'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PostCommentReact extends Model {
    static associate(models) {
      PostCommentReact.belongsTo(models.PostComment, { foreignKey: 'pComment_id' })
      PostCommentReact.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
      PostCommentReact.belongsTo(models.React, { foreignKey: 'react_id' })
    }
  }

  PostCommentReact.init({
    pComment_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    react_id: { type: DataTypes.INTEGER, primaryKey: true },
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PostCommentReact',
    tableName: 'Post_Comment_Reacts',
    timestamps: false
  })

  return PostCommentReact
}
