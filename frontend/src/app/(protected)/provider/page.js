'use client';

import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useAuthStore from '@/store/auth.store';

export default function ProviderDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const cards = [
    {
      title: 'Khóa học',
      desc: 'Tạo / sửa / xóa khóa học, gắn major, upload thumbnail.',
      href: '/provider/courses',
      color: 'bg-indigo-500',
    },
    {
      title: 'Bài học',
      desc: 'Tạo bài học trong khóa học (lesson), sắp xếp thứ tự.',
      href: '/provider/lessons',
      color: 'bg-blue-500',
    },
    {
      title: 'Video + Câu hỏi',
      desc: 'Upload MP4 từ máy lên server (uploads/videos) và tạo checkpoint câu hỏi trong video.',
      href: '/provider/videoAndQuestions',
      color: 'bg-purple-500',
    },
    {
      title: 'Quiz cuối khóa',
      desc: 'Tạo bài quiz cuối khóa và thêm đủ số câu hỏi.',
      href: '/provider/finalQuiz',
      color: 'bg-green-500',
    },
    {
      title: 'Người học',
      desc: 'Xem danh sách người học của từng khóa và thống kê hoàn thành (nếu có endpoint).',
      href: '/provider/Student',
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      

      <main className="bg-white w-full pt-[45px]">
        {/* HERO */}
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-6 flex flex-col md:flex-row items-center md:justify-between gap-4 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="text-left">
            <div className="text-white/90 text-sm font-semibold">Provider Dashboard</div>
            <div className="text-white text-2xl md:text-3xl font-extrabold">
              Quản lý khóa học • bài học • video • quiz • người học
            </div>
            <div className="text-white/80 text-sm mt-2">
              Đăng nhập: <b>{user?.username || '—'}</b> ({user?.role || '—'})
            </div>
          </div>

          <div className="bg-white/20 border border-white/30 rounded-2xl px-4 py-3 text-white text-sm">
            <div className="font-semibold">Gợi ý</div>
            <div className="mt-1 opacity-90">
              Bắt đầu từ <b>Khóa học</b> → tạo <b>Bài học</b> → upload <b>Video</b> → tạo <b>Quiz</b>.
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {cards.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group block bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className={`${c.color} p-4`}>
                    <div className="text-white font-extrabold text-lg">{c.title}</div>
                    <div className="text-white/90 text-sm mt-1">{c.desc}</div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                      Đi tới trang
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-indigo-50">
                      <span className="text-gray-700 group-hover:text-indigo-700 text-lg">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Notes */}
           
          </div>
        </section>

        
      </main>
    </div>
  );
}
