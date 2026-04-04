'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CourseRating extends Model {
    static associate(models) {
      CourseRating.belongsTo(models.Course, { foreignKey: 'course_id' })
      CourseRating.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  }

  CourseRating.init({
    course_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    stars: { type: DataTypes.TINYINT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
  }, {
    sequelize,
    modelName: 'CourseRating',
    tableName: 'Course_Ratings',
  })

  return CourseRating
}
