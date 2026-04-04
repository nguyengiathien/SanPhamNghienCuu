/**
 * HTTP client với token attachment
 */

const API_BASE_URL =  `${process.env.NEXT_PUBLIC_API_BASE/api}` || 'http://localhost:3000/api';

// Sử dụng Next.js API proxy
const getProxyUrl = (endpoint) => {
  return `/api/proxy${endpoint}`;
};

// Lấy token từ localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Fetch wrapper với token attachment
 */
export async function httpRequest(endpoint, options = {}) {
  const url = getProxyUrl(endpoint);
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      ...(options.body && typeof options.body === 'object' 
        ? { body: JSON.stringify(options.body) }
        : { body: options.body }
      ),
    });

    const data = await response.json();

    if (!response.ok) {
      // Nếu token hết hạn hoặc không hợp lệ
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    console.error('HTTP Error:', error);
    throw error;
  }
}

/**
 * HTTP methods
 */
export const http = {
  get: (endpoint, options = {}) => 
    httpRequest(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, body, options = {}) => 
    httpRequest(endpoint, { ...options, method: 'POST', body }),
  
  put: (endpoint, body, options = {}) => 
    httpRequest(endpoint, { ...options, method: 'PUT', body }),
  
  patch: (endpoint, body, options = {}) => 
    httpRequest(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: (endpoint, options = {}) => 
    httpRequest(endpoint, { ...options, method: 'DELETE' }),
};

