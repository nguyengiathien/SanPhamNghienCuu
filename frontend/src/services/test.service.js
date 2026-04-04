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

export const testService = {
  async getAllTests() {
    const res = await fetch(`${API_BASE}/api/tests`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.tests ?? data;
  },

  async getTestById(id) {
    const res = await fetch(`${API_BASE}/api/tests/${id}`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.test ?? data;
  },

  async startAttempt(testId) {
    const res = await fetch(`${API_BASE}/api/tests/${testId}/attempts`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    const data = await parseJson(res);
    return data; // attempt info
  },

  async submitResponse(attemptId, payload) {
    const res = await fetch(`${API_BASE}/api/tests/attempts/${attemptId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await parseJson(res);
    return data;
  },

  async finishAttempt(attemptId) {
    const res = await fetch(`${API_BASE}/api/tests/attempts/${attemptId}/finish`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    const data = await parseJson(res);
    return data;
  },
};
