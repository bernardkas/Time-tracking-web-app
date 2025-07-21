// routes/userRoutes.js

const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const { getUser } = require('../controllers/user-controller');

const router = express.Router();

// Define the GET route to fetch user details
router.get('/user', authenticateJWT, getUser);

module.exports = router;
