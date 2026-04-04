'use strict';

const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/lessonController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const {
  createLessonValidationRules,
  addLessonContentValidationRules
} = require('../validators/lessonValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/', authenticateToken, lessonController.getLessons);
router.get('/:id', authenticateToken, lessonController.getLessonById);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createLessonValidationRules(),
  handleValidationErrors,
  lessonController.createLesson
);

router.post(
  '/:id/contents',
  authenticateToken,
  authorizeRole('admin','provider'),
  addLessonContentValidationRules(),
  handleValidationErrors,
  lessonController.addLessonContent
);

const lessonCheckpointController = require('../controllers/lessonCheckpointController');
// ===== Checkpoint gating =====
router.get('/:lessonId/access', authenticateToken, lessonCheckpointController.getAccess);
router.get('/:lessonId/checkpoints', authenticateToken, lessonCheckpointController.getCheckpoints);
router.post('/:lessonId/checkpoints/:checkpointId/submit', authenticateToken, lessonCheckpointController.submitCheckpoint);
router.post('/:lessonId/video-progress', authenticateToken, lessonCheckpointController.updateVideoProgress);

// ===== Manage checkpoints (admin/provider) =====
router.post(
  '/:lessonId/checkpoints',
  authenticateToken,
  authorizeRole('admin','provider'),
  lessonCheckpointController.createCheckpoint
);


const uploadVideo = require('../middlewares/uploadVideo');

router.post(
  '/:id/video',
  authenticateToken,
  authorizeRole('admin','provider'),
  uploadVideo.single('video'),
  lessonController.uploadLessonVideo
);

module.exports = router;
