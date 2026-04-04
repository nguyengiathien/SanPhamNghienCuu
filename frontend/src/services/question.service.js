/**
 * Question service
 */

import { http } from './http';

export const questionService = {
  /**
   * Lấy tất cả question types
   */
  getTypes() {
    return http.get('/questions/types');
  },

  /**
   * Tạo question type mới (provider/admin)
   */
  createType(typeData) {
    return http.post('/questions/types', typeData);
  },

  /**
   * Lấy tất cả questions
   */
  getAll() {
    return http.get('/questions');
  },

  /**
   * Lấy question theo ID
   */
  getById(id) {
    return http.get(`/questions/${id}`);
  },

  /**
   * Tạo question mới (provider/admin)
   */
  create(questionData) {
    return http.post('/questions', questionData);
  },

  /**
   * Cập nhật question (provider/admin)
   */
  update(id, questionData) {
    return http.put(`/questions/${id}`, questionData);
  },
};

