'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CourseComment extends Model {
    static associate(models) {
      CourseComment.belongsTo(models.Course, { foreignKey: 'course_id' })
      CourseComment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })

      CourseComment.belongsTo(models.CourseComment, {
        foreignKey: 'parent_comment_id',
        as: 'parent'
      })
      CourseComment.hasMany(models.CourseComment, {
        foreignKey: 'parent_comment_id',
        as: 'children'
      })

      CourseComment.hasMany(models.CourseCommentContent, { foreignKey: 'comment_id' })
      CourseComment.hasMany(models.CourseCommentReact, { foreignKey: 'comment_id' })
    }
  }

  CourseComment.init({
    comment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    parent_comment_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseComment',
    tableName: 'Course_Comments',
    timestamps: false
  })

  return CourseComment
}
