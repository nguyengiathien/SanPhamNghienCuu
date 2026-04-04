'use strict'
const { body } = require('express-validator')



const updateLearningProcessValidationRules = () => [
    body('lesson_id').notEmpty().isInt().withMessage('lesson_id khong hop le'),
    body('status').notEmpty().isInt({ min: 0, max: 1 }).withMessage('status phai la 0 hoac 1'),
];


module.exports = {
    updateLearningProcessValidationRules
}
