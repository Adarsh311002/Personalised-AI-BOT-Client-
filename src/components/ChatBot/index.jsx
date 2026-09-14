import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import axios from 'axios';
import { FiSend, FiX, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const WELCOME_TEXT =
  "Hi, I'm Mait, Adarsh's AI assistant. I can tell you about his projects, skills, and experience. How can I help you today?";

const GENERIC_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again later.";

const RATE_LIMIT_ERROR =
  "I'm getting a lot of questions right now — please try again in a few minutes.";

// Shown only in the empty-conversation state, as a starting point. Selecting
// one fills the input - it does not send on the visitor's behalf.
const SUGGESTED_PROMPTS = [
  "What projects has Adarsh built?",
  "What did he work on at DigitalSherpa.AI?",
  "What is his GitHub?",
];

// Only ever renders text this function chose. A backend response body is never
// shown as-is, so nothing internal can reach the visitor through an error path.
const errorTextFor = (error) => {
  const status = error?.response?.status;
  if (status === 429) return RATE_LIMIT_ERROR;
  if (status === 400) {
    const message = error?.response?.data?.error;
    return typeof message === 'string' ? message : GENERIC_ERROR;
  }
  return GENERIC_ERROR;
};

// The model replies in light Markdown - **bold**, *italic*, and bullet or
// numbered lists - which would otherwise show its literal asterisks.
//
// This builds React elements from plain strings and never touches
// dangerouslySetInnerHTML, so model output cannot become markup: an injected
// <script> stays the visible text "<script>". A Markdown library would cost a
// dependency and ~100KB for the handful of constructs actually used.

const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;

// Splits one line into plain text and emphasised runs. Bold is matched before
// italic so "**x**" is never read as an empty italic wrapping "*x*".
const renderInline = (line, keyPrefix) =>
  line
    .split(INLINE)
    .filter((part) => part !== '' && part !== undefined)
    .map((part, i) => {
      const key = `${keyPrefix}-i${i}`;
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={key}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={key}>{part.slice(1, -1)}</em>;
      }
      return <span key={key}>{part}</span>;
    });

const BULLET_LINE = /^\s*[-*•]\s+(.*)$/;
const NUMBERED_LINE = /^\s*\d+[.)]\s+(.*)$/;

// Groups consecutive list lines into a single list so bullets render as one
// block rather than as separate stray lines.
const renderMarkdown = (text) => {
  const lines = String(text ?? '').split('\n');
  const blocks = [];
  let list = null;

  const closeList = () => {
    if (!list) return;
    const Tag = list.type === 'ol' ? 'ol' : 'ul';
    blocks.push(
      <Tag
        key={`b${blocks.length}`}
        className={`${list.type === 'ol' ? 'list-decimal' : 'list-disc'} list-inside space-y-1 my-1`}
      >
        {list.items.map((item, i) => (
          <li key={`b${blocks.length}-l${i}`}>{renderInline(item, `b${blocks.length}-l${i}`)}</li>
        ))}
      </Tag>
    );
    list = null;
  };

  lines.forEach((line, index) => {
    const bullet = line.match(BULLET_LINE);
    const numbered = line.match(NUMBERED_LINE);

    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        closeList();
        list = { type, items: [] };
      }
      list.items.push((bullet ?? numbered)[1]);
      return;
    }

    closeList();
    if (line.trim() === '') return;
    blocks.push(
      <p key={`b${blocks.length}`} className="my-1 first:mt-0 last:mb-0">
        {renderInline(line, `b${index}`)}
      </p>
    );
  });

  closeList();
  return blocks;
};

