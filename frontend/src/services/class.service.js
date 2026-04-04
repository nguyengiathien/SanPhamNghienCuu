/**
 * Class service
 */

import { http } from './http';

export const classService = {
  /**
   * Lấy tất cả classes
   */
  getAll() {
    return http.get('/classes');
  },

  /**
   * Lấy class theo ID
   */
  getById(id) {
    return http.get(`/classes/${id}`);
  },

  /**
   * Tạo class mới (provider/admin)
   */
  create(classData) {
    return http.post('/classes', classData);
  },

  /**
   * Thêm member vào class
   */
  addMember(classId, userId) {
    return http.post(`/classes/${classId}/members`, { userId });
  },
};

