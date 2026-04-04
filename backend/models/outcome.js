'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Outcome extends Model {
    static associate(models) {
      Outcome.belongsTo(models.Course, { foreignKey: 'course_id' })
    }
  }

  Outcome.init({
    outcome_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    outcomeContent: DataTypes.STRING,
    course_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Outcome',
    tableName: 'Outcomes'
  })

  return Outcome
}
