/**
 * Admin Layout - Chỉ admin được truy cập
 */

'use client';

import { RoleGuard } from '@/lib/auth/guards';
import { ALLOWED_ROLES } from '@/lib/constants';

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={ALLOWED_ROLES.ADMIN_ONLY}>
      {children}
    </RoleGuard>
  );
}

