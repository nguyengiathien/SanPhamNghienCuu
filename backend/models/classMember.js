'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ClassMember extends Model {
    static associate(models) {
      ClassMember.belongsTo(models.Class, { foreignKey: 'class_id' })
      ClassMember.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  }

  ClassMember.init({
    class_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    memberRole: DataTypes.ENUM('teacher','student'),
    joinedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ClassMember',
    tableName: 'Class_Members',
    timestamps: false
  })

  return ClassMember
}
