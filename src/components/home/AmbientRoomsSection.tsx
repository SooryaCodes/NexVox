"use client";

import React, { useRef } from 'react';
import { useRouter } from "next/navigation";
import ShimmeringText from "@/components/ShimmeringText";
import AmbientRoom from "@/components/AmbientRoom";
import FuturisticButton from "@/components/FuturisticButton";
import soundEffects from "@/utils/soundEffects";

interface AmbientRoomsSectionProps {
  onExploreAllRooms: () => void;
}

const AmbientRoomsSection: React.FC<AmbientRoomsSectionProps> = ({ onExploreAllRooms }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  
  const rooms = [
    { 
      name: "Neon District", 
      type: "music", 
      color: "#FF00E6", 
      participants: 128,
      badgeText: "MUSIC"
    },
    { 
      name: "Quantum Realm", 
      type: "conversation", 
      color: "#00FFFF", 
      participants: 128,
      badgeText: "CONVERSATION"
    },
    { 
      name: "Digital Oasis", 
      type: "chill", 
      color: "#00FFFF", 
      participants: 128,
      badgeText: "CHILL"
    }
  ];

  const handleJoinRoom = (roomName: string) => {
    soundEffects.playClick();
    router.push(`/rooms/${roomName.toLowerCase().replace(/\s+/g, '-')}`);
  };
  
  return (
    <section ref={sectionRef} id="ambient-rooms" className="py-24 px-4 sm:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/noise.png')] opacity-10"></div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated accent dots */}
        <div className="absolute top-[10%] right-[25%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] left-[10%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse-slower"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#9D00FF]/5 blur-[120px] top-0 right-0"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#00FFFF]/5 blur-[100px] bottom-0 left-0"></div>
        
        {/* Animated lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent top-1/3 animate-pulse-slower"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/20 to-transparent left-1/3 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div>
          <ShimmeringText
            text="Discover Ambient Rooms"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-6"
            variant="gradient"
            as="h2"
          />
          <p className="text-center mb-16 max-w-2xl mx-auto text-sm sm:text-base opacity-80">
            Explore specially designed voice environments with unique visual and audio characteristics
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, index) => (
            <div 
              key={room.name}
              className="rounded-xl overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 rounded-xl overflow-hidden">
                <AmbientRoom 
                  roomName={room.name}
                  roomType={room.type as "music" | "conversation" | "chill"}
                  participantCount={room.participants}
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute top-4 right-4 bg-black/60 text-[10px] px-3 py-1 rounded-full text-[#FF00E6] border border-[#FF00E6]/30">
                  {room.badgeText}
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center">
                  <h3 className="text-xl text-white font-orbitron mb-1">{room.name}</h3>
                </div>
                <div className="flex items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-white/80">{room.participants} listening</span>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {'ABCDE'.split('').map((letter, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        room.type === 'music' ? 'bg-[#FF00E6]' : 
                        room.type === 'conversation' ? 'bg-[#00FFFF]' : 'bg-[#00FFFF]'
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-700">
                    +123
                  </div>
                </div>
                
                <div className="mt-6 mb-2">
                  <FuturisticButton
                    text="Join Room"
                    type="secondary"
                    className="w-full py-2 text-sm"
                    rippleEffect={true}
                    onClick={() => handleJoinRoom(room.name)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <FuturisticButton 
            text="Explore All Rooms" 
            type="secondary"
            rippleEffect={true}
            accessibilityLabel="Explore all ambient rooms"
            onClick={onExploreAllRooms}
            className="border border-cyan-400/30 hover:border-cyan-400/60"
          />
        </div>
      </div>
    </section>
  );
};

export default AmbientRoomsSection; 