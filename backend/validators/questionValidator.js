'use strict'
const { body, param } = require('express-validator')

const createQuestionTypeValidationRules = () => {
    return [
        body('typeName')
            .notEmpty().withMessage('ten loai cau hoi khong duoc de trong')
    ]
}

const createQuestionValidationRules = () => {
    return [
        body('questionContent')
            .notEmpty().withMessage('noi dung cau hoi khong duoc de trong'),

        body('type_id')
            .isInt().withMessage('type_id khong hop le'),

        body('answers')
            .isArray({ min: 1 }).withMessage('phai co it nhat 1 dap an'),

        body('answers.*.answerContent')
            .notEmpty().withMessage('noi dung dap an khong duoc de trong'),

        body('answers.*.isCorrect')
            .isBoolean().withMessage('isCorrect phai la boolean')
    ]
}

const updateQuestionValidationRules = () => {
    return [
        param('id')
            .isInt().withMessage('question_id khong hop le'),

        body('questionContent')
            .optional()
            .notEmpty().withMessage('noi dung cau hoi khong duoc de trong')
    ]
}

module.exports = {
    createQuestionTypeValidationRules,
    createQuestionValidationRules,
    updateQuestionValidationRules
}
