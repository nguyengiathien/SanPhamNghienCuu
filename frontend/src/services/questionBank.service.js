/**
 * Question Bank service
 */

import { http } from './http';

export const questionBankService = {
  /**
   * Lấy tất cả question banks
   */
  getAll() {
    return http.get('/question-banks');
  },

  /**
   * Lấy question bank theo ID
   */
  getById(id) {
    return http.get(`/question-banks/${id}`);
  },

  /**
   * Tạo question bank mới (provider/admin)
   */
  create(bankData) {
    return http.post('/question-banks', bankData);
  },

  /**
   * Thêm question vào bank
   */
  addQuestion(bankId, questionId) {
    return http.post(`/question-banks/${bankId}/questions`, { questionId });
  },
};

