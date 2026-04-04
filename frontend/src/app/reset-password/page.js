import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

function LoadingResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300/70 from-50% to-indigo-400 to-40% px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-indigo-300 text-center">
        <p className="text-indigo-700 font-medium">
          Đang tải trang đặt lại mật khẩu...
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingResetPassword />}>
      <ResetPasswordClient />
    </Suspense>
  );
}