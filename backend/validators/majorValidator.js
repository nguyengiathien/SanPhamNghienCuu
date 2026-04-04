'use strict'
const { body, param } = require('express-validator')

const createMajorValidationRules = () => {
    return [
        body('majorName')
            .notEmpty().withMessage('ten nganh khong duoc de trong')
            .trim()
    ]
}

const updateMajorValidationRules = () => {
    return [
        param('id')
            .isInt().withMessage('id khong hop le'),

        body('majorName')
            .notEmpty().withMessage('ten nganh khong duoc de trong')
            .trim()
    ]
}

module.exports = {
    createMajorValidationRules,
    updateMajorValidationRules
}
