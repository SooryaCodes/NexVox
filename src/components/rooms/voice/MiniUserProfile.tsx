import React from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { User } from "@/types/room";

interface MiniUserProfileProps {
  user: User;
  position: { x: number; y: number };
}

export default function MiniUserProfile({ user, position }: MiniUserProfileProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-3 z-50 shadow-lg w-60"
      style={{ left: position.x + 20, top: position.y - 30 }}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20">
          {user.avatarUrl ? (
            <Image 
              src={user.avatarUrl}
              alt={user.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
              <span className="text-xl font-bold">{user.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-[#00FFFF] font-medium">{user.name}</h4>
          <div className="text-xs text-white/60 mb-1">Level {user.level || 1}</div>
          {user.isSpeaking && (
            <div className="text-xs px-2 py-0.5 bg-[#00FFFF]/20 rounded-full inline-block">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full animate-pulse"></span>
                Speaking
              </span>
            </div>
          )}
        </div>
      </div>
      
      {user.badges && user.badges.length > 0 && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <div className="flex flex-wrap gap-1">
            {user.badges.slice(0, 3).map((badge, index) => (
              <div key={index} className="px-2 py-0.5 bg-black/40 rounded-full text-xs border border-[#00FFFF]/30">
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </m.div>
  );
} 