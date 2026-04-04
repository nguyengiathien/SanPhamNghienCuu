'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CourseCommentContent extends Model {
    static associate(models) {
      CourseCommentContent.belongsTo(models.CourseComment, { foreignKey: 'comment_id' })
    }
  }

  CourseCommentContent.init({
    content_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comment_id: DataTypes.INTEGER,
    contentType: DataTypes.ENUM('text','image'),
    contentData: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CourseCommentContent',
    tableName: 'Course_Comment_Contents',
    timestamps: false
  })

  return CourseCommentContent
}
