'use strict'
const express = require('express')
const router = express.Router()

const socialController = require('../controllers/socialController')
const authenticateToken = require('../middlewares/authenticateToken')
const authorizeRole = require('../middlewares/authorizeRole')

// Reacts
router.get('/reacts', authenticateToken, socialController.getReacts)
router.post(
  '/reacts',
  authenticateToken,
  authorizeRole('admin'),
  socialController.createReact
)

// Course comments
router.post(
  '/course-comments',
  authenticateToken,
  socialController.createCourseComment
)

router.post(
  '/course-comments/:id/contents',
  authenticateToken,
  socialController.addCourseCommentContent
)

router.post(
  '/course-comments/:id/reacts',
  authenticateToken,
  socialController.reactCourseComment
)

// Meetings
router.get('/meetings', authenticateToken, socialController.getMeetings)
router.post(
  '/meetings',
  authenticateToken,
  authorizeRole('admin','provider'),
  socialController.createMeeting
)

// Posts
router.post('/posts', authenticateToken, socialController.createPost)
router.post('/posts/:id/contents', authenticateToken, socialController.addPostContent)
router.post('/posts/:id/reacts', authenticateToken, socialController.reactPost)

// Post comments
router.post('/posts/:id/comments', authenticateToken, socialController.createPostComment)
router.post(
  '/post-comments/:id/contents',
  authenticateToken,
  socialController.addPostCommentContent
)
router.post(
  '/post-comments/:id/reacts',
  authenticateToken,
  socialController.reactPostComment
)

module.exports = router
