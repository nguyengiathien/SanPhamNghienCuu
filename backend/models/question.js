// models/question.js
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      // ✅ FIX alias type để include { as: 'type' } không lỗi
      Question.belongsTo(models.QuestionType, {
        foreignKey: 'type_id',
        as: 'type',
      })

      // ✅ FIX: Question <-> Major qua Question_Majors
      Question.belongsToMany(models.Major, {
        through: models.QuestionMajor,      // hoặc 'Question_Majors'
        foreignKey: 'question_id',
        otherKey: 'major_id',
        as: 'majors',
      })

      // ✅ Answer
      Question.hasMany(models.Answer, {
        foreignKey: 'question_id',
      })

      // Test <-> Question
      Question.belongsToMany(models.Test, {
        through: models.TestQuestion,
        foreignKey: 'question_id',
        otherKey: 'test_id',
      })
    }
  }

  Question.init(
    {
      question_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      questionContent: { type: DataTypes.TEXT, allowNull: false },
      type_id: { type: DataTypes.INTEGER, allowNull: false },
      level: DataTypes.TINYINT,

      optionA: DataTypes.STRING,
      optionB: DataTypes.STRING,
      optionC: DataTypes.STRING,
      optionD: DataTypes.STRING,
      correctKey: DataTypes.ENUM('A', 'B', 'C', 'D'),
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Question',
      tableName: 'Questions',
      timestamps: true,
      underscored: false,
    }
  )

  return Question
}
