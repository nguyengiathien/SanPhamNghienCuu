/**
 * Auth Guards for route protection
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import { ROUTE_MAP, ALLOWED_ROLES } from '@/lib/constants';

/**
 * AuthGuard - Bảo vệ route yêu cầu đăng nhập
 */
export function AuthGuard({ children }) {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router, isAuthenticated]);

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * RoleGuard - Bảo vệ route theo role
 */
export function RoleGuard({ children, allowedRoles = ALLOWED_ROLES.ALL }) {
  const router = useRouter();
  const { user, hasAnyRole, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!hasAnyRole(allowedRoles)) {
      // Redirect về dashboard theo role
      const userRole = user?.role;
      const redirectPath = ROUTE_MAP[userRole] || '/';
      router.push(redirectPath);
    }
  }, [router, user, allowedRoles, hasAnyRole, isAuthenticated]);

  if (!isAuthenticated() || !hasAnyRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

