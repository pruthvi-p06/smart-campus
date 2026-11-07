import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Sparkles, RotateCcw, MessageCircle } from "lucide-react";
import { askCampusAssistant } from "../services/api";

const starterMessage = {
  role: "assistant",
  text: "Hi! I'm your SmartCampus assistant. I can help you understand how to report an issue, track a request, use campus resources or navigate the platform. What would you like to know?",
};

const suggestions = ["How do I report an issue?", "How can I track my complaint?", "What can the admin do?"];

function CampusChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
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
      setMessages((current) => [...current, { role: "assistant", text: response.reply, provider: response.provider, notice: response.notice }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", text: error.message || "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsSending(false);
    }
  };

  const resetChat = () => setMessages([starterMessage]);

  return (
    <div className="campus-chatbot-root">
      {isOpen && (
        <section className="campus-chat-panel" aria-label="SmartCampus assistant">
          <header className="campus-chat-header">
            <div className="campus-chat-brand-icon"><Bot size={22} /></div>
            <div className="campus-chat-heading"><strong>Campus assistant</strong><span><i /> Here to help</span></div>
            <button className="campus-chat-icon-button" onClick={resetChat} title="Start a new chat" aria-label="Start a new chat"><RotateCcw size={16} /></button>
            <button className="campus-chat-icon-button" onClick={() => setIsOpen(false)} title="Close chat" aria-label="Close chat"><X size={19} /></button>
          </header>
          <div className="campus-chat-messages">
            <div className="campus-chat-date">SMARTCAMPUS SUPPORT</div>
            {messages.map((message, index) => (
              <div className={`campus-chat-message ${message.role}`} key={`${index}-${message.role}`}>
                {message.role === "assistant" && <span className="chat-message-avatar"><Bot size={15} /></span>}
                <div><div className="chat-message-bubble">{message.text}</div>{message.notice && <div className="chat-message-note">{message.notice}</div>}</div>
              </div>
            ))}
            {isSending && <div className="campus-chat-message assistant"><span className="chat-message-avatar"><Bot size={15} /></span><div className="chat-message-bubble chat-typing"><i /><i /><i /></div></div>}
            {messages.length === 1 && <div className="campus-chat-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}<span>↗</span></button>)}</div>}
            <div ref={endRef} />
          </div>
          <form className="campus-chat-compose" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask something about SmartCampus…" maxLength={1000} aria-label="Message the campus assistant" />
            <button type="submit" disabled={!input.trim() || isSending} aria-label="Send message"><Send size={17} /></button>
          </form>
          <div className="campus-chat-disclaimer"><Sparkles size={12} /> AI responses may need verification for important matters.</div>
        </section>
      )}
      <button className={`campus-chat-launcher ${isOpen ? "is-open" : ""}`} onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close campus assistant" : "Open campus assistant"}>
        {isOpen ? <X size={23} /> : <><MessageCircle size={22} /><span className="chat-launcher-sparkle"><Sparkles size={11} /></span></>}
      </button>
    </div>
  );
}

export default CampusChatbot;
