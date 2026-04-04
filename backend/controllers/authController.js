'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../models');
const { sendResetPasswordEmail } = require('../utils/sendMail');

const signToken = (user) => {
  const payload = { userId: user.user_id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName, dob, role, address } = req.body;
    const finalFullName = (fullName && fullName.trim()) || (username && username.trim());

    const existed = await db.User.findOne({
      where: { [db.Sequelize.Op.or]: [{ username }, { email }] }
    });

    if (existed) {
      return res.status(409).json({ message: 'username hoac email da ton tai' });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await db.User.create({
      username,
      email,
      password: hashed,
      fullName: finalFullName,
      dob: dob || null,
      role: role || 'student',
      address: address || null
    });

    const token = signToken(user);

    return res.status(201).json({
      message: 'dang ky thanh cong',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    const token = signToken(user);

    return res.json({
      message: 'dang nhap thanh cong',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage = 'Nếu email tồn tại trong hệ thống, link đặt lại mật khẩu đã được gửi.';

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.json({ message: genericMessage });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3001').replace(/\/$/, '');
    const resetLink = `${clientUrl}/reset-password?token=${rawToken}`;

    try {
      const mailResult = await sendResetPasswordEmail({
        to: user.email,
        fullName: user.fullName || user.username,
        resetLink
      });

      return res.json({
        message: genericMessage,
        ...(process.env.NODE_ENV === 'development'
          ? {
              debugResetLink: resetLink,
              mailSent: !!mailResult.sent
            }
          : {})
      });
    } catch (mailErr) {
      console.error('SEND MAIL ERROR:', mailErr);

      if (process.env.NODE_ENV === 'development') {
        return res.json({
          message: 'Khong gui duoc email, dang tra link test trong moi truong development',
          debugResetLink: resetLink,
          mailSent: false
        });
      }

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        message: 'Khong the gui email dat lai mat khau'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'token khong hop le' });
    }

    const hashedToken = hashResetToken(token);

    const user = await db.User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'
      });
    }

    return res.json({ message: 'Token hop le' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = hashResetToken(token);

    const user = await db.User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'
      });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({
      message: 'Dat lai mat khau thanh cong'
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user?.user_id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'chua dang nhap' });
    }

    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    return res.json({ user });
  } catch (err) {
    next(err);
  }
};