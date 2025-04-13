"use client";

import React from "react";
import { m } from "framer-motion";
import Image from "next/image";
import HolographicCard from "@/components/HolographicCard";
import { User } from "@/types/room";

interface UserProfileCardProps {
  user: User;
  onClose: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onClose }) => {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      <HolographicCard className="relative max-w-md w-full p-8">
        <button 
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center mb-4">
            {user.avatarUrl ? (
              <Image 
                src={user.avatarUrl}
                alt={user.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
                <span className="text-3xl font-bold">{user.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-orbitron text-[#00FFFF] mb-2">{user.name}</h3>
          
          {/* User level */}
          <div className="flex items-center gap-2 mb-6">
            <div className="px-3 py-1 bg-[#00FFFF]/20 rounded-full text-xs border border-[#00FFFF]/30">
              Level {user.level || 1}
            </div>
            {user.isHost && (
              <div className="px-3 py-1 bg-[#9D00FF]/20 rounded-full text-xs border border-[#9D00FF]/30">
                Host
              </div>
            )}
          </div>
          
          {/* Badges section */}
          {user.badges && user.badges.length > 0 && (
            <div className="w-full mb-6">
              <h4 className="text-sm text-white/70 mb-2">Badges</h4>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <div key={index} className="px-3 py-1 bg-black/40 rounded-full text-xs border border-[#00FFFF]/30">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Share buttons */}
          <div className="w-full mt-4">
            <div className="flex justify-center gap-4">
              <m.button
                className="p-3 rounded-full bg-[#00FFFF]/20 border border-[#00FFFF]/30 text-[#00FFFF]"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </m.button>
              <m.button
                className="p-3 rounded-full bg-[#9D00FF]/20 border border-[#9D00FF]/30 text-[#9D00FF]"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(157, 0, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </m.button>
              <m.button
                className="p-3 rounded-full bg-[#FF00E6]/20 border border-[#FF00E6]/30 text-[#FF00E6]"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(255, 0, 230, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </m.button>
            </div>
          </div>
        </div>
      </HolographicCard>
    </m.div>
  );
};

export default UserProfileCard;
