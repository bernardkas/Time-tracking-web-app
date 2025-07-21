// routes/activityRoutes.js
const express = require('express');
const { signIn } = require('../controllers/signin-controller');
const router = express.Router();

// POST route for creating activity logs
router.post('/', signIn);

module.exports = router;
