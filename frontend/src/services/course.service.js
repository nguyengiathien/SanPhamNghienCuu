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

export const courseService = {
  // GET /api/courses
  async getAllCourses() {
    const res = await fetch(`${API_BASE}/api/courses`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.courses ?? data; // tuỳ controller trả {courses} hay trả thẳng []
  },

  // GET /api/courses/:id
  async getCourseById(id) {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.course ?? data;
  },

  // GET /api/courses/:courseId/outcomes
  async getOutcomes(courseId) {
    const res = await fetch(`${API_BASE}/api/courses/${courseId}/outcomes`, {
      method: 'GET',
      headers: { ...authHeader() },
      cache: 'no-store',
    });
    const data = await parseJson(res);
    return data.outcomes ?? data;
  },

  // ADMIN/PROVIDER: POST /api/courses
  async createCourse(payload) {
    const res = await fetch(`${API_BASE}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await parseJson(res);
    return data.course ?? data;
  },

  // ADMIN/PROVIDER: PUT /api/courses/:id
  async updateCourse(id, payload) {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await parseJson(res);
    return data.course ?? data;
  },

  // ADMIN/PROVIDER: DELETE /api/courses/:id
  async deleteCourse(id) {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    const data = await parseJson(res);
    return data;
  },
};
