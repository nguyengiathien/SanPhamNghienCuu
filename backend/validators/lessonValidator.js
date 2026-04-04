'use strict'
const { body, param } = require('express-validator')

const createLessonValidationRules = () => {
    return [
        body('course_id')
            .isInt().withMessage('course_id khong hop le'),

        body('lessonName')
            .notEmpty().withMessage('ten bai hoc khong duoc de trong')
    ]
}

const addLessonContentValidationRules = () => {
    return [
        param('id')
            .isInt().withMessage('lesson_id khong hop le'),

        body('contentType')
            .notEmpty().withMessage('contentType khong duoc de trong')
            .isIn(['text', 'image', 'video', 'file']).withMessage('contentType khong hop le'),

        body('contentData')
            .notEmpty().withMessage('contentData khong duoc de trong')
            .isString().withMessage('contentData phai la string')
            .trim()
    ]
}

module.exports = {
    createLessonValidationRules,
    addLessonContentValidationRules
}
