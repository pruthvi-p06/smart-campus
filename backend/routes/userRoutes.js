const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Get users list (e.g., to populate staff dropdowns during assignment)
router.get('/', authenticateUser, authorizeRoles('admin'), getAllUsers);

module.exports = router;
