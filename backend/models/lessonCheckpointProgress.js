'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LessonCheckpointProgress extends Model {
    static associate(models) {
      LessonCheckpointProgress.belongsTo(models.User, { foreignKey: 'user_id' })
      LessonCheckpointProgress.belongsTo(models.LessonCheckpoint, { foreignKey: 'checkpoint_id' })
    }
  }

  LessonCheckpointProgress.init({
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    checkpoint_id: { type: DataTypes.INTEGER, primaryKey: true },
    isPassed: DataTypes.BOOLEAN,
    passedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'LessonCheckpointProgress',
    tableName: 'Lesson_Checkpoint_Progress',
    timestamps: false
  })

  return LessonCheckpointProgress
}
