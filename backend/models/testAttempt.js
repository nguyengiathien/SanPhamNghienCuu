'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TestAttempt extends Model {
    static associate(models) {
      TestAttempt.belongsTo(models.Test, { foreignKey: 'test_id' })
      TestAttempt.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
      TestAttempt.hasMany(models.TestResponse, { foreignKey: 'attempt_id' })
    }
  }

  TestAttempt.init({
    attempt_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    test_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    startedAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE,
    result: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'TestAttempt',
    tableName: 'Test_Attempts'
  })

  return TestAttempt
}
