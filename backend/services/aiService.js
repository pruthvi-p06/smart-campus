/**
 * SmartCampus AI Service
 * Modular AI processing engine with built-in heuristic classifier fallback.
 */

// Heuristic keyword engine for deterministic fallback
const fallbackAnalyzeIssue = (description = '') => {
  const text = (description || '').toLowerCase();

  let category = 'Other';
  let priority = 'Medium';
  let reason = 'General campus issue requiring facility attention.';

  if (
    text.includes('wifi') ||
    text.includes('wi-fi') ||
    text.includes('internet') ||
    text.includes('lan') ||
    text.includes('router') ||
    text.includes('network') ||
    text.includes('ethernet') ||
    text.includes('connectivity')
  ) {
    category = 'Network';
    if (text.includes('lab') || text.includes('exam') || text.includes('entire') || text.includes('multiple') || text.includes('cannot access')) {
      priority = 'High';
      reason = 'Network disruption affecting multiple users or critical laboratory environments.';
    } else {
      priority = 'Medium';
      reason = 'Local internet connectivity disruption reported.';
    }
  } else if (
    text.includes('fan') ||
    text.includes('light') ||
    text.includes('bulb') ||
    text.includes('tube') ||
    text.includes('power') ||
    text.includes('switch') ||
    text.includes('ac') ||
    text.includes('air conditioner') ||
    text.includes('plug') ||
    text.includes('socket')
  ) {
    category = 'Electrical';
    if (text.includes('spark') || text.includes('smoke') || text.includes('shock') || text.includes('fire')) {
      priority = 'High';
      reason = 'Critical electrical hazard or equipment failure posing immediate risk.';
    } else if (text.includes('blackout') || text.includes('power cut')) {
      priority = 'High';
      reason = 'Power outage impacting facility operations.';
    } else {
      priority = 'Medium';
      reason = 'Routine electrical fixture maintenance required.';
    }
  } else if (
    text.includes('leak') ||
    text.includes('water') ||
    text.includes('tap') ||
    text.includes('washroom') ||
    text.includes('toilet') ||
    text.includes('pipe') ||
    text.includes('drain') ||
    text.includes('overflow')
  ) {
    category = 'Plumbing';
    if (text.includes('flood') || text.includes('burst') || text.includes('overflow') || text.includes('drinking water')) {
      priority = 'High';
      reason = 'Active water leakage or contamination causing potential structural or hygiene issues.';
    } else {
      priority = 'Low';
      reason = 'Standard plumbing maintenance or dripping tap.';
    }
  } else if (
    text.includes('projector') ||
    text.includes('screen') ||
    text.includes('speaker') ||
    text.includes('mic') ||
    text.includes('bench') ||
    text.includes('desk') ||
    text.includes('board') ||
    text.includes('chair') ||
    text.includes('podium')
  ) {
    category = 'Classroom';
    if (text.includes('exam') || text.includes('lecture') || text.includes('class')) {
      priority = 'High';
      reason = 'Essential classroom equipment needed for scheduled academic lectures.';
    } else {
      priority = 'Medium';
      reason = 'Classroom infrastructure repair needed.';
    }
  } else if (
    text.includes('dust') ||
    text.includes('clean') ||
    text.includes('garbage') ||
    text.includes('trash') ||
    text.includes('smell') ||
    text.includes('waste')
  ) {
    category = 'Cleanliness';
    priority = text.includes('hazard') || text.includes('urgent') ? 'Medium' : 'Low';
    reason = 'Housekeeping and sanitation maintenance requested.';
  } else if (
    text.includes('computer') ||
    text.includes('pc') ||
    text.includes('printer') ||
    text.includes('scanner') ||
    text.includes('device') ||
    text.includes('monitor')
  ) {
    category = 'Equipment';
    priority = text.includes('exam') || text.includes('all') ? 'High' : 'Medium';
    reason = 'Campus laboratory or departmental computer hardware issue.';
  }

  return { category, priority, reason };
};

/**
 * Predict category & priority from description
 */
