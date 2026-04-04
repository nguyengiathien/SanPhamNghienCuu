'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.Question, { foreignKey: 'question_id' })
      Answer.hasMany(models.TestResponse, { foreignKey: 'answer_id' })
    }
  }

  Answer.init({
    answer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_id: DataTypes.INTEGER,
    answerContent: DataTypes.TEXT,
    isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: 'Answers',
    timestamps: false
  })

  return Answer
}
