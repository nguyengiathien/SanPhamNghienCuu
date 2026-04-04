/**
 * Social service
 */

import { http } from './http';

export const socialService = {
  /**
   * Lấy tất cả reacts
   */
  getReacts() {
    return http.get('/social/reacts');
  },

  /**
   * Tạo react mới (admin)
   */
  createReact(reactData) {
    return http.post('/social/reacts', reactData);
  },

  /**
   * Tạo course comment
   */
  createCourseComment(commentData) {
    return http.post('/social/course-comments', commentData);
  },

  /**
   * Thêm content vào course comment
   */
  addCourseCommentContent(commentId, contentData) {
    return http.post(`/social/course-comments/${commentId}/contents`, contentData);
  },

  /**
   * React course comment
   */
  reactCourseComment(commentId, reactId) {
    return http.post(`/social/course-comments/${commentId}/reacts`, { reactId });
  },

  /**
   * Lấy tất cả meetings
   */
  getMeetings() {
    return http.get('/social/meetings');
  },

  /**
   * Tạo meeting mới (provider/admin)
   */
  createMeeting(meetingData) {
    return http.post('/social/meetings', meetingData);
  },

  /**
   * Tạo post
   */
  createPost(postData) {
    return http.post('/social/posts', postData);
  },

  /**
   * Thêm content vào post
   */
  addPostContent(postId, contentData) {
    return http.post(`/social/posts/${postId}/contents`, contentData);
  },

  /**
   * React post
   */
  reactPost(postId, reactId) {
    return http.post(`/social/posts/${postId}/reacts`, { reactId });
  },

  /**
   * Tạo post comment
   */
  createPostComment(postId, commentData) {
    return http.post(`/social/posts/${postId}/comments`, commentData);
  },

  /**
   * Thêm content vào post comment
   */
  addPostCommentContent(commentId, contentData) {
    return http.post(`/social/post-comments/${commentId}/contents`, contentData);
  },

  /**
   * React post comment
   */
  reactPostComment(commentId, reactId) {
    return http.post(`/social/post-comments/${commentId}/reacts`, { reactId });
  },
};

