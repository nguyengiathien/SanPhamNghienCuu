'use strict';

const db = require('../models');

const isAdmin = (req) => req.user?.role === 'admin';

exports.getAllClasses = async (req, res, next) => {
  try {
    const classes = await db.Class.findAll({
      include: [
        { model: db.User, as: 'creator', attributes: ['user_id','username','fullName','role'] }
      ]
    });
    res.json({ classes });
  } catch (err) {
    next(err);
  }
};

exports.getClassById = async (req, res, next) => {
  try {
    const clazz = await db.Class.findByPk(req.params.id, {
      include: [
        { model: db.User, as: 'creator', attributes: ['user_id','username','fullName','role'] },
        { model: db.ClassMember, include: [{ model: db.User, attributes: ['user_id','username','fullName','role'] }] }
      ]
    });
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });
    res.json({ class: clazz });
  } catch (err) {
    next(err);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    const creator_id = req.user?.user_id || req.body.creator_id;
    const { className, startDate, endDate } = req.body;

    const clazz = await db.Class.create({
      className,
      creator_id,
      startDate: startDate || null,
      endDate: endDate || null
    });

    res.status(201).json({ message: 'tao lop thanh cong', class: clazz });
  } catch (err) {
    next(err);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    const clazz = await db.Class.findByPk(req.params.id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    if (!isAdmin(req) && req.user?.user_id && clazz.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen cap nhat lop nay' });
    }

    const { className, startDate, endDate } = req.body;
    await clazz.update({
      className: className ?? clazz.className,
      startDate: startDate ?? clazz.startDate,
      endDate: endDate ?? clazz.endDate
    });

    res.json({ message: 'cap nhat thanh cong', class: clazz });
  } catch (err) {
    next(err);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const clazz = await db.Class.findByPk(req.params.id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    if (!isAdmin(req) && req.user?.user_id && clazz.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen xoa lop nay' });
    }

    await clazz.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};

// Members
exports.getClassMembers = async (req, res, next) => {
  try {
    const members = await db.ClassMember.findAll({
      where: { class_id: req.params.id },
      include: [{ model: db.User, attributes: ['user_id','username','fullName','role'] }]
    });
    res.json({ members });
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const clazz = await db.Class.findByPk(req.params.id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    if (!isAdmin(req) && req.user?.user_id && clazz.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen them thanh vien' });
    }

    const { user_id, memberRole } = req.body;

    const user = await db.User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: 'khong tim thay user' });

    const existed = await db.ClassMember.findOne({ where: { class_id: clazz.class_id, user_id } });
    if (existed) return res.status(409).json({ message: 'user da la thanh vien' });

    const member = await db.ClassMember.create({
      class_id: clazz.class_id,
      user_id,
      memberRole: memberRole || 'student',
      joinedAt: new Date()
    });

    res.status(201).json({ message: 'them thanh vien thanh cong', member });
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const clazz = await db.Class.findByPk(req.params.id);
    if (!clazz) return res.status(404).json({ message: 'khong tim thay lop' });

    if (!isAdmin(req) && req.user?.user_id && clazz.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen xoa thanh vien' });
    }

    const member = await db.ClassMember.findOne({
      where: { class_id: req.params.id, user_id: req.params.userId }
    });

    if (!member) return res.status(404).json({ message: 'khong tim thay thanh vien' });

    await member.destroy();
    res.json({ message: 'xoa thanh vien thanh cong' });
  } catch (err) {
    next(err);
  }
};
