'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Vui lòng đăng nhập lại');
      return;
    }

    fetch('http://localhost:8080/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser({ name: data.name, email: data.email });
        } else {
          setMessage(data.message || 'Không thể tải thông tin người dùng');
        }
      })
      .catch(() => setMessage('Lỗi khi kết nối server'));
  }, []);

  // Hàm xử lý cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Bạn chưa đăng nhập');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Cập nhật thất bại');
        return;
      }

      setMessage('Cập nhật thành công 🎉');
      localStorage.setItem('user', JSON.stringify(data.user));
      setPassword('');
    } catch (err) {
      setMessage('Lỗi kết nối server');
    }
  };

  // JSX hiển thị form
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#CDF1FF]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#71D9FF]">
        <h1 className="text-2xl font-bold text-[#003140] mb-6 text-center">Chỉnh sửa thông tin cá nhân</h1>

        {message && (
          <p className={`mb-4 text-center font-medium ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#00587C] font-semibold mb-1">Tên:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
              required
            />
          </div>

          <div>
            <label className="block text-[#00587C] font-semibold mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
              required
            />
          </div>

          <div>
            <label className="block text-[#00587C] font-semibold mb-1">Mật khẩu mới (tuỳ chọn):</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#71D9FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ABFD]"
            />
          </div>

          <button type="submit" className="w-full bg-[#00ABFD] hover:bg-[#00587C] text-white font-semibold py-2 rounded-lg transition-colors">
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
