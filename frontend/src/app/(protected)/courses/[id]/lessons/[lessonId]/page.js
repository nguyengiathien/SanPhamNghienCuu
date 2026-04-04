'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function absUrl(url) {
  if (!url) return '';
  if (!url.startsWith('http') && !url.startsWith('/')) url = '/' + url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function pickMainVideoFromContents(contents = []) {
  const v = contents.find((x) => x?.contentType === 'video' && x?.contentData);
  return v?.contentData || '';
}

function toEmbedUrl(url) {
  if (!url) return '';
  const ytWatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (ytWatch?.[1]) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  const ytShort = url.match(/youtu\.be\/([^?&]+)/);
  if (ytShort?.[1]) return `https://www.youtube.com/embed/${ytShort[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '');
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const lessonId = params?.lessonId;

  const token = useMemo(() => getToken(), []);

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  // ===== Checkpoints =====
  // ===== Checkpoints =====
  const videoRef = useRef(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [activeCp, setActiveCp] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [cpError, setCpError] = useState('');

  // ✅ RAM only
  const [passedSet, setPassedSet] = useState(() => new Set()); // Set(checkpoint_id)

  const sortedCheckpoints = useMemo(() => {
    return [...(Array.isArray(checkpoints) ? checkpoints : [])].sort(
      (a, b) => (a.at_seconds ?? 0) - (b.at_seconds ?? 0)
    );
  }, [checkpoints]);

  const findNextCheckpointToBlock = (currentTime) => {
    for (const cp of sortedCheckpoints) {
      if (!passedSet.has(cp.checkpoint_id) && currentTime >= Number(cp.at_seconds || 0)) return cp;
    }
    return null;
  };

  const openCheckpoint = (cp) => {
    const v = videoRef.current;
    if (!cp || !v) return;

    v.pause();
    v.currentTime = Number(cp.at_seconds || 0);

    setActiveCp(cp);
    setSelectedOpt(null);
    setCpError('');
  };

  // ✅ chặn play khi đang hỏi
  const onVideoPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (activeCp) {
      v.pause();
      v.currentTime = Number(activeCp.at_seconds || 0);
    }
  };

  const onVideoTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!sortedCheckpoints.length) return;
    if (activeCp) return;

    const next = findNextCheckpointToBlock(v.currentTime);
    if (next) openCheckpoint(next);
  };

  // ✅ chặn tua vượt qua câu hỏi chưa pass
  const onVideoSeeking = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!sortedCheckpoints.length) return;

    if (activeCp) {
      v.pause();
      v.currentTime = Number(activeCp.at_seconds || 0);
      return;
    }

    const firstUnpassed = sortedCheckpoints.find((cp) => !passedSet.has(cp.checkpoint_id));
    if (!firstUnpassed) return;

    const limit = Number(firstUnpassed.at_seconds || 0);
    if (v.currentTime > limit) {
      v.pause();
      v.currentTime = limit;
      openCheckpoint(firstUnpassed);
    }
  };

  const submitCheckpoint = async () => {
    if (!activeCp) return;
    if (!selectedOpt) return setCpError('Vui lòng chọn đáp án');

    try {
      const res = await fetch(
        `${API_BASE}/api/lessons/${lessonId}/checkpoints/${activeCp.checkpoint_id}/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ option_id: selectedOpt }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Không thể nộp đáp án');

      if (!data?.passed) {
        setCpError('Sai rồi, thử lại nhé!');
        return;
      }

      setPassedSet((prev) => {
        const next = new Set(prev);
        next.add(activeCp.checkpoint_id);
        return next;
      });

      const v = videoRef.current;
      const resumeTime = Number(activeCp.at_seconds || 0) + 0.05;

      setActiveCp(null);
      setSelectedOpt(null);
      setCpError('');

      setTimeout(() => {
        if (!v) return;
        v.currentTime = resumeTime;
        v.play().catch(() => { });
      }, 120);
    } catch (e) {
      setCpError(e?.message || 'Có lỗi khi nộp đáp án');
    }
  };


  // ===== Load: course + lessons + lesson + progress + checkpoints =====
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (!courseId || !lessonId) return;

    (async () => {
      setLoading(true);
      setErrMsg('');
      try {
        // course
        const cRes = await fetch(`${API_BASE}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cData = await cRes.json().catch(() => ({}));
        if (!cRes.ok) throw new Error(cData?.message || 'Không tải được khóa học');
        setCourse(cData?.course || null);

        // lessons list
        const listRes = await fetch(`${API_BASE}/api/lessons?course_id=${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const listData = await listRes.json().catch(() => ({}));
        if (!listRes.ok) throw new Error(listData?.message || 'Không tải được danh sách bài học');
        const rawLessons = Array.isArray(listData?.lessons) ? listData.lessons : [];

        // progress (chỉ để hiện ✅, không ảnh hưởng video)
        const pRes = await fetch(`${API_BASE}/api/learning-processes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pData = await pRes.json().catch(() => ({}));
        if (!pRes.ok) throw new Error(pData?.message || 'Không tải được tiến độ');

        const doneSet = new Set(
          (Array.isArray(pData?.progress) ? pData.progress : [])
            .filter((x) => Number(x.status) === 1)
            .map((x) => String(x.lesson_id))
        );

        setLessons(
          rawLessons.map((l) => ({
            ...l,
            completed: doneSet.has(String(l.lesson_id)),
          }))
        );

        // lesson detail
        const lRes = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lData = await lRes.json().catch(() => ({}));
        if (!lRes.ok) throw new Error(lData?.message || 'Không tải được bài học');

        const lObj = lData?.lesson || null;
        const completed = doneSet.has(String(lessonId));
        setLesson(lObj ? { ...lObj, completed } : null);

        // checkpoints
        const cpRes = await fetch(`${API_BASE}/api/lessons/${lessonId}/checkpoints`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cpData = await cpRes.json().catch(() => ({}));
        if (cpRes.ok) {
          setCheckpoints(Array.isArray(cpData?.checkpoints) ? cpData.checkpoints : []);
        } else {
          setCheckpoints([]);
        }

        // ✅ reset passed RAM mỗi lần đổi bài
        setPassedSet(new Set());
        setActiveCp(null);
        setSelectedOpt(null);
        setCpError('');
      } catch (e) {
        setErrMsg(e?.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, courseId, lessonId, router]);

  const currentIndex = useMemo(() => {
    if (!Array.isArray(lessons) || lessons.length === 0) return -1;
    return lessons.findIndex((x) => String(x.lesson_id) === String(lessonId));
  }, [lessons, lessonId]);

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isLastLesson = currentIndex >= 0 && currentIndex === lessons.length - 1;

  const handleComplete = async () => {
    if (!token) return router.push('/login');
    try {
      const res = await fetch(`${API_BASE}/api/learning-processes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: Number(lessonId), status: 1 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Không thể đánh dấu hoàn thành');

      setLesson((p) => (p ? { ...p, completed: true } : p));
      setLessons((prev) =>
        prev.map((x) => (String(x.lesson_id) === String(lessonId) ? { ...x, completed: true } : x))
      );
    } catch (e) {
      alert(e?.message || 'Có lỗi khi hoàn thành bài học');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[75px] px-6 md:px-10">
          <div className="max-w-6xl mx-auto p-6 text-gray-700">Đang tải bài học...</div>
        </main>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[75px] px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="p-4 rounded-xl bg-red-100 text-red-700 border border-red-200">{errMsg}</div>
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
            >
              Quay lại khóa học
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[75px] px-6 md:px-10">
          <div className="max-w-6xl mx-auto p-6 text-gray-700">Không tìm thấy bài học.</div>
        </main>
      </div>
    );
  }

  const contents = Array.isArray(lesson?.LessonContents) ? lesson.LessonContents : [];
  const videoRaw = pickMainVideoFromContents(contents);
  const videoUrl = absUrl(videoRaw);
  const iframeUrl = !isVideoFile(videoRaw) ? toEmbedUrl(videoRaw) : '';
  const thumb = absUrl(course?.thumbnailUrl);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="bg-white w-full z-2 pt-[45px]">
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex xl:flex-row sm:flex-col items-center xl:justify-between sm:justify-center sm:gap-4 xl:gap-10 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="flex items-center gap-4">
            <div className="w-[64px] h-[44px] rounded-xl overflow-hidden bg-white/40 border border-white/30">
              <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <div className="text-white/90 text-sm font-semibold">Khóa học</div>
              <div className="text-white text-lg md:text-xl font-extrabold leading-tight">
                {course?.courseName || '—'}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="bg-white/90 hover:bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl shadow"
            >
              Quay lại
            </button>

            {lesson?.completed && isLastLesson && (
              <button
                onClick={() => router.push(`/courses/${courseId}/quiz`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
              >
                Làm Quiz cuối khóa
              </button>
            )}
          </div>
        </section>

        <section className="w-full flex flex-row justify-between items-start px-6 py-6 gap-6">
          <aside className="w-[320px] shrink-0 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="text-lg font-bold text-gray-800 mb-3">Danh sách bài học</div>

            <ul className="space-y-2">
              {lessons.map((l) => {
                const active = String(l.lesson_id) === String(lessonId);
                return (
                  <li
                    key={l.lesson_id}
                    onClick={() => router.push(`/courses/${courseId}/lessons/${l.lesson_id}`)}
                    className={`cursor-pointer p-3 rounded-xl border transition ${active ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold text-gray-800">
                        {l.orderIndex ? `${l.orderIndex}. ` : ''}{l.lessonName || 'Bài học'}
                      </div>
                      <div className="text-sm">{l.completed ? '✅' : ''}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex gap-2">
              <button
                disabled={!prevLesson}
                onClick={() => router.push(`/courses/${courseId}/lessons/${prevLesson.lesson_id}`)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Bài trước
              </button>
              <button
                disabled={!nextLesson}
                onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.lesson_id}`)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Bài tiếp
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  {lesson.lessonName || 'Bài học'}
                </h1>


              </div>

              <div className="p-5">
                {/* VIDEO */}
                {videoRaw ? (
                  isVideoFile(videoRaw) ? (
                    <div className="relative w-full max-w-5xl">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        // controls
                        className="w-full rounded-xl bg-black"
                        onTimeUpdate={onVideoTimeUpdate}
                        onSeeking={onVideoSeeking}
                        onPlay={onVideoPlay}
                      />

                      <button
                        onClick={() => {
                          const v = videoRef.current;
                          if (!v) return;
                          if (v.paused) v.play();
                          else v.pause();
                        }}
                        className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                      >
                        Play / Pause
                      </button>


                      {/* Overlay câu hỏi */}
                      {activeCp && (
                        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                          <div className="w-full max-w-xl bg-white rounded-2xl p-5 shadow-lg">
                            <div className="text-lg font-bold text-gray-900">
                              {activeCp.question_text}
                            </div>

                            <div className="mt-3 space-y-2">
                              {(activeCp.options || []).map((op) => (
                                <label
                                  key={op.option_id}
                                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${selectedOpt === op.option_id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    name="cpopt"
                                    checked={selectedOpt === op.option_id}
                                    onChange={() => setSelectedOpt(op.option_id)}
                                  />
                                  <span className="text-gray-800">{op.option_text}</span>
                                </label>
                              ))}
                            </div>

                            {cpError && <div className="mt-3 text-red-600 text-sm">{cpError}</div>}

                            <div className="mt-4 flex justify-end gap-2">
                              <button
                                onClick={submitCheckpoint}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                              >
                                Xác nhận
                              </button>
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                              Trả lời đúng để xem tiếp video.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full max-w-5xl rounded-xl overflow-hidden border bg-black">
                      <iframe
                        src={iframeUrl}
                        className="w-full aspect-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )
                ) : (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600">
                    Bài học này chưa có video.
                  </div>
                )}

                {/* Mark complete */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleComplete}
                    disabled={!!lesson.completed}
                    className={`px-4 py-2 rounded-xl font-semibold shadow ${lesson.completed
                      ? 'bg-gray-300 text-white cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                  >
                    {lesson.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Footer />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
