import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ContactForm() {
  return (
    <div className="flex justify-center items-center h-screen w-1/2 bg-gradient-to-r from-[#4e0eff]/80 via-[#8f00ff]/80 to-[#b597ff]/80 p-15">
      <form className="w-full max-w-2xl bg-white/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Gửi tin nhắn cho chúng tôi
            </h2> */}

        {/* Họ và Tên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-indigo-700 font-semibold mb-2">Họ:</label>
            <input
              type="text"
              placeholder="Họ"
              className="w-full px-4 py-2 rounded-lg bg-white/40 border border-transparent focus:border-purple-400 focus:ring focus:ring-purple-500/30 placeholder-indigo-400/80 text-indigo-800 transition outline-indigo-800"
              required
            />
          </div>
          <div>
            <label className="block text-indigo-800 font-semibold mb-2">Tên:</label>
            <input
              type="text"
              placeholder="Tên"
              className="w-full px-4 py-2 rounded-lg bg-white/40 border border-transparent focus:border-purple-400 focus:ring focus:ring-purple-500/30 placeholder-indigo-400/80 text-indigo-800 transition outline-indigo-800"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-indigo-800 font-semibold mb-2">Email (Không bắt buộc):</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white/40 border border-transparent focus:border-purple-400 focus:ring focus:ring-purple-500/30 placeholder-indigo-400/80 text-indigo-800 transition outline-indigo-800"
          />
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label className="block text-indigo-800 font-semibold mb-2">
            Số điện thoại:
          </label>
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="w-full px-4 py-2 rounded-lg bg-white/40 border border-transparent focus:border-purple-400 focus:ring focus:ring-purple-500/30 placeholder-indigo-400/80 text-indigo-800 transition outline-indigo-800"
            required
          />
        </div>

        {/* Lời nhắn */}
        <div className="mb-8">
          <label className="block text-indigo-800 font-semibold mb-2">Lời nhắn:</label>
          <textarea
            placeholder="Lời nhắn"
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-white/40 border border-transparent focus:border-purple-400 focus:ring focus:ring-purple-500/30 placeholder-indigo-400/80 text-indigo-800 transition outline-indigo-800 resize-none"
            required
          ></textarea>
        </div>

        {/* Nút gửi */}
        <div className="text-right text-sm">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:from-[#7f00ff] hover:to-[#4e0eff] text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-purple-500/40 transition-transform transform hover:-translate-y-1"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="animate-pulse !w-[15px]" />
            Gửi tin nhắn
          </button>
        </div>
      </form>
    </div>
  );
}
