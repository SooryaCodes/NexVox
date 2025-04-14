import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { IoClose, IoSend } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';

// Define suggestion questions and their answers
const suggestionQuestions = [
  {
    question: "How do I create a room?",
    answer: "To create a room, click the 'Create Room' button in the header. You'll be guided through setting up your own voice room with custom settings."
  },
  {
    question: "What are communities?",
    answer: "Communities are groups of like-minded users who share similar interests. You can join communities to discover voice rooms that match your preferences and connect with other members."
  },
  {
    question: "How do I join a voice chat?",
    answer: "To join a voice chat, simply click on any room card and then press the 'Join Room' button. Your microphone will be activated once you grant permission."
  },
  {
    question: "Can I customize my profile?",
    answer: "Yes! Click on your profile icon in the top-right corner to access your profile settings. There you can upload a profile picture, change your username, and customize your preferences."
  }
];

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  // Initial welcome message on first load
  useEffect(() => {
    // Show welcome message when component mounts
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        // Pulse the chat button to draw attention
        if (chatButtonRef.current) {
          chatButtonRef.current.classList.add('animate-pulse');
          setTimeout(() => {
            if (chatButtonRef.current) {
              chatButtonRef.current.classList.remove('animate-pulse');
            }
          }, 3000);
        }
      }, 2000);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest' 
      });
      
      // Prevent page scrolling when chat scrolls
      const handleChatScroll = (e: Event) => {
        e.stopPropagation();
      };
      
      const chatContainer = messagesEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.addEventListener('scroll', handleChatScroll);
        return () => chatContainer.removeEventListener('scroll', handleChatScroll);
      }
    }
  }, [messages, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Initial welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTyping(true);
      setTimeout(() => {
        setMessages([
          { 
            text: "👋 Hi there! I'm NexBot. How can I help you with your NexVox experience today?", 
            sender: 'bot' 
          }
        ]);
        setTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+C to toggle chat
      if (e.altKey && e.key === 'c') {
        setIsOpen(prev => !prev);
        e.preventDefault();
      }
      
      // Escape to close chat if open
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Add this effect to ensure immediate visibility
  useEffect(() => {
    // Ensure button is visible on mount
    if (chatButtonRef.current) {
      // Force immediate render with no animation delay
      chatButtonRef.current.style.opacity = '1';
      chatButtonRef.current.style.transform = 'scale(1)';
    }
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    
    // Clear input
    setMessage('');
    
    // Show typing indicator
    setTyping(true);
    
    // Process user message and respond
    processUserMessage(message);
  };

  const processUserMessage = (userMessage: string) => {
    // Check if the message matches any of our predefined questions
    const matchedSuggestion = suggestionQuestions.find(
      item => item.question.toLowerCase() === userMessage.toLowerCase()
    );
    
    setTimeout(() => {
      if (matchedSuggestion) {
        // Use the predefined answer
        setMessages(prev => [...prev, { text: matchedSuggestion.answer, sender: 'bot' }]);
      } else {
        // Generic responses for other messages
        const responses = [
          "I can help you find voice rooms that match your interests!",
          "Feel free to ask about any NexVox feature.",
          "Want to create your own room? Click the 'Create Room' button in the header.",
          "You can join any public room directly from the rooms list.",
          "Need technical support? I'm here to help troubleshoot issues."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
      }
      setTyping(false);
    }, 1500);
  };

  // Handle suggestion click
  const handleSuggestionClick = (question: string) => {
    // Add user message (the suggestion)
    setMessages(prev => [...prev, { text: question, sender: 'user' }]);
    
    // Show typing indicator
    setTyping(true);
    
    // Process the suggestion
    processUserMessage(question);
  };

  return (
    <>
      {/* Floating button - ALWAYS visible with position:fixed and highest z-index */}
      <div className="fixed top-[calc(100vh-100px)] right-6 z-[99999]" style={{ position: 'fixed', willChange: 'transform' }}>
        <AnimatePresence initial={false}>
          {!isOpen && (
            <m.button
              ref={chatButtonRef}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#FF00E6] flex items-center justify-center shadow-lg shadow-[#00FFFF]/20"
              onClick={() => setIsOpen(true)}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.9 }}
              aria-label="Open chat assistant"
              role="button"
              tabIndex={0}
            >
              <RiRobot2Fill className="text-black w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF00E6] animate-ping"></span>
              <span className="sr-only">Chat with NexBot (Alt+C)</span>
            </m.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Chatbot panel with improved accessibility */}
      <AnimatePresence>
        {isOpen && (
          <m.div 
            role="dialog"
            aria-labelledby="chat-title"
            aria-describedby="chat-description"
            className="fixed top-[calc(100vh-600px)] right-6 w-full max-w-md h-[500px] max-h-[80vh] bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg shadow-[#00FFFF]/20 overflow-hidden z-[9999] flex flex-col"
            style={{ 
              position: 'fixed', 
              zIndex: 9999,
              willChange: 'transform',
              isolation: 'isolate'
            }}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div id="chat-description" className="sr-only">
              Chat with NexBot for help with NexVox features. Press Escape to close the chat.
            </div>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                  <RiRobot2Fill className="text-[#00FFFF] w-5 h-5" />
                </div>
                <div>
                  <h3 id="chat-title" className="font-orbitron text-[#00FFFF]">NexBot</h3>
                  <div className="flex items-center text-xs text-white/50">
                    <span className="w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/30 text-white/70 hover:text-[#FF00E6] hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <IoClose className="w-5 h-5" />
                <span className="sr-only">Close (Esc)</span>
              </button>
            </div>
            
            {/* Keyboard shortcuts info */}
            <div className="bg-black/40 px-4 py-1 text-xs text-white/40 flex justify-end">
              <span>Alt+C: Toggle chat • Esc: Close</span>
            </div>
            
            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
              role="log"
              aria-live="polite"
              aria-atomic="false"
              onScroll={(e) => e.stopPropagation()}
              style={{ overscrollBehavior: 'contain' }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-[#FF00E6]/20 border border-[#FF00E6]/30 text-white'
                        : 'bg-[#00FFFF]/20 border border-[#00FFFF]/30 text-white'
                    }`}
                    role={msg.sender === 'bot' ? 'status' : undefined}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Suggestion questions - show after bot messages */}
              {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !typing && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-white/50">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Suggested questions">
                    {suggestionQuestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.question)}
                        className="px-3 py-1.5 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/30 
                                  text-[#00FFFF] text-xs hover:bg-[#00FFFF]/20 transition-colors 
                                  whitespace-nowrap max-w-full overflow-hidden text-ellipsis
                                  focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/70"
                        aria-label={`Ask: ${suggestion.question}`}
                      >
                        {suggestion.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div 
                    className="bg-[#00FFFF]/20 border border-[#00FFFF]/30 p-3 rounded-lg max-w-[85%]"
                    role="status"
                    aria-label="NexBot is typing"
                  >
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick action buttons */}
            <div className="px-3 py-2 border-t border-white/10 bg-black/40 flex gap-2 overflow-x-auto">
              <button 
                onClick={() => handleSuggestionClick("How do I create a room?")}
                className="px-3 py-1.5 rounded-full bg-[#FF00E6]/10 border border-[#FF00E6]/30 
                          text-[#FF00E6] text-xs whitespace-nowrap flex-shrink-0
                          hover:bg-[#FF00E6]/20 transition-colors"
                aria-label="Quick action: Create a room"
              >
                Create a room
              </button>
              <button 
                onClick={() => handleSuggestionClick("How do I join a voice chat?")}
                className="px-3 py-1.5 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/30 
                          text-[#00FFFF] text-xs whitespace-nowrap flex-shrink-0
                          hover:bg-[#00FFFF]/20 transition-colors"
                aria-label="Quick action: Join a voice chat"
              >
                Join a voice chat
              </button>
              <button 
                onClick={() => handleSuggestionClick("Can I customize my profile?")}
                className="px-3 py-1.5 rounded-full bg-[#9D00FF]/10 border border-[#9D00FF]/30 
                          text-[#9D00FF] text-xs whitespace-nowrap flex-shrink-0
                          hover:bg-[#9D00FF]/20 transition-colors"
                aria-label="Quick action: Customize profile"
              >
                Customize profile
              </button>
            </div>
            
            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/40 border border-white/10 focus:border-[#00FFFF]/50 outline-none rounded-md py-2 px-3 text-white"
                  aria-label="Message NexBot"
                />
                <button
                  type="submit"
                  className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/70 ${
                    message.trim()
                      ? 'bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 text-[#00FFFF]'
                      : 'bg-white/5 text-white/30'
                  }`}
                  disabled={!message.trim()}
                  aria-label="Send message"
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot; 