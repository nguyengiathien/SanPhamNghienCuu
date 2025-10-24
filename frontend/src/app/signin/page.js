'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!formData.email || !formData.password) {
            setMessage('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || 'Đăng nhập thất bại');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setMessage('Đăng nhập thành công');
            setTimeout(() => router.push('/profile'), 1000)
        } catch (err) {
            console.error(err);
            setMessage('Lỗi kết nối server')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#CDF1FF]">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#71D9FF]">
                <div>
                    <h1 className="text-2xl font-bold text-[#003140] mb-6 text-center">Đăng nhập</h1>
                </div>
                {message && (
                    <p
                        className={`mb-4 text-center font-medium ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {message}
                    </p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">
                            Email:
                        </label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#00587C] font-semibold mb-1">
                            Mật khẩu:
                        </label>
                        <input
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#00ABFD] hover:bg-[#00587C] text-white font-semibold py-2 rounded-lg transition-colors">
                        Đăng nhập
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">Chưa có tài khoản? <a href="/signup" className="text-[#00ABFD] hover:underline">Đăng ký</a></p>
            </div>
        </div>

    )
}