'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ===== IMPORT ROUTES =====
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const majorRoutes = require('./routes/majorRoutes.js');
const courseRoutes = require('./routes/courseRoutes.js');
const providerRoutes = require('./routes/providerRoutes.js');
const classRoutes = require('./routes/classRoutes.js');
const lessonRoutes = require('./routes/lessonRoutes.js');
const questionRoutes = require('./routes/questionRoutes.js');
const questionBankRoutes = require('./routes/questionBankRoutes.js');
const testRoutes = require('./routes/testRoutes.js');
const learningProcessRoutes = require('./routes/learningProcessRoutes.js');
const socialRoutes = require('./routes/socialRoutes.js');
const checkpointRoutes = require('./routes/checkpointRoutes.js');

// ===== MIDDLEWARE =====
const requestLoggerMiddleWare = require('./middlewares/requestLogger.js');
const errorHandlerMiddleWare = require('./middlewares/errorHandler.js');

// ===== DATABASE =====
const db = require('./models');

// ===== CONFIG =====
const PORT = process.env.PORT || 3000;

// ======================================================
// CORS - PHẢI ĐẶT TRƯỚC TẤT CẢ ROUTES
// ======================================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
)

// ======================================================
// GLOBAL MIDDLEWARE
// ======================================================
app.use(requestLoggerMiddleWare);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// HEALTH CHECK
// ======================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'elearning-backend',
    time: new Date().toISOString(),
  });
});

// ======================================================
// ROUTES
// ======================================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/majors', majorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/question-banks', questionBankRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/learning-processes', learningProcessRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/checkpoints', checkpointRoutes);

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================================================
// DATABASE CONNECTION CHECK
// ======================================================
console.log('Đang kết nối đến database...');

db.sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Kết nối CSDL thành công');
    console.log(`✓ Database : ${process.env.DB_DATABASE}`);
    console.log(`✓ Host     : ${process.env.DB_HOST}`);
    console.log(`✓ Dialect  : ${db.sequelize.getDialect()}`);
  })
  .catch((err) => {
    console.error('✗ LỖI KẾT NỐI DATABASE');
    console.error('Message:', err.message);
    process.exit(1);
  });

// ======================================================
// JWT CONFIG CHECK
// ======================================================
if (!process.env.JWT_SECRET) {
  console.warn('⚠ JWT_SECRET chưa được cấu hình trong file .env');
}

// ======================================================
// ERROR HANDLER (LUÔN ĐẶT CUỐI)
// ======================================================
app.use(errorHandlerMiddleWare);

// ======================================================
// START SERVER
// ======================================================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✓ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});