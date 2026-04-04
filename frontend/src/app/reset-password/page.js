'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setMessage('Thiếu token đặt lại mật khẩu');
        setIsError(true);
        setTokenValid(false);
        setChecking(false);
        return;
      }

      try {
        setChecking(true);
        await authService.validateResetToken(token);
        setTokenValid(true);
        setMessage('');
        setIsError(false);
      } catch (error) {
        setTokenValid(false);
        setMessage(error?.message || 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
        setIsError(true);
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!formData.password || !formData.confirmPassword) {
      setMessage('Vui lòng nhập đầy đủ thông tin');
      setIsError(true);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự');
      setIsError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Xác nhận mật khẩu không khớp');
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);
      const data = await authService.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );

      setMessage(data?.message || 'Đặt lại mật khẩu thành công');
      setIsError(false);

      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (error) {
      setMessage(error?.message || 'Đặt lại mật khẩu thất bại');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40% px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300 text-center">
          <p className="text-indigo-700 font-medium">Đang kiểm tra liên kết đặt lại mật khẩu...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40% px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Liên kết không hợp lệ</h1>
          <p className="text-gray-600 mb-4">{message || 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'}</p>
          <a
            href="/forgot-password"
            className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            Yêu cầu link mới
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40% px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300">
        <h1 className="w-fit m-auto text-2xl font-bold mb-4 text-center bg-clip-text bg-gradient-to-tr from-indigo-600 from-20% via-indigo-200 via-40% to-indigo-700 to-70% text-transparent">
          Đặt lại mật khẩu
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>

        {message && (
          <div
            className={`mb-4 text-center font-medium whitespace-pre-line ${
              isError ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">
              Mật khẩu mới:
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

          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">
              Xác nhận mật khẩu mới:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-lg transition-all shadow-md ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-tr from-indigo-400/70 to-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Quay lại{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}