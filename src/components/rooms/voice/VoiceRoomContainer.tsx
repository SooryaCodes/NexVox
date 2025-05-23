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
  onUserClick: (user: User) => void;
  mutedUsers?: number[];
}

export default function VoiceRoomContainer({
  users,
  activeSpeakers,
  handRaised,
  onUserHover,
  onUserHoverEnd,
  onUserClick,
  mutedUsers = []
}: VoiceRoomContainerProps) {
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [avatarPositions, setAvatarPositions] = useState<Array<{x: number; y: number; isSpeaking: boolean}>>([]);
  
  // Add debounce state to prevent glitching on hover
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  
  // Improved position calculation with fixed positions rather than random offsets
  const calculateAvatarPositions = (containerWidth: number, containerHeight: number, userCount: number) => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;
    
    return users.slice(0, 5).map((user, index) => {
      // Use fixed positions based on index instead of random offsets
      const angle = (index / userCount) * Math.PI * 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
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
  
  // Handle hover events with debouncing to prevent glitching
  const handleHoverStart = (user: User, index: number, e: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Set the currently hovered user
    setHoveredUser(index);
    
    // Call the parent hover handler
    onUserHover(user, e.clientX, e.clientY);
  };
  
  const handleHoverEnd = () => {
    // Use a short timeout to debounce hover end events
    const timeout = setTimeout(() => {
      setHoveredUser(null);
      onUserHoverEnd();
    }, 50);
    
    setHoverTimeout(timeout);
  };
  
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
      {users.slice(0, 5).map((user: User, index) => (
        <div
          key={user.id}
          className="absolute z-10 cursor-pointer"
          style={{ 
            left: avatarPositions[index]?.x || 0,
            top: avatarPositions[index]?.y || 0,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseEnter={(e) => handleHoverStart(user, index, e)}
          onMouseMove={(e) => onUserHover(user, e.clientX, e.clientY)}
          onMouseLeave={handleHoverEnd}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUserClick(user);
          }}
          role="button"
          aria-label={`View ${user.name}'s profile`}
          tabIndex={0}
        >
          <m.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5, type: 'spring' }}
            className="relative"
            // Use simplified hover states to prevent glitching
            whileHover={{ 
              scale: 1.05, 
              zIndex: 20,
              transition: { duration: 0.2 } 
            }}
            onClick={(e) => {
              // Prevent event from propagating further
              e.stopPropagation();
            }}
          >
            {/* Avatar container with border */}
            <div className={`relative w-20 h-20 rounded-full overflow-hidden ${
              avatarPositions[index]?.isSpeaking 
                ? 'border-2 border-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
                : 'border border-white/20'
            }`}>
              
              {/* Pulsing effect behind the avatar when speaking */}
              {avatarPositions[index]?.isSpeaking && (
                <div className="absolute inset-0 bg-[#00FFFF]/20 animate-pulse"></div>
              )}
              
              {/* Avatar image */}
              <div className="relative w-full h-full">
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
            </div>
              
            {/* Muted indicator */}
            {mutedUsers.includes(user.id) && (
              <div className="absolute -top-2 -left-2 bg-[#FF00E6] w-6 h-6 rounded-full shadow-lg flex items-center justify-center z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </div>
            )}
              
            {/* User badges shown in avatar */}
            <div className="absolute -bottom-2 -right-2 flex">
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
              
            {/* Enhanced Speaking indicator with clear visualization */}
            {avatarPositions[index]?.isSpeaking && (
              <div 
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#00FFFF]/20 backdrop-blur-sm rounded-full px-2 py-0.5 border border-[#00FFFF]/40"
                onClick={(e) => e.stopPropagation()} // Stop clicks on the indicator from triggering profile
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#00FFFF] font-medium">Speaking</span>
                </div>
              </div>
            )}
              
            {/* User name tag with improved visibility */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm whitespace-nowrap border ${
                hoveredUser === index 
                  ? 'bg-black/70 border-[#00FFFF]/30 z-20' 
                  : 'bg-black/40 border-white/10'
              }`}
              onClick={(e) => e.stopPropagation()} // Stop clicks on the name from triggering profile
            >
              {user.isHost && (
                <span className="inline-block w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
              )}
              {user.name}
            </m.div>
          </m.div>
        </div>
      ))}
      
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