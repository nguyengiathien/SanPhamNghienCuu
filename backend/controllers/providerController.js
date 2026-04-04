'use strict';

const db = require('../models');

exports.getMyCourses = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const courses = await db.Course.findAll({
      where: { creator_id: userId },
      include: [
        {
          model: db.Major,
          as: 'majors',
          attributes: ['major_id', 'majorName'],
          through: { attributes: [] },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ courses });
  } catch (err) {
    next(err);
  }
};

exports.getLearnersOfCourse = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { courseId } = req.params;

    // đảm bảo course thuộc provider (tránh xem khóa người khác)
    const course = await db.Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });

    if (req.user.role === 'provider' && course.creator_id !== userId) {
      return res.status(403).json({ message: 'Không có quyền xem khóa học này' });
    }

    // Lấy người học dựa trên LearningProcess + Lesson.course_id
    // DISTINCT user_id + thông tin User
    const rows = await db.LearningProcess.findAll({
      attributes: ['user_id'],
      include: [
        {
          model: db.User,
          attributes: ['user_id', 'username', 'fullName', 'email', 'role'],
        },
        {
          model: db.Lesson,
          attributes: ['lesson_id', 'course_id'],
          where: { course_id: courseId },
        },
      ],
      group: ['LearningProcess.user_id', 'User.user_id', 'Lesson.lesson_id'],
    });

    // Gom unique theo user_id (group trên có thể vẫn nhiều dòng)
    const map = new Map();
    for (const r of rows) {
      const u = r.User;
      if (!u) continue;
      map.set(u.user_id, u);
    }

    res.json({ learners: Array.from(map.values()) });
  } catch (err) {
    next(err);
  }
};
