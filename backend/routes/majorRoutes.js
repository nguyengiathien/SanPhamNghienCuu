'use strict';

const express = require('express');
const router = express.Router();

const majorController = require('../controllers/majorController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const {
  createMajorValidationRules,
  updateMajorValidationRules
} = require('../validators/majorValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

router.get('/', majorController.getAllMajors);

router.get('/:id', majorController.getMajorById);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin','provider'),
  createMajorValidationRules(),
  handleValidationErrors,
  majorController.createMajor
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin','provider'),
  updateMajorValidationRules(),
  handleValidationErrors,
  majorController.updateMajor
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  majorController.deleteMajor
);

module.exports = router;
