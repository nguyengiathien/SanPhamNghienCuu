'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    // models/major.js
    static associate(models) {
      Major.belongsToMany(models.Question, {
        through: models.QuestionMajor,     // hoặc 'Question_Majors'
        foreignKey: 'major_id',
        otherKey: 'question_id',
        as: 'questions',
      })
    }

  }

  Major.init({
    major_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    majorName: { type: DataTypes.STRING, unique: true }
  }, {
    sequelize,
    modelName: 'Major',
    tableName: 'Majors'
  })

  return Major
}
