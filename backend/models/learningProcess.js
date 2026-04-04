'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LearningProcess extends Model {
    static associate(models) {
      LearningProcess.belongsTo(models.User, { foreignKey: 'user_id' })
      LearningProcess.belongsTo(models.Lesson, { foreignKey: 'lesson_id' })
    }
  }

  LearningProcess.init({
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    lesson_id: { type: DataTypes.INTEGER, primaryKey: true },
    status: DataTypes.BOOLEAN,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'LearningProcess',
    tableName: 'Learning_Processes',
    timestamps: false
  })

  return LearningProcess
}
