const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendError = require('../utils/sendError');

// Helper to generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Add it to backend/.env and restart the server.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  year: user.year,
  phone: user.phone,
  status: user.status,
});

// Constant-time comparison so the invite code cannot be guessed by timing.
const codesMatch = (supplied, expected) => {
  const a = crypto.createHash('sha256').update(String(supplied || '')).digest();
  const b = crypto.createHash('sha256').update(String(expected || '')).digest();
  return crypto.timingSafeEqual(a, b);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (students/staff). Admin accounts additionally need ADMIN_INVITE_CODE.
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, department, year, role, adminCode } = req.body || {};

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' ||
        !name.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const requestedRole = role || 'student';
    if (!['student', 'staff', 'admin'].includes(requestedRole)) {
      return res.status(400).json({ message: 'Please select a valid account type.' });
    }

    // Administrator accounts cannot be created anonymously.
    if (requestedRole === 'admin') {
      const expectedCode = process.env.ADMIN_INVITE_CODE;
      if (!expectedCode || !expectedCode.trim()) {
        return res.status(403).json({
          message: 'Administrator self-registration is disabled. Ask an existing administrator to create your account.',
        });
      }
      if (!codesMatch(adminCode, expectedCode.trim())) {
        return res.status(403).json({ message: 'Invalid administrator invite code.' });
      }
    }

    const normalisedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalisedEmail });
    if (userExists) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalisedEmail,
      password,
      phone: typeof phone === 'string' ? phone : '',
      department: typeof department === 'string' ? department : '',
      year: typeof year === 'string' ? year : '',
      role: requestedRole,
      status: 'active',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return sendError(res, error, 'Registration failed');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact an administrator.' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return sendError(res, error, 'Login failed');
  }
};

// @desc    Get current authenticated user info
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return sendError(res, error, 'Failed to fetch user profile');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
