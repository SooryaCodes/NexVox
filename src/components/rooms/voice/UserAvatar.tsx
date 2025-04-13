"use client";

import React, { useState } from "react";
import { m } from "framer-motion";
import Image from "next/image";
import { User } from "@/types/room";

interface UserAvatarProps {
  user: User;
  position: { x: number; y: number };
  index: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, position, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <m.div
      className="absolute"
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 10 : 5 - index
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Avatar border with pulse effect for speaking indicator */}
        <div className={`absolute inset-0 rounded-full ${
          user.isSpeaking 
            ? 'border-2 border-[#00FFFF] animate-pulse' 
            : 'border border-white/20'
        }`}></div>
        
        {/* Avatar image */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center">
          {user.avatarUrl ? (
            <Image 
              src={user.avatarUrl}
              alt={user.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
              <span className="text-xl font-bold">{user.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        {/* User badges shown in avatar */}
        {user.badges && user.badges.length > 0 && (
          <div className="absolute -top-2 -right-2 flex">
            {user.badges.slice(0, 2).map((badge, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full bg-black border border-[#00FFFF] flex items-center justify-center text-xs ml-1"
                title={badge}
              >
                {badge[0]}
              </div>
            ))}
          </div>
        )}
        
        {/* User name tag */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm border border-white/10 whitespace-nowrap"
        >
          {user.isHost && (
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
          )}
          {user.name}
        </m.div>
      </div>
    </m.div>
  );
};

export default UserAvatar;
