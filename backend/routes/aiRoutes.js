const express = require('express');
const router = express.Router();
const { analyzeIssueEndpoint, getInsightsEndpoint } = require('../controllers/aiController');
const { askCampusAssistant } = require('../controllers/chatController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public campus FAQ / Gemini assistant. It does not expose account or ticket records.
router.post('/chat', askCampusAssistant);

// Issue text categorization & priority prediction (All authenticated users)
router.post('/analyze-issue', authenticateUser, analyzeIssueEndpoint);

// Strategic analytics insights (Admin only)
router.post('/insights', authenticateUser, authorizeRoles('admin'), getInsightsEndpoint);

module.exports = router;
