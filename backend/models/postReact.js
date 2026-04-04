'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PostReact extends Model {
    static associate(models) {
      PostReact.belongsTo(models.Post, { foreignKey: 'post_id' })
      PostReact.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
      PostReact.belongsTo(models.React, { foreignKey: 'react_id' })
    }
  }

  PostReact.init({
    post_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    react_id: { type: DataTypes.INTEGER, primaryKey: true },
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PostReact',
    tableName: 'Post_Reacts',
    timestamps: false
  })

  return PostReact
}
