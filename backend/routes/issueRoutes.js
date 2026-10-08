const express = require('express');
const router = express.Router();
const {
  createIssue,
  getMyIssues,
  getIssueById,
  getStaffIssues,
  updateIssueStatusByStaff,
  getAdminIssues,
  updateAdminIssue,
} = require('../controllers/issueController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Student Issue Routes
router.post('/', authenticateUser, authorizeRoles('student', 'admin'), upload.single('image'), createIssue);
router.get('/my', authenticateUser, authorizeRoles('student', 'admin'), getMyIssues);

// Staff Specific Status Update
router.put('/:id/status', authenticateUser, authorizeRoles('staff', 'admin'), updateIssueStatusByStaff);

// General Issue Details Route
router.get('/:id', authenticateUser, getIssueById);

module.exports = router;
