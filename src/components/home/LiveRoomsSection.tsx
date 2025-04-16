"use client";

import React from 'react';
import GlitchText from "@/components/GlitchText";
import FuturisticButton from "@/components/FuturisticButton";
import { useScrollAnimation, getAnimationClasses } from '@/utils/useScrollAnimation';

interface LiveRoomsSectionProps {
  onBrowseRooms: () => void;
}

const LiveRoomsSection: React.FC<LiveRoomsSectionProps> = ({ onBrowseRooms }) => {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
    once: true,
    rootMargin: "0px 0px -10% 0px"
  });

  return (
    <section 
      ref={sectionRef}
      id="live-rooms" 
      className="py-24 px-4 sm:px-8 relative min-h-screen flex items-center"
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF00E6]/20 via-black to-[#00FFFF]/20"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={getAnimationClasses(isVisible, 'up')}>
          <GlitchText
            text="Join Live Rooms"
            className="text-4xl sm:text-5xl font-orbitron text-center mb-6"
            color="pink"
            intensity="high"
            activeOnView={true}
          />
          <p className="text-center opacity-80 mb-16 max-w-4xl mx-auto text-base sm:text-lg">
            We&apos;re revolutionizing how people connect across the globe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className={`bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#FF00E6]/20 transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,230,0.3)] ${getAnimationClasses(isVisible, 'up', 150, 0)}`}>
            <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#FF00E6]/20 to-transparent rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF00E6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[#FF00E6] font-orbitron text-xl mb-3">Live Streaming</h3>
            <p className="text-gray-300">Join live rooms with real-time streaming and participate in global conversations.</p>
          </div>
          
          <div className={`bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#9D00FF]/20 transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(157,0,255,0.3)] ${getAnimationClasses(isVisible, 'up', 150, 1)}`}>
            <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#9D00FF]/20 to-transparent rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9D00FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[#9D00FF] font-orbitron text-xl mb-3">Global Community</h3>
            <p className="text-gray-300">Connect with users worldwide in topic-based rooms with crystal-clear audio.</p>
          </div>
          
          <div className={`bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#00FFFF]/20 transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] ${getAnimationClasses(isVisible, 'up', 150, 2)}`}>
            <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#00FFFF]/20 to-transparent rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[#00FFFF] font-orbitron text-xl mb-3">Ambient Rooms</h3>
            <p className="text-gray-300">Experience themed audio environments with ambient soundscapes and visuals.</p>
          </div>
        </div>
        
        <div className={`mt-16 flex justify-center ${getAnimationClasses(isVisible, 'up', 300)}`}>
          <FuturisticButton 
            text="Browse All Rooms" 
            type="neon"
            glitchEffect={true}
            rippleEffect={true}
            accessibilityLabel="Browse all available rooms"
            soundEffect="click"
            onClick={onBrowseRooms}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveRoomsSection; 