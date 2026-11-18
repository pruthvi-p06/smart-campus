const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Resource = require('../models/Resource');

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 8;

/**
 * Live Data Integration:
 * Extracts relevant application data from MongoDB based on user query and role.
 * Strictly enforces that:
 * - Staff can ONLY query tasks assigned to them (never department-wide or campus-wide).
 * - Students can ONLY query complaints they reported (never department-wide or campus-wide).
 * - Admins have managerial access to department, category, unassigned, and campus-wide analytics.
 * - Guests must log in to view any issue data.
 */
const fetchCampusDataContext = async (message, user) => {
  try {
    const text = message.toLowerCase();

    // Helper: extract status filter
    let statusFilter = null;
    if (/\bpending\b/i.test(text)) statusFilter = 'Pending';
    else if (/\bin progress\b|\bprogress\b/i.test(text)) statusFilter = 'In Progress';
    else if (/\bresolved\b|\bcompleted\b/i.test(text)) statusFilter = 'Resolved';

    // Helper: extract priority filter
    let priorityFilter = null;
    if (/\bhigh priority\b|\bhigh\b|\burgent\b|\bcritical\b/i.test(text)) priorityFilter = 'High';
    else if (/\bmedium priority\b|\bmedium\b/i.test(text)) priorityFilter = 'Medium';
    else if (/\blow priority\b|\blow\b/i.test(text)) priorityFilter = 'Low';

    // Helper: extract department mention
    const deptMatch =
      text.match(/\b(ece|cse|it|eee|mech|mechanical|civil|hostel|library|canteen|admin|maintenance|accounts|physics|chemistry|biotech)\b/i) ||
      text.match(/(?:in|of|for|about)\s+([a-zA-Z0-9\s_-]+?)\s+(?:dept|department)/i);
    const mentionedDept = deptMatch ? (deptMatch[1] || deptMatch[0]).trim() : null;

    // Helper: extract category mention
    const catMatch = text.match(
      /\b(electrical|plumbing|wifi|internet|furniture|cleaning|sanitation|ac|projector|lab|software|infrastructure)\b/i
    );
    const mentionedCategory = catMatch ? catMatch[0].trim() : null;

    // Helper: check if query is asking for campus-wide / broad overview
    const isCampusWideQuery =
      /\b(all issues|all complaints|all tickets|campus-wide|all departments|system overview|all users|invite code|everything)\b/i.test(
        text
      );

    // ==============================================================
    // 1. ROLE: STAFF TECHNICIAN
    // ==============================================================
    if (user?.role === 'staff') {
      const isSelfInquiry =
        /\b(my|mine|to me|for me|my queue|my workload|my tasks?|my issues?|my tickets?|assigned to me|allotted to me|i need to|i have to|i should|should i|i am assigned|what do i|what should i|for me to|can i fix|can i resolve|i must|do i have)\b/i.test(
          text
        );

      // GUARD: If staff asks for department-wide issues, category-wide issues, or campus-wide issues WITHOUT self-intent:
      if (!isSelfInquiry && (mentionedDept || mentionedCategory || isCampusWideQuery)) {
        const target = mentionedDept
          ? `${mentionedDept.toUpperCase()} department`
          : mentionedCategory
            ? `${mentionedCategory} category`
            : 'campus-wide';
        return {
          type: 'restricted',
          summary: `Access Restricted: As a staff technician, you cannot view all issues for ${target}. Your access is strictly restricted to tasks assigned directly to your personal queue under Assigned Issues.`,
        };
      }

      // Query staff's assigned tasks
      if (
        isSelfInquiry ||
        /issue|issues|task|tasks|assigned|pending|progress|resolved|priority|workload|to do|maintenance|queue/i.test(
          text
        )
      ) {
        const baseFilter = { assignedTo: user._id };
        const queryFilter = { assignedTo: user._id };

        if (statusFilter) queryFilter.status = statusFilter;
        if (priorityFilter) queryFilter.priority = priorityFilter;
        if (mentionedCategory) queryFilter.category = new RegExp(mentionedCategory, 'i');
        if (mentionedDept) {
          queryFilter.$or = [
            { department: new RegExp(mentionedDept, 'i') },
            { location: new RegExp(mentionedDept, 'i') },
            { title: new RegExp(mentionedDept, 'i') },
          ];
        }

        const [totalAssigned, matchingCount, matchingIssues, pendingCount, inProgressCount, resolvedCount] =
          await Promise.all([
            Issue.countDocuments(baseFilter),
            Issue.countDocuments(queryFilter),
            Issue.find(queryFilter)
              .sort({ createdAt: -1 })
              .limit(5)
              .select('title category location status priority description department'),
            Issue.countDocuments({ ...baseFilter, status: 'Pending' }),
            Issue.countDocuments({ ...baseFilter, status: 'In Progress' }),
            Issue.countDocuments({ ...baseFilter, status: 'Resolved' }),
          ]);

        const filterLabels = [
          mentionedDept ? `${mentionedDept.toUpperCase()}` : '',
          mentionedCategory ? `${mentionedCategory}` : '',
          priorityFilter ? `${priorityFilter} Priority` : '',
          statusFilter ? `${statusFilter}` : '',
        ].filter(Boolean);

        const filterDesc = filterLabels.join(' & ') || 'All Assigned';

        if (matchingCount === 0) {
          return {
            type: 'staff_tasks',
            total: 0,
            filterDesc,
            totalAssigned,
            pendingCount,
            inProgressCount,
            resolvedCount,
            sampleIssues: [],
            summary: `Staff technician ${user.name || ''} has 0 tasks matching "${filterDesc}" assigned to their queue. (Overall queue: ${totalAssigned} total — ${pendingCount} Pending, ${inProgressCount} In Progress, ${resolvedCount} Resolved).`,
          };
        }

        const details = matchingIssues
          .map(
            (iss, i) =>
              `  ${i + 1}. "${iss.title}" [${iss.category || 'General'}] at ${iss.location || 'Campus'} — Status: ${iss.status}, Priority: ${iss.priority}`
          )
          .join('\n');

        return {
          type: 'staff_tasks',
          total: matchingCount,
          filterDesc,
          totalAssigned,
          pendingCount,
          inProgressCount,
          resolvedCount,
          sampleIssues: matchingIssues,
          summary: `Staff technician ${user.name || ''} has ${matchingCount} task(s) matching "${filterDesc}" in their queue:\n${details}\n(Overall queue: ${totalAssigned} total — ${pendingCount} Pending, ${inProgressCount} In Progress, ${resolvedCount} Resolved)`,
        };
      }

      // Check facility resources if asked
      if (/resource|facility|facilities|lab|hall|auditorium|availability/i.test(text)) {
        const resources = await Resource.find({}).limit(6).select('name category location status');
        if (resources.length) {
          const resText = resources
            .map((r, i) => `${i + 1}. ${r.name} (${r.category}, ${r.location}) — Status: ${r.status}`)
            .join('\n');
          return {
            type: 'resources',
            total: resources.length,
            summary: `Campus Resources Overview:\n${resText}`,
            items: resources,
          };
        }
      }

      // Staff queries NEVER fall through to Admin analytics
      return null;
    }

    // ==============================================================
    // 2. ROLE: STUDENT
    // ==============================================================
    if (user?.role === 'student') {
      const isSelfInquiry =
        /\b(my|mine|for me|to me|submitted by me|reported by me|raised by me|filed by me|i filed|i reported|i submitted|i raised|i complained|what did i|what have i|do i have|i have in|can i check)\b/i.test(
          text
        );

      // GUARD: If student asks for department-wide issues, category-wide issues, or admin/staff data WITHOUT self-intent:
      if (!isSelfInquiry && (mentionedDept || mentionedCategory || isCampusWideQuery || /unassigned|staff issues|technicians?|workload|reassign|invite code|user list|all users|metrics|breakdown|velocity/i.test(text))) {
        const target = mentionedDept
          ? `${mentionedDept.toUpperCase()} department`
          : mentionedCategory
            ? `${mentionedCategory} category`
            : 'department-wide or campus-wide';
        return {
          type: 'restricted',
          summary: `Access Restricted: As a student, you cannot view ${target} complaints. Your access is strictly scoped to complaints you personally reported under My Issues.`,
        };
      }

      // Query student's reported complaints
      if (
        isSelfInquiry ||
        /issue|issues|complaint|complaints|ticket|tickets|my|status|pending|resolved|progress|report|update|updates|note|notes|remark/i.test(
          text
        )
      ) {
        const baseFilter = { reportedBy: user._id };
        const queryFilter = { reportedBy: user._id };

        if (statusFilter) queryFilter.status = statusFilter;
        if (priorityFilter) queryFilter.priority = priorityFilter;
        if (mentionedCategory) queryFilter.category = new RegExp(mentionedCategory, 'i');
        if (mentionedDept) {
          queryFilter.$or = [
            { department: new RegExp(mentionedDept, 'i') },
            { location: new RegExp(mentionedDept, 'i') },
            { title: new RegExp(mentionedDept, 'i') },
          ];
        }

        const [totalReported, matchingCount, matchingIssues, pendingCount, inProgressCount, resolvedCount] =
          await Promise.all([
            Issue.countDocuments(baseFilter),
            Issue.countDocuments(queryFilter),
            Issue.find(queryFilter)
              .sort({ createdAt: -1 })
              .limit(5)
              .select('title category location status priority createdAt resolutionNote adminNote assignedTo')
              .populate('assignedTo', 'name department'),
            Issue.countDocuments({ ...baseFilter, status: 'Pending' }),
            Issue.countDocuments({ ...baseFilter, status: 'In Progress' }),
            Issue.countDocuments({ ...baseFilter, status: 'Resolved' }),
          ]);

        const filterLabels = [
          mentionedDept ? `${mentionedDept.toUpperCase()}` : '',
          mentionedCategory ? `${mentionedCategory}` : '',
          priorityFilter ? `${priorityFilter} Priority` : '',
          statusFilter ? `${statusFilter}` : '',
        ].filter(Boolean);

        const filterDesc = filterLabels.join(' & ') || 'All Reported';

        if (matchingCount === 0) {
          return {
            type: 'student_issues',
            total: 0,
            filterDesc,
            totalReported,
            pendingCount,
            inProgressCount,
            resolvedCount,
            sampleIssues: [],
            summary: `Student ${user.name || ''} has 0 complaints matching "${filterDesc}". (Overall reported: ${totalReported} total — ${pendingCount} Pending, ${inProgressCount} In Progress, ${resolvedCount} Resolved).`,
          };
        }

        const details = matchingIssues
          .map((iss, i) => {
            const staffAssigned = iss.assignedTo?.name
              ? `Assigned Staff: ${iss.assignedTo.name}`
              : 'Technician: Pending assignment';
            const updateText = iss.resolutionNote
              ? `Staff Note: "${iss.resolutionNote}"`
              : iss.status === 'Resolved'
                ? 'Marked Resolved by technician'
                : iss.status === 'In Progress'
                  ? 'Technician is actively working on this issue'
                  : 'Awaiting inspection';
            return `  ${i + 1}. "${iss.title}" [${iss.category || 'General'}] at ${iss.location || 'Campus'} — Status: ${iss.status}, Priority: ${iss.priority} | ${staffAssigned} | ${updateText}`;
          })
          .join('\n');

        return {
          type: 'student_issues',
          total: matchingCount,
          filterDesc,
          totalReported,
          pendingCount,
          inProgressCount,
          resolvedCount,
          sampleIssues: matchingIssues,
          summary: `Student ${user.name || ''} has ${matchingCount} complaint(s) matching "${filterDesc}":\n${details}\n(Overall reported: ${totalReported} total — ${pendingCount} Pending, ${inProgressCount} In Progress, ${resolvedCount} Resolved)`,
        };
      }

      // Check facility resources if asked
      if (/resource|facility|facilities|lab|hall|auditorium|availability/i.test(text)) {
        const resources = await Resource.find({}).limit(6).select('name category location status');
        if (resources.length) {
          const resText = resources
            .map((r, i) => `${i + 1}. ${r.name} (${r.category}, ${r.location}) — Status: ${r.status}`)
            .join('\n');
          return {
            type: 'resources',
            total: resources.length,
            summary: `Campus Resources Overview:\n${resText}`,
            items: resources,
          };
        }
      }

      // Student queries NEVER fall through to Admin analytics
      return null;
    }

    // ==============================================================
    // 3. ROLE: ADMINISTRATOR (FULL CAMPUS-WIDE & FILTERED ANALYTICS)
    // ==============================================================
    if (user?.role === 'admin') {
      const isUnassignedQuery = /\bunassigned\b|\bnot assigned\b|\bwithout technician\b/i.test(text);

      const isAnalysisQuery =
        mentionedDept ||
        mentionedCategory ||
        statusFilter ||
        priorityFilter ||
        isUnassignedQuery ||
        isCampusWideQuery ||
        /analyse|analyze|analysis|summary|stats|overview|issues|breakdown|pending|report|trend|metrics|velocity|manage|managing/.test(
          text
        );

      if (isAnalysisQuery) {
        let filter = {};
        let scopeParts = [];

        if (mentionedDept) {
          filter.department = new RegExp(`^${mentionedDept}$`, 'i');
          scopeParts.push(`${mentionedDept.toUpperCase()} Dept`);
        }
        if (mentionedCategory) {
          filter.category = new RegExp(mentionedCategory, 'i');
          scopeParts.push(`${mentionedCategory} Category`);
        }
        if (priorityFilter) {
          filter.priority = priorityFilter;
          scopeParts.push(`${priorityFilter} Priority`);
        }
        if (statusFilter) {
          filter.status = statusFilter;
          scopeParts.push(`${statusFilter}`);
        }
        if (isUnassignedQuery) {
          filter.assignedTo = null;
          scopeParts.push('Unassigned');
        }

        const scopeLabel = scopeParts.length ? scopeParts.join(' — ') : 'Campus-Wide';

        let [total, pending, inProgress, resolved, highPriority, sampleIssues] =
          await Promise.all([
            Issue.countDocuments(filter),
            Issue.countDocuments({ ...filter, status: 'Pending' }),
            Issue.countDocuments({ ...filter, status: 'In Progress' }),
            Issue.countDocuments({ ...filter, status: 'Resolved' }),
            Issue.countDocuments({ ...filter, priority: 'High' }),
            Issue.find(filter)
              .sort({ createdAt: -1 })
              .limit(5)
              .select('title category department location status priority assignedTo')
              .populate('assignedTo', 'name'),
          ]);

        // Fallback loose match if department field was empty on documents
        if (total === 0 && mentionedDept) {
          const looseFilter = {
            $or: [
              { department: new RegExp(mentionedDept, 'i') },
              { location: new RegExp(mentionedDept, 'i') },
              { title: new RegExp(mentionedDept, 'i') },
            ],
          };
          if (priorityFilter) looseFilter.priority = priorityFilter;
          if (statusFilter) looseFilter.status = statusFilter;
          if (isUnassignedQuery) looseFilter.assignedTo = null;

          const looseTotal = await Issue.countDocuments(looseFilter);
          if (looseTotal > 0) {
            filter = looseFilter;
            [total, pending, inProgress, resolved, highPriority, sampleIssues] =
              await Promise.all([
                Issue.countDocuments(filter),
                Issue.countDocuments({ ...filter, status: 'Pending' }),
                Issue.countDocuments({ ...filter, status: 'In Progress' }),
                Issue.countDocuments({ ...filter, status: 'Resolved' }),
                Issue.countDocuments({ ...filter, priority: 'High' }),
                Issue.find(filter)
                  .sort({ createdAt: -1 })
                  .limit(5)
                  .select('title category department location status priority assignedTo')
                  .populate('assignedTo', 'name'),
              ]);
          }
        }

        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        const sampleText = sampleIssues.length
          ? sampleIssues
            .map((iss) => {
              const assigned = iss.assignedTo?.name
                ? `Assigned: ${iss.assignedTo.name}`
                : 'Unassigned';
              return `  - "${iss.title}" [${iss.category || 'General'}] at ${iss.location || 'Campus'} (${iss.priority} Priority, Status: ${iss.status}, ${assigned})`;
            })
            .join('\n')
          : '  (No matching tickets recorded in the system)';

        const summary = `Live Database Records for [${scopeLabel}]:
• Total Reported Issues: ${total}
• Status Breakdown: Pending: ${pending}, In Progress: ${inProgress}, Resolved: ${resolved}
• High Priority Issues: ${highPriority}
• Resolution Rate: ${resolutionRate}%
• Recent Tickets in Scope:
${sampleText}`;

        return {
          type: 'analytics',
          scopeLabel,
          total,
          pending,
          inProgress,
          resolved,
          highPriority,
          resolutionRate,
          sampleIssues,
          summary,
        };
      }

      // Check facility resources if asked
      if (/resource|facility|facilities|lab|hall|auditorium|availability/i.test(text)) {
        const resources = await Resource.find({}).limit(6).select('name category location status');
        if (resources.length) {
          const resText = resources
            .map((r, i) => `${i + 1}. ${r.name} (${r.category}, ${r.location}) — Status: ${r.status}`)
            .join('\n');
          return {
            type: 'resources',
            total: resources.length,
            summary: `Campus Resources Overview:\n${resText}`,
            items: resources,
          };
        }
      }
    }

    // ==============================================================
    // 4. UNATHENTICATED GUEST
    // ==============================================================
    if (!user) {
      if (/resource|facility|facilities|lab|hall|auditorium|availability/i.test(text)) {
        const resources = await Resource.find({}).limit(6).select('name category location status');
        if (resources.length) {
          const resText = resources
            .map((r, i) => `${i + 1}. ${r.name} (${r.category}, ${r.location}) — Status: ${r.status}`)
            .join('\n');
          return {
            type: 'resources',
            total: resources.length,
            summary: `Campus Resources Overview:\n${resText}`,
            items: resources,
          };
        }
      }

      if (/issue|issues|complaint|complaints|ticket|tickets/i.test(text)) {
        return {
          type: 'restricted',
          summary: 'Authentication Required: Campus issue tracking and complaint records require an active account. Please log in with your Student, Staff, or Admin credentials.',
        };
      }
    }

    return null;
  } catch (err) {
    console.error('[Campus Chatbot] Error retrieving context data:', err.message);
    return null;
  }
};

