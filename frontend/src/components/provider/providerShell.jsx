'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/provider/courses', label: 'Khóa học' },
  { href: '/provider/lessons', label: 'Bài học' },
  { href: '/provider/videoAndQuestions', label: 'Video + Câu hỏi' },
  { href: '/provider/finalQuiz', label: 'Quiz cuối khóa' },
  { href: '/provider/learners', label: 'Người học' },
];

export default function ProviderShell({ children }) {
  const pathname = usePathname();

  return (
    <main className="bg-white w-full pt-[45px]">
      <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex flex-col md:flex-row items-center md:justify-between gap-4 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
        <div className="text-left">
          <div className="text-white/90 text-sm font-semibold">Provider Panel</div>
          <div className="text-white text-xl md:text-2xl font-extrabold">
            Quản lý khóa học • bài học • video • quiz • người học
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((t) => {
            const active = pathname?.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2 rounded-xl font-semibold shadow ${
                  active ? 'bg-white text-indigo-700' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </section>
    </main>
  );
}
