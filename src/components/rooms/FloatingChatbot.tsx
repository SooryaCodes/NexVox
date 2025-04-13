import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { IoClose, IoSend } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [typing, setTyping] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle showing/hiding the chat button based on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Show chat button when scrolled down 200px or more
      const scrolled = window.scrollY > 200;
      setShowChatButton(scrolled);
    };

    // Call once to set initial state
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  // Initial welcome message
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

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    
    // Clear input
    setMessage('');
    
    // Show typing indicator
    setTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I can help you find voice rooms that match your interests!",
        "Feel free to ask about any NexVox feature.",
        "Want to create your own room? Click the 'Create Room' button in the header.",
        "You can join any public room directly from the rooms list.",
        "Need technical support? I'm here to help troubleshoot issues."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating button - only visible after scrolling */}
      <AnimatePresence>
        {showChatButton && !isOpen && (
          <m.button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#FF00E6] flex items-center justify-center shadow-lg shadow-[#00FFFF]/20 z-30"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)" }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open chatbot"
          >
            <RiRobot2Fill className="text-black w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF00E6] animate-ping"></span>
          </m.button>
        )}
      </AnimatePresence>
      
      {/* Chatbot panel */}
      <AnimatePresence>
        {isOpen && (
          <m.div 
            className="fixed bottom-6 right-6 w-full max-w-md h-[500px] max-h-[80vh] bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg shadow-[#00FFFF]/20 overflow-hidden z-40 flex flex-col"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                  <RiRobot2Fill className="text-[#00FFFF] w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron text-[#00FFFF]">NexBot</h3>
                  <div className="flex items-center text-xs text-white/50">
                    <span className="w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/30 text-white/70 hover:text-[#FF00E6] hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
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
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-[#00FFFF]/20 border border-[#00FFFF]/30 p-3 rounded-lg max-w-[85%]">
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
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/40 border border-white/10 focus:border-[#00FFFF]/50 outline-none rounded-md py-2 px-3 text-white"
                />
                <button
                  type="submit"
                  className={`p-2 rounded-md ${
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