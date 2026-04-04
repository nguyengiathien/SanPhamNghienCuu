'use strict';

const db = require('../models');

const isAdmin = (req) => req.user?.role === 'admin';

// helper rollback an toàn
async function safeRollback(t) {
  if (t && !t.finished) {
    try { await t.rollback(); } catch (_) {}
  }
}

/**
 * GET /api/tests?course_id=1
 * - Nếu có course_id => lọc quiz theo khóa học
 */
exports.getAllTests = async (req, res, next) => {
  try {
    const { course_id } = req.query;

    const where = {};
    if (course_id !== undefined && course_id !== null && course_id !== '') {
      where.course_id = Number(course_id);
    }

    const tests = await db.Test.findAll({
      where,
      include: [
        { model: db.User, as: 'creator', attributes: ['user_id', 'username', 'fullName', 'role'] }
      ],
      order: [['test_id', 'DESC']],
    });

    res.json({ tests });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tests/:id
 */
exports.getTestById = async (req, res, next) => {
  try {
    const testId = Number(req.params.id);

    const test = await db.Test.findByPk(testId, {
      include: [
        { model: db.User, as: 'creator', attributes: ['user_id', 'username', 'fullName', 'role'] },
        { model: db.Class },
        {
          model: db.Question,
          as: 'questions',
          through: { attributes: ['orderIndex'] },
          include: [
            { model: db.Answer },
            { model: db.QuestionType, as: 'type' },
          ],
        },
      ],
      order: [[db.Sequelize.literal('`questions->TestQuestion`.`orderIndex`'), 'ASC']],
    });

    if (!test) return res.status(404).json({ message: 'khong tim thay de thi' });

    res.json({ test });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tests
 */
exports.createTest = async (req, res, next) => {
  try {
    const creator_id = req.user?.user_id;
    if (!creator_id) return res.status(401).json({ message: 'chua dang nhap' });

    const { testName, testDuration, testQNumber, course_id } = req.body;

    const payload = {
      testName,
      testDuration,
      testQNumber,
      creator_id,
    };

    if (course_id !== undefined && course_id !== null && course_id !== '') {
      payload.course_id = Number(course_id);
    }

    const test = await db.Test.create(payload);
    res.status(201).json({ message: 'tao de thi thanh cong', test });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tests/:id
 * body: { testName?, testDuration?, testQNumber?, course_id? }
 */
exports.updateTest = async (req, res, next) => {
  try {
    const testId = Number(req.params.id);
    const test = await db.Test.findByPk(testId);

    if (!test) {
      return res.status(404).json({ message: 'khong tim thay de thi' });
    }

    if (!isAdmin(req) && req.user?.user_id && test.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen cap nhat de thi' });
    }

    const { testName, testDuration, testQNumber, course_id } = req.body;

    const payload = {};

    if (testName !== undefined) payload.testName = testName;
    if (testDuration !== undefined && testDuration !== null && testDuration !== '') {
      payload.testDuration = Number(testDuration);
    }
    if (testQNumber !== undefined && testQNumber !== null && testQNumber !== '') {
      payload.testQNumber = Number(testQNumber);
    }
    if (course_id !== undefined) {
      payload.course_id =
        course_id === null || course_id === '' ? null : Number(course_id);
    }

    await test.update(payload);

    return res.json({
      message: 'cap nhat de thi thanh cong',
      test,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tests/:id/classes
 */
exports.assignTestToClass = async (req, res, next) => {
  try {
    const test = await db.Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'khong tim thay de thi' });

    if (!isAdmin(req) && req.user?.user_id && test.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen giao de thi' });
    }

    const { class_id } = req.body;
    const clazz = await db.Class.findByPk(class_id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    const existed = await db.TestClass.findOne({ where: { test_id: test.test_id, class_id } });
    if (existed) return res.status(409).json({ message: 'de thi da duoc giao cho lop nay' });

    const row = await db.TestClass.create({ test_id: test.test_id, class_id });
    res.status(201).json({ message: 'giao de thi thanh cong', data: row });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tests/:id/questions
 */
exports.addQuestionToTest = async (req, res, next) => {
  try {
    const test = await db.Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'khong tim thay de thi' });

    if (!isAdmin(req) && req.user?.user_id && test.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen them cau hoi vao de thi' });
    }

    const { question_id, orderIndex } = req.body;

    const q = await db.Question.findByPk(question_id);
    if (!q) return res.status(404).json({ message: 'khong tim thay cau hoi' });

    const existed = await db.TestQuestion.findOne({ where: { test_id: test.test_id, question_id } });
    if (existed) return res.status(409).json({ message: 'cau hoi da co trong de thi' });

    const row = await db.TestQuestion.create({
      test_id: test.test_id,
      question_id,
      orderIndex: orderIndex ?? null,
    });

    res.status(201).json({ message: 'them cau hoi vao de thi thanh cong', data: row });
  } catch (err) {
    next(err);
  }
};

// ============================
// Attempts
// ============================
exports.startAttempt = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const test = await db.Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'khong tim thay de thi' });

    const attempt = await db.TestAttempt.create({
      test_id: test.test_id,
      user_id: userId,
      startedAt: new Date(),
      finishedAt: null,
      result: null,
    });

    res.status(201).json({ message: 'bat dau lam bai', attempt });
  } catch (err) {
    next(err);
  }
};

exports.submitResponse = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const { attemptId } = req.params;
    const { question_id, answer_id, responseText } = req.body;

    const attempt = await db.TestAttempt.findByPk(attemptId);
    if (!attempt) return res.status(404).json({ message: 'khong tim thay luot lam bai' });

    if (attempt.user_id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'khong co quyen' });
    }

    let isCorrect = null;
    if (answer_id) {
      const answer = await db.Answer.findByPk(answer_id);
      isCorrect = answer ? !!answer.isCorrect : null;
    }

    const existed = await db.TestResponse.findOne({ where: { attempt_id: attemptId, question_id } });
    if (existed) {
      await existed.update({
        answer_id: answer_id ?? existed.answer_id,
        responseText: responseText ?? existed.responseText,
        isCorrect,
      });
      return res.json({ message: 'cap nhat tra loi', response: existed });
    }

    const created = await db.TestResponse.create({
      attempt_id: attemptId,
      question_id,
      answer_id: answer_id || null,
      responseText: responseText || null,
      isCorrect,
    });

    res.status(201).json({ message: 'luu tra loi', response: created });
  } catch (err) {
    next(err);
  }
};

exports.finishAttempt = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const { attemptId } = req.params;

    const attempt = await db.TestAttempt.findByPk(attemptId, { transaction: t });
    if (!attempt) return res.status(404).json({ message: 'khong tim thay luot lam bai' });

    if (attempt.user_id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'khong co quyen' });
    }

    const responses = await db.TestResponse.findAll({
      where: { attempt_id: attemptId },
      transaction: t,
    });

    const total = responses.length || 0;
    const correct = responses.filter((r) => r.isCorrect === true).length;
    const score = total === 0 ? 0 : (correct / total) * 10;

    await attempt.update(
      { finishedAt: new Date(), result: score },
      { transaction: t }
    );

    await t.commit();

    res.json({ message: 'nop bai thanh cong', result: { total, correct, score } });
  } catch (err) {
    await safeRollback(t);
    next(err);
  }
};