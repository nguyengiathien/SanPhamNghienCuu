'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Class, { foreignKey: 'class_id' })
      Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })

      Post.hasMany(models.PostContent, { foreignKey: 'post_id' })
      Post.hasMany(models.PostReact, { foreignKey: 'post_id' })
      Post.hasMany(models.PostComment, { foreignKey: 'post_id' })
    }
  }

  Post.init({
    post_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts',
    timestamps: false
  })

  return Post
}
