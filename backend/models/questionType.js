'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class QuestionType extends Model {
    static associate(models) {
      QuestionType.hasMany(models.Question, { foreignKey: 'type_id' })
    }
  }

  QuestionType.init({
    type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    typeName: { type: DataTypes.STRING, unique: true }
  }, {
    sequelize,
    modelName: 'QuestionType',
    tableName: 'QuestionTypes'
  })

  return QuestionType
}