const buildCampusSystemInstruction = (user, dataContext) => {
  let roleScope =
    'The user is an unauthenticated campus visitor. Guide them generally on registration, login, and what SmartCampus does.';

  if (user) {
    if (user.role === 'admin') {
      roleScope = `The user is an authenticated ADMINISTRATOR (${user.name || 'Admin'}). You can assist them with campus-wide operations: interpreting analytics & KPIs, assigning pending issues to staff technicians, managing user accounts, and managing campus resources.`;
    } else if (user.role === 'staff') {
      roleScope = `The user is an authenticated STAFF TECHNICIAN (${user.name || 'Staff'}, Department: ${user.department || 'Maintenance'}). Assist them strictly with tasks assigned directly to their queue, updating issue resolution notes, and managing resources. STRICT PRIVACY RULE: If staff asks for department-wide issues (e.g. 'tell all issues of ECE dept') or campus-wide issues, you MUST refuse and state that staff can only view tasks assigned directly to them. Never present their personal queue as the department's issues.`;
    } else {
      roleScope = `The user is an authenticated STUDENT (${user.name || 'Student'}). Guide them on student features: submitting campus complaints/issues, tracking their status in My Issues, viewing staff resolution updates, and checking resource availability. STRICT PRIVACY RULE: If a student asks for department-wide issues or campus-wide issues, you MUST refuse and state that students can only view their own reported complaints.`;
    }
  }

  let prompt = `You are the SmartCampus Assistant for a college campus issue and resource management web application. Be friendly, concise, practical, and strictly maintain role-based boundaries.
Role Context: ${roleScope}

Rules:
1. Strict Role Boundary:
   - Staff only see tasks assigned to them; never department-wide or campus-wide logs.
   - Students only see their own submitted complaints; never department-wide or campus-wide logs.
   - Admins see managerial campus-wide and department-specific analytics.
2. Anti-Hallucination Guardrail: When answering questions about issues or statistics, rely exclusively on the Live Application Data Records provided below. Do not invent arbitrary numbers.
3. Off-Topic Refusal: If a query is unrelated to campus or SmartCampus (such as weather, general trivia, movies, sports, jokes), politely decline and redirect to campus assistance.
4. Life Safety: If a situation involves immediate danger (fire, exposed electric wiring, serious injury), advise contacting campus security or emergency services immediately.`;

  if (dataContext?.summary) {
    prompt += `\n\nLive Application Data Records from MongoDB:\n${dataContext.summary}\n\nInstructions: Answer the user's inquiry directly using these records. Respect role boundaries strictly. If dataContext indicates Access Restricted, clearly inform the user of the restriction.`;
  }

  return prompt;
};

