const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
} = require('../controllers/userController');

const {
  getAdminIssues,
  getIssueById,
  updateAdminIssue,
} = require('../controllers/issueController');

const {
  createResource,
  updateResource,
  deleteResource,
  getAllResources,
} = require('../controllers/resourceController');

const { getAdminAnalytics } = require('../controllers/analyticsController');
const { getInsightsEndpoint } = require('../controllers/aiController');

const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All routes here strictly require Admin role
router.use(authenticateUser, authorizeRoles('admin'));

// Admin User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/status', updateUserStatus);

// Admin Issue Management
router.get('/issues', getAdminIssues);
router.get('/issues/:id', getIssueById);
router.put('/issues/:id', updateAdminIssue);

// Admin Resource Management
router.get('/resources', getAllResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

// Admin Analytics & AI Insights
router.get('/analytics', getAdminAnalytics);
router.post('/insights', getInsightsEndpoint);

module.exports = router;
