"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const HeaderUserMenu = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { playClick } = useSoundEffects();
  const pathname = usePathname();
  
  // Memoize avatar style to prevent unnecessary recalculations
  const avatarStyle = useMemo(() => 
    getAvatarStyle(user.avatarType || 'cyan'),
    [user.avatarType]
  );
  
  // Memoize status color
  const statusColor = useMemo(() => 
    getStatusColor(user.status || 'online'),
    [user.status]
  );
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  const toggleMenu = () => {
    playClick();
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="relative" ref={menuRef}>
      <m.button
        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* User avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
          style={{ background: avatarStyle.background }}
        >
          <span className="text-sm font-bold" style={{ color: avatarStyle.color }}>
            {user.name.charAt(0)}
          </span>
          
          {/* Status indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black"
            style={{ backgroundColor: statusColor }}
          ></div>
        </div>
        
        <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">{user.name}</span>
        
        {/* Dropdown icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </m.button>
      
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-60 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* User info section */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
                  style={{ background: avatarStyle.background }}
                >
                  <span className="text-xl font-bold" style={{ color: avatarStyle.color }}>
                    {user.name.charAt(0)}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    ></div>
                    <span className="text-white/70 capitalize">{user.status || 'Online'}</span>
                  </div>
                </div>
              </div>
              
              {/* Level indicator */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">Level {user.level || 1}</span>
                  <span className="text-white/70">{user.level || 0}/50 XP</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ 
                      width: `${Math.min(100, (user.level || 0) / 50 * 100)}%`,
                      background: avatarStyle.background 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Menu options */}
            <div className="py-1">
              <Link href="/profile">
                <m.div 
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>My Profile</span>
                </m.div>
              </Link>
              
              <Link href="/settings">
                <m.div 
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </m.div>
              </Link>
              
              {/* Status selector */}
              <div className="px-4 py-2 border-t border-white/10 mt-1">
                <p className="text-xs text-white/50 mb-2">Set Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['online', 'away', 'busy', 'offline'].map((status) => {
                    // Define statusType for proper typing
                    type StatusType = 'online' | 'away' | 'busy' | 'offline';
                    return (
                      <button 
                        key={status} 
                        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-sm"
                        onClick={() => {
                          playClick();
                          const { updateStatus } = useUser();
                          updateStatus(status as StatusType);
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(status) }}></div>
                        <span className="capitalize">{status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Logout option */}
              <Link href="/login">
                <m.div 
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors border-t border-white/10 mt-1 text-[#FF00E6]"
                  whileHover={{ x: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </m.div>
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderUserMenu; 