'use client';

import { useEffect, useMemo, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import CoursePicker from '@/components/provider/CoursePicker';
import { apiFetch, API_BASE } from '@/lib/api';

function absUrl(url) {
  if (!url) return '';
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function emptyCheckpointForm() {
  return {
    at_seconds: '',
    question_text: '',
    options: [
      { option_text: '', isCorrect: true },
      { option_text: '', isCorrect: false },
      { option_text: '', isCorrect: false },
      { option_text: '', isCorrect: false },
    ],
  };
}

function checkpointToForm(cp) {
  const incoming = Array.isArray(cp?.options)
    ? cp.options.map((o) => ({
        option_text: o.option_text || '',
        isCorrect: !!o.isCorrect,
      }))
    : [];

  const options = incoming.slice(0, 4);
  while (options.length < 4) {
    options.push({ option_text: '', isCorrect: false });
  }

  if (!options.some((o) => o.isCorrect)) {
    options[0].isCorrect = true;
  }

  return {
    at_seconds: String(cp?.at_seconds ?? ''),
    question_text: cp?.question_text || '',
    options,
  };
}

function dedupeCheckpointsKeepLatest(arr = []) {
  const map = new Map();

  for (const cp of arr) {
    const key = Number(cp.at_seconds);
    if (!map.has(key)) {
      map.set(key, cp);
      continue;
    }

    const current = map.get(key);
    const currentId = Number(current?.checkpoint_id || 0);
    const nextId = Number(cp?.checkpoint_id || 0);

    if (nextId >= currentId) {
      map.set(key, cp);
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => (a.at_seconds ?? 0) - (b.at_seconds ?? 0)
  );
}

export default function ProviderVideoAndQuestionsPage() {
  const user = useAuthStore((s) => s.user);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');

  const selectedLesson = useMemo(
    () => lessons.find((l) => String(l.lesson_id) === String(selectedLessonId)) || null,
    [lessons, selectedLessonId]
  );

  const [msg, setMsg] = useState('');
  const [cpMsg, setCpMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [videoFile, setVideoFile] = useState(null);
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonVideoContentId, setLessonVideoContentId] = useState(null);

  const [checkpoints, setCheckpoints] = useState([]);
  const [editingCheckpointId, setEditingCheckpointId] = useState(null);
  const [cpForm, setCpForm] = useState(emptyCheckpointForm());

  const requireProvider = () => {
    if (!user) throw new Error('Bạn chưa đăng nhập');
    if (!(user.role === 'provider' || user.role === 'admin')) {
      throw new Error('Bạn không có quyền');
    }
  };

  const normalizeFetchError = (e) => {
    const m = String(e?.message || '');
    if (m.toLowerCase().includes('failed to fetch')) {
      return 'Failed to fetch (thường do CORS/OPTIONS bị chặn hoặc backend đang tắt). Hãy kiểm tra Network tab xem request OPTIONS có bị 404/blocked không.';
    }
    return m || 'Có lỗi xảy ra';
  };

  const resetCheckpointForm = () => {
    setEditingCheckpointId(null);
    setCpForm(emptyCheckpointForm());
  };

  const fetchMyCourses = async () => {
    requireProvider();
    const data = await apiFetch('/api/provider/courses');
    setCourses(Array.isArray(data?.courses) ? data.courses : []);
  };

  const loadLessons = async (courseId) => {
    requireProvider();
    setLessons([]);
    setSelectedLessonId('');
    setLessonVideoUrl('');
    setLessonVideoContentId(null);
    setCheckpoints([]);
    setCpMsg('');
    setMsg('');
    resetCheckpointForm();

    if (!courseId) return;

    try {
      const data = await apiFetch(`/api/lessons?course_id=${courseId}`);
      const arr = Array.isArray(data?.lessons) ? data.lessons : [];
      arr.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      setLessons(arr);
    } catch (e) {
      setMsg(normalizeFetchError(e));
    }
  };

  const loadLessonDetail = async (lessonId) => {
    if (!lessonId) {
      setLessonVideoUrl('');
      setLessonVideoContentId(null);
      return;
    }

    try {
      const data = await apiFetch(`/api/lessons/${lessonId}`);
      const lesson = data?.lesson || data;

      const contents = Array.isArray(lesson?.contents)
        ? lesson.contents
        : Array.isArray(lesson?.LessonContents)
          ? lesson.LessonContents
          : [];

      const video = contents.find((c) => c.contentType === 'video');

      setLessonVideoUrl(video?.contentData || '');
      setLessonVideoContentId(video?.content_id || null);
    } catch {
      setLessonVideoUrl('');
      setLessonVideoContentId(null);
    }
  };

  const uploadLessonVideo = async () => {
    try {
      requireProvider();
      if (!selectedLessonId) return setMsg('Hãy chọn lesson');
      if (!videoFile) return setMsg('Chưa chọn file MP4');
      if (videoFile.type !== 'video/mp4') return setMsg('Chỉ cho phép MP4');

      setLoading(true);
      setMsg('');

      const fd = new FormData();
      fd.append('video', videoFile);

      const data = await apiFetch(`/api/lessons/${selectedLessonId}/video`, {
        method: 'POST',
        body: fd,
      });

      const returnedUrl = data?.videoUrl || data?.content?.contentData || '';
      setMsg(`Upload video thành công: ${returnedUrl || '(không có videoUrl trả về)'}`);
      setVideoFile(null);

      await loadLessonDetail(selectedLessonId);
    } catch (e) {
      setMsg(normalizeFetchError(e));
    } finally {
      setLoading(false);
    }
  };

  const loadCheckpoints = async (lessonId) => {
    try {
      requireProvider();
      setCheckpoints([]);
      setCpMsg('');
      if (!lessonId) return;

      const data = await apiFetch(`/api/lessons/${lessonId}/checkpoints`);
      const arr = Array.isArray(data?.checkpoints) ? data.checkpoints : [];
      setCheckpoints(dedupeCheckpointsKeepLatest(arr));
    } catch (e) {
      setCpMsg(normalizeFetchError(e));
    }
  };

  const startEditCheckpoint = (cp) => {
    setEditingCheckpointId(cp.checkpoint_id);
    setCpForm(checkpointToForm(cp));
    setCpMsg(`Đang chỉnh sửa checkpoint tại giây ${cp.at_seconds}`);
  };

  const deleteCheckpoint = async (cp) => {
    try {
      requireProvider();
      if (!cp?.checkpoint_id) return;

      const ok = window.confirm(`Bạn có chắc muốn xóa checkpoint tại giây ${cp.at_seconds}?`);
      if (!ok) return;

      setLoading(true);
      setCpMsg('');

      await apiFetch(`/api/checkpoints/${cp.checkpoint_id}`, {
        method: 'DELETE',
      });

      if (editingCheckpointId === cp.checkpoint_id) {
        resetCheckpointForm();
      }

      await loadCheckpoints(selectedLessonId);
      setCpMsg('Đã xóa checkpoint');
    } catch (e) {
      setCpMsg(normalizeFetchError(e));
    } finally {
      setLoading(false);
    }
  };

  const submitCheckpoint = async () => {
    try {
      requireProvider();
      if (!selectedLessonId) return;

      const at = Number(cpForm.at_seconds);
      if (!Number.isFinite(at) || at < 0) return setCpMsg('at_seconds không hợp lệ');
      if (!cpForm.question_text.trim()) return setCpMsg('Thiếu nội dung câu hỏi');

      const ops = (cpForm.options || [])
        .map((o) => ({
          option_text: String(o.option_text || '').trim(),
          isCorrect: !!o.isCorrect,
        }))
        .filter((o) => o.option_text);

      if (ops.length < 2) return setCpMsg('Cần ít nhất 2 đáp án');
      if (!ops.some((o) => o.isCorrect)) return setCpMsg('Cần ít nhất 1 đáp án đúng');

      const duplicated = checkpoints.find(
        (cp) =>
          Number(cp.at_seconds) === at &&
          Number(cp.checkpoint_id) !== Number(editingCheckpointId || 0)
      );

      if (duplicated) {
        return setCpMsg(`Đã tồn tại checkpoint ở giây ${at}.`);
      }

      setLoading(true);
      setCpMsg('');

      if (editingCheckpointId) {
        await apiFetch(`/api/checkpoints/${editingCheckpointId}`, {
          method: 'PUT',
          body: {
            at_seconds: at,
            question_text: cpForm.question_text.trim(),
            options: ops,
          },
        });

        resetCheckpointForm();
        await loadCheckpoints(selectedLessonId);
        setCpMsg('Đã cập nhật checkpoint');
      } else {
        const created = await apiFetch(`/api/lessons/${selectedLessonId}/checkpoints`, {
          method: 'POST',
          body: { at_seconds: at, question_text: cpForm.question_text.trim() },
        });

        const checkpointId = created?.checkpoint?.checkpoint_id || created?.checkpoint_id;
        if (!checkpointId) throw new Error('Tạo checkpoint ok nhưng không lấy được checkpoint_id');

        await Promise.all(
          ops.map((op) =>
            apiFetch(`/api/checkpoints/${checkpointId}/options`, {
              method: 'POST',
              body: op,
            })
          )
        );

        resetCheckpointForm();
        await loadCheckpoints(selectedLessonId);
        setCpMsg('Đã thêm checkpoint');
      }
    } catch (e) {
      setCpMsg(normalizeFetchError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMyCourses().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  useEffect(() => {
    if (!selectedCourseId) return;
    loadLessons(selectedCourseId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  return (
    <div className="min-h-screen bg-white">
      <main className="bg-white w-full pt-[45px]">
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex flex-col md:flex-row items-center md:justify-between gap-4 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="text-left">
            <div className="text-white/90 text-sm font-semibold">Provider • Video + Questions</div>
            <div className="text-white text-xl md:text-2xl font-extrabold">Upload video MP4 & Checkpoints</div>
            <div className="text-white/80 text-sm mt-1">
              Đăng nhập: <b>{user?.username}</b> ({user?.role})
            </div>
          </div>
        </section>

        <section className="px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <CoursePicker
              courses={courses}
              selectedCourseId={selectedCourseId}
              onChange={setSelectedCourseId}
              onReload={() => fetchMyCourses()}
            />

            {msg && (
              <div className="mb-4 p-3 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200">
                {msg}
              </div>
            )}

            {!selectedCourseId ? (
              <div className="p-4 text-gray-600">Hãy chọn khóa học.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  <div className="font-bold text-gray-900 mb-2">Chọn bài học</div>
                  <select
                    value={selectedLessonId}
                    onChange={async (e) => {
                      const id = e.target.value;
                      setSelectedLessonId(id);
                      setCheckpoints([]);
                      setCpMsg('');
                      setMsg('');
                      setVideoFile(null);
                      setLessonVideoUrl('');
                      setLessonVideoContentId(null);
                      resetCheckpointForm();

                      if (id) {
                        await Promise.all([loadLessonDetail(id), loadCheckpoints(id)]);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="">-- Chọn lesson --</option>
                    {lessons.map((l) => (
                      <option key={l.lesson_id} value={l.lesson_id}>
                        {l.lessonName}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 font-bold text-gray-900">Video của bài học</div>

                  {!selectedLessonId ? (
                    <div className="text-sm text-gray-600 mt-2">Hãy chọn lesson để xem/upload video.</div>
                  ) : lessonVideoUrl ? (
                    <div className="mt-2">
                      <video
                        className="w-full rounded-xl border border-gray-200"
                        controls
                        src={absUrl(lessonVideoUrl)}
                      />
                      <div className="text-xs text-gray-500 mt-2">
                        Mỗi bài học chỉ có <b>1</b> video. Bạn có thể chọn file mới để <b>thay video</b>.
                      </div>

                      <input
                        type="file"
                        accept="video/mp4"
                        className="mt-2 w-full text-sm"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />

                      <button
                        disabled={loading || !videoFile}
                        onClick={uploadLessonVideo}
                        className={`mt-3 w-full py-2 rounded-xl font-semibold shadow ${
                          loading
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                      >
                        {loading ? 'Đang upload...' : 'Thay video'}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">
                        Chưa có video. Chọn file MP4 và upload lên server.
                      </div>

                      <input
                        type="file"
                        accept="video/mp4"
                        className="mt-2 w-full text-sm"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />

                      <button
                        disabled={loading || !videoFile}
                        onClick={uploadLessonVideo}
                        className={`mt-3 w-full py-2 rounded-xl font-semibold shadow ${
                          loading
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                      >
                        {loading ? 'Đang upload...' : 'Upload video'}
                      </button>
                    </div>
                  )}

                  {lessonVideoContentId ? (
                    <div className="text-[11px] text-gray-500 mt-2">
                      content_id(video): <b>{lessonVideoContentId}</b>
                    </div>
                  ) : null}
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900">
                      Checkpoints {selectedLesson ? `— ${selectedLesson.lessonName}` : ''}
                    </div>
                    <button
                      disabled={!selectedLessonId}
                      onClick={() => selectedLessonId && loadCheckpoints(selectedLessonId)}
                      className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                    >
                      Reload
                    </button>
                  </div>

                  {cpMsg && (
                    <div className="mb-3 p-3 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200">
                      {cpMsg}
                    </div>
                  )}

                  {!selectedLessonId ? (
                    <div className="text-gray-600">Chọn lesson để xem/thêm câu hỏi.</div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
                      <div>
                        {checkpoints.length === 0 ? (
                          <div className="text-gray-600">Chưa có checkpoint.</div>
                        ) : (
                          <div className="space-y-3">
                            {checkpoints.map((cp) => (
                              <div
                                key={cp.checkpoint_id}
                                className="p-3 rounded-xl bg-gray-50 border border-gray-200"
                              >
                                <div className="font-semibold text-gray-900">
                                  ⏱ {cp.at_seconds}s — {cp.question_text}
                                </div>

                                <div className="mt-2 text-sm text-gray-700 space-y-1">
                                  {(cp.options || []).map((op) => (
                                    <div key={op.option_id}>
                                      • {op.option_text}{' '}
                                      {op.isCorrect ? <b className="text-green-700">(đúng)</b> : null}
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-3 flex gap-2">
                                  <button
                                    onClick={() => startEditCheckpoint(cp)}
                                    className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => deleteCheckpoint(cp)}
                                    className="px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-gray-900">
                            {editingCheckpointId ? 'Chỉnh sửa checkpoint' : 'Thêm câu hỏi vào video'}
                          </div>

                          {editingCheckpointId ? (
                            <button
                              onClick={resetCheckpointForm}
                              className="text-sm font-semibold text-indigo-600 hover:underline"
                            >
                              Hủy sửa
                            </button>
                          ) : null}
                        </div>

                        <input
                          value={cpForm.at_seconds}
                          onChange={(e) => setCpForm((p) => ({ ...p, at_seconds: e.target.value }))}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          placeholder="Thời điểm (giây), vd: 15"
                        />
                        <textarea
                          value={cpForm.question_text}
                          onChange={(e) => setCpForm((p) => ({ ...p, question_text: e.target.value }))}
                          className="mt-2 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm min-h-[80px]"
                          placeholder="Nội dung câu hỏi..."
                        />

                        <div className="mt-3 text-sm font-semibold text-gray-700">Đáp án (tick đáp án đúng)</div>
                        <div className="space-y-2 mt-2">
                          {cpForm.options.map((op, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="cpCorrect"
                                checked={!!op.isCorrect}
                                onChange={() =>
                                  setCpForm((p) => ({
                                    ...p,
                                    options: p.options.map((x, i) => ({ ...x, isCorrect: i === idx })),
                                  }))
                                }
                              />
                              <input
                                value={op.option_text}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setCpForm((p) => ({
                                    ...p,
                                    options: p.options.map((x, i) =>
                                      i === idx ? { ...x, option_text: v } : x
                                    ),
                                  }));
                                }}
                                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                placeholder={`Option ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          disabled={loading}
                          onClick={submitCheckpoint}
                          className={`mt-3 w-full py-2 rounded-xl font-semibold shadow ${
                            loading
                              ? 'bg-gray-300 text-white cursor-not-allowed'
                              : editingCheckpointId
                                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {loading
                            ? 'Đang lưu...'
                            : editingCheckpointId
                              ? 'Lưu chỉnh sửa'
                              : 'Thêm checkpoint'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}