// src/app/profile/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import HolographicCard from "@/components/HolographicCard";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import NeonGrid from "@/components/NeonGrid";
import AudioWaveform from "@/components/AudioWaveform";
import { IoSettingsOutline, IoNotificationsOutline, IoChevronBackOutline } from "react-icons/io5";

// Mock user data
const userData = {
  id: 1,
  name: "CyberUser",
  email: "user@nexvox.io",
  joinDate: "2023-05-12",
  bio: "Digital explorer and voice chat enthusiast. Love to connect with others across the metaverse.",
  avatar: null,
  level: 34,
  status: "online" as const,
  badges: ["Early Adopter", "Voice Master", "Community Leader"],
  stats: {
    roomsJoined: 128,
    connectionsCount: 85,
    hoursSpent: 342,
    communitiesJoined: 7
  }
};

// Avatars to choose from
const avatarOptions = [
  { id: 1, color: "cyan", name: "Neon Sprite" },
  { id: 2, color: "purple", name: "Void Walker" },
  { id: 3, color: "pink", name: "Glitch Punk" },
  { id: 4, color: "gradient", name: "Cyber Soul" },
];

// Define the status options
const statusOptions = [
  { id: "online", label: "Online", color: "#4ade80" },
  { id: "away", label: "Away", color: "#facc15" },
  { id: "busy", label: "Busy", color: "#f87171" },
  { id: "invisible", label: "Invisible", color: "#9ca3af" },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [status, setStatus] = useState("online");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    bio: userData.bio,
  });
  const profileHeaderRef = useRef<HTMLDivElement>(null);

  // Animation for the profile header
  useEffect(() => {
    if (profileHeaderRef.current) {
      const element = profileHeaderRef.current;
      element.classList.add("animate-fade-in");
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAvatarSelect = (id: number) => {
    setSelectedAvatar(id);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Start editing - nothing else to do
    } else {
      // Save changes - in a real app you would save to backend
      // For now we just update local state
      // Also you might want to validate data before saving
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rooms">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Back to Rooms"
              >
                <IoChevronBackOutline className="h-5 w-5" />
              </m.button>
            </Link>
            <h1 className="text-2xl font-orbitron text-[#00FFFF]">Profile</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Settings"
              >
                <IoSettingsOutline className="h-5 w-5" />
              </m.button>
            </Link>
            
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 relative"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF00E6] text-xs flex items-center justify-center">3</span>
            </m.button>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Profile Header */}
        <div 
          ref={profileHeaderRef}
          className="mb-8 opacity-0 transition-opacity duration-700"
          style={{ animationDuration: '0.7s' }}
        >
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center md:items-start">
              {/* Avatar (with selected option) */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 border-2 border-white/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div 
                      className="w-full h-full flex items-center justify-center text-4xl font-bold"
                      style={{ 
                        background: selectedAvatar === 4 
                          ? 'linear-gradient(135deg, #00FFFF, #9D00FF, #FF00E6)' 
                          : selectedAvatar === 1 
                            ? '#00FFFF20' 
                            : selectedAvatar === 2 
                              ? '#9D00FF20' 
                              : '#FF00E620',
                        color: selectedAvatar === 1 
                          ? '#00FFFF' 
                          : selectedAvatar === 2 
                            ? '#9D00FF' 
                            : '#FF00E6'
                      }}
                    >
                      {profileData.name.charAt(0)}
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-2 animate-pulse"
                    style={{ 
                      borderColor: selectedAvatar === 1 
                        ? '#00FFFF' 
                        : selectedAvatar === 2 
                          ? '#9D00FF' 
                          : '#FF00E6'
                    }}
                  ></div>
                </div>
                
                {/* Status Indicator */}
                <div 
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-black"
                  style={{ backgroundColor: statusOptions.find(s => s.id === status)?.color }}
                ></div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="text-2xl font-orbitron bg-black/30 border border-[#00FFFF]/30 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-[#00FFFF]"
                    />
                  ) : (
                    <h2 className="text-2xl font-orbitron text-[#00FFFF]">{profileData.name}</h2>
                  )}
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {userData.badges.map((badge, index) => (
                      <div 
                        key={index}
                        className="px-2 py-1 rounded-md text-xs"
                        style={{ 
                          backgroundColor: index === 0 
                            ? '#00FFFF20' 
                            : index === 1 
                              ? '#9D00FF20' 
                              : '#FF00E620',
                          color: index === 0 
                            ? '#00FFFF' 
                            : index === 1 
                              ? '#9D00FF' 
                              : '#FF00E6'
                        }}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-white/70">
                    <span className="w-2 h-2 rounded-full bg-[#00FFFF]"></span>
                    <span>Level {userData.level}</span>
                  </div>
                  <div className="text-white/50">Joined {new Date(userData.joinDate).toLocaleDateString()}</div>
                </div>
                
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] resize-none h-24 text-white"
                  />
                ) : (
                  <p className="text-white/80">{profileData.bio}</p>
                )}
                
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <m.button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isEditing
                        ? "bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30"
                        : "bg-[#FF00E6]/20 text-[#FF00E6] border border-[#FF00E6]/30"
                    }`}
                    whileHover={{ scale: 1.05, boxShadow: isEditing ? "0 0 15px rgba(0, 255, 255, 0.3)" : "0 0 15px rgba(255, 0, 230, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? "Save Profile" : "Edit Profile"}
                  </m.button>
                  
                  {isEditing && (
                    <m.button
                      className="px-4 py-2 rounded-md text-sm font-medium bg-black/40 text-white/70 border border-white/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: userData.name,
                          bio: userData.bio,
                        });
                      }}
                    >
                      Cancel
                    </m.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <div className="mb-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-2 border-b border-white/10 pb-2">
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium transition-colors ${
                activeTab === "profile" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTabChange("profile")}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium transition-colors ${
                activeTab === "stats" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTabChange("stats")}
            >
              Stats
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium transition-colors ${
                activeTab === "avatar" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTabChange("avatar")}
            >
              Avatar
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium transition-colors ${
                activeTab === "connections" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTabChange("connections")}
            >
              Connections
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium transition-colors ${
                activeTab === "activity" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTabChange("activity")}
            >
              Activity
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassmorphicCard className="p-6">
                <h3 className="text-lg font-orbitron text-[#00FFFF] mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Display Name</label>
                    <div className="bg-black/40 px-3 py-2 rounded-md border border-white/10">{profileData.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Email</label>
                    <div className="bg-black/40 px-3 py-2 rounded-md border border-white/10">{userData.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Status</label>
                    <div className="flex gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                            status === option.id
                              ? 'border-[#00FFFF]/50 bg-[#00FFFF]/10'
                              : 'border-white/10 bg-black/40 hover:bg-black/60'
                          }`}
                          onClick={() => handleStatusChange(option.id)}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: option.color }}
                          ></div>
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="p-6">
                <h3 className="text-lg font-orbitron text-[#FF00E6] mb-4">Progress</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white/70">Level Progress</span>
                      <span className="text-sm text-white/70">72%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00FFFF] to-[#FF00E6] w-[72%]"></div>
                    </div>
                    <div className="mt-1 text-xs text-white/50">1280 XP more until level {userData.level + 1}</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white/70">Voice Rooms Created</span>
                      <span className="text-sm text-white/70">8</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#9D00FF] to-[#FF00E6] w-[40%]"></div>
                    </div>
                    <div className="mt-1 text-xs text-white/50">Create 2 more rooms to earn "Room Creator" badge</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white/70">Connection Growth</span>
                      <span className="text-sm text-white/70">85/100</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] w-[85%]"></div>
                    </div>
                    <div className="mt-1 text-xs text-white/50">Connect with 15 more users to earn "Networker" badge</div>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          )}
          
          {activeTab === "stats" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <HolographicCard className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-orbitron text-[#00FFFF] mb-2">{userData.stats.roomsJoined}</div>
                <div className="text-sm text-white/60 text-center">Rooms Joined</div>
              </HolographicCard>
              
              <HolographicCard className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-orbitron text-[#9D00FF] mb-2">{userData.stats.connectionsCount}</div>
                <div className="text-sm text-white/60 text-center">Connections</div>
              </HolographicCard>
              
              <HolographicCard className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-orbitron text-[#FF00E6] mb-2">{userData.stats.hoursSpent}</div>
                <div className="text-sm text-white/60 text-center">Hours Spent</div>
              </HolographicCard>
              
              <HolographicCard className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#FF00E6] mb-2">{userData.stats.communitiesJoined}</div>
                <div className="text-sm text-white/60 text-center">Communities</div>
              </HolographicCard>
              
              <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#00FFFF] mb-4">Activity History</h3>
                  <div className="h-64 relative">
                    <div className="absolute inset-0 flex items-end">
                      {[...Array(30)].map((_, index) => {
                        const height = 20 + Math.floor(Math.random() * 80);
                        return (
                          <div 
                            key={index} 
                            className="flex-1 mx-0.5 rounded-t"
                            style={{ 
                              height: `${height}%`,
                              background: `linear-gradient(to top, ${
                                index % 3 === 0 ? '#00FFFF' : index % 3 === 1 ? '#9D00FF' : '#FF00E6'
                              }30, ${
                                index % 3 === 0 ? '#00FFFF' : index % 3 === 1 ? '#9D00FF' : '#FF00E6'
                              }60)`
                            }}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 text-xs text-white/40 pt-1">
                      Last 30 days
                    </div>
                  </div>
                </GlassmorphicCard>
              </div>
            </div>
          )}
          
          {activeTab === "avatar" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#00FFFF] mb-4">Preview</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 border-2 border-white/20 flex items-center justify-center relative mb-4">
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div 
                          className="w-full h-full flex items-center justify-center text-5xl font-bold"
                          style={{ 
                            background: selectedAvatar === 4 
                              ? 'linear-gradient(135deg, #00FFFF, #9D00FF, #FF00E6)' 
                              : selectedAvatar === 1 
                                ? '#00FFFF20' 
                                : selectedAvatar === 2 
                                  ? '#9D00FF20' 
                                  : '#FF00E620',
                            color: selectedAvatar === 1 
                              ? '#00FFFF' 
                              : selectedAvatar === 2 
                                ? '#9D00FF' 
                                : '#FF00E6'
                          }}
                        >
                          {profileData.name.charAt(0)}
                        </div>
                      </div>
                      <div 
                        className="absolute inset-0 rounded-full border-2 animate-pulse"
                        style={{ 
                          borderColor: selectedAvatar === 1 
                            ? '#00FFFF' 
                            : selectedAvatar === 2 
                              ? '#9D00FF' 
                              : '#FF00E6'
                        }}
                      ></div>
                    </div>
                    
                    <div className="text-lg font-orbitron mb-1" style={{ 
                      color: selectedAvatar === 1 
                        ? '#00FFFF' 
                        : selectedAvatar === 2 
                          ? '#9D00FF' 
                          : '#FF00E6'
                    }}>
                      {avatarOptions[selectedAvatar - 1].name}
                    </div>
                    <p className="text-sm text-white/60 text-center">Your virtual identity in voice rooms</p>
                  </div>
                </GlassmorphicCard>
              </div>
              
              <div className="md:col-span-2">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#00FFFF] mb-4">Choose Avatar Style</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {avatarOptions.map((avatar) => (
                      <m.div
                        key={avatar.id}
                        className={`p-4 rounded-xl cursor-pointer ${
                          selectedAvatar === avatar.id 
                            ? avatar.color === 'cyan' 
                              ? 'bg-[#00FFFF]/10 border border-[#00FFFF]/30' 
                              : avatar.color === 'purple' 
                                ? 'bg-[#9D00FF]/10 border border-[#9D00FF]/30'
                                : avatar.color === 'pink'
                                  ? 'bg-[#FF00E6]/10 border border-[#FF00E6]/30'
                                  : 'bg-gradient-to-br from-[#00FFFF]/10 to-[#FF00E6]/10 border border-white/30'
                            : 'bg-black/20 border border-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAvatarSelect(avatar.id)}
                      >
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
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
                              className="text-2xl font-bold"
                              style={{ 
                                color: avatar.color === 'cyan' 
                                  ? '#00FFFF' 
                                  : avatar.color === 'purple' 
                                    ? '#9D00FF' 
                                    : '#FF00E6'
                              }}
                            >
                              {profileData.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium">{avatar.name}</div>
                        </div>
                      </m.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <h4 className="text-md font-orbitron text-[#9D00FF] mb-3">Voice Emotes</h4>
                    <p className="text-sm text-white/60 mb-4">
                      Your avatar will react to your voice and can express emotions
                    </p>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {["Happy", "Excited", "Calm", "Thinking", "Surprise"].map((emote, index) => (
                        <m.div
                          key={index}
                          className="p-2 bg-black/30 rounded-lg border border-white/10 text-center cursor-pointer"
                          whileHover={{ scale: 1.05, borderColor: "#00FFFF" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div 
                            className="text-xl mb-1"
                            style={{ color: index % 2 === 0 ? '#00FFFF' : '#FF00E6' }}
                          >
                            {index === 0 ? '😊' : index === 1 ? '😃' : index === 2 ? '😌' : index === 3 ? '🤔' : '😲'}
                          </div>
                          <div className="text-xs text-white/80">{emote}</div>
                        </m.div>
                      ))}
                    </div>
                  </div>
                </GlassmorphicCard>
                
                <div className="mt-4">
                  <GlassmorphicCard className="p-6">
                    <h3 className="text-lg font-orbitron text-[#FF00E6] mb-4">Avatar Upgrades</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF00E6]/20 to-[#00FFFF]/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">Reactive Effects</div>
                          <div className="text-xs text-white/60">Special visual effects when speaking</div>
                        </div>
                        <m.button
                          className="px-3 py-1 text-xs bg-[#FF00E6]/20 border border-[#FF00E6]/30 rounded-md text-[#FF00E6]"
                          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 0, 230, 0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Unlock
                        </m.button>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FFFF]/20 to-[#9D00FF]/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">Custom Animations</div>
                          <div className="text-xs text-white/60">Personalized avatar animations</div>
                        </div>
                        <m.button
                          className="px-3 py-1 text-xs bg-[#00FFFF]/20 border border-[#00FFFF]/30 rounded-md text-[#00FFFF]"
                          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Unlock
                        </m.button>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "connections" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassmorphicCard className="p-6">
                <h3 className="text-lg font-orbitron text-[#00FFFF] mb-4">Recent Connections</h3>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 border border-white/10 flex items-center justify-center">
                        <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">User{index + 1}</div>
                        <div className="text-xs text-white/60">Connected {index + 1} day{index > 0 ? 's' : ''} ago</div>
                      </div>
                      <m.button
                        className="p-2 bg-black/40 rounded-full text-white/60"
                        whileHover={{ scale: 1.1, color: "#00FFFF" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </m.button>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
              
              <div className="space-y-6">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#FF00E6] mb-4">Connection Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-white/10 text-center">
                      <div className="text-2xl font-orbitron text-[#00FFFF] mb-1">85</div>
                      <div className="text-xs text-white/60">Total Connections</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-white/10 text-center">
                      <div className="text-2xl font-orbitron text-[#FF00E6] mb-1">23</div>
                      <div className="text-xs text-white/60">Active This Week</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white/70">Network Growth</span>
                      <span className="text-sm text-white/70">85%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00FFFF] to-[#FF00E6] w-[85%]"></div>
                    </div>
                  </div>
                </GlassmorphicCard>
                
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#9D00FF] mb-4">Find Connections</h3>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <div className="text-sm font-medium text-white">Find people with similar interests</div>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by username or interest..."
                      className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] text-white text-sm"
                    />
                  </div>
                  
                  <m.button
                    className="w-full py-2 bg-[#9D00FF]/20 border border-[#9D00FF]/30 rounded-md text-[#9D00FF] text-sm font-medium"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(157, 0, 255, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Communities
                  </m.button>
                </GlassmorphicCard>
              </div>
            </div>
          )}
          
          {activeTab === "activity" && (
            <div className="space-y-6">
              <GlassmorphicCard className="p-6">
                <h3 className="text-lg font-orbitron text-[#00FFFF] mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="border-l-2 border-[#00FFFF]/50 pl-4 pb-4 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#00FFFF]"></div>
                      <div className="text-sm text-white/80">{
                        index === 0 
                          ? "Joined 'Neon Dojo' voice room"
                          : index === 1 
                            ? "Connected with 3 new users"
                            : index === 2
                              ? "Created a new room 'Digital Oasis'"
                              : index === 3
                                ? "Earned 'Voice Master' badge"
                                : "Changed avatar style"
                      }</div>
                      <div className="text-xs text-white/50">{index + 1} day{index > 0 ? 's' : ''} ago</div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#FF00E6] mb-4">Most Visited Rooms</h3>
                  <div className="space-y-3">
                    {["Neon Dojo", "Virtual Nexus", "Digital Oasis"].map((room, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ 
                            backgroundColor: index === 0 
                              ? '#00FFFF20' 
                              : index === 1 
                                ? '#9D00FF20' 
                                : '#FF00E620' 
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{room}</div>
                          <div className="text-xs text-white/60">{28 - index * 5} visits</div>
                        </div>
                        <AudioWaveform 
                          width={60} 
                          height={24} 
                          bars={5} 
                          color={index === 0 ? "#00FFFF" : index === 1 ? "#9D00FF" : "#FF00E6"}
                          activeColor="#FFFFFF"
                          className="opacity-60"
                        />
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
                
                <GlassmorphicCard className="p-6">
                  <h3 className="text-lg font-orbitron text-[#9D00FF] mb-4">Usage Patterns</h3>
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-white/80 mb-2">Time Spent by Category</h4>
                    <div className="h-4 bg-black/20 rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#00FFFF] w-[35%]"></div>
                      <div className="h-full bg-[#9D00FF] w-[25%]"></div>
                      <div className="h-full bg-[#FF00E6] w-[20%]"></div>
                      <div className="h-full bg-cyan-300 w-[20%]"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/60">
                      <div>Music: 35%</div>
                      <div>Gaming: 25%</div>
                      <div>Social: 20%</div>
                      <div>Tech: 20%</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white/80 mb-2">Active Hours</h4>
                    <div className="grid grid-cols-24 gap-[2px] h-10">
                      {[...Array(24)].map((_, i) => {
                        const height = i >= 8 && i <= 23 ? 10 + Math.floor(Math.random() * (i > 18 ? 90 : 40)) : Math.floor(Math.random() * 20);
                        return (
                          <div 
                            key={i} 
                            className="rounded-t"
                            style={{ 
                              height: `${height}%`,
                              backgroundColor: i >= 8 && i <= 23 
                                ? (i >= 18 ? '#FF00E6' : i >= 13 ? '#9D00FF' : '#00FFFF')
                                : '#2f2f2f'
                            }}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/50">
                      <div>12 AM</div>
                      <div>6 AM</div>
                      <div>12 PM</div>
                      <div>6 PM</div>
                      <div>11 PM</div>
                    </div>
                  </div>
                </GlassmorphicCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;