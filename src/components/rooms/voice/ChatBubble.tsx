import React from "react";
import { ChatMessage } from "@/types/room";

type ChatBubbleProps = ChatMessage;

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, userName }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div 
      className={`max-w-xs px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30 rounded-tr-none' 
          : 'bg-[#9D00FF]/20 text-white border border-[#9D00FF]/30 rounded-tl-none'
      }`}
    >
      {!isUser && userName && (
        <div className="text-xs text-[#9D00FF] mb-1 font-semibold">{userName}</div>
      )}
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

export default ChatBubble;
