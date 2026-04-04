'use strict'

const Sequelize = require('sequelize')
const sequelize = require('../config/config')

const db = {}

db.User = require('./user')(sequelize, Sequelize.DataTypes)
db.Major = require('./major')(sequelize, Sequelize.DataTypes)
db.Course = require('./course')(sequelize, Sequelize.DataTypes)
db.CourseMajor = require('./courseMajor')(sequelize, Sequelize.DataTypes)
db.Outcome = require('./outcome')(sequelize, Sequelize.DataTypes)

db.Class = require('./class')(sequelize, Sequelize.DataTypes)
db.ClassMember = require('./classMember')(sequelize, Sequelize.DataTypes)
db.Lesson = require('./lesson')(sequelize, Sequelize.DataTypes)
db.LessonContent = require('./lessonContent')(sequelize, Sequelize.DataTypes)
db.LearningProcess = require('./learningProcess')(sequelize, Sequelize.DataTypes)

db.QuestionBank = require('./questionBank')(sequelize, Sequelize.DataTypes)
db.QuestionType = require('./questionType')(sequelize, Sequelize.DataTypes)
db.Question = require('./question')(sequelize, Sequelize.DataTypes)
db.Answer = require('./answer')(sequelize, Sequelize.DataTypes)
db.QuestionMajor = require('./questionMajor')(sequelize, Sequelize.DataTypes)
db.BankQuestion = require('./bankQuestion')(sequelize, Sequelize.DataTypes)

db.Test = require('./test')(sequelize, Sequelize.DataTypes)
db.TestClass = require('./testClass')(sequelize, Sequelize.DataTypes)
db.TestQuestion = require('./testQuestion')(sequelize, Sequelize.DataTypes)
db.TestAttempt = require('./testAttempt')(sequelize, Sequelize.DataTypes)
db.TestResponse = require('./testResponse')(sequelize, Sequelize.DataTypes)

db.React = require('./react')(sequelize, Sequelize.DataTypes)
db.CourseComment = require('./courseComment')(sequelize, Sequelize.DataTypes)
db.CourseCommentContent = require('./courseCommentContent')(sequelize, Sequelize.DataTypes)
db.CourseCommentReact = require('./courseCommentReact')(sequelize, Sequelize.DataTypes)

db.Meeting = require('./meeting')(sequelize, Sequelize.DataTypes)

db.Post = require('./post')(sequelize, Sequelize.DataTypes)
db.PostContent = require('./postContent')(sequelize, Sequelize.DataTypes)
db.PostReact = require('./postReact')(sequelize, Sequelize.DataTypes)
db.PostComment = require('./postComment')(sequelize, Sequelize.DataTypes)
db.PostCommentContent = require('./postCommentContent')(sequelize, Sequelize.DataTypes)
db.PostCommentReact = require('./postCommentReact')(sequelize, Sequelize.DataTypes)
db.CourseRating = require('./courseRating')(sequelize, Sequelize.DataTypes)

db.LessonCheckpoint = require('./lessonCheckpoint')(sequelize, Sequelize.DataTypes)
db.LessonCheckpointOption = require('./lessonCheckpointOption')(sequelize, Sequelize.DataTypes)
db.LessonCheckpointProgress = require('./lessonCheckpointProgress')(sequelize, Sequelize.DataTypes)
db.LessonVideoProgress = require('./lessonVideoProgress')(sequelize, Sequelize.DataTypes)





Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
