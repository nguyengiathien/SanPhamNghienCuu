'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class QuestionBank extends Model {
    static associate(models) {
      QuestionBank.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' })
      QuestionBank.belongsToMany(models.Question, {
        through: models.BankQuestion,
        foreignKey: 'bank_id',
        otherKey: 'question_id'
      })
    }
  }

  QuestionBank.init({
    bank_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bankName: DataTypes.STRING,
    creator_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionBank',
    tableName: 'Question_Banks'
  })

  return QuestionBank
}
