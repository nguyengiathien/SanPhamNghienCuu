'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class React extends Model {
    static associate(models) {
      React.hasMany(models.CourseCommentReact, { foreignKey: 'react_id' })
      React.hasMany(models.PostReact, { foreignKey: 'react_id' })
      React.hasMany(models.PostCommentReact, { foreignKey: 'react_id' })
    }
  }

  React.init({
    react_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reactName: { type: DataTypes.STRING, unique: true }
  }, {
    sequelize,
    modelName: 'React',
    tableName: 'Reacts',
    timestamps: false
  })

  return React
}
