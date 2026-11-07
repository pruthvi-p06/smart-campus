const Issue = require('../models/Issue');
const User = require('../models/User');

// Public landing-page metrics only. No names, emails, issue descriptions or other personal data are exposed.
const getPublicOverview = async (req, res) => {
  try {
    const [totalIssues, resolvedIssues, activeStaff] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Resolved' }),
      User.countDocuments({ role: 'staff', status: 'active' }),
    ]);

    const resolutionRate = totalIssues > 0
      ? Math.round((resolvedIssues / totalIssues) * 100)
      : 0;

    return res.status(200).json({
      totalIssues,
      resolvedIssues,
      activeStaff,
      resolutionRate,
    });
  } catch (error) {
    console.error('[Public Overview] Failed to load metrics:', error.message);
    return res.status(503).json({ message: 'Campus overview is temporarily unavailable.' });
  }
};

module.exports = { getPublicOverview };
