'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PostCommentContent extends Model {
    static associate(models) {
      PostCommentContent.belongsTo(models.PostComment, { foreignKey: 'pComment_id' })
    }
  }

  PostCommentContent.init({
    content_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pComment_id: DataTypes.INTEGER,
    contentType: DataTypes.ENUM('text','image'),
    contentData: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'PostCommentContent',
    tableName: 'Post_Comment_Contents',
    timestamps: false
  })

  return PostCommentContent
}
