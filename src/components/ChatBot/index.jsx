import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiSend, FiX, FiMessageSquare } from 'react-icons/fi';

const ChatBot = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: "Hi, I'm Mait, Adarsh's AI assistant. I can tell you about his projects, skills, and experience. How can I help you today?", isBot: true }]);
    }
  }, [isOpen]);

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

      const response = await axios.post(
        'https://ai-personalised-chat-bot-backend.vercel.app/api/chat',
        { message: inputMessage },
        { withCredentials: true }
      );

      const botMessage = { text: response.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: error.response?.data?.error || "Sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true 
      };
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
              <button
                onClick={onToggle}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
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
                    <p className="text-sm leading-5">{msg.text}</p>
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