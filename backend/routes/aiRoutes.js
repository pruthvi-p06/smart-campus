const express = require('express');
const router = express.Router();
const { analyzeIssueEndpoint, getInsightsEndpoint } = require('../controllers/aiController');
const { askCampusAssistant } = require('../controllers/chatController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { createRateLimiter } = require('../middleware/rateLimiter');

// The chat endpoint is public and may call a paid AI API, so limit each IP.
const chatLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'You are sending messages too quickly. Please wait a minute and try again.',
});

// Public campus FAQ / Gemini assistant. It does not expose account or ticket records.
router.post('/chat', chatLimiter, askCampusAssistant);

// Issue text categorization & priority prediction (All authenticated users)
router.post('/analyze-issue', authenticateUser, analyzeIssueEndpoint);

// Strategic analytics insights (Admin only)
router.post('/insights', authenticateUser, authorizeRoles('admin'), getInsightsEndpoint);

module.exports = router;
