'use client';

import { AuthGuard } from '@/lib/auth/guards';

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}

