'use strict'
const { body, param } = require('express-validator')

const createTestValidationRules = () => {
  return [
    body('testName')
      .notEmpty().withMessage('ten de thi khong duoc de trong'),

    body('testDuration')
      .isInt({ min: 1 }).withMessage('thoi gian thi khong hop le'),

    body('testQNumber')
      .isInt({ min: 1 }).withMessage('so cau hoi khong hop le'),

    // ✅ creator_id lấy từ token, không nhận từ body nữa
    // body('creator_id').isInt().withMessage('creator_id khong hop le')

    // ✅ nếu bạn dùng quiz theo course_id (bạn đã add cột course_id trong Tests)
    body('course_id')
      .optional({ nullable: true })
      .isInt({ min: 1 }).withMessage('course_id khong hop le'),
  ]
}

const assignTestToClassValidationRules = () => {
  return [
    param('id')
      .isInt().withMessage('test_id khong hop le'),

    body('class_id')
      .isInt().withMessage('class_id khong hop le')
  ]
}

const addQuestionToTestValidationRules = () => {
  return [
    param('id')
      .isInt().withMessage('test_id khong hop le'),

    body('question_id')
      .isInt().withMessage('question_id khong hop le'),

    // ✅ optional nếu bạn truyền orderIndex khi add vào test
    body('orderIndex')
      .optional({ nullable: true })
      .isInt({ min: 0 }).withMessage('orderIndex khong hop le')
  ]
}

module.exports = {
  createTestValidationRules,
  assignTestToClassValidationRules,
  addQuestionToTestValidationRules
}
