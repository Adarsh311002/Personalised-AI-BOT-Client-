import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Bot, Send } from "lucide-react";
import ChatBot from "../components/ChatBot/index.jsx";


const Button = ({ children, variant, size, className, ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900";
      case "ghost":
        return "hover:bg-gray-100 text-gray-900";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "lg":
        return "px-6 py-3 md:px-8 md:py-4 text-base md:text-lg";
      case "sm":
        return "px-3 py-1.5 text-sm";
      default:
        return "px-4 py-2";
    }
  };

  return (
    <button
      className={`rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 active:scale-95 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  };

  const floatingIconsVariants = {
    initial: { y: 0 },
    animate: {
      y: [-8, 8],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <header className="py-4 md:py-6 relative z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              PersonaAI
            </span>
          </motion.div>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center relative py-8 md:py-0">
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-30"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        >
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 filter blur-3xl"></div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="text-center relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 leading-tight"
            variants={itemVariants}
          >
            Future of
            <br className="sm:hidden" /> AI Interaction
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
            variants={itemVariants}
          >
            I build custom AI chatbots that learn{" "}
            <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              your unique content
            </span>
            . Instantly answer questions about your products, docs, or services.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            variants={itemVariants}
          >
            <Button 
              size="lg" 
              className="px-8 py-4 text-base md:text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              onClick={toggleChat}
            >
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>{showChat ? "Close Chat" : "Try the Demo"}</span>
              </div>
            </Button>
            
           
          </motion.div>

          <motion.p
            className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Experience the power of AI leveraging real portfolio data. 
            <span className="block sm:inline"> Ask about projects, skills, or anything else!</span>
          </motion.p>
        </motion.div>

        
        <motion.div
          className="hidden md:block absolute top-20 left-10 lg:left-20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
        >
          <Bot className="h-8 w-8 lg:h-12 lg:w-12 text-blue-300/40" />
        </motion.div>
        
        <motion.div
          className="hidden md:block absolute top-32 right-16 lg:right-32"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <div className="h-6 w-6 lg:h-10 lg:w-10 rounded-full bg-purple-300/30"></div>
        </motion.div>
        
        <motion.div
          className="hidden lg:block absolute bottom-32 left-32"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          <Send className="h-8 w-8 text-cyan-300/40" />
        </motion.div>
        
        <motion.div
          className="hidden md:block absolute bottom-20 right-20 lg:right-32"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.9 }}
        >
          <div className="h-5 w-5 lg:h-8 lg:w-8 rounded-full bg-green-300/30"></div>
        </motion.div>
      </main>

      <ChatBot isOpen={showChat} onToggle={toggleChat} />

      <footer className="py-6 text-center text-gray-400 relative z-10 mt-8 md:mt-0">
        <div className="container mx-auto px-4">
          <p className="text-sm md:text-base">
            © 2025 PersonaAI · Crafted with 💙 · Transforming AI Conversations
          </p>
          <div className="flex justify-center space-x-6 mt-3 text-xs md:text-sm text-gray-500">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}