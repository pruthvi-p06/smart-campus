const Issue = require('../models/Issue');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to notify user
const createNotification = async ({ userId, message, type, issueId }) => {
  try {
    await Notification.create({ userId, message, type, issueId });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

// Helper to notify all admins
const notifyAdmins = async ({ message, type, issueId }) => {
  try {
    const admins = await User.find({ role: 'admin', status: 'active' });
    const notifications = admins.map((admin) => ({
      userId: admin._id,
      message,
      type,
      issueId,
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error('Failed to notify admins:', err.message);
  }
};

// @desc    Report a new issue (Student)
// @route   POST /api/issues
// @access  Private (Student)
const createIssue = async (req, res) => {
  try {
    const { title, category, location, department, description, priority } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, category, location, and description',
      });
    }

    // Determine image path (from uploaded file or request body URL)
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const issue = await Issue.create({
      title,
      category,
      location,
      department: department || req.user.department || '',
      description,
      image: imageUrl,
      priority: priority || 'Medium',
      status: 'Pending',
      reportedBy: req.user._id,
      reportedAt: new Date(),
    });

    // Notify administrators
    await notifyAdmins({
      message: `New issue reported: "${issue.title}" at ${issue.location}`,
      type: 'issue_reported',
      issueId: issue._id,
    });

    const populatedIssue = await Issue.findById(issue._id).populate('reportedBy', 'name email department phone');

    return res.status(201).json({
      message: 'Issue reported successfully',
      issue: populatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to create issue: ${error.message}` });
  }
};

// @desc    Get all issues reported by the logged in student
// @route   GET /api/issues/my
// @access  Private (Student)
const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('assignedTo', 'name email department phone')
      .sort({ createdAt: -1 });

    return res.status(200).json(issues);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch issues: ${error.message}` });
  }
};

// @desc    Get single issue details
// @route   GET /api/issues/:id
// @access  Private (Student own issue, Assigned Staff, or Admin)
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email department phone year')
      .populate('assignedTo', 'name email department phone');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Access authorization check
    const isOwner = issue.reportedBy && issue.reportedBy._id.toString() === req.user._id.toString();
    const isAssignedStaff = issue.assignedTo && issue.assignedTo._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssignedStaff && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this issue' });
    }

    return res.status(200).json(issue);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch issue details: ${error.message}` });
  }
};

// @desc    Get issues assigned to logged in staff
// @route   GET /api/staff/issues
// @access  Private (Staff)
const getStaffIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ assignedTo: req.user._id })
      .populate('reportedBy', 'name email department phone')
      .sort({ createdAt: -1 });

    return res.status(200).json(issues);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch staff issues: ${error.message}` });
  }
};

// @desc    Update issue status & resolution note (Staff / Admin)
// @route   PUT /api/issues/:id/status
// @access  Private (Staff / Admin)
const updateIssueStatusByStaff = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check staff assignment or admin privileges
    const isAssigned = issue.assignedTo && issue.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssigned && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only update issues assigned to you' });
    }

    if (status) {
      if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be Pending, In Progress, or Resolved.' });
      }
      issue.status = status;
    }

    if (resolutionNote !== undefined) {
      issue.resolutionNote = resolutionNote;
    }

    if (status === 'Resolved') {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    // Notify the reporting student
    await createNotification({
      userId: issue.reportedBy,
      message: `Your issue "${issue.title}" status has been updated to "${issue.status}".`,
      type: issue.status === 'Resolved' ? 'issue_resolved' : 'status_updated',
      issueId: issue._id,
    });

    // Notify admins if resolved
    if (status === 'Resolved') {
      await notifyAdmins({
        message: `Issue "${issue.title}" was marked Resolved by ${req.user.name}.`,
        type: 'issue_resolved',
        issueId: issue._id,
      });
    }

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email department phone')
      .populate('assignedTo', 'name email department phone');

    return res.status(200).json({
      message: 'Issue status updated successfully',
      issue: updatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to update status: ${error.message}` });
  }
};

// @desc    Get all issues with comprehensive search & filtering (Admin)
// @route   GET /api/admin/issues
// @access  Private (Admin)
const getAdminIssues = async (req, res) => {
  try {
    const { status, priority, category, department, location, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (department) query.department = department;
    if (location) query.location = { $regex: location, $options: 'i' };

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { department: searchRegex },
      ];
    }

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email department phone')
      .populate('assignedTo', 'name email department phone')
      .sort({ createdAt: -1 });

    return res.status(200).json(issues);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch admin issues: ${error.message}` });
  }
};

// @desc    Update issue assignment, status, and admin note (Admin)
// @route   PUT /api/admin/issues/:id
// @access  Private (Admin)
const updateAdminIssue = async (req, res) => {
  try {
    const { status, assignedTo, adminNote, priority } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (status) issue.status = status;
    if (priority) issue.priority = priority;
    if (adminNote !== undefined) issue.adminNote = adminNote;

    let assignedStaffUser = null;
    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === '') {
        issue.assignedTo = null;
        issue.assignedAt = null;
      } else {
        assignedStaffUser = await User.findById(assignedTo);
        if (!assignedStaffUser) {
          return res.status(400).json({ message: 'Assigned staff user not found' });
        }
        issue.assignedTo = assignedStaffUser._id;
        issue.assignedAt = new Date();
        if (issue.status === 'Pending') {
          issue.status = 'In Progress'; // Auto advance status upon assignment
        }
      }
    }

    await issue.save();

    // If assigned to staff, notify that staff member
    if (assignedStaffUser) {
      await createNotification({
        userId: assignedStaffUser._id,
        message: `You have been assigned issue: "${issue.title}" at ${issue.location}.`,
        type: 'issue_assigned',
        issueId: issue._id,
      });
    }

    // Notify student about updates
    await createNotification({
      userId: issue.reportedBy,
      message: `Your issue "${issue.title}" was updated by administrator. Status: ${issue.status}.`,
      type: 'status_updated',
      issueId: issue._id,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email department phone')
      .populate('assignedTo', 'name email department phone');

    return res.status(200).json({
      message: 'Issue updated successfully',
      issue: updatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to update admin issue: ${error.message}` });
  }
};

module.exports = {
  createIssue,
  getMyIssues,
  getIssueById,
  getStaffIssues,
  updateIssueStatusByStaff,
  getAdminIssues,
  updateAdminIssue,
};
