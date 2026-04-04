'use strict'
const { body, param } = require('express-validator')

const updateUserValidationRules = () => {
  return [
    param('id')
      .isInt().withMessage('id khong hop le'),

    body('email')
      .optional()
      .isEmail().withMessage('email khong hop le')
      .normalizeEmail(),

    body('role')
      .optional()
      .isIn(['admin','provider','student']).withMessage('role khong hop le'),

    body('fullName')
      .optional()
      .notEmpty().withMessage('fullName khong duoc de trong')
      .trim(),

    body('dob')
      .optional()
      .isISO8601().withMessage('dob khong hop le'),

    body('address')
      .optional()
      .trim()
  ]
}

module.exports = {
  updateUserValidationRules
}
