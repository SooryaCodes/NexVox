"use client";

import React, { useState } from "react";
import { m } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { getAvatarStyle } from "@/utils/profileUtils";
import { AVATAR_TYPES, User } from "@/types/room";

interface ProfileTabProps {
  currentUser?: User;
  toggleUserProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ currentUser: userProp, toggleUserProfile }) => {
  const userContext = useUser();
  const user = userProp || userContext.user;
  const { updateUser } = userContext;
  const { playClick, playEdit, playSave } = useSoundEffects();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || "",
    status: user.status || "online"
  });
  
  // Get avatar style based on user's selected avatar type
  const avatarStyle = getAvatarStyle(user.avatarType || AVATAR_TYPES.CYAN);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    playClick();
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      playSave();
      updateUser({
        name: formData.name,
        bio: formData.bio,
        status: formData.status as any
      });
    } else {
      // Enter edit mode
      playEdit();
    }
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="overflow-y-auto h-full">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-white/10">
        <h3 className="text-lg font-orbitron text-[#9D00FF]">Your Profile</h3>
      </div>
      
      <div className="p-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center mb-4 relative">
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ background: avatarStyle.background }}
          >
            <span 
              className="text-3xl font-bold"
              style={{ color: avatarStyle.color }}
            >
              {user.name.charAt(0)}
            </span>
          </div>
          
          {/* Edit avatar button */}
          <m.button
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleUserProfile}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </m.button>
        </div>
        
        <h3 className="text-xl font-orbitron" style={{ color: avatarStyle.color }}>{user.name}</h3>
        
        {/* User level */}
        <div className="flex items-center gap-2 mb-6">
          <div className="px-3 py-1 bg-[#9D00FF]/20 rounded-full text-xs border border-[#9D00FF]/30">
            Level {user.level || 1}
          </div>
        </div>
        
        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="w-full mb-6">
            <h4 className="text-sm text-white/70 mb-2">Your Badges</h4>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge: string, index: number) => (
                <div 
                  key={index} 
                  className="px-3 py-1 bg-black/40 rounded-full text-xs border"
                  style={{ 
                    borderColor: index % 3 === 0 ? '#00FFFF40' : 
                              index % 3 === 1 ? '#9D00FF40' : '#FF00E640',
                    color: index % 3 === 0 ? '#00FFFF' : 
                           index % 3 === 1 ? '#9D00FF' : '#FF00E6'
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Profile Form */}
        <div className="w-full space-y-4 mt-4">
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Display Name</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Bio</label>
            <textarea 
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell others about yourself..."
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors resize-none"
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-center">
            <m.button 
              className="bg-[#9D00FF]/20 text-[#9D00FF] border border-[#9D00FF]/30 rounded-md py-2 px-6 text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(157, 0, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditToggle}
            >
              {isEditing ? "Save Profile" : "Edit Profile"}
            </m.button>
          </div>
          
          <div className="pt-4 text-center">
            <m.button 
              className="text-[#FF00E6] text-sm hover:underline"
              onClick={toggleUserProfile}
            >
              View Full Profile Card
            </m.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
