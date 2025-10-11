'use client'
import { useState } from "react"

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage("Mật khẩu không khớp");
            return;
        }
        setMessage("Đăng ký thành công");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#CDF1FF]">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#71D9FF]">
                <h1 className="text-2xl font-bold text-[#003140] mb-6 text-center">
                    Đăng ký tài khoản
                </h1>

                {message && (
                    <p className={`mb-4 text-center font-medium ${message.includes("khớp") ? "text-red-600" : "text-green-600"}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <button
                        type="submit"
                        className="w-full bg-[#00ABFD] hover:bg-[#00587C] text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    )
}
