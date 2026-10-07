const express = require('express');
const router = express.Router();
const { getStaffIssues, getIssueById } = require('../controllers/issueController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Staff Issues
router.get('/issues', authenticateUser, authorizeRoles('staff', 'admin'), getStaffIssues);
router.get('/issues/:id', authenticateUser, authorizeRoles('staff', 'admin'), getIssueById);

module.exports = router;
