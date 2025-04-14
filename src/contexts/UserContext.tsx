'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AVATAR_TYPES, AVATAR_ANIMATIONS } from '@/types/room';

// Default user data
const defaultUser: User = {
  id: 1,
  name: "CyberUser",
  email: "user@nexvox.io",
  joinDate: new Date().toISOString(),
  bio: "Digital explorer and voice chat enthusiast. Love to connect with others across the metaverse.",
  avatarUrl: "",
  level: 24,
  status: "online",
  avatarType: "cyan",
  avatarAnimation: "pulse",
  badges: ["Early Adopter", "Voice Master", "Community Leader"],
  stats: {
    roomsJoined: 128,
    connectionsCount: 85,
    hoursSpent: 342,
    communitiesJoined: 7
  }
};

type UserContextType = {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  updateAvatar: (type: typeof AVATAR_TYPES[keyof typeof AVATAR_TYPES]) => void;
  updateAnimation: (animation: typeof AVATAR_ANIMATIONS[keyof typeof AVATAR_ANIMATIONS]) => void;
  updateStatus: (status: 'online' | 'away' | 'busy' | 'offline') => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise use default
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('nexvox_user');
      return savedUser ? { ...defaultUser, ...JSON.parse(savedUser) } : defaultUser;
    }
    return defaultUser;
  });

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexvox_user', JSON.stringify(user));
    }
  }, [user]);

  // Update the user state with partial data
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updates,
    }));
  }, []);

  // Specific update functions for common operations
  const updateAvatar = useCallback((type: typeof AVATAR_TYPES[keyof typeof AVATAR_TYPES]) => {
    setUser(prevUser => ({
      ...prevUser,
      avatarType: type,
    }));
  }, []);

  const updateAnimation = useCallback((animation: typeof AVATAR_ANIMATIONS[keyof typeof AVATAR_ANIMATIONS]) => {
    setUser(prevUser => ({
      ...prevUser,
      avatarAnimation: animation,
    }));
  }, []);

  const updateStatus = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
    setUser(prevUser => ({
      ...prevUser,
      status,
    }));
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, updateAvatar, updateAnimation, updateStatus }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 