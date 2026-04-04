'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [debugLink, setDebugLink] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setDebugLink('');
    setIsError(false);

    if (!email.trim()) {
      setMessage('Vui lòng nhập email');
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);
      const data = await authService.forgotPassword(email.trim());

      setMessage(
        data?.message || 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu.'
      );
      setDebugLink(data?.debugResetLink || '');
      setIsError(false);
    } catch (error) {
      setMessage(error?.message || 'Không thể gửi yêu cầu quên mật khẩu');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40% px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300">
        <h1 className="w-fit m-auto text-2xl font-bold mb-4 text-center bg-clip-text bg-gradient-to-tr from-indigo-600 from-20% via-indigo-200 via-40% to-indigo-700 to-70% text-transparent">
          Quên mật khẩu
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Nhập email của bạn để nhận link đặt lại mật khẩu.
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

        {debugLink && (
          <div className="mb-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-sm">
            <p className="font-semibold text-indigo-700 mb-2">Link test trong môi trường development:</p>
            <a
              href={debugLink}
              className="break-all text-indigo-600 hover:underline"
            >
              {debugLink}
            </a>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-indigo-900/80 font-semibold mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Nhập email đã đăng ký"
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
            {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Quay lại{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Đăng nhập
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