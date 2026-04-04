'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class QuestionMajor extends Model {}

  QuestionMajor.init({
    question_id: { type: DataTypes.INTEGER, primaryKey: true },
    major_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'QuestionMajor',
    tableName: 'Question_Majors',
    timestamps: false
  })

  return QuestionMajor
}
