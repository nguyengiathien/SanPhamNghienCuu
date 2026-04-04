/**
 * Major service
 */

import { http } from './http';

export const majorService = {
  /**
   * Lấy tất cả majors
   */
  getAll() {
    return http.get('/majors');
  },

  /**
   * Lấy major theo ID
   */
  getById(id) {
    return http.get(`/majors/${id}`);
  },

  /**
   * Tạo major mới (admin)
   */
  create(majorData) {
    return http.post('/majors', majorData);
  },

  /**
   * Cập nhật major (admin)
   */
  update(id, majorData) {
    return http.patch(`/majors/${id}`, majorData);
  },

  /**
   * Xóa major (admin)
   */
  delete(id) {
    return http.delete(`/majors/${id}`);
  },
};

