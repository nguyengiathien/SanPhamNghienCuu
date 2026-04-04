'use strict';

const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const {
  createQuestionTypeValidationRules,
  createQuestionValidationRules,
  updateQuestionValidationRules
} = require('../validators/questionValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/types', authenticateToken, questionController.getQuestionTypes);

router.post(
  '/types',
  authenticateToken,
  authorizeRole('admin','provider'),
  createQuestionTypeValidationRules(),
  handleValidationErrors,
  questionController.createQuestionType
);

router.get('/', authenticateToken, questionController.getAllQuestions);
router.get('/:id', authenticateToken, questionController.getQuestionById);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createQuestionValidationRules(),
  handleValidationErrors,
  questionController.createQuestion
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin','provider'),
  updateQuestionValidationRules(),
  handleValidationErrors,
  questionController.updateQuestion
);

module.exports = router;