const getFallbackReply = (message, user = null, dataContext = null) => {
  const text = message.toLowerCase();

  // Guardrail against off-topic queries
  if (/weather|cricket|football|movie|song|recipe|joke|capital of|who is the president/.test(text)) {
    return 'I am the SmartCampus AI assistant dedicated exclusively to campus operations and issues. I cannot answer general trivia or off-campus queries like the weather. How can I assist you with the campus platform?';
  }

  // 1. Access Restriction Guard
  if (dataContext?.type === 'restricted') {
    return `🔒 ${dataContext.summary}`;
  }

  // 2. Staff Assigned Tasks (Strictly scoped to that staff member's queue)
  if (dataContext?.type === 'staff_tasks') {
    const { total, filterDesc, totalAssigned, pendingCount, inProgressCount, resolvedCount, sampleIssues } = dataContext;

    if (total === 0) {
      return `🔧 Assigned Maintenance Queue (${filterDesc}):
You currently have 0 tasks matching "${filterDesc}" assigned to your queue.
(Your overall queue: ${totalAssigned} total — ${pendingCount} Pending, ${inProgressCount} In Progress, ${resolvedCount} Resolved).

💡 Tip: Open "Assigned Issues" from your dashboard to review tasks that require your attention.`;
    }

    const sampleList = sampleIssues
      .map(
        (iss, i) =>
          `  ${i + 1}. "${iss.title}" [${iss.category || 'General'}] at ${iss.location || 'Campus'} — Status: ${iss.status}, Priority: ${iss.priority}`
      )
      .join('\n');

    return `🔧 Your Assigned Tasks (${filterDesc}):
• Matching Tasks in Your Queue: ${total}
• Overall Workload: ${pendingCount} Pending | ${inProgressCount} In Progress | ${resolvedCount} Resolved

Tasks:
${sampleList}

💡 Next Step: When you begin work on a task, change its status to "In Progress" in the Assigned Issues dashboard, and submit resolution notes once finished.`;
  }

  // 3. Student Reported Issues (Strictly scoped to that student's reported tickets)
  if (dataContext?.type === 'student_issues') {
    const { total, filterDesc, totalReported, pendingCount, inProgressCount, resolvedCount, sampleIssues } = dataContext;

    if (total === 0) {
      return `📋 Your Reported Complaints (${filterDesc}):
You currently have 0 complaints matching "${filterDesc}".
(Overall complaint history: ${totalReported} total — ${pendingCount} Pending, ${inProgressCount} In Progress, ${resolvedCount} Resolved).

💡 Need to report an issue? Open "Report Issue" from your student dashboard.`;
    }

    const sampleList = sampleIssues
      .map((iss, i) => {
        const staffAssigned = iss.assignedTo?.name
          ? `\n     👷 Assigned Staff: ${iss.assignedTo.name}`
          : '\n     👷 Assigned Staff: Pending technician assignment';

        const updateRemark = iss.resolutionNote
          ? `\n     💬 Staff Remark: "${iss.resolutionNote}"`
          : iss.status === 'In Progress'
            ? '\n     🔄 Status Update: A technician is currently working on this issue.'
            : iss.status === 'Resolved'
              ? '\n     ✅ Status Update: Issue marked resolved by staff.'
              : '\n     ⏳ Status Update: Ticket submitted, waiting for technician assignment.';

        return `  ${i + 1}. "${iss.title}" [${iss.category || 'General'}] at ${iss.location || 'Campus'}
     Status: ${iss.status} | Priority: ${iss.priority}${staffAssigned}${updateRemark}`;
      })
      .join('\n\n');

    return `📋 Your Reported Issues (${filterDesc}):
• Matching Complaints: ${total}
• Your Overall Complaints: ${pendingCount} Pending | ${inProgressCount} In Progress | ${resolvedCount} Resolved

Complaints & Staff Updates:
${sampleList}

💡 You can view full history and attach further details under the "My Issues" tab on your dashboard.`;
  }

  // 4. Data-Grounded Analytics Report (Only for Administrators)
  if (dataContext?.type === 'analytics') {
    const { scopeLabel, total, pending, inProgress, resolved, highPriority, resolutionRate, sampleIssues } = dataContext;

    if (total === 0) {
      return `📊 Analysis for ${scopeLabel}:
No reported issues currently recorded under ${scopeLabel} in the campus database. All systems appear to be operating normally for this area.`;
    }

    const sampleList = sampleIssues.length
      ? sampleIssues
        .map((iss) => {
          const assigned = iss.assignedTo?.name
            ? `Assigned: ${iss.assignedTo.name}`
            : 'Unassigned';
          return `  • "${iss.title}" [${iss.category || 'General'}] at ${iss.location || 'Campus'} — Status: ${iss.status}, Priority: ${iss.priority} (${assigned})`;
        })
        .join('\n')
      : '  • No recent tickets available.';

    const recommendation =
      highPriority > 0
        ? `⚠️ Urgent Action: Prioritize assigning the ${highPriority} high-priority ticket(s) to staff technicians immediately.`
        : pending > 0
          ? `💡 Operational Suggestion: Review and assign the ${pending} pending ticket(s) to improve the current ${resolutionRate}% resolution rate.`
          : `✅ Optimal Performance: All tickets in ${scopeLabel} have been addressed or resolved.`;

    return `📊 Issue Analysis for ${scopeLabel}:
• Total Issues: ${total}
• Status Breakdown: Pending: ${pending} | In Progress: ${inProgress} | Resolved: ${resolved}
• High Priority: ${highPriority}
• Resolution Rate: ${resolutionRate}%

Recent Tickets in Scope:
${sampleList}

${recommendation}`;
  }

  // 5. Resource Overview
  if (dataContext?.type === 'resources') {
    return `🏛 Campus Resources Overview:
${dataContext.summary}

Visit the Resources tab in your dashboard to view complete availability schedules and book facilities.`;
  }

  // 6. Role-tailored Greetings
  if (/hello|hi\b|hey\b|good morning|good afternoon/.test(text)) {
    if (user?.role === 'admin') {
      return `Hello Administrator ${user.name || ''}! How can I assist you today with campus analytics, ticket assignments, or issue management?`;
    }
    if (user?.role === 'staff') {
      return `Hello ${user.name || 'Staff Member'}! How can I assist you with your assigned maintenance tickets or department resources?`;
    }
    if (user) {
      return `Hello ${user.name || ''}! How can I help you with reporting an issue or checking campus resources?`;
    }
    return 'Hello! Welcome to SmartCampus. I can guide you through reporting campus issues, tracking requests, using resources and navigating the student, staff or admin areas. What would you like help with?';
  }

  // 7. Common platform actions
  if (/report|raise|submit|new complaint|new issue/.test(text)) {
    return 'To report a campus issue, open Report Issue from your student dashboard. Provide a clear title, category, location, and description. You can also attach an image to help technicians locate and resolve the issue quickly.';
  }

  if (/track|status|my issue|my complaint|progress/.test(text)) {
    return 'Sign in and open My Issues from the student dashboard. Select a request to view its details and current status. The usual stages are Pending, In Progress, and Resolved.';
  }

  if (/priority|urgent|emergency|danger|fire|electric shock/.test(text)) {
    return 'When reporting an issue, describe its impact clearly so the campus team can assess its priority. If there is immediate danger, such as fire, exposed live wiring or a serious injury, do not wait for an app response—contact campus security or local emergency services directly.';
  }

  // Role-boundary restrictions in general inquiries
  if (user?.role === 'student') {
    if (/assign|technician|staff queue|workload|reassign/.test(text)) {
      return 'Technician assignments are managed by campus administrators and staff supervisors. As a student, you can track the status of your assigned technician and view resolution notes directly in the My Issues tab.';
    }
    if (/admin|administrator|analytics|kpi|statistics|all users|invite code/.test(text)) {
      return 'Administrative oversight, user account management, and campus-wide analytics are restricted to administrators. Students have access to Report Issue, My Issues, and campus Resources.';
    }
  }

  if (user?.role === 'staff') {
    if (/assign ticket|admin|administrator|analytics|all users|invite code/.test(text)) {
      return 'System-wide analytics, user credentials, and ticket reassignment are administrator functions. Staff technicians manage tasks assigned directly to their queue under Assigned Issues.';
    }
  }

  return user?.role === 'admin'
    ? 'I can assist with admin workflows: reviewing department-specific issue analysis, managing campus issues, and assigning technicians. Ask me to "analyse issues in ECE dept" or "overview of pending issues".'
    : user?.role === 'staff'
      ? 'I can assist with your assigned maintenance workload. Ask me "what issues are pending?", "my high priority tasks", or "campus resources".'
      : 'I can assist with SmartCampus basics: reporting an issue, tracking ticket status, and checking campus resources. What do you need help with?';
};

