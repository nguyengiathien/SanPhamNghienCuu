'use strict';

const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');

const checkpointController = require('../controllers/checkpointController');

// POST /api/checkpoints/:checkpointId/options
router.post(
  '/:checkpointId/options',
  authenticateToken,
  authorizeRole('admin', 'provider'),
  checkpointController.addOption
);

// PUT /api/checkpoints/:checkpointId
router.put(
  '/:checkpointId',
  authenticateToken,
  authorizeRole('admin', 'provider'),
  checkpointController.updateCheckpoint
);

// DELETE /api/checkpoints/:checkpointId
router.delete(
  '/:checkpointId',
  authenticateToken,
  authorizeRole('admin', 'provider'),
  checkpointController.deleteCheckpoint
);

module.exports = router;