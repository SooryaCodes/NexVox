"use client";

import React, { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import ChatBubble from "./ChatBubble";
import { ChatMessage, quickReplies } from "@/types/room";

interface ChatTabProps {
  messages: ChatMessage[];
  isAiAssistantActive: boolean;
  isAiTyping: boolean;
  showQuickReplies: boolean;
  setShowQuickReplies: (show: boolean) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  handleQuickReply: (reply: string) => void;
  toggleAiAssistant: () => void;
}

const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  isAiAssistantActive,
  isAiTyping,
  showQuickReplies,
  setShowQuickReplies,
  handleSendMessage,
  chatInput,
  setChatInput,
  handleQuickReply,
  toggleAiAssistant
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <ChatBubble key={i} {...msg} />
        ))}
        
        {/* AI typing indicator */}
        {isAiTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs px-4 py-2 rounded-2xl bg-[#9D00FF]/20 text-white border border-[#9D00FF]/30 rounded-tl-none">
              <div className="text-xs text-[#9D00FF] mb-1 font-semibold">NexVox AI</div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#9D00FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-[#9D00FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-[#9D00FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Quick replies section */}
      <AnimatePresence>
        {showQuickReplies && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-t border-white/10 bg-black/40"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-[#00FFFF]">Quick Replies</h3>
              <button 
                onClick={() => setShowQuickReplies(false)}
                className="text-white/50 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {quickReplies.map((reply, index) => (
                <m.button
                  key={index}
                  className="text-left p-2 bg-[#00FFFF]/10 rounded-md border border-[#00FFFF]/20 text-sm hover:bg-[#00FFFF]/20"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </m.button>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
      
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={isAiAssistantActive ? "Ask the AI assistant..." : "Type a message..."}
            className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors"
          />
          
          <m.button
            type="button"
            className={`${isAiAssistantActive ? 'bg-[#FF00E6]/20 border-[#FF00E6]/50 text-[#FF00E6]' : 'bg-black/40 border-white/10 text-white/70'} border px-3 rounded-md`}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: isAiAssistantActive ? "0 0 15px rgba(255, 0, 230, 0.3)" : "0 0 15px rgba(255, 255, 255, 0.1)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAiAssistant}
            aria-label={isAiAssistantActive ? "Deactivate AI assistant" : "Activate AI assistant"}
          >
            <svg width="20" height="20" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M96 176C93.3333 176 91.1667 175.111 89.5 173.333C87.8333 171.556 87 169.333 87 166.667C87 164 87.8889 161.778 89.6667 160C91.4444 158.222 93.6667 157.333 96.3333 157.333C99 157.333 101.222 158.222 103 160C104.778 161.778 105.667 164 105.667 166.667C105.667 169.333 104.778 171.556 103 173.333C101.222 175.111 99 176 96 176ZM26.6667 146.667C24 146.667 21.8333 145.778 20.1667 144C18.5 142.222 17.6667 140 17.6667 137.333C17.6667 134.667 18.5556 132.444 20.3333 130.667C22.1111 128.889 24.3333 128 27 128C29.6667 128 31.8889 128.889 33.6667 130.667C35.4444 132.444 36.3333 134.667 36.3333 137.333C36.3333 140 35.4444 142.222 33.6667 144C31.8889 145.778 29.6667 146.667 27 146.667H26.6667ZM96 146.667C78.2222 146.667 63.6111 140.111 52.1667 127C40.7222 113.889 35 97.7778 35 78.6667C35 59.5556 40.7222 43.4444 52.1667 30.3333C63.6111 17.2222 78.2222 10.6667 96 10.6667C113.778 10.6667 128.389 17.2222 139.833 30.3333C151.278 43.4444 157 59.5556 157 78.6667C157 97.7778 151.278 113.889 139.833 127C128.389 140.111 113.778 146.667 96 146.667ZM96 128C107.333 128 116.833 123.778 124.5 115.333C132.167 106.889 136 93.7778 136 78C136 62.2222 132.167 49.1111 124.5 40.6667C116.833 32.2222 107.333 28 96 28C84.6667 28 75.1667 32.2222 67.5 40.6667C59.8333 49.1111 56 62.2222 56 78C56 93.7778 59.8333 106.889 67.5 115.333C75.1667 123.778 84.6667 128 96 128ZM165.333 146.667C162.667 146.667 160.5 145.778 158.833 144C157.167 142.222 156.333 140 156.333 137.333C156.333 134.667 157.222 132.444 159 130.667C160.778 128.889 163 128 165.667 128C168.333 128 170.556 128.889 172.333 130.667C174.111 132.444 175 134.667 175 137.333C175 140 174.111 142.222 172.333 144C170.556 145.778 168.333 146.667 165.667 146.667H165.333Z" fill="currentColor"/>
            </svg>
          </m.button>
          
          <m.button
            type="button"
            className="bg-[#9D00FF]/20 border border-[#9D00FF]/50 text-[#9D00FF] px-3 rounded-md"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(157, 0, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            aria-label="Show quick replies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </m.button>
          
          <m.button
            type="submit"
            className="bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] px-3 rounded-md"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            disabled={chatInput.trim() === ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </m.button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
