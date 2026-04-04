'use strict';
const db = require('../models');

const normalizeOptions = (options = []) => {
  return (Array.isArray(options) ? options : [])
    .map((o) => ({
      option_text: String(o?.option_text || '').trim(),
      isCorrect: !!o?.isCorrect,
    }))
    .filter((o) => o.option_text);
};

async function safeRollback(t) {
  if (t && !t.finished) {
    try { await t.rollback(); } catch (_) {}
  }
}

exports.addOption = async (req, res, next) => {
  try {
    const checkpointId = Number(req.params.checkpointId);
    const { option_text, isCorrect } = req.body;

    if (!checkpointId) {
      return res.status(400).json({ message: 'checkpointId khong hop le' });
    }

    if (!option_text || !String(option_text).trim()) {
      return res.status(400).json({ message: 'option_text khong duoc de trong' });
    }

    const cp = await db.LessonCheckpoint.findByPk(checkpointId);
    if (!cp) {
      return res.status(404).json({ message: 'khong tim thay checkpoint' });
    }

    const opt = await db.LessonCheckpointOption.create({
      checkpoint_id: checkpointId,
      option_text: String(option_text).trim(),
      isCorrect: !!isCorrect,
    });

    return res.status(201).json({
      message: 'them option thanh cong',
      option: opt,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCheckpoint = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const checkpointId = Number(req.params.checkpointId);
    const { at_seconds, question_text, options } = req.body;

    if (!checkpointId) {
      await safeRollback(t);
      return res.status(400).json({ message: 'checkpointId khong hop le' });
    }

    const checkpoint = await db.LessonCheckpoint.findByPk(checkpointId, { transaction: t });
    if (!checkpoint) {
      await safeRollback(t);
      return res.status(404).json({ message: 'khong tim thay checkpoint' });
    }

    const at = Number(at_seconds);
    if (!Number.isFinite(at) || at < 0) {
      await safeRollback(t);
      return res.status(400).json({ message: 'at_seconds khong hop le' });
    }

    if (!String(question_text || '').trim()) {
      await safeRollback(t);
      return res.status(400).json({ message: 'question_text khong duoc de trong' });
    }

    // Không cho trùng thời điểm trong cùng lesson với checkpoint khác
    const duplicated = await db.LessonCheckpoint.findOne({
      where: {
        lesson_id: checkpoint.lesson_id,
        at_seconds: at,
        checkpoint_id: {
          [db.Sequelize.Op.ne]: checkpointId,
        },
      },
      transaction: t,
    });

    if (duplicated) {
      await safeRollback(t);
      return res.status(409).json({
        message: `Da ton tai checkpoint o giay ${at} trong bai hoc nay`,
      });
    }

    const normalizedOptions = normalizeOptions(options);

    if (normalizedOptions.length < 2) {
      await safeRollback(t);
      return res.status(400).json({ message: 'Can it nhat 2 dap an' });
    }

    if (!normalizedOptions.some((o) => o.isCorrect)) {
      await safeRollback(t);
      return res.status(400).json({ message: 'Can it nhat 1 dap an dung' });
    }

    await checkpoint.update(
      {
        at_seconds: at,
        question_text: String(question_text).trim(),
      },
      { transaction: t }
    );

    await db.LessonCheckpointOption.destroy({
      where: { checkpoint_id: checkpointId },
      transaction: t,
    });

    await db.LessonCheckpointOption.bulkCreate(
      normalizedOptions.map((o) => ({
        checkpoint_id: checkpointId,
        option_text: o.option_text,
        isCorrect: o.isCorrect,
      })),
      { transaction: t }
    );

    const updatedCheckpoint = await db.LessonCheckpoint.findByPk(checkpointId, { transaction: t });
    const updatedOptions = await db.LessonCheckpointOption.findAll({
      where: { checkpoint_id: checkpointId },
      order: [['option_id', 'ASC']],
      transaction: t,
    });

    await t.commit();

    return res.json({
      message: 'cap nhat checkpoint thanh cong',
      checkpoint: {
        ...updatedCheckpoint.toJSON(),
        options: updatedOptions,
      },
    });
  } catch (err) {
    await safeRollback(t);
    next(err);
  }
};

exports.deleteCheckpoint = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const checkpointId = Number(req.params.checkpointId);

    if (!checkpointId) {
      await safeRollback(t);
      return res.status(400).json({ message: 'checkpointId khong hop le' });
    }

    const checkpoint = await db.LessonCheckpoint.findByPk(checkpointId, { transaction: t });
    if (!checkpoint) {
      await safeRollback(t);
      return res.status(404).json({ message: 'khong tim thay checkpoint' });
    }

    await db.LessonCheckpointOption.destroy({
      where: { checkpoint_id: checkpointId },
      transaction: t,
    });

    await checkpoint.destroy({ transaction: t });

    await t.commit();

    return res.json({ message: 'xoa checkpoint thanh cong' });
  } catch (err) {
    await safeRollback(t);
    next(err);
  }
};