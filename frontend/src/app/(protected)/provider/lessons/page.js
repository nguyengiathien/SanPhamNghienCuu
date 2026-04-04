'use client';

import { useEffect, useMemo, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import CoursePicker from '@/components/provider/CoursePicker';
import { apiFetch } from '@/lib/api';

export default function ProviderLessonsPage() {
  const user = useAuthStore((s) => s.user);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.course_id) === String(selectedCourseId)) || null,
    [courses, selectedCourseId]
  );

  const [lessons, setLessons] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [lessonForm, setLessonForm] = useState({
    lessonName: '',
    orderMode: 'append', // append | custom
    orderIndex: '',
  });

  const requireProvider = () => {
    if (!user) throw new Error('Bạn chưa đăng nhập');
    if (!(user.role === 'provider' || user.role === 'admin')) {
      throw new Error('Bạn không có quyền');
    }
  };

  const fetchMyCourses = async () => {
    requireProvider();
    const data = await apiFetch('/api/provider/courses');
    setCourses(Array.isArray(data?.courses) ? data.courses : []);
  };

  const loadLessons = async (courseId) => {
    requireProvider();
    setLessons([]);
    setMsg('');
    if (!courseId) return;

    const data = await apiFetch(`/api/lessons?course_id=${courseId}`);
    const arr = Array.isArray(data?.lessons) ? data.lessons : [];
    arr.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    setLessons(arr);
  };

  const resetLessonForm = () => {
    setLessonForm({
      lessonName: '',
      orderMode: 'append',
      orderIndex: '',
    });
  };

  const createLesson = async () => {
    requireProvider();

    if (!selectedCourseId) {
      setMsg('Hãy chọn khóa học');
      return;
    }

    if (!lessonForm.lessonName.trim()) {
      setMsg('Thiếu tên bài học');
      return;
    }

    if (lessonForm.orderMode === 'custom') {
      const orderValue = Number(lessonForm.orderIndex);
      if (!Number.isInteger(orderValue) || orderValue <= 0) {
        setMsg('Thứ tự bài học phải là số nguyên lớn hơn 0');
        return;
      }
    }

    setLoading(true);
    setMsg('');

    try {
      await apiFetch('/api/lessons', {
        method: 'POST',
        body: {
          course_id: Number(selectedCourseId),
          lessonName: lessonForm.lessonName.trim(),
          orderIndex:
            lessonForm.orderMode === 'append'
              ? null
              : Number(lessonForm.orderIndex),
        },
      });

      resetLessonForm();
      await loadLessons(selectedCourseId);
      setMsg(' Tạo bài học thành công');
    } catch (e) {
      setMsg(e?.message || 'Lỗi tạo bài học');
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
            <div className="text-white/90 text-sm font-semibold">Provider • Lessons</div>
            <div className="text-white text-xl md:text-2xl font-extrabold">Quản lý bài học</div>
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

            <div className="mb-4 text-sm text-gray-600">
              Khóa học đang chọn: <b>{selectedCourse?.courseName || '—'}</b>
            </div>

            {msg && (
              <div className="mb-4 p-3 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200">
                {msg}
              </div>
            )}

            {!selectedCourseId ? (
              <div className="p-4 text-gray-600">Hãy chọn khóa học.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  <div className="font-bold text-gray-900 mb-4">Tạo bài học</div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Tên bài học
                      </label>
                      <input
                        value={lessonForm.lessonName}
                        onChange={(e) =>
                          setLessonForm((p) => ({ ...p, lessonName: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                        placeholder="Nhập tên bài học"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Cách sắp xếp bài học
                      </label>
                      <select
                        value={lessonForm.orderMode}
                        onChange={(e) =>
                          setLessonForm((p) => ({
                            ...p,
                            orderMode: e.target.value,
                            orderIndex: e.target.value === 'append' ? '' : p.orderIndex,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      >
                        <option value="append">Thêm vào cuối danh sách</option>
                        <option value="custom">Tự nhập thứ tự</option>
                      </select>
                    </div>

                    {lessonForm.orderMode === 'custom' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Thứ tự bài học
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={lessonForm.orderIndex}
                          onChange={(e) =>
                            setLessonForm((p) => ({ ...p, orderIndex: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          placeholder="Ví dụ: 1"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Số nhỏ hơn sẽ hiển thị trước. Ví dụ: bài 1, bài 2, bài 3...
                        </div>
                      </div>
                    )}

                    {lessonForm.orderMode === 'append' && (
                      <div className="text-xs text-gray-500 -mt-1">
                        Bài học mới sẽ được thêm vào cuối danh sách hiện tại.
                      </div>
                    )}

                    <button
                      disabled={loading}
                      onClick={createLesson}
                      className={`w-full py-2 rounded-xl font-semibold shadow ${
                        loading
                          ? 'bg-gray-300 text-white cursor-not-allowed'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      {loading ? 'Đang tạo...' : 'Tạo bài học'}
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900">Danh sách bài học</div>
                    <button
                      onClick={() => loadLessons(selectedCourseId)}
                      className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                    >
                      Reload
                    </button>
                  </div>

                  {lessons.length === 0 ? (
                    <div className="text-gray-600">Chưa có bài học.</div>
                  ) : (
                    <div className="space-y-2">
                      {lessons.map((l, idx) => (
                        <div
                          key={l.lesson_id}
                          className="p-3 rounded-xl bg-gray-50 border border-gray-200"
                        >
                          <div className="font-semibold text-gray-900">
                            {idx + 1}. {l.lessonName} (ID: {l.lesson_id})
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Thứ tự: {l.orderIndex ?? '—'}
                          </div>
                        </div>
                      ))}
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