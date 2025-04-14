"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { User } from "@/types/room";
import { getAvatarStyle, getStatusColor } from "@/utils/profileUtils"; 

interface PublicUserProfileCardProps {
  user: User;
  onClose: () => void;
  onConnect?: () => void;
}

const PublicUserProfileCard: React.FC<PublicUserProfileCardProps> = ({ user, onClose, onConnect }) => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Determine avatar style based on user's avatarType or default to cyan
  const avatarStyle = getAvatarStyle(user.avatarType || 'cyan');
  
  // Effect to add key listener for Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <m.div
        className="relative bg-black/70 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-xl w-full max-w-lg z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <button 
          className="absolute top-4 right-4 text-white/70 hover:text-white z-20"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header with avatar and user info */}
        <div className="relative pt-12 pb-8 px-6 flex flex-col items-center">
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/80 z-0"
            style={{ 
              background: `linear-gradient(to bottom, ${avatarStyle.gradientFrom}40, ${avatarStyle.gradientTo}70)` 
            }}
          ></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br flex items-center justify-center mb-4 relative border-2"
              style={{ 
                borderColor: avatarStyle.borderColor,
                background: avatarStyle.background 
              }}
            >
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span 
                  className="text-4xl font-bold"
                  style={{ color: avatarStyle.color }}
                >
                  {user.name.charAt(0)}
                </span>
              )}
              
              {/* Status indicator */}
              {user.status && (
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-black">
                  <div 
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  ></div>
                </div>
              )}
            </div>
            
            <h2 
              className="text-2xl font-orbitron mb-1"
              style={{ color: avatarStyle.color }}
            >
              {user.name}
            </h2>
            
            <div className="text-sm text-white/70 mb-4">
              Level {user.level || 1}
            </div>
            
            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {user.badges.map((badge, index) => (
                  <m.div 
                    key={index} 
                    className="px-3 py-1 bg-black/40 rounded-full text-xs border"
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
            )}
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex border-b border-white/10">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/70"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "stats" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/70"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Stats
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6 max-h-80 overflow-y-auto">
          {activeTab === "profile" && (
            <div>
              {/* Bio section */}
              <div className="mb-6">
                <h3 
                  className="text-lg font-medium mb-2"
                  style={{ color: avatarStyle.color }}
                >
                  About
                </h3>
                <p className="text-white/80">
                  {user.bio || "This user has not added a bio yet."}
                </p>
              </div>
              
              {/* Join date */}
              {user.joinDate && (
                <div className="flex items-center text-sm text-white/60 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </div>
              )}
              
              {/* Recent activity */}
              <div className="mb-6">
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: avatarStyle.color }}
                >
                  Recently Active In
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((room) => (
                    <div key={room} className="bg-black/30 rounded-lg border border-white/10 p-3">
                      <h4 className="font-medium text-white mb-1">Voice Room {room}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/50">2 hours ago</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "stats" && (
            <div>
              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h5 className="text-white/60 text-xs mb-1">Rooms Joined</h5>
                  <div 
                    className="text-2xl font-orbitron"
                    style={{ color: avatarStyle.color }}
                  >
                    {user.stats?.roomsJoined || 0}
                  </div>
                </div>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h5 className="text-white/60 text-xs mb-1">Connections</h5>
                  <div 
                    className="text-2xl font-orbitron"
                    style={{ color: avatarStyle.color }}
                  >
                    {user.stats?.connectionsCount || 0}
                  </div>
                </div>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h5 className="text-white/60 text-xs mb-1">Hours Spent</h5>
                  <div 
                    className="text-2xl font-orbitron"
                    style={{ color: avatarStyle.color }}
                  >
                    {user.stats?.hoursSpent || 0}
                  </div>
                </div>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h5 className="text-white/60 text-xs mb-1">Communities</h5>
                  <div 
                    className="text-2xl font-orbitron"
                    style={{ color: avatarStyle.color }}
                  >
                    {user.stats?.communitiesJoined || 0}
                  </div>
                </div>
              </div>
              
              {/* Progress bars */}
              <div>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: avatarStyle.color }}
                >
                  Activity
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Voice Participation</span>
                      <span className="text-white/70">78%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '78%',
                          background: avatarStyle.background 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Room Creation</span>
                      <span className="text-white/70">45%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '45%',
                          background: avatarStyle.background 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Community Engagement</span>
                      <span className="text-white/70">92%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '92%',
                          background: avatarStyle.background 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 flex justify-end gap-3">
          <m.button
            className="p-3 rounded-full bg-[#00FFFF]/20 border border-[#00FFFF]/30 text-[#00FFFF]"
            whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </m.button>
          
          {onConnect && (
            <m.button
              className="px-6 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 border border-[#00FFFF]/30 rounded-full text-[#00FFFF]"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onConnect}
            >
              <span className="font-medium">Connect</span>
            </m.button>
          )}
          
          <m.button
            className="px-6 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 border border-[#00FFFF]/30 rounded-full text-[#00FFFF]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <span className="font-medium">Close</span>
          </m.button>
        </div>
      </m.div>
    </m.div>
  );
};

export default PublicUserProfileCard; 