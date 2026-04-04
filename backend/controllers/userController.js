'use strict';

const db = require('../models');

// ===================== ADMIN =====================

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'khong tim thay user' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { email, fullName, dob, role, address, avatarUrl } = req.body;

    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'khong tim thay user' });

    await user.update({
      email: email ?? user.email,
      fullName: fullName ?? user.fullName,
      dob: dob ?? user.dob,
      role: role ?? user.role,
      address: address ?? user.address,
      avatarUrl: avatarUrl ?? user.avatarUrl,
    });

    const safe = await db.User.findByPk(user.user_id, { attributes: { exclude: ['password'] } });
    res.json({ message: 'cap nhat thanh cong', user: safe });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'khong tim thay user' });

    await user.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};

// ===================== SELF (/me) =====================

// GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) return res.status(404).json({ message: 'khong tim thay user' });

    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.user_id;
    if (!userId) return res.status(401).json({ message: 'chua dang nhap' });

    const { fullName, dob, address } = req.body;

    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'khong tim thay user' });

    await user.update({
      fullName: fullName ?? user.fullName,
      dob: dob ?? user.dob,
      address: address ?? user.address,
    });

    const safe = await db.User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    return res.json({ message: 'cap nhat thanh cong', user: safe });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/me/avatar
// multipart/form-data: avatar (file)
exports.updateMyAvatar = async (req, res, next) => {
  try {
    const user = req.user;

    // ✅ KHÔNG CÓ FILE → cho qua
    if (!req.file) {
      return res.json({
        message: "Không có ảnh mới, giữ nguyên avatar",
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      });
    }

    // Có file → update avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await user.update({ avatarUrl });

    return res.json({
      message: "Cập nhật avatar thành công",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

