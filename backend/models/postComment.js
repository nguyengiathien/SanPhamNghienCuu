'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
    static associate(models) {
      PostComment.belongsTo(models.Post, { foreignKey: 'post_id' })
      PostComment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })

      PostComment.belongsTo(models.PostComment, {
        foreignKey: 'parent_comment_id',
        as: 'parent'
      })
      PostComment.hasMany(models.PostComment, {
        foreignKey: 'parent_comment_id',
        as: 'children'
      })

      PostComment.hasMany(models.PostCommentContent, { foreignKey: 'pComment_id' })
      PostComment.hasMany(models.PostCommentReact, { foreignKey: 'pComment_id' })
    }
  }

  PostComment.init({
    pComment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    parent_comment_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PostComment',
    tableName: 'Post_Comments',
    timestamps: false
  })

  return PostComment
}
