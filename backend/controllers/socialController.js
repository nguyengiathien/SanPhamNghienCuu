'use strict';

const db = require('../models');

exports.getReacts = async (req, res, next) => {
  try {
    const reacts = await db.React.findAll();
    res.json({ reacts });
  } catch (err) {
    next(err);
  }
};

exports.createReact = async (req, res, next) => {
  try {
    const react = await db.React.create({ reactName: req.body.reactName });
    res.status(201).json({ message: 'tao react thanh cong', react });
  } catch (err) {
    next(err);
  }
};

// Course comments
exports.createCourseComment = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const { course_id, parent_comment_id, content } = req.body;

    const course = await db.Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    const comment = await db.CourseComment.create({
      course_id,
      user_id: userId,
      parent_comment_id: parent_comment_id || null
    }, { transaction: t });

    const ccontent = await db.CourseCommentContent.create({
      comment_id: comment.comment_id,
      contentType: 'text',
      contentData: content
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ message: 'tao comment thanh cong', comment, content: ccontent });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.addCourseCommentContent = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const comment = await db.CourseComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'khong tim thay comment' });

    // owner hoặc admin
    if (req.user?.role !== 'admin' && comment.user_id !== userId) {
      return res.status(403).json({ message: 'khong co quyen' });
    }

    const { contentType, contentData } = req.body;
    const row = await db.CourseCommentContent.create({
      comment_id: comment.comment_id,
      contentType: contentType || 'text',
      contentData
    });

    res.status(201).json({ message: 'them noi dung thanh cong', content: row });
  } catch (err) {
    next(err);
  }
};

exports.reactCourseComment = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const { react_id } = req.body;
    const comment_id = req.params.id;

    const comment = await db.CourseComment.findByPk(comment_id);
    if (!comment) return res.status(404).json({ message: 'khong tim thay comment' });

    const react = await db.React.findByPk(react_id);
    if (!react) return res.status(404).json({ message: 'khong tim thay react' });

    const existed = await db.CourseCommentReact.findOne({ where: { comment_id, user_id: userId, react_id } });
    if (existed) return res.status(409).json({ message: 'ban da react roi' });

    const row = await db.CourseCommentReact.create({
      comment_id,
      user_id: userId,
      react_id,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'react thanh cong', data: row });
  } catch (err) {
    next(err);
  }
};

// Meetings
exports.getMeetings = async (req, res, next) => {
  try {
    const { class_id } = req.query;
    const where = {};
    if (class_id) where.class_id = class_id;

    const meetings = await db.Meeting.findAll({ where });
    res.json({ meetings });
  } catch (err) {
    next(err);
  }
};

exports.createMeeting = async (req, res, next) => {
  try {
    const { class_id, startTime, endTime, historyUrl } = req.body;

    const clazz = await db.Class.findByPk(class_id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    // provider chỉ được tạo trong lớp mình tạo (admin bỏ qua)
    if (req.user?.role !== 'admin' && req.user?.user_id && clazz.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen tao meeting cho lop nay' });
    }

    const meeting = await db.Meeting.create({
      class_id,
      startTime,
      endTime: endTime || null,
      historyUrl: historyUrl || null
    });

    res.status(201).json({ message: 'tao meeting thanh cong', meeting });
  } catch (err) {
    next(err);
  }
};

// Posts
exports.createPost = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const { class_id, content } = req.body;

    const clazz = await db.Class.findByPk(class_id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    const post = await db.Post.create({
      class_id,
      user_id: userId,
      createdAt: new Date()
    }, { transaction: t });

    const pcontent = await db.PostContent.create({
      post_id: post.post_id,
      contentType: 'text',
      contentData: content,
      orderIndex: 1
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ message: 'tao bai dang thanh cong', post, content: pcontent });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.addPostContent = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const post = await db.Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'khong tim thay bai dang' });

    if (req.user?.role !== 'admin' && post.user_id !== userId) {
      return res.status(403).json({ message: 'khong co quyen' });
    }

    const { contentType, contentData, orderIndex } = req.body;
    const row = await db.PostContent.create({
      post_id: post.post_id,
      contentType,
      contentData,
      orderIndex: orderIndex || null
    });

    res.status(201).json({ message: 'them noi dung thanh cong', content: row });
  } catch (err) {
    next(err);
  }
};

exports.reactPost = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const post = await db.Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'khong tim thay bai dang' });

    const { react_id } = req.body;
    const react = await db.React.findByPk(react_id);
    if (!react) return res.status(404).json({ message: 'khong tim thay react' });

    const existed = await db.PostReact.findOne({ where: { post_id: post.post_id, user_id: userId, react_id } });
    if (existed) return res.status(409).json({ message: 'ban da react roi' });

    const row = await db.PostReact.create({
      post_id: post.post_id,
      user_id: userId,
      react_id,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'react thanh cong', data: row });
  } catch (err) {
    next(err);
  }
};

// Post comments
exports.createPostComment = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const post = await db.Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'khong tim thay bai dang' });

    const { parent_comment_id, content } = req.body;

    const comment = await db.PostComment.create({
      post_id: post.post_id,
      user_id: userId,
      parent_comment_id: parent_comment_id || null,
      createdAt: new Date()
    }, { transaction: t });

    const ccontent = await db.PostCommentContent.create({
      pComment_id: comment.pComment_id,
      contentType: 'text',
      contentData: content
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ message: 'tao comment thanh cong', comment, content: ccontent });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.addPostCommentContent = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const comment = await db.PostComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'khong tim thay comment' });

    if (req.user?.role !== 'admin' && comment.user_id !== userId) {
      return res.status(403).json({ message: 'khong co quyen' });
    }

    const { contentType, contentData } = req.body;
    const row = await db.PostCommentContent.create({
      pComment_id: comment.pComment_id,
      contentType: contentType || 'text',
      contentData
    });

    res.status(201).json({ message: 'them noi dung thanh cong', content: row });
  } catch (err) {
    next(err);
  }
};

exports.reactPostComment = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const comment = await db.PostComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'khong tim thay comment' });

    const { react_id } = req.body;
    const react = await db.React.findByPk(react_id);
    if (!react) return res.status(404).json({ message: 'khong tim thay react' });

    const existed = await db.PostCommentReact.findOne({
      where: { pComment_id: comment.pComment_id, user_id: userId, react_id }
    });
    if (existed) return res.status(409).json({ message: 'ban da react roi' });

    const row = await db.PostCommentReact.create({
      pComment_id: comment.pComment_id,
      user_id: userId,
      react_id,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'react thanh cong', data: row });
  } catch (err) {
    next(err);
  }
};
