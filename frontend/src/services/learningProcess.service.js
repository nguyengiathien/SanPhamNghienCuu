/**
 * Learning Process service
 */

import { http } from './http';

export const learningProcessService = {
  /**
   * Lấy tiến độ học tập của user hiện tại
   */
  getMyProgress() {
    return http.get('/learning-processes');
  },

  /**
   * Cập nhật tiến độ học tập
   */
  updateProgress(progressData) {
    return http.post('/learning-processes', progressData);
  },
};

