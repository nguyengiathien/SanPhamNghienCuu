'use strict';

const express = require('express');
const router = express.Router();

const classController = require('../controllers/classController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const {
  createClassValidationRules,
  addClassMemberValidationRules
} = require('../validators/classValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/', authenticateToken, classController.getAllClasses);
router.get('/:id', authenticateToken, classController.getClassById);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createClassValidationRules(),
  handleValidationErrors,
  classController.createClass
);

router.post(
  '/:id/members',
  authenticateToken,
  authorizeRole('admin','provider'),
  addClassMemberValidationRules(),
  handleValidationErrors,
  classController.addMember
);

module.exports = router;
