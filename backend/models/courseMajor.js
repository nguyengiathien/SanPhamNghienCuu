'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CourseMajor extends Model {
    static associate (models) {
      // thường không cần associate ngược ở through model
    }
  }

  CourseMajor.init(
    {
      course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      major_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'CourseMajor',
      tableName: 'Course_Majors',
      timestamps: false
    }
  )

  return CourseMajor
}
