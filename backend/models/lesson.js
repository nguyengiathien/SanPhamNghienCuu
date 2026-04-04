'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Course, { foreignKey: 'course_id' })
      Lesson.hasMany(models.LessonContent, { foreignKey: 'lesson_id' })
      Lesson.hasMany(models.LessonCheckpoint, { foreignKey: 'lesson_id', as: 'checkpoints' })
      Lesson.hasMany(models.LessonVideoProgress, { foreignKey: 'lesson_id', as: 'videoProgress' })

    }
  }

  Lesson.init({
    lesson_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: DataTypes.INTEGER,
    lessonName: DataTypes.STRING,
    orderIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'Lessons'
  })

  return Lesson
}
