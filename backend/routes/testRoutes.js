'use strict';

const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const {
  createTestValidationRules,
  assignTestToClassValidationRules,
  addQuestionToTestValidationRules
} = require('../validators/testValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/', authenticateToken, testController.getAllTests);
router.get('/:id', authenticateToken, testController.getTestById);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createTestValidationRules(),
  handleValidationErrors,
  testController.createTest
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'provider'),
  testController.updateTest
);

router.post(
  '/:id/classes',
  authenticateToken,
  authorizeRole('admin','provider'),
  assignTestToClassValidationRules(),
  handleValidationErrors,
  testController.assignTestToClass
);

router.post(
  '/:id/questions',
  authenticateToken,
  authorizeRole('admin','provider'),
  addQuestionToTestValidationRules(),
  handleValidationErrors,
  testController.addQuestionToTest
);

router.post('/:id/attempts', authenticateToken, testController.startAttempt);

router.post(
  '/attempts/:attemptId/responses',
  authenticateToken,
  testController.submitResponse
);

router.post(
  '/attempts/:attemptId/finish',
  authenticateToken,
  testController.finishAttempt
);

module.exports = router;