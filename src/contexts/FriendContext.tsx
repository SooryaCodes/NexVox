'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/room';

// Sample friends data
const sampleFriends: User[] = [
  {
    id: 2,
    name: "NebulaGamer",
    status: "online",
    avatarType: "purple",
    badges: ["Gaming Pro", "VR Enthusiast"],
    level: 32,
  },
  {
    id: 3,
    name: "SynthWave",
    status: "away",
    avatarType: "gradient",
    badges: ["Music Producer", "Beat Master"],
    level: 45,
  },
  {
    id: 4,
    name: "QuantumCoder",
    status: "offline",
    avatarType: "cyan",
    badges: ["Code Wizard", "AI Developer"],
    level: 28,
  },
  {
    id: 5,
    name: "CyberNova",
    status: "busy",
    avatarType: "pink",
    badges: ["Digital Artist", "Creator"],
    level: 37,
  },
];

// Sample friend requests data
const sampleIncomingRequests: User[] = [
  {
    id: 6,
    name: "TechExplorer",
    status: "online",
    avatarType: "blue",
    badges: ["Tech Enthusiast"],
    level: 19,
  },
  {
    id: 7,
    name: "VoxMaster",
    status: "online",
    avatarType: "green",
    badges: ["Voice Master"],
    level: 24,
  },
];

// Sample outgoing requests
const sampleOutgoingRequests: User[] = [
  {
    id: 8,
    name: "PixelPioneer",
    status: "away",
    avatarType: "purple",
    badges: ["Digital Creator"],
    level: 31,
  },
];

// Sample global users for discovery
const sampleGlobalUsers: User[] = [
  {
    id: 9,
    name: "NeonRider",
    status: "online",
    avatarType: "gradient",
    badges: ["Top Contributor", "Community Leader"],
    level: 56,
  },
  {
    id: 10,
    name: "ByteCrafter",
    status: "online",
    avatarType: "cyan",
    badges: ["Developer", "Code Expert"],
    level: 42,
  },
  {
    id: 11,
    name: "EchoVox",
    status: "away",
    avatarType: "blue",
    badges: ["Voice Talent", "Public Speaker"],
    level: 38,
  },
  {
    id: 12,
    name: "DigitalDreamer",
    status: "online",
    avatarType: "pink",
    badges: ["Creative Designer", "Visionary"],
    level: 49,
  },
  {
    id: 13,
    name: "WaveRunner",
    status: "busy",
    avatarType: "green",
    badges: ["Audio Engineer", "Sound Designer"],
    level: 35,
  },
];

type FriendContextType = {
  friends: User[];
  incomingRequests: User[];
  outgoingRequests: User[];
  globalUsers: User[];
  addFriend: (userId: number) => void;
  removeFriend: (userId: number) => void;
  sendFriendRequest: (userId: number) => void;
  acceptFriendRequest: (userId: number) => void;
  rejectFriendRequest: (userId: number) => void;
  cancelFriendRequest: (userId: number) => void;
  searchUsers: (query: string) => User[];
  unreadRequestsCount: number;
};

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise use sample data
  const [friends, setFriends] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const savedFriends = localStorage.getItem('nexvox_friends');
      return savedFriends ? JSON.parse(savedFriends) : sampleFriends;
    }
    return sampleFriends;
  });

  const [incomingRequests, setIncomingRequests] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRequests = localStorage.getItem('nexvox_incoming_requests');
      return savedRequests ? JSON.parse(savedRequests) : sampleIncomingRequests;
    }
    return sampleIncomingRequests;
  });

  const [outgoingRequests, setOutgoingRequests] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOutgoing = localStorage.getItem('nexvox_outgoing_requests');
      return savedOutgoing ? JSON.parse(savedOutgoing) : sampleOutgoingRequests;
    }
    return sampleOutgoingRequests;
  });

  const [globalUsers, setGlobalUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const savedGlobal = localStorage.getItem('nexvox_global_users');
      return savedGlobal ? JSON.parse(savedGlobal) : sampleGlobalUsers;
    }
    return sampleGlobalUsers;
  });

  // Calculate unread requests count
  const unreadRequestsCount = incomingRequests.length;

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexvox_friends', JSON.stringify(friends));
      localStorage.setItem('nexvox_incoming_requests', JSON.stringify(incomingRequests));
      localStorage.setItem('nexvox_outgoing_requests', JSON.stringify(outgoingRequests));
      localStorage.setItem('nexvox_global_users', JSON.stringify(globalUsers));
    }
  }, [friends, incomingRequests, outgoingRequests, globalUsers]);

  // Add a user as a friend directly
  const addFriend = useCallback((userId: number) => {
    const user = globalUsers.find(u => u.id === userId);
    if (user && !friends.some(f => f.id === userId)) {
      setFriends(prev => [...prev, user]);
      setGlobalUsers(prev => prev.filter(u => u.id !== userId));
    }
  }, [friends, globalUsers]);

  // Remove a friend
  const removeFriend = useCallback((userId: number) => {
    const user = friends.find(f => f.id === userId);
    if (user) {
      setFriends(prev => prev.filter(f => f.id !== userId));
      setGlobalUsers(prev => [...prev, user]);
    }
  }, [friends]);

  // Send a friend request
  const sendFriendRequest = useCallback((userId: number) => {
    const user = globalUsers.find(u => u.id === userId);
    if (user && !outgoingRequests.some(r => r.id === userId)) {
      setOutgoingRequests(prev => [...prev, user]);
    }
  }, [globalUsers, outgoingRequests]);

  // Accept a friend request
  const acceptFriendRequest = useCallback((userId: number) => {
    const user = incomingRequests.find(r => r.id === userId);
    if (user) {
      setFriends(prev => [...prev, user]);
      setIncomingRequests(prev => prev.filter(r => r.id !== userId));
    }
  }, [incomingRequests]);

  // Reject a friend request
  const rejectFriendRequest = useCallback((userId: number) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== userId));
  }, []);

  // Cancel an outgoing friend request
  const cancelFriendRequest = useCallback((userId: number) => {
    setOutgoingRequests(prev => prev.filter(r => r.id !== userId));
  }, []);

  // Search users by name
  const searchUsers = useCallback((query: string): User[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return globalUsers.filter(user => 
      user.name.toLowerCase().includes(lowerQuery)
    );
  }, [globalUsers]);

  return (
    <FriendContext.Provider value={{ 
      friends, 
      incomingRequests, 
      outgoingRequests, 
      globalUsers,
      addFriend, 
      removeFriend, 
      sendFriendRequest, 
      acceptFriendRequest, 
      rejectFriendRequest, 
      cancelFriendRequest,
      searchUsers,
      unreadRequestsCount
    }}>
      {children}
    </FriendContext.Provider>
  );
};

// Custom hook to use the friend context
export const useFriends = () => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
};

export default FriendContext; 