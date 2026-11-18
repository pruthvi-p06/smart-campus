import { useEffect, useRef, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Bot, X, Send, Sparkles, RotateCcw, MessageCircle } from "lucide-react";
import { askCampusAssistant } from "../services/api";

const getStarterMessage = (user) => {
  if (!user) {
    return {
      role: "assistant",
      text: "Hi! I'm your SmartCampus assistant. I can help guide you through reporting campus issues, tracking requests, using campus resources or navigating the platform. What would you like to know?",
    };
  }
  if (user.role === "admin") {
    return {
      role: "assistant",
      text: `Welcome Administrator ${user.name || ""}. I am your Campus Admin Assistant. I can assist you with operational analytics, issue assignment workflows, user management, and campus resources.`,
    };
  }
  if (user.role === "staff") {
    return {
      role: "assistant",
      text: `Hello ${user.name || "Staff Member"}. I am your Staff Assistant. I can guide you through managing assigned maintenance tasks, updating issue resolution notes, and checking facility resources.`,
    };
  }
  return {
    role: "assistant",
    text: `Hi ${user.name || "Student"}! I'm your SmartCampus Assistant. I can help you report campus issues, track your submitted requests under My Issues, or check resource availability.`,
  };
};

const getRoleSuggestions = (role) => {
  if (role === "admin") {
    return [
      "Analyse issues in ECE dept",
      "Managing campus issues overview",
      "What high priority issues are pending?",
    ];
  }
  if (role === "staff") {
    return [
      "What tasks are assigned to me?",
      "What issues are pending in my queue?",
      "Campus resources status",
    ];
  }
  return [
    "What issues have I reported?",
    "How do I report a new issue?",
    "Campus resources status",
  ];
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function CampusChatbot() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [getStarterMessage(getCurrentUser())]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Session key uniquely identifies the active logged-in user + role
  const sessionKey = currentUser
    ? `${currentUser._id || currentUser.id || currentUser.email}_${currentUser.role}`
    : "guest";
  const prevSessionKeyRef = useRef(sessionKey);

  // Monitor location and localStorage to detect login/logout/role switch
  useEffect(() => {
    const freshUser = getCurrentUser();
    const freshKey = freshUser
      ? `${freshUser._id || freshUser.id || freshUser.email}_${freshUser.role}`
      : "guest";

    if (freshKey !== prevSessionKeyRef.current) {
      prevSessionKeyRef.current = freshKey;
      setCurrentUser(freshUser);
      // Immediately wipe previous user's chat messages
      setMessages([getStarterMessage(freshUser)]);
    }
  }, [location.pathname]);

  // Listen for explicit clear-chat events (e.g., on logout)
  useEffect(() => {
    const handleClearChat = () => {
      const freshUser = getCurrentUser();
      prevSessionKeyRef.current = freshUser
        ? `${freshUser._id || freshUser.id || freshUser.email}_${freshUser.role}`
        : "guest";
      setCurrentUser(freshUser);
      setMessages([getStarterMessage(freshUser)]);
    };

    window.addEventListener("smartcampus:clear-chat", handleClearChat);
    window.addEventListener("storage", handleClearChat);
    return () => {
      window.removeEventListener("smartcampus:clear-chat", handleClearChat);
      window.removeEventListener("storage", handleClearChat);
    };
  }, []);

  useEffect(() => {
    const openChat = (event) => {
      setIsOpen(true);
      const prompt = event?.detail?.prompt;
      if (prompt) {
        sendMessage(prompt);
      }
    };
    window.addEventListener("smartcampus:open-chat", openChat);
    return () => window.removeEventListener("smartcampus:open-chat", openChat);
  }, []);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (value = input) => {
    const message = value.trim();
    if (!message || isSending) return;
    const history = messages.slice(-8).map(({ role, text }) => ({ role, text }));
    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setIsSending(true);
    try {
      const response = await askCampusAssistant({ message, history });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: response.reply,
          provider: response.provider,
          notice: response.notice,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error.message ||
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const resetChat = () => {
    const freshUser = getCurrentUser();
    setMessages([getStarterMessage(freshUser)]);
  };

  const suggestions = useMemo(() => getRoleSuggestions(currentUser?.role), [currentUser?.role]);

  return (
    <div className="campus-chatbot-root">
      {isOpen && (
        <section className="campus-chat-panel" aria-label="SmartCampus assistant">
          <header className="campus-chat-header">
            <div className="campus-chat-brand-icon"><Bot size={22} /></div>
            <div className="campus-chat-heading">
              <strong>Campus assistant</strong>
              <span>
                <i /> {currentUser ? `${currentUser.role.toUpperCase()} MODE` : "Campus Support"}
              </span>
            </div>
            <button
              className="campus-chat-icon-button"
              onClick={resetChat}
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="campus-chat-icon-button"
              onClick={() => setIsOpen(false)}
              title="Close chat"
              aria-label="Close chat"
            >
              <X size={19} />
            </button>
          </header>
          <div className="campus-chat-messages">
            <div className="campus-chat-date">SMARTCAMPUS SUPPORT</div>
            {messages.map((message, index) => (
              <div className={`campus-chat-message ${message.role}`} key={`${index}-${message.role}`}>
                {message.role === "assistant" && <span className="chat-message-avatar"><Bot size={15} /></span>}
                <div>
                  <div className="chat-message-bubble">{message.text}</div>
                  {message.notice && <div className="chat-message-note">{message.notice}</div>}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="campus-chat-message assistant">
                <span className="chat-message-avatar"><Bot size={15} /></span>
                <div className="chat-message-bubble chat-typing"><i /><i /><i /></div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="campus-chat-suggestions">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} onClick={() => sendMessage(suggestion)}>
                    {suggestion}<span>↗</span>
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form className="campus-chat-compose" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask something about SmartCampus…"
              maxLength={1000}
              aria-label="Message the campus assistant"
            />
            <button type="submit" disabled={!input.trim() || isSending} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
          <div className="campus-chat-disclaimer">
            <Sparkles size={12} /> AI responses may need verification for important matters.
          </div>
        </section>
      )}
      <button
        className={`campus-chat-launcher ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close campus assistant" : "Open campus assistant"}
      >
        {isOpen ? (
          <X size={23} />
        ) : (
          <>
            <MessageCircle size={22} />
            <span className="chat-launcher-sparkle"><Sparkles size={11} /></span>
          </>
        )}
      </button>
    </div>
  );
}

export default CampusChatbot;
