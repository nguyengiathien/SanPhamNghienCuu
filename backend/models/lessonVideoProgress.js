'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LessonVideoProgress extends Model {
    static associate(models) {
      LessonVideoProgress.belongsTo(models.User, { foreignKey: 'user_id' })
      LessonVideoProgress.belongsTo(models.Lesson, { foreignKey: 'lesson_id' })
    }
  }

  LessonVideoProgress.init({
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    lesson_id: { type: DataTypes.INTEGER, primaryKey: true },
    last_second: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'LessonVideoProgress',
    tableName: 'Lesson_Video_Progress',
    timestamps: false
  })

  return LessonVideoProgress
}
