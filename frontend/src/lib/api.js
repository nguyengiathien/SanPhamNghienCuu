// lib/api.js
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

/**
 * Header Authorization
 */
export const authHeaders = (token = getToken()) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Chuẩn hoá message lỗi từ backend (Sequelize/express-validator/custom)
 */
function extractErrorMessage(data, fallback = 'Request failed') {
  if (!data) return fallback;

  // dạng phổ biến: { message: "..." }
  if (typeof data.message === 'string' && data.message.trim()) return data.message;

  // express-validator: { error: [{ msg: "..." }, ...] }
  if (Array.isArray(data.error) && data.error.length) {
    const m = data.error[0]?.msg;
    if (m) return m;
  }

  // một số nơi dùng { errors: [...] }
  if (Array.isArray(data.errors) && data.errors.length) {
    const m = data.errors[0]?.msg || data.errors[0]?.message;
    if (m) return m;
  }

  // Sequelize error shape (đôi khi)
  if (typeof data.error === 'string' && data.error.trim()) return data.error;

  return fallback;
}

/**
 * Fetch wrapper:
 * - path: "/api/..."
 * - options: { method, headers, body, token, timeoutMs, raw }
 *
 * body:
 * - Object => tự JSON.stringify + set Content-Type
 * - FormData => giữ nguyên, KHÔNG set Content-Type (browser tự set boundary)
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...authHeaders(),
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  const data = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg = isJson ? (data?.message || "Request failed") : `Request failed: ${data || res.status}`;
    throw new Error(msg);
  }
  return data;
}

/**
 * Sugar helpers (tuỳ thích dùng)
 */
export const api = {
  get: (path, opts) => apiFetch(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => apiFetch(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' }),
};
