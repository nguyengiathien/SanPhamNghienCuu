'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export const lessonService = {
  async getLessons() {
    const res = await fetch(`${API_BASE}/api/lessons`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.lessons ?? data;
  },

  async getLessonById(id) {
    const res = await fetch(`${API_BASE}/api/lessons/${id}`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.lesson ?? data;
  },

  async createLesson(payload) {
    const res = await fetch(`${API_BASE}/api/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await parseJson(res);
    return data.lesson ?? data;
  },

  async addLessonContent(lessonId, payload) {
    const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/contents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await parseJson(res);
    return data;
  },
};
