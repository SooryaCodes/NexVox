"use client";

import { m } from 'framer-motion';
import { IoChatbubbleOutline } from 'react-icons/io5';

export default function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <m.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
          className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto"
        >
          <IoChatbubbleOutline className="w-12 h-12 text-[#0ff]/50" />
        </m.div>
      </div>
      
      <m.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold font-orbitron mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#FF00E6]"
      >
        NexVox Chat
      </m.h2>
      
      <m.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/60 max-w-md mb-8"
      >
        Select a conversation from the list or start a new chat with one of your friends.
      </m.p>
      
      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4 max-w-md"
      >
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#0ff]/30 transition-colors">
          <div className="text-[#0ff] mb-2">End-to-End Encryption</div>
          <p className="text-xs text-white/60">Your messages are secured with advanced encryption</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF00E6]/30 transition-colors">
          <div className="text-[#FF00E6] mb-2">Spatial Audio</div>
          <p className="text-xs text-white/60">Create voice rooms directly from chats</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#0ff]/30 transition-colors">
          <div className="text-[#0ff] mb-2">File Sharing</div>
          <p className="text-xs text-white/60">Share images, audio and files securely</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF00E6]/30 transition-colors">
          <div className="text-[#FF00E6] mb-2">Cross-Platform</div>
          <p className="text-xs text-white/60">Access your chats on all your devices</p>
        </div>
      </m.div>
      
      {/* Ambient background animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[#0ff]/5 via-transparent to-transparent opacity-50"></div>
        <div className="absolute top-1/4 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-[#0ff]/20 to-transparent"></div>
        <div className="absolute top-1/3 left-1/3 w-px h-40 bg-gradient-to-b from-transparent via-[#FF00E6]/20 to-transparent"></div>
        <div className="absolute top-1/2 right-1/3 w-px h-40 bg-gradient-to-b from-transparent via-[#0ff]/20 to-transparent"></div>
      </div>
    </div>
  );
} 