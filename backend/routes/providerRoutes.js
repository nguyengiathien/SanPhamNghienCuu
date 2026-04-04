'use strict';

const express = require('express');
const router = express.Router();

const providerController = require('../controllers/providerController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');

router.get(
  '/courses',
  authenticateToken,
  authorizeRole('provider', 'admin'),
  providerController.getMyCourses
);

router.get(
  '/courses/:courseId/learners',
  authenticateToken,
  authorizeRole('provider', 'admin'),
  providerController.getLearnersOfCourse
);

module.exports = router;
