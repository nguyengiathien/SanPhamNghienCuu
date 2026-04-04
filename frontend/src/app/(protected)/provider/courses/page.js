'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useAuthStore from '@/store/auth.store';
import { apiFetch, API_BASE } from '@/lib/api';

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

function pickMajorNames(course) {
  const arr = Array.isArray(course?.majors) ? course.majors : [];
  return arr.map((m) => m.majorName).filter(Boolean).join(', ');
}

export default function ProviderCoursesPage() {
  const user = useAuthStore((s) => s.user);

  const [courses, setCourses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMajors, setLoadingMajors] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [editing, setEditing] = useState(null);
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    courseDescription: '',
    level: 'beginner',
    majorId: '',
  });
  const [thumbFile, setThumbFile] = useState(null);

  const requireProvider = () => {
    if (!user) throw new Error('Bạn chưa đăng nhập');
    if (!(user.role === 'provider' || user.role === 'admin')) {
      throw new Error('Bạn không có quyền truy cập trang Provider');
    }
  };

  const fetchMyCourses = async () => {
    requireProvider();
    setLoading(true);
    setErrMsg('');
    try {
      const data = await apiFetch('/api/provider/courses');
      setCourses(Array.isArray(data?.courses) ? data.courses : []);
    } catch (e) {
      setErrMsg(e?.message || 'Không tải được khóa học của bạn');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    setLoadingMajors(true);
    try {
      const data = await apiFetch('/api/majors');
      const majorList = Array.isArray(data?.majors)
        ? data.majors
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];

      setMajors(majorList);
    } catch (e) {
      console.error('Không tải được majors:', e);
      setMajors([]);
    } finally {
      setLoadingMajors(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMyCourses().catch(() => {});
    fetchMajors().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  const resetCourseForm = () => {
    setEditing(null);
    setCourseForm({
      courseName: '',
      courseDescription: '',
      level: 'beginner',
      majorId: '',
    });
    setThumbFile(null);
  };

  const openEdit = (c) => {
    setEditing(c);
    setCourseForm({
      courseName: c.courseName || '',
      courseDescription: c.courseDescription || '',
      level: c.level || 'beginner',
      majorId: Array.isArray(c.majors) && c.majors[0]?.major_id ? String(c.majors[0].major_id) : '',
    });
    setThumbFile(null);
  };

  const submitCourse = async () => {
    requireProvider();

    const majorIds = courseForm.majorId ? [Number(courseForm.majorId)] : [];

    const payload = {
      courseName: courseForm.courseName,
      courseDescription: courseForm.courseDescription || null,
      level: courseForm.level,
      majorIds,
    };

    setLoading(true);
    setErrMsg('');
    try {
      const isEdit = !!editing?.course_id;
      const path = isEdit ? `/api/courses/${editing.course_id}` : `/api/courses`;
      const method = isEdit ? 'PUT' : 'POST';

      const data = await apiFetch(path, { method, body: payload });
      const savedCourse = data?.course || data?.saved || data;

      if (thumbFile && savedCourse?.course_id) {
        const fd = new FormData();
        fd.append('thumbnail', thumbFile);

        await apiFetch(`/api/courses/${savedCourse.course_id}/thumbnail`, {
          method: 'PATCH',
          body: fd,
        });
      }

      await fetchMyCourses();
      resetCourseForm();
    } catch (e) {
      setErrMsg(e?.message || 'Lỗi lưu khóa học');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    requireProvider();
    if (!confirm('Bạn chắc chắn muốn xóa khóa học này?')) return;

    setLoading(true);
    setErrMsg('');
    try {
      await apiFetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      await fetchMyCourses();
    } catch (e) {
      setErrMsg(e?.message || 'Lỗi xóa khóa học');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="bg-white w-full pt-[45px]">
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex flex-col md:flex-row items-center md:justify-between gap-4 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="text-left">
            <div className="text-white/90 text-sm font-semibold">Provider • Courses</div>
            <div className="text-white text-xl md:text-2xl font-extrabold">Quản lý khóa học</div>
            <div className="text-white/80 text-sm mt-1">
              Đăng nhập: <b>{user?.username}</b> ({user?.role})
            </div>
          </div>
        </section>

        <section className="px-6 py-6">
          <div className="max-w-6xl mx-auto">
            {errMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 border border-red-200">
                {errMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
              <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold text-gray-900">{editing ? 'Sửa khóa học' : 'Thêm khóa học'}</div>
                  {editing && (
                    <button onClick={resetCourseForm} className="text-sm font-semibold text-indigo-600 hover:underline">
                      Hủy sửa
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên khóa học</label>
                    <input
                      value={courseForm.courseName}
                      onChange={(e) => setCourseForm((p) => ({ ...p, courseName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      placeholder="VD: NodeJS Backend"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={courseForm.courseDescription}
                      onChange={(e) => setCourseForm((p) => ({ ...p, courseDescription: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm min-h-[90px]"
                      placeholder="Mô tả ngắn..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mức độ</label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm((p) => ({ ...p, level: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      >
                        <option value="beginner">Cơ bản</option>
                        <option value="intermediate">Trung cấp</option>
                        <option value="advanced">Nâng cao</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ngành / Danh mục</label>
                      <select
                        value={courseForm.majorId}
                        onChange={(e) => setCourseForm((p) => ({ ...p, majorId: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                        disabled={loadingMajors}
                      >
                        <option value="">
                          {loadingMajors ? 'Đang tải danh mục...' : 'Chọn ngành'}
                        </option>
                        {majors.map((major) => (
                          <option key={major.major_id} value={major.major_id}>
                            {major.majorName}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500 mt-1">
                        Chọn ngành để phân loại khóa học.
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail (tùy chọn)</label>
                    <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] || null)} />
                  </div>

                  <button
                    disabled={loading || !courseForm.courseName}
                    onClick={submitCourse}
                    className={`w-full py-2 rounded-xl font-semibold shadow ${
                      loading ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    {loading ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo khóa học'}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-900">Khóa học của bạn</div>
                  <button
                    onClick={fetchMyCourses}
                    className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                    disabled={loading}
                  >
                    Reload
                  </button>
                </div>

                {loading ? (
                  <div className="p-4 text-gray-600">Đang tải...</div>
                ) : courses.length === 0 ? (
                  <div className="p-4 text-gray-600">Chưa có khóa học.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((c) => {
                      const thumb = absUrl(c.thumbnailUrl);
                      const fallbackThumb = `${API_BASE}/uploads/coursesThumbnail/default.png`;

                      return (
                        <div key={c.course_id} className="border border-gray-200 rounded-2xl overflow-hidden">
                          <div className="h-[130px] bg-gray-100">
                            <img
                              src={thumb || fallbackThumb}
                              className="w-full h-full object-cover"
                              alt="thumb"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackThumb;
                              }}
                            />
                          </div>

                          <div className="p-4">
                            <div className="font-bold text-gray-900 line-clamp-2">{c.courseName}</div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{c.courseDescription || '—'}</div>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                                {levelLabel(c.level)}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-700 font-semibold">
                                {pickMajorNames(c) || 'Chưa gán danh mục'}
                              </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => openEdit(c)}
                                className="flex-1 px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => deleteCourse(c.course_id)}
                                className="flex-1 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
                              >
                                Xóa
                              </button>
                            </div>

                           
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}