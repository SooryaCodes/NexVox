"use client";

import React from "react";
import { m } from "framer-motion";
import Image from "next/image";
import AudioLevelIndicator from "./AudioLevelIndicator";
import { User } from "@/types/room";

interface ParticipantsTabProps {
  users: User[];
  onUserClick?: (user: User) => void;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ users, onUserClick }) => {
  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="mb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search participants..."
            className="w-full bg-black/40 border border-white/10 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors"
          />
        </div>
      </div>
      
      {/* Participant stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
          <div className="text-2xl font-orbitron text-[#00FFFF]">{users.length}</div>
          <div className="text-xs text-white/50 mt-1">Total</div>
        </div>
        <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
          <div className="text-2xl font-orbitron text-[#9D00FF]">3</div>
          <div className="text-xs text-white/50 mt-1">Speaking</div>
        </div>
        <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
          <div className="text-2xl font-orbitron text-[#FF00E6]">2</div>
          <div className="text-xs text-white/50 mt-1">Hands Up</div>
        </div>
      </div>
      
      {/* User list with improved card design */}
      <div className="space-y-3">
        {users.map((user: User) => (
          <m.div
            key={user.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10 cursor-pointer"
            whileHover={{ x: 5, boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)" }}
            onClick={() => onUserClick && onUserClick(user)}
          >
            <div className={`
              w-12 h-12 rounded-full 
              bg-black 
              border-2 ${user.isSpeaking ? 'border-[#00FFFF]' : 'border-[#9D00FF]/50'} 
              flex items-center justify-center
              ${user.isSpeaking ? 'shadow-[0_0_10px_rgba(0,255,255,0.5)]' : ''}
              relative
            `}>
              {user.avatarUrl ? (
                <Image 
                  src={user.avatarUrl}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="font-orbitron text-lg">{user.name.charAt(0)}</span>
              )}
              
              {user.isSpeaking && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FFFF] rounded-full border border-black"></span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <p className="font-medium">{user.name}</p>
                {user.isSpeaking && (
                  <div className="ml-2">
                    <AudioLevelIndicator level={Math.floor(Math.random() * 8)} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-xs py-0.5 px-2 rounded-full bg-[#00FFFF]/10 text-[#00FFFF]/80 border border-[#00FFFF]/20">
                  {user.isSpeaking ? 'Speaking' : 'Not speaking'}
                </div>
                {user.isHost && (
                  <div className="text-xs py-0.5 px-2 rounded-full bg-[#9D00FF]/10 text-[#9D00FF]/80 border border-[#9D00FF]/20">
                    Host
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <m.button
                className="p-2 bg-black/40 rounded-md border border-white/10 text-sm"
                whileHover={{ borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Message user"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </m.button>
              <m.button
                className="p-2 bg-black/40 rounded-md border border-white/10 text-sm"
                whileHover={{ borderColor: "#FF00E6", color: "#FF00E6" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Mute user"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </m.button>
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsTab;
