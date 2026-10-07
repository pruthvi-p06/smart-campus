const express = require('express');
const router = express.Router();
const { analyzeIssueEndpoint, getInsightsEndpoint } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Issue text categorization & priority prediction (All authenticated users)
router.post('/analyze-issue', authenticateUser, analyzeIssueEndpoint);

// Strategic analytics insights (Admin only)
router.post('/insights', authenticateUser, authorizeRoles('admin'), getInsightsEndpoint);

module.exports = router;
