'use strict';

const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');

const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const { updateUserValidationRules } = require('../validators/userValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

// ======================================================
// MULTER CONFIG (upload avatar)
// ======================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uid = req.user?.user_id || 'unknown';
    cb(null, `u_${uid}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ======================================================
// USER SELF ROUTES (/me)
// ======================================================

// GET /api/users/me
router.get('/me', authenticateToken, userController.getMe);

// PATCH /api/users/me
router.patch('/me', authenticateToken, userController.updateMe);

// PATCH /api/users/me/avatar (multipart/form-data: avatar)
router.patch(
  '/me/avatar',
  authenticateToken,
  upload.single('avatar'),
  userController.updateMyAvatar
);

// ======================================================
// ADMIN ROUTES
// ======================================================

router.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  userController.getUserById
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  updateUserValidationRules(),
  handleValidationErrors,
  userController.updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  userController.deleteUser
);

module.exports = router;
