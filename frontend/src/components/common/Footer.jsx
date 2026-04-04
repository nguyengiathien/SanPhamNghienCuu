/**
 * Footer Component
 */

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
        {/* Logo + Intro */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">E-Learning Platform</h2>
          <p className="text-sm leading-6">
            Nền tảng học trực tuyến giúp kết nối học viên – giảng viên – trung tâm đào tạo.
            Học mọi lúc, mọi nơi với kho khóa học phong phú và linh hoạt.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liên kết nhanh</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/courses" className="hover:text-white transition">
                Khóa học
              </a>
            </li>
            <li>
              <a href="/classes" className="hover:text-white transition">
                Lớp học
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Giảng viên
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Hỗ trợ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liên hệ</h3>
          <ul className="text-sm space-y-2">
            <li>
              Email:{' '}
              <a
                href="mailto:support@elearning.com"
                className="hover:text-white transition"
              >
                support@elearning.com
              </a>
            </li>
            <li>Hotline: <span className="hover:text-white transition">0123 456 789</span></li>
            <li>Địa chỉ: TP. Hồ Chí Minh</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-400 py-4">
        © 2025 <span className="font-semibold text-white">Nhóm 04</span>. All rights reserved.
      </div>
    </footer>
  );
}

