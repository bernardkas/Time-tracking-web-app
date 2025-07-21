// routes/uploatToS3Routes.js

const express = require('express');
const { uploadBase64ToS3 } = require('../controllers/upload-to-s3-controller');

const router = express.Router();

// Define the GET route to fetch user details
router.post('/upload-screenshot', uploadBase64ToS3);

module.exports = router;
