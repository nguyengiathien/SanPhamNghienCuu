'use strict'
const { body, param } = require('express-validator')

const createCourseValidationRules = () => {
    return [
        body('courseName')
            .notEmpty().withMessage('ten khoa hoc khong duoc de trong'),

        

        body('majorIds')
            .optional()
            .isArray().withMessage('majorIds phai la mang')
    ]
}

const updateCourseValidationRules = () => {
    return [
        param('id')
            .isInt().withMessage('id khoa hoc khong hop le'),

        body('courseName')
            .optional()
            .notEmpty().withMessage('ten khoa hoc khong duoc de trong'),

        body('ratingAvg')
            .optional()
            .isFloat({ min: 0, max: 5 }).withMessage('rating tu 0 den 5')
    ]
}

const createOutcomeValidationRules = () => {
    return [
        body('outcomeContent')
            .notEmpty().withMessage('noi dung outcome khong duoc de trong')
    ]
}



module.exports = {
    createCourseValidationRules,
    updateCourseValidationRules,
    createOutcomeValidationRules
}
