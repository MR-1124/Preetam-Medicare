import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';
import {
  getAssistantResponse,
  INITIAL_GREETING,
  QUICK_SUGGESTIONS,
  ASSISTANT_DISCLAIMER
} from '../../services/clinicAssistant';

export default function ClinicAssistant({ isMobileSimulator = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: INITIAL_GREETING,
      time: getCurrentTime(),
      suggestions: QUICK_SUGGESTIONS.map((s) => s.label)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Auto-scroll chat to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      // Focus input field when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleResetChat = (e) => {
    e.stopPropagation();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: INITIAL_GREETING,
        time: getCurrentTime(),
        suggestions: QUICK_SUGGESTIONS.map((s) => s.label)
      }
    ]);
    setIsTyping(false);
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural response latency (450ms - 650ms)
    setTimeout(() => {
      const response = getAssistantResponse(query);
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        time: getCurrentTime(),
        suggestions: response.suggestions
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 550);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (label) => {
    // Find matching query from QUICK_SUGGESTIONS or use the label stripped of emoji
    const matched = QUICK_SUGGESTIONS.find((s) => s.label === label);
    const queryText = matched ? matched.query : label.replace(/^[^\w\s]+\s*/, '');
    handleSendMessage(queryText);
  };

  // Helper to render markdown-like bold (**text**), italics (*text*), and line breaks
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return lines.map((line, lineIdx) => {
      // Split on bold syntax **bold**
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

      return (
        <div key={lineIdx} className={line.startsWith('• ') ? 'chat-list-item' : 'chat-line'}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="chat-strong">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={partIdx} className="chat-em">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={`clinic-assistant-wrapper ${
        isMobileSimulator ? 'in-simulator' : 'in-viewport'
      }`}
    >
      {/* Floating Chat Widget Window */}
      {isOpen && (
        <div
          className="clinic-chat-window"
          role="dialog"
          aria-labelledby="assistant-header-title"
        >
          {/* Header */}
          <div className="clinic-chat-header">
            <div className="chat-header-info">
              <div className="assistant-avatar-badge">
                <Bot size={20} className="assistant-avatar-icon" />
                <span className="assistant-status-dot" title="Online" />
              </div>
              <div>
                <h3 id="assistant-header-title" className="assistant-header-title">
                  Medicare Connect Assistant
                </h3>
                <div className="assistant-header-sub">
                  <span className="status-indicator-live">Live</span>
                  <span>Clinic Support Knowledge Base</span>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-header-btn"
                onClick={handleResetChat}
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                className="chat-header-btn"
                onClick={handleToggleOpen}
                title="Minimize assistant"
                aria-label="Minimize assistant"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="chat-notice-banner">
            <Sparkles size={13} className="notice-icon" />
            <span>Instant answers for timings, appointments, doctors, and portals</span>
          </div>

          {/* Messages Body */}
          <div className="clinic-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message-row ${
                  msg.sender === 'user' ? 'row-user' : 'row-assistant'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="bubble-avatar">
                    <Bot size={15} />
                  </div>
                )}

                <div className="bubble-wrapper">
                  <div
                    className={`chat-bubble ${
                      msg.sender === 'user' ? 'bubble-user' : 'bubble-assistant'
                    }`}
                  >
                    <div className="bubble-text">{renderFormattedText(msg.text)}</div>
                  </div>

                  <span className="bubble-timestamp">{msg.time}</span>

                  {/* Contextual Quick Suggestions below Assistant Response */}
                  {msg.sender === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="bubble-suggestions">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-message-row row-assistant">
                <div className="bubble-avatar">
                  <Bot size={15} />
                </div>
                <div className="bubble-wrapper">
                  <div className="chat-bubble bubble-assistant bubble-typing">
                    <div className="typing-dots">
                      <span className="dot dot-1" />
                      <span className="dot dot-2" />
                      <span className="dot dot-3" />
                    </div>
                    <span className="typing-label">Medicare Assistant is answering...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input & Disclaimer Footer */}
          <div className="clinic-chat-footer">
            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="chat-text-input"
                placeholder="Ask about clinic timings, doctors, booking..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                aria-label="Ask Medicare Connect Assistant"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!inputValue.trim() || isTyping}
                title="Send message"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>

            {/* Mandatory Disclaimer (Requirement 7) */}
            <div className="chat-disclaimer">
              <Info size={12} className="disclaimer-icon" />
              <span>{ASSISTANT_DISCLAIMER}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Circular Launcher Button (Requirement 1) */}
      <button
        type="button"
        className={`clinic-assistant-launcher ${isOpen ? 'active-open' : ''}`}
        onClick={handleToggleOpen}
        title="Chat with Clinic Assistant"
        aria-label="Chat with Clinic Assistant"
        aria-expanded={isOpen}
      >
        <div className="launcher-icon-wrapper">
          {isOpen ? (
            <X size={26} className="launcher-close-icon" />
          ) : (
            <>
              <Bot size={26} className="launcher-bot-icon" />
              {hasUnread && <span className="launcher-pulse-badge" />}
            </>
          )}
        </div>

        {!isOpen && (
          <span className="launcher-tooltip">Chat with Clinic Assistant</span>
        )}
      </button>
    </div>
  );
}

