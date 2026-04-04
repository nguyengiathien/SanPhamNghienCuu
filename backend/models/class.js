'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' })
      Class.hasMany(models.ClassMember, { foreignKey: 'class_id' })
      Class.hasMany(models.Post, { foreignKey: 'class_id' })
      Class.hasMany(models.Meeting, { foreignKey: 'class_id' })
    }
  }

  Class.init({
    class_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    className: DataTypes.STRING,
    creator_id: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'Classes'
  })

  return Class
}
