import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { User } from "@/types/room";

interface VoiceRoomContainerProps {
  users: User[];
  activeSpeakers: number[];
  handRaised: boolean;
  onUserHover: (user: User, mouseX: number, mouseY: number) => void;
  onUserHoverEnd: () => void;
}

export default function VoiceRoomContainer({
  users,
  activeSpeakers,
  handRaised,
  onUserHover,
  onUserHoverEnd
}: VoiceRoomContainerProps) {
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [avatarPositions, setAvatarPositions] = useState<Array<{x: number; y: number; isSpeaking: boolean}>>([]);
  
  const calculateAvatarPositions = (containerWidth: number, containerHeight: number, userCount: number) => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;
    
    return users.slice(0, 5).map((user, index) => {
      const angle = (index / userCount) * Math.PI * 2;
      const randomOffset = Math.random() * 20 - 10;
      return {
        x: centerX + radius * Math.cos(angle) + randomOffset,
        y: centerY + radius * Math.sin(angle) + randomOffset,
        isSpeaking: activeSpeakers.includes(index)
      };
    });
  };
  
  useEffect(() => {
    if (avatarContainerRef.current) {
      const updatePositions = () => {
        const { width, height } = avatarContainerRef.current!.getBoundingClientRect();
        setAvatarPositions(calculateAvatarPositions(width, height, users.length));
      };
      
      updatePositions();
      window.addEventListener("resize", updatePositions);
      
      return () => {
        window.removeEventListener("resize", updatePositions);
      };
    }
  }, [users, activeSpeakers]);
  
  return (
    <div 
      ref={avatarContainerRef}
      className="relative flex-1 h-[500px] mb-8 flex items-center justify-center"
      aria-label="Users in room"
    >
      {/* Improved 3D spatial grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-[#00FFFF]/5"></div>
        ))}
      </div>
      
      {/* Center room indicator with enhanced effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00FFFF]/10 to-[#9D00FF]/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#00FFFF]/30 animate-pulse"></div>
          </div>
        </div>
        
        {/* Enhanced sound waves */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF]/10 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-0 rounded-full border border-[#00FFFF]/5 animate-ping" style={{ animationDuration: '4s' }}></div>
          <div className="absolute inset-0 rounded-full border border-[#9D00FF]/5 animate-ping" style={{ animationDuration: '5s' }}></div>
        </div>
      </div>
      
      {/* Enhanced User avatars with speaking indicators */}
      {avatarPositions.length > 0 && 
        users.slice(0, 5).map((user: User, index) => (
          <div
            key={user.id}
            className="absolute z-10"
            style={{ 
              left: avatarPositions[index].x,
              top: avatarPositions[index].y,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={(e) => onUserHover(user, e.clientX, e.clientY)}
            onMouseMove={(e) => onUserHover(user, e.clientX, e.clientY)}
            onMouseLeave={onUserHoverEnd}
          >
            <m.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
              className="relative"
            >
              {/* Avatar border with enhanced pulse effect for speaking indicator */}
              <div className={`absolute inset-0 rounded-full ${
                avatarPositions[index].isSpeaking 
                  ? 'border-2 border-[#00FFFF] animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
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
              <div className="absolute -top-2 -right-2 flex">
                {user.badges && user.badges.slice(0, 2).map((badge, i) => (
                  <div 
                    key={i} 
                    className="w-6 h-6 rounded-full bg-black border border-[#00FFFF] flex items-center justify-center text-xs ml-1"
                    title={badge}
                  >
                    {badge[0]}
                  </div>
                ))}
              </div>
              
              {/* Speaking indicator */}
              {avatarPositions[index].isSpeaking && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FFFF] rounded-full border border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}
              
              {/* User name tag with improved visibility */}
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm border border-white/10 whitespace-nowrap"
              >
                {user.isHost && (
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
                )}
                {user.name}
              </m.div>
            </m.div>
          </div>
        ))
      }
      
      {/* Hand raised indicator */}
      {handRaised && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#9D00FF]/20 backdrop-blur-md px-4 py-2 rounded-full border border-[#9D00FF]/30 z-30 flex items-center gap-2 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          <span className="text-[#9D00FF] font-medium">Hand Raised</span>
        </div>
      )}
    </div>
  );
} 