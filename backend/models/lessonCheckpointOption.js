'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LessonCheckpointOption extends Model {
    static associate(models) {
      LessonCheckpointOption.belongsTo(models.LessonCheckpoint, { foreignKey: 'checkpoint_id' })
    }
  }

  LessonCheckpointOption.init({
    option_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    checkpoint_id: DataTypes.INTEGER,
    option_text: DataTypes.TEXT,
    isCorrect: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'LessonCheckpointOption',
    tableName: 'Lesson_Checkpoint_Options',
    timestamps: false
  })

  return LessonCheckpointOption
}
