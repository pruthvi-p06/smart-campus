const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.use(authenticateUser);

router.get('/', getNotifications);
router.put('/:id/read', validateObjectId, markNotificationAsRead);
router.put('/read-all', markAllNotificationsAsRead);

module.exports = router;
