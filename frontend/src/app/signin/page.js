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
            localStorage.setItem('user', JSON.stringify(data.user)); //local -> db

            setMessage('Đăng nhập thành công');
            if (data.user.role === "admin") {
                setTimeout(() => router.push('/admin/'), 1000);
            } else {
                setTimeout(() => router.push('/'), 1000);
            }
            // } else if (data.user.role === "student") {
            //     setTimeout(() => router.push('/student'), 1000)
            // } else if (data.user.role === "admin") {
            //     setTimeout(() => router.push('/admin'), 1000)
            // }

        } catch (err) {
            console.error(err);
            setMessage('Lỗi kết nối server')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40%">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300">
                <div>
                    <h1 className="w-fit m-auto text-2xl font-bold mb-6 text-center bg-clip-text bg-gradient-to-tr from-indigo-600 from-20% via-indigo-200 via-40% to-indigo-700 to-70% text-transparent">Đăng nhập</h1>
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
                        <label className="block text-indigo-900/80 font-semibold mb-1">
                            Email:
                        </label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
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
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-tr from-indigo-400/70 to-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-md">
                        Đăng nhập
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">Chưa có tài khoản? <a href="/signup" className="text-indigo-600 hover:underline font-medium">Đăng ký</a></p>
                <p className="text-center text-sm text-gray-600 mt-2"><a href="/" className="text-indigo-600 hover:underline font-medium">Trang chủ</a></p>
            </div>
        </div>

    )
}