'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'videos');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = path.basename(file.originalname || 'video', ext).replace(/\s+/g, '_');
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}_${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ok = file.mimetype === 'video/mp4' || (file.originalname || '').toLowerCase().endsWith('.mp4');
  if (!ok) return cb(new Error('Chỉ cho phép file MP4'), false);
  cb(null, true);
};

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 * 1024 } // 300MB (tùy bạn)
});

module.exports = uploadVideo;
