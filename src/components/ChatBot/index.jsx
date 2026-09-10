import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiSend, FiX, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const WELCOME_TEXT =
  "Hi, I'm Mait, Adarsh's AI assistant. I can tell you about his projects, skills, and experience. How can I help you today?";

const GENERIC_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again later.";

const RATE_LIMIT_ERROR =
  "I'm getting a lot of questions right now — please try again in a few minutes.";

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

const ChatBot = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
  }, [isOpen]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

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

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[70vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-gray-700/50"
            style={{ 
              position: 'fixed', 
              bottom: '5rem', 
              right: '1rem',
              maxWidth: 'calc(100vw - 2rem)'
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-white text-sm tracking-wide">Mait Bot - Online</h3>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={onToggle}
                  aria-label="Close chat"
                  className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      msg.isBot 
                        ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white rounded-bl-none'
                        : 'bg-gray-800/80 text-gray-100 rounded-br-none'
                    } backdrop-blur-sm`}
                  >
                    <div className="text-sm leading-5">{renderMarkdown(msg.text)}</div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 max-w-[60%] rounded-bl-none">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about projects, skills, or experience..."
                  className="flex-1 text-sm bg-gray-800/80 text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px]"
                >
                  <FiSend className="text-white h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center relative hover:shadow-purple-500/25 transition-all duration-300"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <FiX className="h-5 w-5 md:h-6 md:w-6 text-white" />
        ) : (
          <FiMessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white" />
        )}
        
        
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"
          />
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;