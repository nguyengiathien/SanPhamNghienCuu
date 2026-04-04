'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LessonCheckpoint extends Model {
    static associate(models) {
      LessonCheckpoint.belongsTo(models.Lesson, { foreignKey: 'lesson_id' })
      LessonCheckpoint.hasMany(models.LessonCheckpointOption, { foreignKey: 'checkpoint_id', as: 'options' })
      LessonCheckpoint.hasMany(models.LessonCheckpointProgress, { foreignKey: 'checkpoint_id', as: 'progress' })
    }
  }

  LessonCheckpoint.init({
    checkpoint_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lesson_id: DataTypes.INTEGER,
    at_seconds: DataTypes.INTEGER,
    question_text: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'LessonCheckpoint',
    tableName: 'Lesson_Checkpoints'
  })

  return LessonCheckpoint
}
