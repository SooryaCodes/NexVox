"use client";

import React, { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import HolographicCard from "@/components/HolographicCard";
import { User } from "@/types/room";
import { gsap } from "gsap";

// Avatar animation types
const AVATAR_ANIMATIONS = {
  PULSE: "pulse",
  WAVE: "wave", 
  BOUNCE: "bounce",
  GLITCH: "glitch",
  NONE: "none"
};

// Avatar options - consistent with profile page
const avatarOptions = [
  { id: 1, color: "cyan", name: "Neon Sprite" },
  { id: 2, color: "purple", name: "Void Walker" },
  { id: 3, color: "pink", name: "Glitch Punk" },
  { id: 4, color: "gradient", name: "Cyber Soul" },
];

interface UserProfileCardProps {
  user: User;
  onClose: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onClose }) => {
  const [selectedAnimation, setSelectedAnimation] = useState(AVATAR_ANIMATIONS.PULSE);
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [activeTab, setActiveTab] = useState("profile");
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Setup avatar animation based on selected type
  useEffect(() => {
    if (!avatarRef.current) return;
    
    // Clear any existing animations
    gsap.killTweensOf(avatarRef.current);
    
    const avatar = avatarRef.current;
    
    switch(selectedAnimation) {
      case AVATAR_ANIMATIONS.PULSE:
        gsap.to(avatar, {
          scale: 1.05,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        break;
        
      case AVATAR_ANIMATIONS.WAVE:
        gsap.to(avatar, {
          y: "-=5",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        break;
        
      case AVATAR_ANIMATIONS.BOUNCE:
        gsap.to(avatar, {
          y: "-=8",
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
        break;
        
      case AVATAR_ANIMATIONS.GLITCH:
        // Create glitch effect
        const tl = gsap.timeline({repeat: -1, repeatDelay: 2});
        tl.to(avatar, {
          x: "+=2",
          duration: 0.05,
          repeat: 3,
          yoyo: true
        })
        .to(avatar, {
          x: "-=3",
          duration: 0.05,
          repeat: 2,
          yoyo: true
        })
        .to(avatar, {
          x: 0,
          duration: 0.05
        });
        break;
        
      case AVATAR_ANIMATIONS.NONE:
      default:
        // No animation
        gsap.set(avatar, {scale: 1, x: 0, y: 0});
        break;
    }
    
    return () => {
      gsap.killTweensOf(avatar);
    };
  }, [selectedAnimation]);
  
  // Get avatar color based on selection
  const getAvatarStyle = () => {
    switch(selectedAvatar) {
      case 1: 
        return {
          background: '#00FFFF20',
          color: '#00FFFF',
          borderColor: '#00FFFF'
        };
      case 2:
        return {
          background: '#9D00FF20',
          color: '#9D00FF',
          borderColor: '#9D00FF'
        };
      case 3:
        return {
          background: '#FF00E620',
          color: '#FF00E6',
          borderColor: '#FF00E6'
        };
      case 4:
        return {
          background: 'linear-gradient(135deg, #00FFFF, #9D00FF, #FF00E6)',
          color: '#FFFFFF',
          borderColor: '#00FFFF'
        };
      default:
        return {
          background: '#00FFFF20',
          color: '#00FFFF',
          borderColor: '#00FFFF'
        };
    }
  };
  
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <HolographicCard 
        className="relative max-w-4xl w-full p-0 overflow-hidden"
        glowIntensity="medium"
        color={selectedAvatar === 1 ? "cyan" : selectedAvatar === 2 ? "purple" : selectedAvatar === 3 ? "pink" : "gradient"}
      >
        <button 
          className="absolute top-4 right-4 text-white/70 hover:text-white z-20"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar with avatar and basic info */}
          <div className="w-full md:w-1/3 bg-black/40 p-8 flex flex-col items-center">
            {/* Avatar with animation */}
            <div className="relative mb-6">
              <div 
                ref={avatarRef}
                className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/10 to-[#FF00E6]/10 border-2 flex items-center justify-center" 
                style={{ borderColor: getAvatarStyle().borderColor }}
              >
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl}
                    alt={user.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: getAvatarStyle().background }}
                  >
                    <span 
                      className="text-5xl font-bold"
                      style={{ color: getAvatarStyle().color }}
                    >
                      {user.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Status indicator */}
              {user.status && (
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-black">
                  <div 
                    className="w-full h-full rounded-full"
                    style={{ 
                      backgroundColor: user.status === "online" ? "#4ade80" : 
                                      user.status === "away" ? "#facc15" : 
                                      user.status === "busy" ? "#f87171" : "#9ca3af" 
                    }}
                  ></div>
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-orbitron mb-2" style={{ color: getAvatarStyle().color }}>{user.name}</h3>
            
            {/* Level display */}
            <div className="mb-4 text-center">
              <div className="relative h-6 w-44 bg-black/40 rounded-full overflow-hidden border border-white/20 mb-1">
                <div 
                  className="h-full"
                  style={{ 
                    width: `${Math.min(100, (user.level || 1) / 50 * 100)}%`,
                    background: getAvatarStyle().background 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  Level {user.level || 1}
                </div>
              </div>
              
              <div className="text-xs text-white/50">
                {user.level && user.level >= 50 ? "Mastery Achieved" : `${50 - (user.level || 0)} XP to next level`}
              </div>
            </div>
            
            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="mb-6 w-full">
                <h4 className="text-sm text-white/70 mb-2 text-center">Badges</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {user.badges.map((badge, index) => (
                    <m.div 
                      key={index} 
                      className="px-3 py-1 bg-black/60 rounded-full text-xs border"
                      style={{ 
                        borderColor: index % 3 === 0 ? '#00FFFF40' : 
                                    index % 3 === 1 ? '#9D00FF40' : '#FF00E640',
                        color: index % 3 === 0 ? '#00FFFF' : 
                               index % 3 === 1 ? '#9D00FF' : '#FF00E6'
                      }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      {badge}
                    </m.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Animation selector */}
            <div className="w-full mt-4">
              <h4 className="text-sm text-white/70 mb-2 text-center">Avatar Animation</h4>
              <select 
                className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF]"
                value={selectedAnimation}
                onChange={(e) => setSelectedAnimation(e.target.value)}
              >
                <option value={AVATAR_ANIMATIONS.PULSE}>Pulse</option>
                <option value={AVATAR_ANIMATIONS.WAVE}>Wave</option>
                <option value={AVATAR_ANIMATIONS.BOUNCE}>Bounce</option>
                <option value={AVATAR_ANIMATIONS.GLITCH}>Glitch</option>
                <option value={AVATAR_ANIMATIONS.NONE}>None</option>
              </select>
            </div>
            
            {/* Avatar selector */}
            <div className="w-full mt-6">
              <h4 className="text-sm text-white/70 mb-2 text-center">Avatar Style</h4>
              <div className="grid grid-cols-4 gap-2">
                {avatarOptions.map((avatar) => (
                  <m.div
                    key={avatar.id}
                    className={`p-1 rounded-lg cursor-pointer ${
                      selectedAvatar === avatar.id ? 'bg-white/10 border border-[#00FFFF]/30' : 'border border-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                        style={{ 
                          background: avatar.color === 'gradient'
                            ? 'linear-gradient(135deg, #00FFFF30, #9D00FF30, #FF00E630)'
                            : avatar.color === 'cyan'
                              ? '#00FFFF20'
                              : avatar.color === 'purple'
                                ? '#9D00FF20'
                                : '#FF00E620',
                        }}
                      >
                        <span 
                          className="text-xs font-bold"
                          style={{ 
                            color: avatar.color === 'cyan' 
                              ? '#00FFFF' 
                              : avatar.color === 'purple' 
                                ? '#9D00FF' 
                                : '#FF00E6'
                          }}
                        >
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-xs truncate">{avatar.name}</div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="w-full md:w-2/3 p-8">
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "profile" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/70"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "stats" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/70"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Stats
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "achievements" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/70"
                }`}
                onClick={() => setActiveTab("achievements")}
              >
                Achievements
              </button>
            </div>
            
            {/* Tab content */}
            <div className="h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {activeTab === "profile" && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-orbitron mb-2" style={{ color: getAvatarStyle().color }}>About</h4>
                    <p className="text-white/80 mb-4">
                      {user.bio || "Digital explorer and voice chat enthusiast. Love to connect with others across the metaverse."}
                    </p>
                    
                    {user.email && (
                      <div className="flex items-center gap-2 mb-2 text-white/70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{user.email}</span>
                      </div>
                    )}
                    
                    {user.joinDate && (
                      <div className="flex items-center gap-2 text-white/70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-orbitron mb-3" style={{ color: getAvatarStyle().color }}>Recently Active In</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((room) => (
                        <div key={room} className="bg-black/30 rounded-lg border border-white/10 p-3 hover:border-[#00FFFF]/30 transition-colors">
                          <h5 className="font-medium text-white mb-1">Cyber Room {room}</h5>
                          <div className="text-xs text-white/50">Last active: 2 hours ago</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-orbitron mb-3" style={{ color: getAvatarStyle().color }}>Connections</h4>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((connection) => (
                        <div key={connection} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center">
                          <span className="text-sm font-bold">U{connection}</span>
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-dashed border-white/30 flex items-center justify-center">
                        <span className="text-white/70 text-xl">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "stats" && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white/60 text-sm mb-1">Rooms Joined</h5>
                      <div className="text-2xl font-orbitron" style={{ color: getAvatarStyle().color }}>
                        {user.stats?.roomsJoined || 128}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white/60 text-sm mb-1">Connections</h5>
                      <div className="text-2xl font-orbitron" style={{ color: getAvatarStyle().color }}>
                        {user.stats?.connectionsCount || 85}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white/60 text-sm mb-1">Hours Spent</h5>
                      <div className="text-2xl font-orbitron" style={{ color: getAvatarStyle().color }}>
                        {user.stats?.hoursSpent || 342}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white/60 text-sm mb-1">Communities</h5>
                      <div className="text-2xl font-orbitron" style={{ color: getAvatarStyle().color }}>
                        {user.stats?.communitiesJoined || 7}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-orbitron mb-3" style={{ color: getAvatarStyle().color }}>Activity</h4>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <div className="flex mb-3">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                          <div key={day} className="text-xs text-white/40 flex-1 text-center">
                            {["S", "M", "T", "W", "T", "F", "S"][day]}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {Array.from({ length: 28 }).map((_, i) => {
                          const activity = Math.random();
                          let bgColor = "bg-white/5";
                          if (activity > 0.7) bgColor = "bg-[#00FFFF]/60";
                          else if (activity > 0.4) bgColor = "bg-[#00FFFF]/30";
                          else if (activity > 0.1) bgColor = "bg-[#00FFFF]/10";
                          
                          return (
                            <div 
                              key={i} 
                              className={`h-5 rounded-sm ${bgColor}`}
                              title={`${Math.floor(activity * 10)} hours`}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="flex justify-end gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-white/5 rounded-sm"></div>
                          <span className="text-white/40">Less</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-[#00FFFF]/60 rounded-sm"></div>
                          <span className="text-white/40">More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "achievements" && (
                <div>
                  <h4 className="text-lg font-orbitron mb-4" style={{ color: getAvatarStyle().color }}>Achievements</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Voice Pioneer</h5>
                        <p className="text-white/60 text-sm">Hosted 10 voice rooms successfully</p>
                      </div>
                      <div className="text-[#00FFFF]">Completed</div>
                    </div>
                    
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#9D00FF]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Networker</h5>
                        <p className="text-white/60 text-sm">Connect with 50+ other users</p>
                      </div>
                      <div>
                        <div className="w-16 bg-white/20 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#9D00FF] h-full" style={{ width: "85%" }}></div>
                        </div>
                        <div className="text-xs text-white/50 text-right mt-1">85%</div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#FF00E6]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Devoted Member</h5>
                        <p className="text-white/60 text-sm">500 hours spent in voice rooms</p>
                      </div>
                      <div>
                        <div className="w-16 bg-white/20 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#FF00E6] h-full" style={{ width: "68%" }}></div>
                        </div>
                        <div className="text-xs text-white/50 text-right mt-1">68%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex gap-3 justify-end">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
              
              <m.button
                className="px-6 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 border border-[#00FFFF]/30 rounded-full text-[#00FFFF]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium">Save Changes</span>
              </m.button>
            </div>
          </div>
        </div>
      </HolographicCard>
    </m.div>
  );
};

export default UserProfileCard;
