const { analyzeIssue, generateInsights } = require('../services/aiService');
const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Analyze issue text to suggest category & priority
// @route   POST /api/ai/analyze-issue
// @access  Private (Authenticated users)
const analyzeIssueEndpoint = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description text is required for AI analysis' });
    }

    const result = await analyzeIssue(description);

    return res.status(200).json(result);
  } catch (error) {
    // Failsafe fallback so front-end never crashes
    return res.status(200).json({
      category: 'Other',
      priority: 'Medium',
      reason: 'General maintenance issue.',
    });
  }
};

// @desc    Generate strategic operational insights from live database
// @route   POST /api/ai/insights
// @access  Private (Admin)
const getInsightsEndpoint = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: 'Pending' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });
    const highPriority = await Issue.countDocuments({ priority: 'High' });
    const activeStaff = await User.countDocuments({ role: 'staff', status: 'active' });

    const resolutionRate = totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0;

    const categoryAgg = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const issuesByCategory = {};
    categoryAgg.forEach((item) => {
      if (item._id) issuesByCategory[item._id] = item.count;
    });

    const statusAgg = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const issuesByStatus = {};
    statusAgg.forEach((item) => {
      if (item._id) issuesByStatus[item._id] = item.count;
    });

    const analyticsData = {
      totalIssues,
      pending,
      inProgress,
      resolved,
      highPriority,
      resolutionRate,
      activeStaff,
      issuesByCategory,
      issuesByStatus,
    };

    const aiInsights = await generateInsights(analyticsData);

    return res.status(200).json(aiInsights);
  } catch (error) {
    return res.status(500).json({ message: `Failed to generate insights: ${error.message}` });
  }
};

module.exports = {
  analyzeIssueEndpoint,
  getInsightsEndpoint,
};
