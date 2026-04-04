'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    static associate(models) {
      // Test thuộc về người tạo
      Test.belongsTo(models.User, {
        foreignKey: 'creator_id',
        as: 'creator'
      })

      // Test có nhiều câu hỏi (qua bảng trung gian)
      Test.belongsToMany(models.Question, {
        through: models.TestQuestion,
        foreignKey: 'test_id',
        otherKey: 'question_id',
        as: 'questions'
      })

      // Test được giao cho nhiều lớp
      Test.belongsToMany(models.Class, {
        through: models.TestClass,
        foreignKey: 'test_id',
        otherKey: 'class_id'
      })

      // Test có nhiều lượt làm bài
      Test.hasMany(models.TestAttempt, {
        foreignKey: 'test_id'
      })
    }
  }

  Test.init(
    {
      test_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      testName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      testDuration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      testQNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Test',
      tableName: 'Tests'
    }
  )

  return Test
}
