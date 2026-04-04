'use strict';

const db = require('../models');

exports.getMyProgress = async (req, res, next) => {
  try {
    // trả về danh sách lesson_id đã hoàn thành của user
    const rows = await db.LearningProcess.findAll({
      where: { user_id: req.user.user_id },
      attributes: ['lesson_id', 'status', 'updatedAt'],
    });

    res.json({ progress: rows });
  } catch (err) {
    next(err);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { lesson_id, status } = req.body;

    // status: 0/1
    const [row, created] = await db.LearningProcess.findOrCreate({
      where: { user_id, lesson_id },
      defaults: { status: status ? 1 : 0 },
    });

    if (!created) {
      await row.update({ status: status ? 1 : 0 });
    }

    res.json({ message: 'cap nhat tien do thanh cong', progress: row });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/learning-processes/lessons/:lessonId/complete
exports.completeLesson = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const { lessonId } = req.params;

    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });

    await db.LearningProcess.upsert({
      user_id: userId,
      lesson_id: Number(lessonId),
      status: true,
      updatedAt: new Date(),
    });


    return res.json({ message: 'Đã đánh dấu hoàn thành', lesson_id: Number(lessonId), status: 1 });
  } catch (err) {
    next(err);
  }
};

