'use strict';

module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Loi server',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
