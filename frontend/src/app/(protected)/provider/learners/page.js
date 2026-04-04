'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useAuthStore from '@/store/auth.store';
import CoursePicker from '@/components/provider/CoursePicker';
import { apiFetch } from '@/lib/api';

export default function ProviderStudentPage() {
  const user = useAuthStore((s) => s.user);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.course_id) === String(selectedCourseId)) || null,
    [courses, selectedCourseId]
  );

  const [learners, setLearners] = useState([]);
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const requireProvider = () => {
    if (!user) throw new Error('Bạn chưa đăng nhập');
    if (!(user.role === 'provider' || user.role === 'admin')) throw new Error('Bạn không có quyền');
  };

  const fetchMyCourses = async () => {
    requireProvider();
    const data = await apiFetch('/api/provider/courses');
    setCourses(Array.isArray(data?.courses) ? data.courses : []);
  };

  const loadLearners = async (courseId) => {
    requireProvider();
    setMsg('');
    setStats(null);
    setLearners([]);
    if (!courseId) return;

    setLoading(true);
    try {
      const data = await apiFetch(`/api/provider/courses/${courseId}/learners`);
      setLearners(Array.isArray(data?.learners) ? data.learners : []);

      // optional stats endpoint
      try {
        const s = await apiFetch(`/api/provider/courses/${courseId}/stats`);
        setStats(s?.stats || s);
      } catch {
        setStats(null);
      }
    } catch (e) {
      setMsg(e?.message || 'Lỗi tải learners');
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
    loadLearners(selectedCourseId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  return (
    <div className="min-h-screen bg-white">
      

      <main className="bg-white w-full pt-[45px]">
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex flex-col md:flex-row items-center md:justify-between gap-4 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="text-left">
            <div className="text-white/90 text-sm font-semibold">Provider • Learners</div>
            <div className="text-white text-xl md:text-2xl font-extrabold">Người học & Thống kê hoàn thành</div>
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
              disabledReload={loading}
            />

            <div className="mb-4 text-sm text-gray-600">
              Course: <b>{selectedCourse?.courseName || '—'}</b>
            </div>

            {msg && (
              <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 border border-red-200">
                {msg}
              </div>
            )}

            {!selectedCourseId ? (
              <div className="p-4 text-gray-600">Hãy chọn khóa học.</div>
            ) : loading ? (
              <div className="p-4 text-gray-600">Đang tải...</div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">
                    Tổng learners: <b>{learners.length}</b>
                  </div>
                  <button
                    onClick={() => loadLearners(selectedCourseId)}
                    className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                  >
                    Reload
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500">Người đang học</div>
                    <div className="text-xl font-extrabold text-gray-900">{learners.length}</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500">Người hoàn thành</div>
                    <div className="text-xl font-extrabold text-gray-900">{stats?.completedLearners ?? '—'}</div>
                    {/* <div className="text-xs text-gray-500 mt-1">{stats ? 'Dựa trên endpoint stats' : 'Chưa có endpoint stats'}</div> */}
                  </div>
                  <div className="p-3 rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500">Tỉ lệ hoàn thành</div>
                    <div className="text-xl font-extrabold text-gray-900">
                      {stats?.completionRate != null ? `${stats.completionRate}%` : '—'}
                    </div>
                    {/* <div className="text-xs text-gray-500 mt-1">{stats ? 'Dựa trên endpoint stats' : 'Cần backend trả'}</div> */}
                  </div>
                </div>

                {learners.length === 0 ? (
                  <div className="p-4 text-gray-600">Chưa có người học (chưa phát sinh progress).</div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b bg-gray-50">
                          <th className="py-2 px-3">ID</th>
                          <th className="py-2 px-3">Username</th>
                          <th className="py-2 px-3">Họ tên</th>
                          <th className="py-2 px-3">Email</th>
                          <th className="py-2 px-3">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {learners.map((u) => (
                          <tr key={u.user_id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-3">{u.user_id}</td>
                            <td className="py-2 px-3 font-semibold">{u.username}</td>
                            <td className="py-2 px-3">{u.fullName || '—'}</td>
                            <td className="py-2 px-3">{u.email || '—'}</td>
                            <td className="py-2 px-3">{u.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* {!stats && (
                  <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                    ✅ Muốn thống kê “bao nhiêu người hoàn thành khóa học” thì backend cần endpoint:
                    <div className="mt-2 font-mono text-xs bg-white/70 p-2 rounded">GET /api/provider/courses/:courseId/stats</div>
                    Trả về ví dụ:
                    <div className="mt-2 font-mono text-xs bg-white/70 p-2 rounded">
                      {'{ "totalLearners": 30, "completedLearners": 12, "completionRate": 40 }'}
                    </div>
                  </div>
                )} */}
              </>
            )}
          </div>
        </section>

       
      </main>
    </div>
  );
}
