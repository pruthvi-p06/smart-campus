const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Get dynamic system analytics & KPI metrics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: 'Pending' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });
    const highPriority = await Issue.countDocuments({ priority: 'High' });

    const activeStaff = await User.countDocuments({ role: 'staff', status: 'active' });

    // Resolution rate percentage
    const resolutionRate = totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0;

    // Aggregate issues by status
    const statusAgg = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const issuesByStatus = {
      Pending: 0,
      'In Progress': 0,
      Resolved: 0,
    };
    statusAgg.forEach((item) => {
      if (item._id) issuesByStatus[item._id] = item.count;
    });

    // Aggregate issues by category
    const categoryAgg = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const issuesByCategory = {};
    categoryAgg.forEach((item) => {
      if (item._id) issuesByCategory[item._id] = item.count;
    });

    // Aggregate issues by department
    const departmentAgg = await Issue.aggregate([
      { $match: { department: { $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const issuesByDepartment = {};
    departmentAgg.forEach((item) => {
      if (item._id) issuesByDepartment[item._id] = item.count;
    });

    return res.status(200).json({
      totalIssues,
      pending,
      inProgress,
      resolved,
      highPriority,
      resolutionRate,
      activeStaff,
      issuesByStatus,
      issuesByCategory,
      issuesByDepartment,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to compile analytics: ${error.message}` });
  }
};

module.exports = {
  getAdminAnalytics,
};
