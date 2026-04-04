'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CourseCommentReact extends Model {
    static associate(models) {
      CourseCommentReact.belongsTo(models.CourseComment, { foreignKey: 'comment_id' })
      CourseCommentReact.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
      CourseCommentReact.belongsTo(models.React, { foreignKey: 'react_id' })
    }
  }

  CourseCommentReact.init({
    comment_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    react_id: { type: DataTypes.INTEGER, primaryKey: true },
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CourseCommentReact',
    tableName: 'Course_Comment_Reacts',
    timestamps: false
  })

  return CourseCommentReact
}
