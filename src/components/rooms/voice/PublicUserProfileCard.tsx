"use client";

import React, { useRef, useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User } from "@/types/room";
import { gsap } from "gsap";
import AudioWaveform from "@/components/AudioWaveform";

interface PublicUserProfileCardProps {
  user: User;
  onClose: () => void;
  onConnect?: () => void;
  onMute?: () => void;
  isMuted?: boolean;
}

const PublicUserProfileCard: React.FC<PublicUserProfileCardProps> = ({ 
  user, 
  onClose,
  onConnect,
  onMute,
  isMuted = false
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements'>('overview');
  
  // Generate random data for demonstration purposes
  const generateRandomData = () => {
    return {
      recentRooms: [
        { id: 1, name: "Cyber Lounge", time: "2 hours ago", color: "#00FFFF" },
        { id: 2, name: "Music Production", time: "Yesterday", color: "#9D00FF" },
        { id: 3, name: "Late Night Talks", time: "3 days ago", color: "#FF00E6" },
      ],
      mutualConnections: Math.floor(Math.random() * 8) + 1,
      achievements: [
        { name: "Voice Voyager", description: "Joined 50+ voice rooms", completed: true, color: "#00FFFF", progress: 100 },
        { name: "Connection Catalyst", description: "Connect with 20+ users", completed: Math.random() > 0.5, color: "#9D00FF", progress: Math.floor(Math.random() * 100) },
        { name: "Feedback Maven", description: "Received 10+ positive ratings", completed: Math.random() > 0.7, color: "#FF00E6", progress: Math.floor(Math.random() * 100) },
        { name: "Conversation Starter", description: "Initiated 30+ discussions", completed: Math.random() > 0.6, color: "#00FFFF", progress: Math.floor(Math.random() * 100) },
      ],
      interests: ["Technology", "Music", "AI", "Design", "Gaming"].filter(() => Math.random() > 0.3)
    };
  };
  
  const userData = generateRandomData();
  
  // Animation for the avatar glow effect
  useEffect(() => {
    if (!avatarRef.current) return;
    
    // Create pulsing glow animation
    const pulseGlow = gsap.to(avatarRef.current, {
      boxShadow: `0 0 20px ${getAvatarColor()}80`,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    return () => {
      pulseGlow.kill();
    };
  }, [user]);

  // Background glow effect
  useEffect(() => {
    if (!glowRef.current) return;
    
    const glow = glowRef.current;
    
    const timeline = gsap.timeline({ repeat: -1, yoyo: true });
    timeline.to(glow, {
      backgroundPosition: '200% 0',
      duration: 15,
      ease: "sine.inOut"
    });
    
    return () => {
      timeline.kill();
    };
  }, []);
  
  // Card tilt effect on mouse move
  useEffect(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "elastic.out(1,0.7)"
      });
    };
    
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  
  // Determine avatar color based on user data
  const getAvatarColor = () => {
    const badges = user.badges || [];
    if (user.isHost) return "#00FFFF";
    if (badges.includes("Early Adopter")) return "#00FFFF";
    if (badges.includes("Voice Master") || badges.includes("Community Leader")) return "#9D00FF";
    return "#FF00E6";
  };

  // Get complementary color for accents
  const getComplementaryColor = () => {
    const primaryColor = getAvatarColor();
    if (primaryColor === "#00FFFF") return "#FF00E6";
    if (primaryColor === "#9D00FF") return "#00FFFF";
    return "#9D00FF";
  };
  
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      ></div>
      
      <m.div
        ref={cardRef}
        className="relative max-w-sm w-full overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
        onClick={(e) => {
          // Prevent clicks inside the modal from closing it
          e.stopPropagation();
        }}
      >
        {/* Animated glow background */}
        <div
          ref={glowRef}
          className="absolute inset-0 opacity-30 pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent, ${getAvatarColor()}30, ${getComplementaryColor()}30, transparent)`,
            backgroundSize: '400% 100%',
            filter: 'blur(8px)'
          }}
        ></div>
        
        {/* Main Card */}
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
          {/* Top particles/lines effect */}
          <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden opacity-50 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute top-8 -left-4 w-20 h-px bg-gradient-to-r from-transparent via-[#00FFFF]/40 to-transparent rotate-45"></div>
            <div className="absolute top-16 right-0 w-32 h-px bg-gradient-to-r from-transparent via-[#FF00E6]/40 to-transparent -rotate-45"></div>
          </div>
          
          {/* Decorative cyber grid in background */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-[#00FFFF]/5"></div>
              ))}
            </div>
          </div>
          
       
          
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white z-20 bg-black/30 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Hero section with avatar */}
          <div className="pt-8 px-6 pb-4 text-center relative">
            <div className="relative inline-block">
              <div
                ref={avatarRef}
                className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-black to-black border-2 flex items-center justify-center mx-auto"
                style={{ borderColor: getAvatarColor() }}
              >
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${getAvatarColor()}20, ${getAvatarColor()}10)` 
                    }}
                  >
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: getAvatarColor() }}
                    >
                      {user.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Muted status indicator */}
              {isMuted && (
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FF00E6] flex items-center justify-center shadow-[0_0_10px_rgba(255,0,230,0.5)] z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </div>
              )}
              
              {/* Animated ring effect around avatar */}
              <div 
                className="absolute inset-[-4px] rounded-full pointer-events-none"
                style={{ 
                  background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, ${getAvatarColor()}80 180deg, transparent 360deg)`,
                  animation: 'spin 4s linear infinite'
                }}
              ></div>
              
              {/* Status indicator */}
              {user.status && (
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-black">
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
              
              {/* Speaking indicator */}
              {user.isSpeaking && (
                <m.div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#00FFFF]/20 backdrop-blur-sm rounded-full px-2 py-0.5 border border-[#00FFFF]/40"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <span className="text-xs text-[#00FFFF] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full animate-pulse"></span>
                    Speaking
                  </span>
                </m.div>
              )}
            </div>
            
            <h2 
              className="mt-4 text-xl font-orbitron mb-1"
              style={{ color: getAvatarColor() }}
            >
              {user.name}
            </h2>
            
            {/* Tagline with typewriter effect */}
            <div className="text-xs text-white/70 h-4 mb-2 font-mono">
              {userData.interests.length > 0 && (
                <span>Interests: {userData.interests.join(' · ')}</span>
              )}
            </div>
            
            {/* Host badge if applicable */}
            {user.isHost && (
              <div className="mt-1 inline-block px-2 py-0.5 bg-[#00FFFF]/20 text-[#00FFFF] text-xs rounded-full">
                Room Host
              </div>
            )}
            
            {/* Level and mutual connection info */}
            <div className="mt-2 flex justify-center items-center gap-2">
              <div 
                className="px-3 py-1 rounded-full text-xs backdrop-blur-md"
                style={{ 
                  backgroundColor: `${getAvatarColor()}20`,
                  color: getAvatarColor()
                }}
              >
                Level {user.level || 1}
              </div>
              
              {userData.mutualConnections > 0 && (
                <div className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/80">
                  {userData.mutualConnections} mutual connection{userData.mutualConnections > 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            {/* Voice visualization (only visible when speaking) */}
            {user.isSpeaking && (
              <div className="mt-3 mx-auto max-w-[160px]">
                <AudioWaveform 
                  width={160} 
                  height={24} 
                  bars={16} 
                  color={getAvatarColor()} 
                  activeColor={getComplementaryColor()}
                />
              </div>
            )}
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b border-white/10">
            <button
              className={`flex-1 py-2 text-xs font-medium ${
                activeTab === 'overview' 
                  ? `text-[${getAvatarColor()}] border-b border-[${getAvatarColor()}]` 
                  : 'text-white/60'
              }`}
              onClick={() => setActiveTab('overview')}
              style={{ 
                color: activeTab === 'overview' ? getAvatarColor() : undefined,
                borderColor: activeTab === 'overview' ? getAvatarColor() : undefined 
              }}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-2 text-xs font-medium ${
                activeTab === 'activity' 
                  ? `text-[${getAvatarColor()}] border-b border-[${getAvatarColor()}]` 
                  : 'text-white/60'
              }`}
              onClick={() => setActiveTab('activity')}
              style={{ 
                color: activeTab === 'activity' ? getAvatarColor() : undefined,
                borderColor: activeTab === 'activity' ? getAvatarColor() : undefined 
              }}
            >
              Activity
            </button>
            <button
              className={`flex-1 py-2 text-xs font-medium ${
                activeTab === 'achievements' 
                  ? `text-[${getAvatarColor()}] border-b border-[${getAvatarColor()}]` 
                  : 'text-white/60'
              }`}
              onClick={() => setActiveTab('achievements')}
              style={{ 
                color: activeTab === 'achievements' ? getAvatarColor() : undefined,
                borderColor: activeTab === 'achievements' ? getAvatarColor() : undefined 
              }}
            >
              Achievements
            </button>
          </div>
          
          {/* Tab content */}
          <div className="px-6 py-4 h-[220px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <m.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Badges */}
                  {user.badges && user.badges.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Badges</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {user.badges.map((badge, index) => (
                          <m.div 
                            key={index} 
                            className="px-2 py-0.5 bg-black/40 rounded-full text-xs border"
                            style={{ 
                              borderColor: `${getAvatarColor()}40`,
                              color: getAvatarColor()
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                          >
                            {badge}
                          </m.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats - only show public stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div 
                      className="bg-black/40 rounded-lg p-3 border border-white/5"
                      style={{ borderColor: `${getAvatarColor()}20` }}
                    >
                      <div className="text-white/60 text-xs mb-1">Voice Rooms</div>
                      <div 
                        className="text-xl font-orbitron"
                        style={{ color: getAvatarColor() }}
                      >
                        {user.stats?.roomsJoined || "10+"}
                      </div>
                    </div>
                    
                    <div 
                      className="bg-black/40 rounded-lg p-3 border border-white/5"
                      style={{ borderColor: `${getAvatarColor()}20` }}
                    >
                      <div className="text-white/60 text-xs mb-1">Connections</div>
                      <div 
                        className="text-xl font-orbitron"
                        style={{ color: getAvatarColor() }}
                      >
                        {user.stats?.connectionsCount || "5+"}
                      </div>
                    </div>
                  </div>
                  
                  {/* A brief about section */}
                  <div className="mb-4">
                    <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">About</h3>
                    <p className="text-sm text-white/80">
                      {user.bio || "Voice enthusiast exploring the digital realm through meaningful conversations and connections."}
                    </p>
                  </div>
                </m.div>
              )}
              
              {activeTab === 'activity' && (
                <m.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Recent Activity</h3>
                  
                  {/* Recent rooms */}
                  <div className="space-y-3">
                    {userData.recentRooms.map((room) => (
                      <m.div 
                        key={room.id}
                        className="bg-black/40 rounded-lg p-3 border border-white/10 flex items-center justify-between"
                        whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${room.color}20` }}
                          >
                            <span className="text-xs" style={{ color: room.color }}>
                              {room.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{room.name}</div>
                            <div className="text-xs text-white/50">{room.time}</div>
                          </div>
                        </div>
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: room.color }}
                        ></div>
                      </m.div>
                    ))}
                  </div>
                  
                  {/* Weekly activity chart */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Weekly Activity</span>
                      <span>{Math.floor(Math.random() * 20) + 5} hours</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${Math.floor(Math.random() * 70) + 30}%`,
                          background: `linear-gradient(to right, ${getAvatarColor()}, ${getComplementaryColor()})` 
                        }}
                      ></div>
                    </div>
                  </div>
                </m.div>
              )}
              
              {activeTab === 'achievements' && (
                <m.div
                  key="achievements"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {userData.achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className="bg-black/40 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              achievement.completed ? 'border-none' : 'border border-white/20'
                            }`}
                            style={{ 
                              backgroundColor: achievement.completed ? `${achievement.color}20` : 'transparent',
                              color: achievement.color
                            }}
                          >
                            {achievement.completed ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white flex items-center gap-1">
                              {achievement.name}
                              {achievement.completed && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${achievement.color}20`, color: achievement.color }}>
                                  Achieved
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-white/60">{achievement.description}</div>
                          </div>
                        </div>
                      </div>
                      
                      {!achievement.completed && (
                        <div className="mt-2 w-full">
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${achievement.progress}%`,
                                backgroundColor: achievement.color 
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-white/50 text-right mt-1">{achievement.progress}%</div>
                        </div>
                      )}
                    </div>
                  ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Action buttons */}
          <div className="px-6 pb-6 pt-2 space-y-3">
            {onConnect && (
              <button 
                className="w-full relative py-3 rounded-md bg-black/40 group overflow-hidden border border-[#00FFFF]/30 hover:border-[#00FFFF] transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConnect();
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-70"></div>
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00FFFF] to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#00FFFF] to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Digital particles */}
                <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#00FFFF] opacity-70"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#00FFFF] opacity-70"></div>
                
                {/* Scanning line effect */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 overflow-hidden pointer-events-none">
                  <div className="h-[1px] w-full bg-[#00FFFF]/50 absolute top-0 left-0 animate-scan"></div>
                </div>
                
                {/* Corner cuts */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00FFFF]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00FFFF]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00FFFF]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00FFFF]"></div>
                
                {/* Button content with glow effect */}
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-6 h-6 rounded-md border border-[#00FFFF]/50 flex items-center justify-center bg-black/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14L21 3" />
                  </svg>
                  </div>
                  <span className="text-[#00FFFF] font-medium tracking-wide text-sm">
                    CONNECT <span className="opacity-80 font-normal">WITH</span> {user.name.toUpperCase()}
                </span>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[#00FFFF] blur-xl transition-opacity duration-300"></div>
              </button>
            )}
            
            {onMute && (
              <button 
                className={`w-full relative py-3 rounded-md bg-black/40 group overflow-hidden border ${isMuted ? 'border-[#00FFFF]/30 hover:border-[#00FFFF]' : 'border-[#FF00E6]/30 hover:border-[#FF00E6]'} transition-all duration-300`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMute();
                }}
              >
                {/* Decorative elements */}
                <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isMuted ? 'via-[#00FFFF]' : 'via-[#FF00E6]'} to-transparent opacity-70`}></div>
                <div className={`absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent ${isMuted ? 'via-[#00FFFF]' : 'via-[#FF00E6]'} to-transparent opacity-70`}></div>
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${isMuted ? 'from-[#00FFFF]' : 'from-[#FF00E6]'} to-transparent opacity-0 group-hover:opacity-40 transition-opacity`}></div>
                <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${isMuted ? 'from-[#00FFFF]' : 'from-[#FF00E6]'} to-transparent opacity-0 group-hover:opacity-40 transition-opacity`}></div>
                
                {/* Digital particles */}
                <div className={`absolute top-1 left-1 w-1 h-1 rounded-full ${isMuted ? 'bg-[#00FFFF]' : 'bg-[#FF00E6]'} opacity-70`}></div>
                <div className={`absolute bottom-1 right-1 w-1 h-1 rounded-full ${isMuted ? 'bg-[#00FFFF]' : 'bg-[#FF00E6]'} opacity-70`}></div>
                
                {/* Scanning line effect */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 overflow-hidden pointer-events-none">
                  <div className={`h-[1px] w-full ${isMuted ? 'bg-[#00FFFF]/50' : 'bg-[#FF00E6]/50'} absolute top-0 left-0 animate-scan`}></div>
                </div>
                
                {/* Corner cuts */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${isMuted ? 'border-[#00FFFF]' : 'border-[#FF00E6]'}`}></div>
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${isMuted ? 'border-[#00FFFF]' : 'border-[#FF00E6]'}`}></div>
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${isMuted ? 'border-[#00FFFF]' : 'border-[#FF00E6]'}`}></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${isMuted ? 'border-[#00FFFF]' : 'border-[#FF00E6]'}`}></div>
                
                {/* Button content with glow effect */}
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className={`w-6 h-6 rounded-md border ${isMuted ? 'border-[#00FFFF]/50' : 'border-[#FF00E6]/50'} flex items-center justify-center bg-black/50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isMuted ? 'text-[#00FFFF]' : 'text-[#FF00E6]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isMuted ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 9.5l0 5.5M12 9.5a3 3 0 013 3M12 9.5V5a7 7 0 017 7m-7-7a7 7 0 00-7 7" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </>
                      )}
                </svg>
                  </div>
                  <span className={`${isMuted ? 'text-[#00FFFF]' : 'text-[#FF00E6]'} font-medium tracking-wide text-sm`}>
                    {isMuted ? 'UNMUTE' : 'MUTE'} <span className="opacity-80 font-normal">USER</span> {user.name.toUpperCase()}
                  </span>
            </div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 ${isMuted ? 'bg-[#00FFFF]' : 'bg-[#FF00E6]'} blur-xl transition-opacity duration-300`}></div>
              </button>
            )}
          </div>
        </div>
        
        {/* Keyframe animation for the spinning effect */}
        <style jsx global>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes scan {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(500%);
            }
          }
          
          .animate-scan {
            animation: scan 2s linear infinite;
          }
        `}</style>
      </m.div>
    </m.div>
  );
};

export default PublicUserProfileCard; 