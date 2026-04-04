'use strict'
const { body, param } = require('express-validator')

const createClassValidationRules = () => {
    return [
        body('className')
            .notEmpty().withMessage('ten lop khong duoc de trong'),

        body('creator_id')
            .isInt().withMessage('creator_id khong hop le')
    ]
}

const addClassMemberValidationRules = () => {
    return [
        param('id')
            .isInt().withMessage('class_id khong hop le'),

        body('user_id')
            .isInt().withMessage('user_id khong hop le'),

        body('memberRole')
            .optional()
            .isIn(['teacher','student']).withMessage('memberRole khong hop le')
    ]
}

module.exports = {
    createClassValidationRules,
    addClassMemberValidationRules
}
