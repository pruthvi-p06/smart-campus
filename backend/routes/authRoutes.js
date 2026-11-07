const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All account types (student, staff and admin) register through the website.
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected auth route
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
