'use strict';

const db = require('../models');

const isAdmin = (req) => req.user?.role === 'admin';

exports.getLessons = async (req, res, next) => {
  try {
    const { course_id } = req.query;
    const where = {};
    if (course_id) where.course_id = course_id;

    const lessons = await db.Lesson.findAll({
      where,
      include: [db.LessonContent],
      order: [['orderIndex', 'ASC']]
    });

    res.json({ lessons });
  } catch (err) {
    next(err);
  }
};

exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await db.Lesson.findByPk(req.params.id, { include: [db.LessonContent] });
    if (!lesson) return res.status(404).json({ message: 'khong tim thay bai hoc' });
    res.json({ lesson });
  } catch (err) {
    next(err);
  }
};

exports.createLesson = async (req, res, next) => {
  try {
    const { course_id, lessonName, orderIndex } = req.body;

    const course = await db.Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    if (!isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen tao bai hoc' });
    }

    const lesson = await db.Lesson.create({ course_id, lessonName, orderIndex: orderIndex || null });
    res.status(201).json({ message: 'tao bai hoc thanh cong', lesson });
  } catch (err) {
    next(err);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await db.Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'khong tim thay bai hoc' });

    const course = await db.Course.findByPk(lesson.course_id);
    if (course && !isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen cap nhat bai hoc' });
    }

    const { lessonName, orderIndex } = req.body;
    await lesson.update({
      lessonName: lessonName ?? lesson.lessonName,
      orderIndex: orderIndex ?? lesson.orderIndex
    });

    res.json({ message: 'cap nhat thanh cong', lesson });
  } catch (err) {
    next(err);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await db.Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'khong tim thay bai hoc' });

    const course = await db.Course.findByPk(lesson.course_id);
    if (course && !isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen xoa bai hoc' });
    }

    await lesson.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};

exports.addLessonContent = async (req, res, next) => {
  try {
    const lesson = await db.Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'khong tim thay bai hoc' });

    const course = await db.Course.findByPk(lesson.course_id);
    if (course && !isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen them noi dung bai hoc' });
    }

    const { contentType, contentData, orderIndex } = req.body;

    //  nếu thêm video thì xoá video cũ để tránh nhiều video/1 bài
    if (contentType === 'video') {
      await db.LessonContent.destroy({
        where: { lesson_id: lesson.lesson_id, contentType: 'video' },
      });
    }

    const content = await db.LessonContent.create({
      lesson_id: lesson.lesson_id,
      contentType,
      contentData,
      orderIndex: orderIndex || 0
    });

    res.status(201).json({ message: 'them noi dung thanh cong', content });
  } catch (err) {
    next(err);
  }
};

exports.uploadLessonVideo = async (req, res, next) => {
  try {
    const lesson = await db.Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'khong tim thay bai hoc' });

    const course = await db.Course.findByPk(lesson.course_id);
    if (course && !isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen upload video' });
    }

    if (!req.file) return res.status(400).json({ message: 'Vui long chon file video mp4' });

    // đường dẫn public để FE dùng
    const publicPath = `/uploads/videos/${req.file.filename}`;

    // Xoá video cũ trong Lesson_Contents để đảm bảo 1 video / 1 lesson
    await db.LessonContent.destroy({
      where: { lesson_id: lesson.lesson_id, contentType: 'video' },
    });

    const content = await db.LessonContent.create({
      lesson_id: lesson.lesson_id,
      contentType: 'video',
      contentData: publicPath,
      orderIndex: 0
    });

    res.status(201).json({
      message: 'upload video thanh cong',
      videoUrl: publicPath,
      content
    });
  } catch (err) {
    next(err);
  }
};
