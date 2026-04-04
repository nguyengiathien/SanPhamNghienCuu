'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useAuthStore from '@/store/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

function absUrl(url) {
  if (!url) return '';
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function levelLabel(level) {
  if (level === 'beginner') return 'Cơ bản';
  if (level === 'intermediate') return 'Trung cấp';
  if (level === 'advanced') return 'Nâng cao';
  return level || '—';
}

function StarBar({ value = 0 }) {
  const v = Number(value || 0);
  const full = Math.floor(v);
  const frac = v - full;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= full;
        const half = !filled && idx === full + 1 && frac >= 0.25 && frac < 0.75;

        return (
          <span
            key={idx}
            className={`text-lg ${
              filled ? 'text-yellow-500' : half ? 'text-yellow-400' : 'text-gray-300'
            }`}
            title={`${v.toFixed(1)} / 5`}
          >
            ★
          </span>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">{v ? v.toFixed(1) : '0.0'}/5</span>
    </div>
  );
}

function StarPicker({ value, hoverValue, onHover, onLeave, onChange, disabled = false }) {
  const displayValue = hoverValue || value || 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const active = star <= displayValue;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onMouseEnter={() => !disabled && onHover(star)}
            onMouseLeave={() => !disabled && onLeave()}
            onClick={() => !disabled && onChange(star)}
            className={`text-3xl leading-none transition ${
              active ? 'text-yellow-500 scale-105' : 'text-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110'}`}
            title={`${star} sao`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const user = useAuthStore((s) => s.user);
  const storeToken = useAuthStore((s) => s.token);
  const token =
    storeToken ||
    (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const [myStars, setMyStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [hasRatedBefore, setHasRatedBefore] = useState(false);

  const fallbackThumb = `${API_BASE}/uploads/coursesThumbnail/default.png`;

  // 1) Load course detail (public)
  useEffect(() => {
    if (!courseId) return;

    (async () => {
      setLoading(true);
      setErrMsg('');
      try {
        const res = await fetch(`${API_BASE}/api/courses/${courseId}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Không tải được khóa học');

        const c = data?.course || data;
        setCourse(c);
      } catch (e) {
        setErrMsg(e?.message || 'Failed to fetch');
        setCourse(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  // 2) Load lessons + progress
  useEffect(() => {
    if (!courseId) return;

    if (!token) {
      setLessons([]);
      setProgressMap({});
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Không tải được danh sách bài học');

        const ls = Array.isArray(data?.lessons) ? data.lessons : [];
        ls.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setLessons(ls);

        const map = {};
        for (const l of ls) map[l.lesson_id] = !!l.completed;
        setProgressMap(map);
      } catch (e) {
        console.log('Load lessons/progress error:', e?.message);
        setLessons([]);
        setProgressMap({});
      }
    })();
  }, [courseId, token]);

  // 3) Load rating hiện tại của user
  useEffect(() => {
    if (!courseId || !token) {
      setMyStars(0);
      setMyComment('');
      setHasRatedBefore(false);
      return;
    }

    (async () => {
      setRatingLoading(true);
      setRatingError('');
      try {
        const res = await fetch(`${API_BASE}/api/courses/${courseId}/ratings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Không tải được đánh giá của bạn');

        const rating = data?.rating;
        if (rating) {
          setMyStars(Number(rating.stars || 0));
          setMyComment(rating.comment || '');
          setHasRatedBefore(true);
        } else {
          setMyStars(0);
          setMyComment('');
          setHasRatedBefore(false);
        }
      } catch (e) {
        setRatingError(e?.message || 'Không tải được đánh giá của bạn');
      } finally {
        setRatingLoading(false);
      }
    })();
  }, [courseId, token]);

  const ratingAvg = Number(course?.ratingAvg || 0);
  const ratingNum = Number(course?.ratingNum || 0);

  const thumb = absUrl(course?.thumbnailUrl);

  const completedCount = useMemo(() => {
    if (!lessons.length) return 0;
    return lessons.reduce((acc, l) => acc + (progressMap[l.lesson_id] ? 1 : 0), 0);
  }, [lessons, progressMap]);

  const totalLessons = lessons.length;

  const handleStartLearning = () => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (!lessons.length) return;

    const firstIncomplete = lessons.find((l) => !progressMap[l.lesson_id]);
    const target = firstIncomplete || lessons[0];

    router.push(`/courses/${courseId}/lessons/${target.lesson_id}`);
  };

  const handleSubmitRating = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    setRatingError('');
    setRatingSuccess('');

    if (!myStars || myStars < 1 || myStars > 5) {
      setRatingError('Vui lòng chọn số sao từ 1 đến 5.');
      return;
    }

    try {
      setRatingSubmitting(true);

      const res = await fetch(`${API_BASE}/api/courses/${courseId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stars: myStars,
          comment: myComment.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Gửi đánh giá thất bại');

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              ratingAvg: Number(data?.ratingAvg || 0),
              ratingNum: Number(data?.ratingNum || 0),
            }
          : prev
      );

      if (data?.myRating) {
        setMyStars(Number(data.myRating.stars || 0));
        setMyComment(data.myRating.comment || '');
      }

      setHasRatedBefore(true);
      setRatingSuccess('Đánh giá của bạn đã được lưu thành công.');
    } catch (e) {
      setRatingError(e?.message || 'Không thể gửi đánh giá');
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[70px] px-6 py-8 text-gray-700">Đang tải...</main>
        <Footer />
      </div>
    );
  }

  if (errMsg || !course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[70px] px-6 py-8">
          <div className="max-w-4xl mx-auto p-4 rounded-lg bg-red-100 text-red-700">
            {errMsg || 'Không tìm thấy khóa học'}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-[70px] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Top: thumbnail + info */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0">
              <div className="bg-gray-100">
                <img
                  src={thumb || fallbackThumb}
                  alt={course.courseName}
                  className="w-full h-[240px] lg:h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackThumb;
                  }}
                />
              </div>

              <div className="p-6 lg:p-8">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {course.courseName}
                  </h1>

                  <div className="text-gray-600">
                    {course.courseDescription || 'Chưa có mô tả'}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                      Mức độ: {levelLabel(course.level)}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-sm font-semibold">
                      Bài học: {totalLessons}
                    </span>

                    {!!user && (
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                        Tiến độ: {completedCount}/{totalLessons}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                          Đánh giá
                        </div>
                        <StarBar value={ratingAvg} />
                        <div className="text-xs text-gray-500 mt-1">
                          {ratingNum} lượt đánh giá
                        </div>
                      </div>

                      <button
                        onClick={handleStartLearning}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl shadow-sm"
                      >
                        Học khóa học
                      </button>
                    </div>
                  </div>

                  {!user && (
                    <div className="mt-3 p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
                      Bạn chưa đăng nhập nên không xem được trạng thái hoàn thành và chưa thể đánh giá khóa học.
                    </div>
                  )}

                  {!!user && !token && (
                    <div className="mt-3 p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
                      Thiếu token đăng nhập, vui lòng đăng nhập lại.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rating form */}
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Đánh giá khóa học</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {hasRatedBefore ? 'Bạn có thể cập nhật lại đánh giá của mình.' : 'Hãy chia sẻ cảm nhận của bạn về khóa học này.'}
                </p>
              </div>

              {hasRatedBefore && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                  Bạn đã đánh giá
                </span>
              )}
            </div>

            {!token ? (
              <div className="mt-4 text-gray-600">
                Vui lòng đăng nhập để gửi đánh giá cho khóa học.
              </div>
            ) : (
              <div className="mt-5">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Chọn số sao</div>
                  <StarPicker
                    value={myStars}
                    hoverValue={hoverStars}
                    onHover={setHoverStars}
                    onLeave={() => setHoverStars(0)}
                    onChange={setMyStars}
                    disabled={ratingSubmitting || ratingLoading}
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {myStars > 0 ? `Bạn đang chọn ${myStars} sao` : 'Chưa chọn số sao'}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nhận xét
                  </label>
                  <textarea
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    disabled={ratingSubmitting || ratingLoading}
                    placeholder="Viết cảm nhận của bạn về khóa học..."
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {myComment.length}/1000 ký tự
                  </div>
                </div>

                {ratingError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                    {ratingError}
                  </div>
                )}

                {ratingSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
                    {ratingSuccess}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmitRating}
                  disabled={ratingSubmitting || ratingLoading}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-semibold px-5 py-3 rounded-xl shadow-sm"
                >
                  {ratingSubmitting
                    ? 'Đang gửi...'
                    : hasRatedBefore
                    ? 'Cập nhật đánh giá'
                    : 'Gửi đánh giá'}
                </button>
              </div>
            )}
          </div>

          {/* Lessons list */}
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Bài học</h2>
              <div className="text-sm text-gray-500">Nhấn vào bài học để học</div>
            </div>

            {!token ? (
              <div className="text-gray-600">
                Vui lòng đăng nhập để xem danh sách bài học và tiến độ.
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-gray-600">Khóa học chưa có bài học.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lessons.map((l, idx) => {
                  const done = !!progressMap[l.lesson_id];
                  return (
                    <a
                      key={l.lesson_id}
                      href={`/courses/${courseId}/lessons/${l.lesson_id}`}
                      className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-xl px-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                            done
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {l.lessonName || `Bài ${idx + 1}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          done
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {done ? '✓ Done' : '• Not yet'}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}