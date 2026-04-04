'use strict'
const { body } = require('express-validator')

const registerValidationRules = () => {
  return [
    body('username')
      .notEmpty().withMessage('username khong duoc de trong')
      .isLength({ min: 3, max: 30 }).withMessage('username tu 3 den 30 ky tu')
      .trim(),

    body('email')
      .notEmpty().withMessage('email khong duoc de trong')
      .isEmail().withMessage('email khong hop le')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('password khong duoc de trong')
      .isLength({ min: 1 }).withMessage('password it nhat 1 ky tu'),

    body('role')
      .optional()
      .isIn(['admin', 'provider', 'student']).withMessage('role khong hop le')
  ]
}

const loginValidationRules = () => {
  return [
    body('emailOrUsername')
      .notEmpty().withMessage('email hoac username khong duoc de trong'),

    body('password')
      .notEmpty().withMessage('password khong duoc de trong')
  ]
}

const forgotPasswordValidationRules = () => {
  return [
    body('email')
      .notEmpty().withMessage('email khong duoc de trong')
      .isEmail().withMessage('email khong hop le')
      .normalizeEmail()
  ]
}

const resetPasswordValidationRules = () => {
  return [
    body('token')
      .notEmpty().withMessage('token khong duoc de trong'),

    body('password')
      .notEmpty().withMessage('password khong duoc de trong')
      .isLength({ min: 6 }).withMessage('password it nhat 6 ky tu'),

    body('confirmPassword')
      .notEmpty().withMessage('confirmPassword khong duoc de trong')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('xac nhan mat khau khong khop')
        }
        return true
      })
  ]
}

module.exports = {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules
}