'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PostContent extends Model {
    static associate(models) {
      PostContent.belongsTo(models.Post, { foreignKey: 'post_id' })
    }
  }

  PostContent.init({
    content_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: DataTypes.INTEGER,
    contentType: DataTypes.ENUM('text','image','file'),
    contentData: DataTypes.TEXT,
    orderIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostContent',
    tableName: 'Post_Contents',
    timestamps: false
  })

  return PostContent
}
