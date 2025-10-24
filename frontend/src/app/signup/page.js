'use client'
import { useState } from "react"

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    })
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const { isLoading, setIsLoading } = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setMessage("Mật khẩu không khớp");
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content_Type": "Application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Đăng ký thất bại");
                setIsError(true);
            } else {
                setMessage(data.message);
                setIsError(false);
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'user'
                });
            }
        } catch (err) {
            setMessage("Lỗi kết nối đến server");
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#CDF1FF]">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#71D9FF]">
                <h1 className="text-2xl font-bold text-[#003140] mb-6 text-center">
                    Đăng ký tài khoản
                </h1>

                {message && (
                    <p className={`mb-4 text-center font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Họ tên */}
                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">Họ tên</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                        />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                        />
                    </div>

                    {/* Vai trò */}
                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">Vai trò</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                        >
                            <option value="user">Người dùng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>

                    {/* Nút đăng ký */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-semibold py-2 rounded-lg transition-colors ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#00ABFD] hover:bg-[#00587C] text-white"
                            }`}
                    >
                        {isLoading ? "Đang tải..." : "Đăng ký"}
                    </button>
                </form>
            </div>
        </div>
    );
}
