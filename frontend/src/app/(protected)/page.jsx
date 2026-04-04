/**
 * Protected Dashboard - Redirect theo role
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import { ROUTE_MAP } from '@/lib/constants';
import Loading from '@/components/common/Loading';

export default function ProtectedDashboard() {
  const router = useRouter();
  const { user, init } = useAuthStore();

  useEffect(() => {
    init();
    
    if (user?.role) {
      const redirectPath = ROUTE_MAP[user.role] || '/';
      router.push(redirectPath);
    }
  }, [router, user]);

  return <Loading message="Đang chuyển hướng..." />;
}

