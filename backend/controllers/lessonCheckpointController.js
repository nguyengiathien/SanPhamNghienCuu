'use strict';

const db = require('../models');

const isAdmin = (req) => req.user?.role === 'admin';

async function assertCanManageLesson(req, lessonId) {
  const lesson = await db.Lesson.findByPk(lessonId);
  if (!lesson) return { ok: false, status: 404, message: 'Không tìm thấy bài học' };

  const course = await db.Course.findByPk(lesson.course_id);
  if (!course) return { ok: false, status: 404, message: 'Không tìm thấy khóa học' };

  // admin hoặc provider là creator khóa
  if (!isAdmin(req) && req.user?.role === 'provider' && course.creator_id !== req.user.user_id) {
    return { ok: false, status: 403, message: 'Không có quyền quản lý checkpoint' };
  }

  if (!isAdmin(req) && req.user?.role !== 'provider') {
    return { ok: false, status: 403, message: 'Không có quyền quản lý checkpoint' };
  }

  return { ok: true, lesson, course };
}

async function computeAccess(user_id, lesson_id) {
  const cps = await db.LessonCheckpoint.findAll({
    where: { lesson_id },
    attributes: ['checkpoint_id', 'at_seconds'],
    order: [['at_seconds', 'ASC']],
  });

  if (cps.length === 0) {
    return { allowedUntil: 10 ** 9, nextCheckpointId: null }; // không có checkpoint => xem thoải mái
  }

  const passed = await db.LessonCheckpointProgress.findAll({
    where: { user_id },
    attributes: ['checkpoint_id', 'isPassed'],
    include: [{
      model: db.LessonCheckpoint,
      attributes: ['lesson_id'],
      where: { lesson_id },
    }],
  });

  const passedSet = new Set(passed.filter(x => x.isPassed).map(x => x.checkpoint_id));

  const next = cps.find(cp => !passedSet.has(cp.checkpoint_id));
  if (!next) return { allowedUntil: 10 ** 9, nextCheckpointId: null };

  return { allowedUntil: Number(next.at_seconds), nextCheckpointId: next.checkpoint_id };
}

// GET /api/lessons/:lessonId/checkpoints  (student/admin/provider)
exports.getCheckpoints = async (req, res, next) => {
  try {
    const lessonId = Number(req.params.lessonId);

    const checkpoints = await db.LessonCheckpoint.findAll({
      where: { lesson_id: lessonId },
      order: [['at_seconds', 'ASC']],
      include: [{
        model: db.LessonCheckpointOption,
        as: 'options',
        attributes: ['option_id', 'option_text'], // KHÔNG trả isCorrect
      }],
    });

    res.json({ checkpoints });
  } catch (e) {
    next(e);
  }
};

// GET /api/lessons/:lessonId/access
exports.getAccess = async (req, res, next) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const userId = req.user.user_id;

    const access = await computeAccess(userId, lessonId);

    const vp = await db.LessonVideoProgress.findOne({
      where: { user_id: userId, lesson_id: lessonId },
      attributes: ['last_second', 'updatedAt'],
    });

    res.json({
      lesson_id: lessonId,
      allowedUntil: access.allowedUntil,
      nextCheckpointId: access.nextCheckpointId,
      last_second: vp?.last_second ?? 0,
    });
  } catch (e) {
    next(e);
  }
};

// POST /api/lessons/:lessonId/checkpoints/:checkpointId/submit  body { option_id }
exports.submitCheckpoint = async (req, res, next) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const checkpointId = Number(req.params.checkpointId);
    const { option_id } = req.body || {};
    const userId = req.user.user_id;

    if (!option_id) return res.status(400).json({ message: 'Thiếu option_id' });

    const cp = await db.LessonCheckpoint.findOne({ where: { checkpoint_id: checkpointId, lesson_id: lessonId } });
    if (!cp) return res.status(404).json({ message: 'Checkpoint không tồn tại' });

    const opt = await db.LessonCheckpointOption.findOne({ where: { option_id, checkpoint_id: checkpointId } });
    if (!opt) return res.status(404).json({ message: 'Option không tồn tại' });

    const passed = !!opt.isCorrect;

    // upsert progress
    await db.LessonCheckpointProgress.upsert({
      user_id: userId,
      checkpoint_id: checkpointId,
      isPassed: passed ? 1 : 0,
      passedAt: passed ? new Date() : null,
    });

    // nếu đúng => cập nhật video progress tối thiểu tới mốc checkpoint
    if (passed) {
      const at = Number(cp.at_seconds) || 0;
      const existing = await db.LessonVideoProgress.findOne({ where: { user_id: userId, lesson_id: lessonId } });
      const nextSec = Math.max(existing?.last_second ?? 0, at);

      await db.LessonVideoProgress.upsert({
        user_id: userId,
        lesson_id: lessonId,
        last_second: nextSec,
        updatedAt: new Date(),
      });
    }

    const access = await computeAccess(userId, lessonId);

    res.json({
      passed,
      allowedUntil: access.allowedUntil,
      nextCheckpointId: access.nextCheckpointId,
    });
  } catch (e) {
    next(e);
  }
};

// POST /api/lessons/:lessonId/video-progress  body { second }
exports.updateVideoProgress = async (req, res, next) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const userId = req.user.user_id;
    const second = Number(req.body?.second ?? 0);

    const access = await computeAccess(userId, lessonId);
    const clamped = Math.max(0, Math.min(second, access.allowedUntil)); // không cho lưu vượt allowedUntil

    await db.LessonVideoProgress.upsert({
      user_id: userId,
      lesson_id: lessonId,
      last_second: clamped,
      updatedAt: new Date(),
    });

    res.json({ lesson_id: lessonId, last_second: clamped, allowedUntil: access.allowedUntil });
  } catch (e) {
    next(e);
  }
};

// ====== (Provider/Admin) tạo checkpoint + options (để bạn quản trị) ======

// POST /api/lessons/:lessonId/checkpoints  body { at_seconds, question_text, options:[{text,isCorrect}] }
exports.createCheckpoint = async (req, res, next) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { at_seconds, question_text, options } = req.body || {};

    if (at_seconds == null || !question_text) {
      return res.status(400).json({ message: 'Thiếu at_seconds hoặc question_text' });
    }

    const perm = await assertCanManageLesson(req, lessonId);
    if (!perm.ok) return res.status(perm.status).json({ message: perm.message });

    const cp = await db.LessonCheckpoint.create({
      lesson_id: lessonId,
      at_seconds: Number(at_seconds),
      question_text,
    });

    if (Array.isArray(options) && options.length) {
      // bắt buộc có 1 đáp án đúng
      const hasCorrect = options.some(o => !!o.isCorrect);
      if (!hasCorrect) return res.status(400).json({ message: 'Options phải có ít nhất 1 đáp án đúng' });

      await db.LessonCheckpointOption.bulkCreate(
        options.map(o => ({
          checkpoint_id: cp.checkpoint_id,
          option_text: String(o.text ?? o.option_text ?? ''),
          isCorrect: !!o.isCorrect,
        }))
      );
    }

    return res.status(201).json({ message: 'Tạo checkpoint thành công', checkpoint: cp });
  } catch (e) {
    next(e);
  }
};
