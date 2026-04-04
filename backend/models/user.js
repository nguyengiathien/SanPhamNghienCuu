'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Course, { foreignKey: 'creator_id' })
      User.hasMany(models.Class, { foreignKey: 'creator_id' })
      User.hasMany(models.LessonCheckpointProgress, { foreignKey: 'user_id', as: 'checkpointProgress' })
      User.hasMany(models.LessonVideoProgress, { foreignKey: 'user_id', as: 'videoProgress' })
    }
  }

  User.init({
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    dob: DataTypes.DATE,
    role: DataTypes.ENUM('admin', 'provider', 'student'),
    email: { type: DataTypes.STRING, unique: true },
    address: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })

  return User
}