// presetMessage is the only addition to the component's contract: an external
// section of the page (e.g. the suggested-prompts demo) can seed the input via
// { text, id }. The id changes on every click so the same prompt can be chosen
// twice in a row; nothing is auto-sent, the visitor still presses send.
const ChatBot = ({ isOpen, onToggle, presetMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const messagesEndRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // A ref rather than state: the id is never rendered, so storing it here keeps
  // it out of the render cycle. The component stays mounted while the panel is
  // closed, so a conversation survives closing and reopening the widget - only
  // the reset button ends it. Deliberately not persisted to storage: the
  // conversation lasts as long as the page does.
  const conversationIdRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: WELCOME_TEXT, isBot: true }]);
    }
    if (isOpen) setHasOpenedOnce(true);
  }, [isOpen]);

  // Locks background scroll only on mobile, where the panel is a full-screen
  // modal - the desktop floating panel is meant to leave the page scrollable
  // behind it. Restores whatever inline overflow value was already there
  // (rather than clearing it) so this never clobbers a style set elsewhere.
  useEffect(() => {
    if (!isOpen) return undefined;
    if (!window.matchMedia('(max-width: 639px)').matches) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (presetMessage?.text) {
      setInputMessage(presetMessage.text);
    }
  }, [presetMessage]);

  // The greeting is set directly rather than by clearing to an empty list: the
  // effect above only runs when isOpen changes, so clearing would leave the
  // panel blank until the widget was closed and reopened.
  const handleReset = () => {
    if (isLoading) return;
    conversationIdRef.current = null;
    setInputMessage('');
    setMessages([{ text: WELCOME_TEXT, isBot: true }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  useEffect(scrollToBottom, [messages, reduceMotion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { text: inputMessage, isBot: false };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // The field is omitted entirely on the first message of a conversation;
      // the backend mints the id and returns it. An empty string is not a
      // valid id and would be rejected, so it is never sent.
      const payload = conversationIdRef.current
        ? { message: inputMessage, conversationId: conversationIdRef.current }
        : { message: inputMessage };

      const response = await axios.post(
        `${API_BASE_URL}/api/chat`,
        payload,
        { withCredentials: true }
      );

      if (typeof response.data?.conversationId === 'string') {
        conversationIdRef.current = response.data.conversationId;
      }

      const botMessage = { text: response.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error responses carry the conversation id too, so a thread survives a
      // transient failure instead of silently restarting on the next message.
      if (typeof error?.response?.data?.conversationId === 'string') {
        conversationIdRef.current = error.response.data.conversationId;
      }

      const errorMessage = { text: errorTextFor(error), isBot: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1 && !isLoading;

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Mait, AI assistant"
            className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[75vh] sm:w-[400px] sm:rounded-2xl sm:border sm:border-white/[0.08] sm:bg-neutral-950/95 sm:shadow-2xl sm:shadow-black/50 sm:backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-100">Mait</h3>
                  <p className="text-xs text-neutral-500">Grounded in Adarsh&apos;s resume &amp; notes</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <FiRefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={onToggle}
                  aria-label="Close chat"
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.isBot
                        ? 'rounded-bl-sm border border-white/[0.06] bg-white/[0.04] text-neutral-200'
                        : 'rounded-br-sm bg-neutral-100 text-neutral-900'
                    }`}
                  >
                    {renderMarkdown(msg.text)}
                  </div>
                </div>
              ))}

              {showSuggestions && (
                <div className="flex flex-col gap-2 pt-1">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInputMessage(prompt)}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-left text-[13px] text-neutral-400 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06] hover:text-neutral-100"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-white/[0.06] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about projects, skills, or experience..."
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  aria-label="Send message"
                  className="flex min-w-[44px] items-center justify-center rounded-xl bg-neutral-100 px-4 py-3 text-neutral-900 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <FiSend className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {!isOpen && !hasOpenedOnce && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mr-3 whitespace-nowrap rounded-full border border-white/10 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-300 shadow-lg"
            >
              Ask me anything
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          aria-label={isOpen ? "Close chat" : "Open chat with Mait"}
          className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-neutral-100 shadow-xl shadow-black/40 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:scale-95"
        >
          {!isOpen && !hasOpenedOnce && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-500/30" aria-hidden="true" />
          )}
          {isOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMessageSquare className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
