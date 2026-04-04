'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    static associate(models) {
      Meeting.belongsTo(models.Class, { foreignKey: 'class_id' })
    }
  }

  Meeting.init({
    meeting_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    historyUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: 'Meetings',
    timestamps: false
  })

  return Meeting
}
