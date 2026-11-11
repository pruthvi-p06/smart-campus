const sendError = require('../utils/sendError');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return sendError(res, error, 'Failed to fetch profile');
  }
};

// @desc    Update current user profile
// @route   PUT /api/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, department, year, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role cannot be changed via profile update
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;

    // Optional password update
    if (typeof password === 'string' && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
      user.password = password; // Pre-save hook will hash it
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        phone: user.phone,
        status: user.status,
      },
    });
  } catch (error) {
    return sendError(res, error, 'Failed to update profile');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
