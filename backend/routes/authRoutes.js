'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules
} = require('../validators/authValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const authenticateToken = require('../middlewares/authenticateToken');

router.post(
  '/signup',
  registerValidationRules(),
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  loginValidationRules(),
  handleValidationErrors,
  authController.login
);

router.post(
  '/forgot-password',
  forgotPasswordValidationRules(),
  handleValidationErrors,
  authController.forgotPassword
);

router.get(
  '/reset-password/:token',
  authController.validateResetToken
);

router.post(
  '/reset-password',
  resetPasswordValidationRules(),
  handleValidationErrors,
  authController.resetPassword
);

router.get('/me', authenticateToken, authController.getMe);

module.exports = router;