'use strict';

const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const uploadCourseThumbnail = require('../middlewares/uploadCourseThumbnail');
const {
  createCourseValidationRules,
  updateCourseValidationRules,
  createOutcomeValidationRules
} = require('../validators/courseValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
// Lessons of a course (for learning page)
router.get('/:courseId/lessons', authenticateToken, courseController.getLessonsOfCourse);
router.get('/:courseId/lessons/:lessonId', authenticateToken, courseController.getLessonOfCourse);


router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createCourseValidationRules(),
  handleValidationErrors,
  courseController.createCourse
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin','provider'),
  updateCourseValidationRules(),
  handleValidationErrors,
  courseController.updateCourse
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin','provider'),
  courseController.deleteCourse
);

// Outcomes
router.get('/:courseId/outcomes', courseController.getOutcomesByCourse);

router.post(
  '/:courseId/outcomes',
  authenticateToken,
  authorizeRole('admin','provider'),
  createOutcomeValidationRules(),
  handleValidationErrors,
  courseController.createOutcome
);

router.patch(
  '/:id/thumbnail',
  authenticateToken,
  authorizeRole('admin','provider'),
  uploadCourseThumbnail.single('thumbnail'),
  courseController.updateCourseThumbnail
);

router.get(
  '/:id/progress',
  authenticateToken,
  courseController.getMyCourseProgress
);

router.get(
  '/:id/admin-overview',
  authenticateToken,
  authorizeRole('admin'),
  courseController.getCourseAdminOverview
);

router.get('/:id/ratings/summary', courseController.getCourseRatingSummary);

router.get(
  '/:id/ratings/me',
  authenticateToken,
  courseController.getMyCourseRating
);

router.post(
  '/:id/ratings',
  authenticateToken,
  courseController.rateCourse
);
router.get('/:courseId/quiz', authenticateToken, courseController.getFinalQuizOfCourse);
router.post('/:courseId/quiz/submit', authenticateToken, courseController.submitFinalQuizOfCourse);

module.exports = router;
