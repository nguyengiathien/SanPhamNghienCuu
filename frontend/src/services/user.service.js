// src/services/user.service.js
'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
  async getMe() {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      method: 'GET',
      headers: {
        ...authHeader(),
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || 'Không lấy được thông tin user');
    return data.user; // backend trả { user }
  },

  async updateMe(payload) {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || 'Cập nhật thất bại');
    return data.user; // backend trả { message, user }
  },

  async updateMyAvatar(file) {
    const fd = new FormData();
    fd.append('avatar', file);

    const res = await fetch(`${API_BASE}/api/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        ...authHeader(), // KHÔNG set Content-Type khi dùng FormData
      },
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || 'Upload avatar thất bại');
    return data.user; // backend trả { message, user }
  },

  // gọi 1 lần cho profile: update info + (nếu có) update avatar
  async updateProfile({ data, avatarFile }) {
    let user = await this.updateMe(data);
    if (avatarFile) {
      user = await this.updateMyAvatar(avatarFile);
    }
    return user;
  },
};
