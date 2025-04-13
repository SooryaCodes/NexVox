import React, { useState, useRef, useEffect } from "react";
import { m, motion, AnimatePresence } from "framer-motion";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiRobot2Fill } from "react-icons/ri";

interface ChatMessage {
  text: string;
  isBot: boolean;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "👋 Welcome to NexVox! How can I assist you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages([...messages, { text: inputValue, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response;
      const lowercaseInput = inputValue.toLowerCase();
      
      if (lowercaseInput.includes("room") && (lowercaseInput.includes("join") || lowercaseInput.includes("enter"))) {
        response = "To join a room, simply click on the 'Join Room' button on any room card. You'll be able to start chatting and communicating right away!";
      } else if (lowercaseInput.includes("create") && lowercaseInput.includes("room")) {
        response = "To create a new room, click on the '+' button in the top right corner of the rooms list. You can customize your room's settings and invite friends.";
      } else if (lowercaseInput.includes("profile") || lowercaseInput.includes("account")) {
        response = "You can access your profile by clicking on your avatar in the top right corner of the page. There you can update your information and preferences.";
      } else if (lowercaseInput.includes("settings")) {
        response = "Settings can be accessed from your profile menu in the top right corner. You can adjust audio, privacy, and notification settings there.";
      } else if (lowercaseInput.includes("help") || lowercaseInput.includes("support")) {
        response = "I'm here to help! You can ask me about rooms, voice chat features, settings, or navigation. Is there something specific you need assistance with?";
      } else {
        response = "Thanks for your message! Is there anything specific about NexVox voice rooms you'd like to know? I can help with joining rooms, settings, or features.";
      }
      
      setMessages(prevMessages => [...prevMessages, { text: response, isBot: true }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  // Prevent scroll events from propagating to the main window
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  
  // Prevent wheel events from propagating to the main window
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Floating button - fixed position that stays on scroll */}
      <m.button
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl ${
          isOpen ? 'bg-[#FF00E6] text-white' : 'bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white'
        } border border-white/20`}
        whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(0, 255, 255, 0.6)" }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatbot}
        aria-label="Toggle AI assistant"
        style={{ backdropFilter: "blur(10px)" }}
      >
        {isOpen ? (
          <IoNotificationsOutline className="w-6 h-6" />
        ) : (
          <RiRobot2Fill className="w-6 h-6" />
        )}
      </m.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-black/80 backdrop-blur-xl border border-[#00FFFF]/30 rounded-lg shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-black/50 rounded-full">
                    <RiRobot2Fill className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                  <h3 className="font-orbitron text-sm text-[#00FFFF]">NexVox AI Assistant</h3>
                </div>
                <m.button
                  className="text-white/60 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleChatbot}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </m.button>
              </div>
            </div>

            {/* Messages - Added event handlers to stop scroll propagation */}
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              onScroll={handleScroll}
              onWheel={handleWheel}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.isBot
                        ? "bg-[#00FFFF]/10 text-white border border-[#00FFFF]/20 rounded-tl-none"
                        : "bg-[#FF00E6]/10 text-white border border-[#FF00E6]/20 rounded-tr-none"
                    }`}
                  >
                    {message.isBot && (
                      <div className="text-xs text-[#00FFFF] mb-1 font-semibold">NexVox AI</div>
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[85%] p-3 rounded-lg bg-[#00FFFF]/10 text-white border border-[#00FFFF]/20 rounded-tl-none">
                    <div className="text-xs text-[#00FFFF] mb-1 font-semibold">NexVox AI</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors text-white text-sm"
                />
                <m.button
                  type="submit"
                  className="bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] p-2 rounded-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={inputValue.trim() === ""}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </m.button>
              </form>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot; 