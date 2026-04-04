'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <div id="container" className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="flex-1 w-full pt-[64px]">
        {/* HERO / Giới thiệu trang web */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 md:px-10 py-12 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                Nền tảng E-Learning cho học tập hiện đại
              </h1>
              <p className="text-base md:text-lg mb-6 text-blue-100">
                Học mọi lúc, mọi nơi với các khóa học chất lượng từ giảng viên giàu kinh nghiệm.
                Theo dõi tiến độ, tham gia lớp học trực tuyến và nhận chứng chỉ hoàn thành.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold shadow-md hover:shadow-lg hover:bg-blue-50 transition">
                  Khám phá khóa học
                </button>
                <button className="px-6 py-3 rounded-xl border border-blue-100 text-white font-semibold hover:bg-blue-700/40 transition">
                  Đăng ký tài khoản
                </button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
                <h2 className="text-xl font-semibold mb-4">Học tập linh hoạt</h2>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li>• Video bài giảng chất lượng cao</li>
                  <li>• Bài tập, quiz và bài kiểm tra trực tuyến</li>
                  <li>• Theo dõi tiến độ học theo từng khóa</li>
                  <li>• Kết nối với giảng viên và bạn học</li>
                  <li>• Hỗ trợ trên mọi thiết bị (PC, tablet, mobile)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Lợi ích / Tính năng chính */}
        <section className="px-6 md:px-10 py-10 md:py-14">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              Tại sao nên chọn nền tảng E-Learning của chúng tôi?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Nội dung cập nhật</h3>
                <p className="text-sm text-gray-600">
                  Khóa học được xây dựng dựa trên nhu cầu thực tế, liên tục được cập nhật để phù hợp
                  với chương trình và xu hướng mới.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Học mọi lúc, mọi nơi</h3>
                <p className="text-sm text-gray-600">
                  Chỉ cần có Internet, bạn có thể truy cập bài giảng, tài liệu và bài tập trên mọi thiết bị.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Theo dõi tiến độ</h3>
                <p className="text-sm text-gray-600">
                  Hệ thống báo cáo giúp bạn biết mình đã học đến đâu, còn thiếu những nội dung nào
                  và mục tiêu tiếp theo là gì.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Tương tác trực tuyến</h3>
                <p className="text-sm text-gray-600">
                  Diễn đàn thảo luận, bình luận dưới bài học và hệ thống tin nhắn hỗ trợ trao đổi nhanh
                  với giảng viên.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Quản lý lớp học</h3>
                <p className="text-sm text-gray-600">
                  Giảng viên dễ dàng tạo lớp, quản lý học viên, chấm điểm và xuất báo cáo kết quả học tập.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Chứng chỉ hoàn thành</h3>
                <p className="text-sm text-gray-600">
                  Sau khi hoàn thành khóa học, học viên có thể nhận chứng chỉ/giấy chứng nhận trực tuyến.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Đối tượng sử dụng */}
        <section className="bg-white px-6 md:px-10 py-10 md:py-14 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              Phù hợp cho nhiều đối tượng
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Học sinh / Sinh viên</h3>
                <p className="text-sm text-gray-600">
                  Ôn tập kiến thức, bổ sung kỹ năng, chuẩn bị kỳ thi với lộ trình rõ ràng.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Giảng viên</h3>
                <p className="text-sm text-gray-600">
                  Xây dựng khóa học số, quản lý lớp học, giao bài tập và chấm bài trên một nền tảng duy nhất.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Doanh nghiệp / Trung tâm</h3>
                <p className="text-sm text-gray-600">
                  Đào tạo nội bộ, quản lý nhân sự học tập, theo dõi tiến độ và kết quả theo từng phòng ban.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
