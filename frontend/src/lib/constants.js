/**
 * Constants cho ứng dụng
 */

export const ROLES = {
  ADMIN: 'admin',
  PROVIDER: 'provider',
  STUDENT: 'student',
};

export const ROUTE_MAP = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.PROVIDER]: '/provider',
  [ROLES.STUDENT]: '/student',
};

export const ALLOWED_ROLES = {
  ADMIN_ONLY: [ROLES.ADMIN],
  PROVIDER_AND_ADMIN: [ROLES.PROVIDER, ROLES.ADMIN],
  STUDENT_ONLY: [ROLES.STUDENT],
  ALL: [ROLES.ADMIN, ROLES.PROVIDER, ROLES.STUDENT],
};

