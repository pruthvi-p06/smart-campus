const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 8;

const CAMPUS_SYSTEM_INSTRUCTION = `You are the SmartCampus Assistant for a college campus issue and resource management web application. Be friendly, concise, practical, and easy for students and staff to understand. Help users navigate SmartCampus, explain how to register and log in, report and track campus issues, understand issue statuses, use resources, and explain the roles of students, staff, and administrators. Do not claim to have accessed a user's account, complaint, personal records, or live campus database. Do not invent campus-specific phone numbers, office hours, policies, locations, or guarantees. If a user needs account-specific help, ask them to sign in and check the relevant dashboard or contact their campus administrator. If a situation involves immediate danger, advise them to contact campus security or local emergency services directly. If a question is unrelated to campus or the SmartCampus platform, politely steer the conversation back to campus support.`;

const getFallbackReply = (message) => {
  const text = message.toLowerCase();

  if (/hello|hi\b|hey\b|good morning|good afternoon/.test(text)) {
    return 'Hello! Welcome to SmartCampus. I can guide you through reporting campus issues, tracking requests, using resources and navigating the student, staff or admin areas. What would you like help with?';
  }
  if (/report|raise|submit|new complaint|new issue/.test(text)) {
    return 'To report a campus issue, sign in with your student account and open Report Issue from your dashboard. Add a clear title, category, location and description, attach an image if useful, and submit. You can then follow its status under My Issues.';
  }
  if (/track|status|my issue|my complaint|progress/.test(text)) {
    return 'Sign in and open My Issues from the student dashboard. Select a request to view its details and current status. The usual stages are Pending, In Progress and Resolved.';
  }
  if (/register|sign up|create account/.test(text)) {
    return 'Choose Get started or Register on the landing page and complete the registration form. After creating your account, use your registered email and password to log in. Your access depends on the role assigned to your account.';
  }
  if (/login|sign in|password/.test(text)) {
    return 'Use the Log in button and enter your registered email and password. If you cannot access your account, check your credentials or contact your campus administrator for account assistance.';
  }
  if (/staff|assign|technician/.test(text)) {
    return 'Staff members can open their staff dashboard to view issues assigned to them, open an issue for details and update its progress. Assignment and staff-account management are handled by an administrator.';
  }
  if (/admin|administrator|analytics|users/.test(text)) {
    return 'The admin workspace is used to manage users, review and assign reported issues, manage campus resources and view operational analytics. Admin access is restricted to accounts with the administrator role.';
  }
  if (/resource|facility|facilities/.test(text)) {
    return 'Open Resources from your signed-in dashboard to view the campus resources available in the system. Availability and details depend on the information maintained by your campus administrator.';
  }
  if (/priority|urgent|emergency|danger|fire|electric shock/.test(text)) {
    return 'When reporting an issue, describe its impact clearly so the campus team can assess its priority. If there is immediate danger, such as fire, exposed live wiring or a serious injury, do not wait for an app response—contact campus security or local emergency services directly.';
  }

  return 'I can help with SmartCampus basics: registering and logging in, reporting an issue, tracking its status, campus resources, staff workflows and admin features. Tell me which one you need help with. For account-specific or live ticket information, please sign in and check your dashboard.';
};

const askCampusAssistant = async (req, res) => {
  try {
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ message: 'Please enter a message.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
    }

    const history = Array.isArray(req.body.history)
      ? req.body.history.slice(-MAX_HISTORY_ITEMS).filter((item) =>
          item && ['user', 'assistant'].includes(item.role) && typeof item.text === 'string'
        )
      : [];

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
      try {
        const contents = history
          .map((item) => ({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text.slice(0, MAX_MESSAGE_LENGTH) }],
          }))
          .filter((item) => item.parts[0].text.trim());
        contents.push({ role: 'user', parts: [{ text: message }] });

        const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY.trim(),
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: CAMPUS_SYSTEM_INSTRUCTION }] },
            contents,
            generationConfig: { temperature: 0.5, maxOutputTokens: 500 },
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || `Gemini request failed (${response.status})`);
        }
        const reply = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || '')
          .join('')
          .trim();
        if (!reply) throw new Error('Gemini returned an empty response.');

        return res.status(200).json({ reply, provider: 'gemini' });
      } catch (error) {
        console.error('[Campus Chatbot] Gemini request failed; using campus guide fallback:', error.message);
      }
    }

    return res.status(200).json({
      reply: getFallbackReply(message),
      provider: 'campus-guide',
      notice: process.env.GEMINI_API_KEY ? 'AI service temporarily unavailable; returned a campus guide response.' : 'Add GEMINI_API_KEY to backend/.env to enable Gemini-powered replies.',
    });
  } catch (error) {
    console.error('[Campus Chatbot] Error:', error.message);
    return res.status(500).json({ message: 'The campus assistant could not process that message. Please try again.' });
  }
};

module.exports = { askCampusAssistant };
