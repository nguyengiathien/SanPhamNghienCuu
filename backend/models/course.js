'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' })
      Course.belongsToMany(models.Major, {
        through: 'Course_Majors',
        foreignKey: 'course_id',
        otherKey: 'major_id',
        as: 'majors',
      })
      Course.hasMany(models.Outcome, { foreignKey: 'course_id' })
      Course.hasMany(models.Lesson, { foreignKey: 'course_id' })
    }
  }

  Course.init({
    course_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    courseName: DataTypes.STRING,
    courseDescription: DataTypes.TEXT,
    creator_id: DataTypes.INTEGER,
    thumbnailUrl: DataTypes.STRING,
    level: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    ratingAvg: DataTypes.DECIMAL(2, 1),
    ratingNum: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'Courses'
  })

  return Course
}
