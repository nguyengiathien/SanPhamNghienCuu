'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TestClass extends Model {
    static associate(models) {
      TestClass.belongsTo(models.Test, {
        foreignKey: 'test_id'
      })

      TestClass.belongsTo(models.Class, {
        foreignKey: 'class_id'
      })
    }
  }

  TestClass.init(
    {
      test_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      class_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'TestClass',
      tableName: 'Test_Classes',
      timestamps: false
    }
  )

  return TestClass
}
