'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!formData.fullName.trim()) {
      setMessage("Vui lòng nhập họ tên");
      setIsError(true);
      return;
    }

    if (!formData.username.trim()) {
      setMessage("Vui lòng nhập tên đăng nhập");
      setIsError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu không khớp");
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);

      
      const payload = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

     
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data;
      try { data = JSON.parse(raw); } catch { data = {}; }

      if (!res.ok) {
        let errorMsg = data?.message || "Đăng ký thất bại";

        // express-validator thường trả errors: [{ msg, path, ... }]
        if (Array.isArray(data?.errors) && data.errors.length) {
          errorMsg = data.errors.map((err) => `• ${err.msg}`).join("\n");
        }

        setMessage(errorMsg);
        setIsError(true);
        return;
      }

      setMessage(data?.message || "Đăng ký thành công ✅");
      setIsError(false);

      setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
      });

      // ✅ chuyển trang bằng router.push trong client
      setTimeout(() => router.push("/login"), 500);

    } catch (err) {
      console.log("FETCH ERROR:", err);
      setMessage("Lỗi kết nối đến server");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40%">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#71D9FF]">
        <h1 className="w-fit m-auto text-2xl font-bold mb-6 text-center bg-clip-text bg-gradient-to-tr from-indigo-600 from-20% via-indigo-200 via-40% to-indigo-700 to-70% text-transparent">
          Đăng ký tài khoản
        </h1>

        {message && (
          <div className={`mb-4 text-center font-medium whitespace-pre-line ${isError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            >
              <option value="student">Học viên</option>
              <option value="provider">Nhà cung cấp</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-lg transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-tr from-indigo-400/70 to-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            {isLoading ? "Đang tải..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Quay lại trang <a href="/login" className="text-indigo-600 hover:underline font-medium">Đăng nhập</a>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          <a href="/" className="text-indigo-600 hover:underline font-medium">Trang chủ</a>
        </p>
      </div>
    </div>
  );
}
