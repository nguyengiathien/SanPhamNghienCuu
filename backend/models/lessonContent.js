'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LessonContent extends Model {
    static associate(models) {
      LessonContent.belongsTo(models.Lesson, { foreignKey: 'lesson_id' })
    }
  }

  LessonContent.init({
    content_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lesson_id: DataTypes.INTEGER,
    contentType: DataTypes.ENUM('text','image','video','file'),
    contentData: DataTypes.TEXT,
    orderIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LessonContent',
    tableName: 'Lesson_Contents',
    timestamps: false
  })

  return LessonContent
}
