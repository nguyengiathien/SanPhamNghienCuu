'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth.store";

export default function SigninPage() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.emailOrUsername || !formData.password) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const data = await login(formData.emailOrUsername, formData.password);
      setMessage("Đăng nhập thành công");

      const role = data?.user?.role;

      setTimeout(() => {
        if (role === "admin") router.push("/admin");
        else if (role === "provider") router.push("/provider");
        else router.push("/");
      }, 500);
    } catch (err) {
      setMessage(err?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40%">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300">
        <h1 className="w-fit m-auto text-2xl font-bold mb-6 text-center bg-clip-text bg-gradient-to-tr from-indigo-600 from-20% via-indigo-200 via-40% to-indigo-700 to-70% text-transparent">
          Đăng nhập
        </h1>

        {message && (
          <p
            className={`mb-4 text-center font-medium whitespace-pre-line ${
              message.includes("thành công") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">
              Email hoặc Username:
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">
              Mật khẩu:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="text-right -mt-2">
            <a
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg transition-all shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-tr from-indigo-400/70 to-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Đăng ký
          </a>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          <a href="/" className="text-indigo-600 hover:underline font-medium">
            Trang chủ
          </a>
        </p>
      </div>
    </div>
  );
}