const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.route('/').get(getUserProfile).put(updateUserProfile);

module.exports = router;
