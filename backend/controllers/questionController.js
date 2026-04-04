// controllers/questionController.js
'use strict';

const db = require('../models');

exports.getQuestionTypes = async (req, res, next) => {
  try {
    const types = await db.QuestionType.findAll({
      order: [['type_id', 'ASC']],
    });
    res.json({ types });
  } catch (err) {
    next(err);
  }
};

exports.createQuestionType = async (req, res, next) => {
  try {
    const { typeName } = req.body;
    const type = await db.QuestionType.create({ typeName });
    res.status(201).json({ message: 'tao loai cau hoi thanh cong', type });
  } catch (err) {
    next(err);
  }
};

exports.getAllQuestions = async (req, res, next) => {
  try {
    const questions = await db.Question.findAll({
      include: [
        // ✅ alias phải đúng với associate ở model Question
        { model: db.QuestionType, as: 'type' },
        { model: db.Answer },
        // ✅ Major phải có association + alias 'majors'
        { model: db.Major, as: 'majors', through: { attributes: [] }, required: false },
      ],
      order: [['question_id', 'DESC']],
    });

    res.json({ questions });
  } catch (err) {
    next(err);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const q = await db.Question.findByPk(req.params.id, {
      include: [
        { model: db.QuestionType, as: 'type' },
        { model: db.Answer },
        { model: db.Major, as: 'majors', through: { attributes: [] }, required: false },
      ],
    });

    if (!q) return res.status(404).json({ message: 'khong tim thay cau hoi' });
    res.json({ question: q });
  } catch (err) {
    next(err);
  }
};

exports.createQuestion = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { questionContent, type_id, level, answers, majorIds } = req.body;

    const question = await db.Question.create(
      { questionContent, type_id, level: level ?? null },
      { transaction: t }
    );

    // Answers
    if (Array.isArray(answers) && answers.length > 0) {
      await db.Answer.bulkCreate(
        answers.map((a) => ({
          question_id: question.question_id,
          answerContent: a.answerContent,
          isCorrect: !!a.isCorrect,
        })),
        { transaction: t }
      );
    }

    // Major links via QuestionMajor
    if (Array.isArray(majorIds)) {
      await db.QuestionMajor.destroy({
        where: { question_id: question.question_id },
        transaction: t,
      });

      if (majorIds.length > 0) {
        await db.QuestionMajor.bulkCreate(
          majorIds.map((mid) => ({
            question_id: question.question_id,
            major_id: Number(mid),
          })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    // ✅ Fetch full sau commit (không rollback nữa)
    try {
      const full = await db.Question.findByPk(question.question_id, {
        include: [
          { model: db.QuestionType, as: 'type' },
          { model: db.Answer },
          { model: db.Major, as: 'majors', through: { attributes: [] }, required: false },
        ],
      });

      return res.status(201).json({ message: 'tao cau hoi thanh cong', question: full });
    } catch (e) {
      return res.status(201).json({ message: 'tao cau hoi thanh cong', question });
    }
  } catch (err) {
    // ✅ chỉ rollback khi transaction chưa kết thúc
    if (!t.finished) {
      try {
        await t.rollback();
      } catch (_) {}
    }
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const question = await db.Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: 'khong tim thay cau hoi' });

    const { questionContent, type_id, level, answers, majorIds } = req.body;

    await question.update(
      {
        questionContent: questionContent ?? question.questionContent,
        type_id: type_id ?? question.type_id,
        level: level ?? question.level,
      },
      { transaction: t }
    );

    // Answers replace
    if (Array.isArray(answers)) {
      await db.Answer.destroy({ where: { question_id: question.question_id }, transaction: t });

      if (answers.length > 0) {
        await db.Answer.bulkCreate(
          answers.map((a) => ({
            question_id: question.question_id,
            answerContent: a.answerContent,
            isCorrect: !!a.isCorrect,
          })),
          { transaction: t }
        );
      }
    }

    // Major links replace
    if (Array.isArray(majorIds)) {
      await db.QuestionMajor.destroy({ where: { question_id: question.question_id }, transaction: t });

      if (majorIds.length > 0) {
        await db.QuestionMajor.bulkCreate(
          majorIds.map((mid) => ({
            question_id: question.question_id,
            major_id: Number(mid),
          })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    const full = await db.Question.findByPk(question.question_id, {
      include: [
        { model: db.QuestionType, as: 'type' },
        { model: db.Answer },
        { model: db.Major, as: 'majors', through: { attributes: [] }, required: false },
      ],
    });

    res.json({ message: 'cap nhat cau hoi thanh cong', question: full });
  } catch (err) {
    if (!t.finished) {
      try {
        await t.rollback();
      } catch (_) {}
    }
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await db.Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: 'khong tim thay cau hoi' });

    await question.destroy();
    res.json({ message: 'xoa cau hoi thanh cong' });
  } catch (err) {
    next(err);
  }
};