const analyzeIssue = async (description = '') => {
  // If external API key exists, attempt calling it
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      // Future integration hook for Gemini or OpenAI
      // const response = await callGeminiAPI(description);
      // return response;
    } catch (err) {
      console.warn('[AI Service] External API call failed, safely falling back to campus heuristic engine:', err.message);
    }
  }

  // Robust, instant local heuristic engine
  return fallbackAnalyzeIssue(description);
};

/**
 * Generate high-level insights for administrators based on actual database metrics
 */
const generateInsights = async (analyticsData) => {
  const {
    totalIssues = 0,
    pending = 0,
    highPriority = 0,
    resolutionRate = 0,
    issuesByCategory = {},
    issuesByStatus = {},
    filters = {},
  } = analyticsData;

  const insights = [];

  const filterParts = [
    filters.category && filters.category !== 'All' ? `Category: ${filters.category}` : null,
    filters.department && filters.department !== 'All' ? `Dept: ${filters.department}` : null,
    filters.status && filters.status !== 'All' ? `Status: ${filters.status}` : null,
    filters.dateRange === '7d' ? 'Last 7 Days' : filters.dateRange === '30d' ? 'Last 30 Days' : filters.dateRange === '90d' ? 'Last 90 Days' : null,
  ].filter(Boolean);

  const scopeLabel = filterParts.length > 0 ? `Filtered View (${filterParts.join(', ')})` : 'Campus-Wide Overview';

  // Handle zero-record dataset gracefully
  if (totalIssues === 0) {
    return {
      summary: `No complaint records found matching ${scopeLabel}. Operational area is currently clear.`,
      generatedAt: new Date().toISOString(),
      insights: [
        {
          type: 'empty_scope',
          title: `Zero Issues Found (${scopeLabel})`,
          detail: 'No complaints or maintenance records match the currently selected filter parameters. Try widening the date range or choosing All Categories.',
          urgency: 'Low',
        },
      ],
    };
  }

  // Top category concentration within current filtered scope
  let topCategory = 'None';
  let topCategoryCount = 0;
  for (const [cat, count] of Object.entries(issuesByCategory)) {
    if (count > topCategoryCount) {
      topCategory = cat;
      topCategoryCount = count;
    }
  }

  if (topCategoryCount > 0) {
    const catPercent = Math.round((topCategoryCount / totalIssues) * 100);
    insights.push({
      type: 'category_trend',
      title: `${topCategory} Concentration (${scopeLabel})`,
      detail: `${topCategory} represents ${catPercent}% (${topCategoryCount} of ${totalIssues}) of recorded tickets in this scope. Suggest prioritizing support staff allocation to ${topCategory} maintenance.`,
      urgency: catPercent >= 40 ? 'High' : 'Medium',
    });
  }

  // High priority ratio
  if (highPriority > 0) {
    const highRatio = Math.round((highPriority / totalIssues) * 100);
    insights.push({
      type: 'priority_warning',
      title: `Critical Escalation Alert (${highRatio}% High Priority)`,
      detail: `${highPriority} of ${totalIssues} tickets in this scope are marked High Priority. Immediate inspection recommended to prevent operational or safety disruptions.`,
      urgency: highRatio > 25 ? 'High' : 'Medium',
    });
  }

  // Pending vs Resolution performance
  if (pending > 0 && resolutionRate < 60) {
    insights.push({
      type: 'backlog_alert',
      title: `Backlog Action Required (${pending} Tickets Pending)`,
      detail: `Current resolution rate is ${resolutionRate}%, with ${pending} tickets awaiting action. Recommend reassigning unallocated staff to clear the queue.`,
      urgency: 'High',
    });
  } else if (resolutionRate >= 70) {
    insights.push({
      type: 'performance_positive',
      title: `Healthy Resolution Velocity (${resolutionRate}% Resolved)`,
      detail: `Maintenance teams are maintaining a ${resolutionRate}% resolution rate across this operational slice. Ticket turnover aligns with campus performance targets.`,
      urgency: 'Low',
    });
  }

  return {
    summary: `Data-grounded analysis for ${scopeLabel}: ${totalIssues} tickets analyzed. Operational state: ${pending > 5 || highPriority > 3 ? 'ATTENTION REQUIRED' : 'STABLE'}.`,
    generatedAt: new Date().toISOString(),
    insights,
  };
};

module.exports = {
  analyzeIssue,
  generateInsights,
};
