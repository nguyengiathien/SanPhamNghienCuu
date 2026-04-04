'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TestResponse extends Model {
    static associate(models) {
      TestResponse.belongsTo(models.TestAttempt, { foreignKey: 'attempt_id' })
      TestResponse.belongsTo(models.Question, { foreignKey: 'question_id' })
      TestResponse.belongsTo(models.Answer, { foreignKey: 'answer_id' })
    }
  }

  TestResponse.init({
    attempt_id: { type: DataTypes.INTEGER, primaryKey: true },
    question_id: { type: DataTypes.INTEGER, primaryKey: true },
    answer_id: DataTypes.INTEGER,
    responseText: DataTypes.TEXT,
    isCorrect: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TestResponse',
    tableName: 'Test_Responses',
    timestamps: false
  })

  return TestResponse
}
