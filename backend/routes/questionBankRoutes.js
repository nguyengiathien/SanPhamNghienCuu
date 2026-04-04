'use strict';

const express = require('express');
const router = express.Router();

const questionBankController = require('../controllers/questionBankController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const {
  createQuestionBankValidationRules,
  addQuestionToBankValidationRules
} = require('../validators/questionBankValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/', authenticateToken, questionBankController.getAllBanks);
router.get('/:id', authenticateToken, questionBankController.getBankById);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createQuestionBankValidationRules(),
  handleValidationErrors,
  questionBankController.createBank
);

router.post(
  '/:id/questions',
  authenticateToken,
  authorizeRole('admin','provider'),
  addQuestionToBankValidationRules(),
  handleValidationErrors,
  questionBankController.addQuestionToBank
);

module.exports = router;
