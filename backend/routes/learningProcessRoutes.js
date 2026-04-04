'use strict';

const express = require('express');
const router = express.Router();

const learningProcessController = require('../controllers/learningProcessController');
const authenticateToken = require('../middlewares/authenticateToken');
const {
  updateLearningProcessValidationRules
} = require('../validators/learningProcessValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get(
  '/',
  authenticateToken,
  learningProcessController.getMyProgress
);

router.post(
  '/',
  authenticateToken,
  updateLearningProcessValidationRules(),
  handleValidationErrors,
  learningProcessController.updateProgress
);

router.patch(
  '/lessons/:lessonId/complete',
  authenticateToken,
  learningProcessController.completeLesson
);

module.exports = router;
