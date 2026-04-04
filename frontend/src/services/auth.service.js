const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const getErrorMessage = (data, fallback) => {
  if (data?.message) return data.message;

  const errorArray = Array.isArray(data?.error)
    ? data.error
    : Array.isArray(data?.errors)
    ? data.errors
    : [];

  if (errorArray.length) {
    return errorArray.map((item) => item.msg).join("\n");
  }

  return fallback;
};

export const authService = {
  async login(emailOrUsername, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(getErrorMessage(data, "Đăng nhập thất bại"));
    return data;
  },

  async getMe() {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(getErrorMessage(data, "Không lấy được user"));

    return data.user;
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(getErrorMessage(data, "Không thể gửi yêu cầu quên mật khẩu"));
    return data;
  },

  async validateResetToken(token) {
    const res = await fetch(`${API_BASE}/api/auth/reset-password/${encodeURIComponent(token)}`, {
      method: "GET",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(getErrorMessage(data, "Link đặt lại mật khẩu không hợp lệ"));
    return data;
  },

  async resetPassword(token, password, confirmPassword) {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(getErrorMessage(data, "Đặt lại mật khẩu thất bại"));
    return data;
  },
};