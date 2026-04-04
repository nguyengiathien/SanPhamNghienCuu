'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class BankQuestion extends Model {}

  BankQuestion.init({
    bank_id: { type: DataTypes.INTEGER, primaryKey: true },
    question_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'BankQuestion',
    tableName: 'Bank_Questions',
    timestamps: false
  })

  return BankQuestion
}
