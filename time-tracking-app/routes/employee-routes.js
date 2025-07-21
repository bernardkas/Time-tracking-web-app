// routes/employeeRoutes.js

const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const {
  getEmployee,
  updateEmployee,
} = require('../controllers/employee-controller');

const router = express.Router();

// Route to get employee data with company details
router.get('/employee', authenticateJWT, getEmployee);

// Route to update employee's "isOnline" status
router.put('/employee/:id', updateEmployee);

module.exports = router;
