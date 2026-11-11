const express = require('express');
const router = express.Router();
const {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// Public/Authenticated access for viewing resources
router.get('/', authenticateUser, getAllResources);

// Admin-only management endpoints on base resource route
router.post('/', authenticateUser, authorizeRoles('admin'), createResource);
router.put('/:id', validateObjectId, authenticateUser, authorizeRoles('admin'), updateResource);
router.delete('/:id', validateObjectId, authenticateUser, authorizeRoles('admin'), deleteResource);

module.exports = router;
