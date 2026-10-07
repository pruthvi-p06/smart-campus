const User = require('../models/User');

// @desc    Get all users with search & filters (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, department, status, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { department: searchRegex }];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch users: ${error.message}` });
  }
};

// @desc    Add a user directly (Admin)
// @route   POST /api/admin/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, year, phone, status } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      department: department || '',
      year: year || '',
      phone: phone || '',
      status: status || 'active',
    });

    return res.status(201).json({
      message: 'User created successfully',
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
    return res.status(500).json({ message: `Failed to create user: ${error.message}` });
  }
};

// @desc    Update user details (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, role, department, year, phone, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;
    if (phone !== undefined) user.phone = phone;
    if (status) user.status = status;

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully',
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
    return res.status(500).json({ message: `Failed to update user: ${error.message}` });
  }
};

// @desc    Activate or deactivate user account status (Admin)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: "Status must be either 'active' or 'inactive'" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      message: `User status changed to ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to update user status: ${error.message}` });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
};
