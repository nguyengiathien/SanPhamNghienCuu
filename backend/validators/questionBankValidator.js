'use strict'
const { body, param } = require('express-validator')

const createQuestionBankValidationRules = () => {
    return [
        body('bankName')
            .notEmpty().withMessage('ten ngan hang cau hoi khong duoc de trong'),

        body('creator_id')
            .isInt().withMessage('creator_id khong hop le')
    ]
}

const addQuestionToBankValidationRules = () => {
    return [
        param('id')
            .isInt().withMessage('bank_id khong hop le'),

        body('question_id')
            .isInt().withMessage('question_id khong hop le')
    ]
}

module.exports = {
    createQuestionBankValidationRules,
    addQuestionToBankValidationRules
}
