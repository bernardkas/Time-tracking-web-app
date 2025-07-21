// routes/activityRoutes.js
const express = require('express');
const {
  createActivity,
  updateActivity,
  getActivity,
} = require('../controllers/active-controller');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const router = express.Router();

router.get('/activity', authenticateJWT, getActivity);

// POST route for creating activity logs
router.post('/activity', createActivity);

router.put('/activity/:id', updateActivity);

module.exports = router;
