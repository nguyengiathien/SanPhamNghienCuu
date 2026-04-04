'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TestQuestion extends Model {}

  TestQuestion.init({
    test_id: { type: DataTypes.INTEGER, primaryKey: true },
    question_id: { type: DataTypes.INTEGER, primaryKey: true },
    orderIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TestQuestion',
    tableName: 'Test_Questions',
    timestamps: false
  })

  return TestQuestion
}
