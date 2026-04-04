'use client';
import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TopicsCategory from '@/components/courses_components/hero_topics_category';
import SearchBox from '@/components/search_box';
import useAuthStore from '@/store/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

function absUrl(url) {
  if (!url) return '';
  // backend trả "/uploads/..." => cần gắn host
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function levelLabel(level) {
  if (level === 'beginner') return 'Cơ bản';
  if (level === 'intermediate') return 'Trung cấp';
  if (level === 'advanced') return 'Nâng cao';
  return level || '—';
}

export default function CoursesPage() {
  const user = useAuthStore((s) => s.user);

  const [searchValue, setSearchValue] = useState('');
  const [majors, setMajors] = useState([]);
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchDraft, setSearchDraft] = useState('');


  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, totalPages: 1, totalItems: 0 });

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(pagination.page));
    params.set('limit', String(pagination.limit));

    if (searchValue) params.set('search', searchValue);
    if (selectedMajorId) params.set('majorId', selectedMajorId);
    if (selectedLevel) params.set('level', selectedLevel);

    return params.toString();
  }, [pagination.page, pagination.limit, searchValue, selectedMajorId, selectedLevel]);

  const handleSearchSubmit = (value) => {
    setSearchValue(value);
    setPagination((p) => ({ ...p, page: 1 })); // search thì về trang 1
  };

  // Load majors (danh mục)
  useEffect(() => {
    (async () => {
      try {
        // giả sử backend có GET /api/majors
        const res = await fetch(`${API_BASE}/api/majors`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Không tải được danh mục');
        setMajors(Array.isArray(data?.majors) ? data.majors : (Array.isArray(data) ? data : []));
      } catch (e) {
        // không chặn trang nếu majors lỗi
        console.log('Load majors error:', e?.message);
      }
    })();
  }, []);

  // Load courses
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrMsg('');
      try {
        const res = await fetch(`${API_BASE}/api/courses?${queryString}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Không tải được khóa học');

        setCourses(Array.isArray(data?.courses) ? data.courses : []);
        if (data?.pagination) {
          setPagination((p) => ({ ...p, ...data.pagination }));
        }
      } catch (e) {
        setErrMsg(e?.message || 'Failed to fetch');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [queryString]);

  const canSeeMyCourses = user?.role === 'student';

  return (
    <div id="container" className="min-h-screen bg-white">
      <Header />

      <main className="bg-white w-full z-2 pt-[45px]">
        {/* HERO */}
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex xl:flex-row sm:flex-col items-center xl:justify-evenly sm:justify-center sm:gap-6 xl:gap-15 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <TopicsCategory />
          <SearchBox
  placeholder="Tìm khóa học..."
  value={searchDraft}
  onChange={setSearchDraft}
  onSubmit={handleSearchSubmit}
/>
         
        </section>

        {/* BODY */}
        <section className="w-full flex flex-row justify-between items-start px-6 py-6 gap-6">
          {/* LEFT: Courses grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Danh sách khóa học</h2>
              <div className="text-sm text-gray-500">
                {pagination.totalItems ? `${pagination.totalItems} khóa học` : ''}
              </div>
            </div>

            {errMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                {errMsg}
              </div>
            )}

            {loading ? (
              <div className="p-6 text-gray-600">Đang tải...</div>
            ) : courses.length === 0 ? (
              <div className="p-6 text-gray-600">Không có khóa học phù hợp.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {courses.map((c) => {
                  const thumb = absUrl(c.thumbnailUrl);
                  const majorNames = Array.isArray(c.majors) ? c.majors.map((m) => m.majorName).filter(Boolean) : [];
                  return (
                    <div key={c.course_id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="w-full h-[140px] bg-gray-100">
                        <img
                          src={thumb || '/no_course.jpg'}
                          alt={c.courseName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // e.currentTarget.src = '/no_course.jpg';
                          }}
                        />
                      </div>

                      <div className="p-4">
                        <div className="font-semibold text-gray-900 line-clamp-2 min-h-[44px]">
                          {c.courseName}
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Danh mục:</span>{' '}
                            {majorNames.length ? majorNames.join(', ') : 'Chưa gán'}
                          </div>
                          <div className="mt-1">
                            <span className="font-semibold">Mức độ:</span> {levelLabel(c.level)}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <a
                            href={`/courses/${c.course_id}`}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm"
                          >
                            Xem
                          </a>
                          
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                disabled={pagination.page <= 1 || loading}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              >
                Prev
              </button>

              <div className="text-sm text-gray-700 px-2">
                Trang <b>{pagination.page}</b> / <b>{pagination.totalPages || 1}</b>
              </div>

              <button
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                disabled={pagination.page >= (pagination.totalPages || 1) || loading}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>

          {/* RIGHT: Filters */}
          <aside className="w-[280px] shrink-0 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="text-lg font-bold text-gray-800 mb-3">Bộ lọc</div>

            {/* Major filter */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục</label>
              <select
                value={selectedMajorId}
                onChange={(e) => {
                  setSelectedMajorId(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tất cả</option>
                {majors.map((m) => (
                  <option key={m.major_id} value={m.major_id}>
                    {m.majorName}
                  </option>
                ))}
              </select>
            </div>

            {/* Level filter */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mức độ</label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tất cả</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            {/* Reset */}
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg"
              onClick={() => {
                setSelectedMajorId('');
                setSelectedLevel('');
                setSearchValue('');
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              Xóa lọc
            </button>
          </aside>
        </section>

        <Footer />
      </main>
    </div>
  );
}
