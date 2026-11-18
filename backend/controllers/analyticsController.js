const sendError = require('../utils/sendError');
const Issue = require('../models/Issue');
const User = require('../models/User');

// Helper to build MongoDB filter criteria from analytics query params
const buildAnalyticsFilter = (params = {}) => {
  const { category, department, status, dateRange } = params;
  const match = {};

  if (category && category !== 'All') {
    match.category = category;
  }
  if (department && department !== 'All') {
    match.department = department;
  }
  if (status && status !== 'All') {
    match.status = status;
  }

  if (dateRange && dateRange !== 'all') {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 0;
    if (days > 0) {
      match.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    }
  }

  return match;
};

// @desc    Get dynamic system analytics & KPI metrics with optional filtering
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res) => {
  try {
    const match = buildAnalyticsFilter(req.query);

    const totalIssues = await Issue.countDocuments(match);
    const pending = await Issue.countDocuments({ ...match, status: 'Pending' });
    const inProgress = await Issue.countDocuments({ ...match, status: 'In Progress' });
    const resolved = await Issue.countDocuments({ ...match, status: 'Resolved' });
    const highPriority = await Issue.countDocuments({ ...match, priority: 'High' });

    const activeStaff = await User.countDocuments({ role: 'staff', status: 'active' });

    // Resolution rate percentage
    const resolutionRate = totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0;

    // Aggregate issues by status with filter
    const statusAgg = await Issue.aggregate([
      ...(Object.keys(match).length > 0 ? [{ $match: match }] : []),
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

    // Aggregate issues by category with filter
    const categoryAgg = await Issue.aggregate([
      ...(Object.keys(match).length > 0 ? [{ $match: match }] : []),
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const issuesByCategory = {};
    categoryAgg.forEach((item) => {
      if (item._id) issuesByCategory[item._id] = item.count;
    });

    // Aggregate issues by department with filter
    const departmentAgg = await Issue.aggregate([
      { $match: { ...match, department: { $ne: '' } } },
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
      appliedFilters: {
        category: req.query.category || 'All',
        department: req.query.department || 'All',
        status: req.query.status || 'All',
        dateRange: req.query.dateRange || 'all',
      },
    });
  } catch (error) {
    return sendError(res, error, 'Failed to compile analytics');
  }
};

module.exports = {
  getAdminAnalytics,
  buildAnalyticsFilter,
};