const askCampusAssistant = async (req, res) => {
  try {
    const message =
      typeof req.body?.message === 'string'
        ? req.body.message.trim()
        : '';

    if (!message) {
      return res.status(400).json({
        message: 'Please enter a message.',
      });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      });
    }

    // Determine current user if Authorization token is provided
    let currentUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token && process.env.JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded?.id) {
            currentUser = await User.findById(decoded.id).select('name role department status');
          }
        } catch {
          // Token invalid or expired - proceed as unauthenticated guest
        }
      }
    }

    // Fetch relevant live application data from MongoDB
    const dataContext = await fetchCampusDataContext(message, currentUser);

    const history = Array.isArray(req.body?.history)
      ? req.body.history
        .slice(-MAX_HISTORY_ITEMS)
        .filter(
          (item) =>
            item &&
            ['user', 'assistant'].includes(item.role) &&
            typeof item.text === 'string'
        )
      : [];

    let geminiFailed = false;
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey) {
      const contents = history
        .map((item) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [
            {
              text: item.text.slice(0, MAX_MESSAGE_LENGTH),
            },
          ],
        }))
        .filter((item) => item.parts[0].text.trim());

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Candidate fallback list: configured model -> latest active flash models
      const candidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-flash-lite-latest',
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
      ].filter(Boolean);

      const uniqueModels = [...new Set(candidateModels)];

      for (const model of uniqueModels) {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
          controller.abort();
        }, 20000);

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
              model
            )}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              signal: controller.signal,
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [
                    {
                      text: buildCampusSystemInstruction(currentUser, dataContext),
                    },
                  ],
                },
                contents,
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 600,
                },
              }),
            }
          );

          const data = await response.json().catch(() => ({}));

          if (response.ok) {
            const reply = data.candidates?.[0]?.content?.parts
              ?.map((part) => part.text || '')
              .join('')
              .trim();

            if (reply) {
              return res.status(200).json({
                reply,
                provider: 'gemini',
              });
            }
          }

          console.error(
            `[Campus Chatbot] Gemini (${model}) response ${response.status}:`,
            data.error?.message || 'Empty candidate response'
          );
        } catch (error) {
          console.error(
            `[Campus Chatbot] Gemini (${model}) request failed:`,
            error.name === 'AbortError' ? 'Request timed out' : error.message
          );
        } finally {
          clearTimeout(timeout);
        }
      }

      geminiFailed = true;
    }

    // Grounded fallback response if Gemini is offline, key is absent, or free tier exhausted
    return res.status(200).json({
      reply: getFallbackReply(message, currentUser, dataContext),
      provider: dataContext ? 'campus-analytics-engine' : 'campus-guide',
      notice: geminiFailed
        ? 'Operating in SmartCampus Grounded Mode (Direct MongoDB Analytics).'
        : undefined,
    });
  } catch (error) {
    console.error('[Campus Chatbot] Error:', error.message);

    return res.status(500).json({
      message:
        'The campus assistant could not process that message. Please try again.',
    });
  }
};

module.exports = { askCampusAssistant };
