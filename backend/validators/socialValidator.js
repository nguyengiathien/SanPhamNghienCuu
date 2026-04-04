'use strict'
const { body } = require('express-validator')

const createReactValidationRules = () => {
    return [
        body('reactName')
            .notEmpty().withMessage('ten react khong duoc de trong')
    ]
}

const createCourseCommentValidationRules = () => {
    return [
        body('course_id')
            .isInt().withMessage('course_id khong hop le'),

        body('content')
            .notEmpty().withMessage('noi dung comment khong duoc de trong')
    ]
}

const createPostValidationRules = () => {
    return [
        body('class_id')
            .isInt().withMessage('class_id khong hop le'),

        body('content')
            .notEmpty().withMessage('noi dung bai dang khong duoc de trong')
    ]
}

const createMeetingValidationRules = () => {
    return [
        body('class_id')
            .isInt().withMessage('class_id khong hop le'),

        body('startTime')
            .isISO8601().withMessage('startTime khong hop le')
    ]
}

module.exports = {
    createReactValidationRules,
    createCourseCommentValidationRules,
    createPostValidationRules,
    createMeetingValidationRules
}
