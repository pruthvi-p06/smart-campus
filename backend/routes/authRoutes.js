const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Slow down password-guessing and mass account creation (per IP).
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many attempts. Please wait a few minutes and try again.',
});

// Students and staff register here. Admin registration additionally requires ADMIN_INVITE_CODE.
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// Protected auth route
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
