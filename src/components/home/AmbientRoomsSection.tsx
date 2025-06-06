"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import ShimmeringText from "@/components/ShimmeringText";
import AmbientRoom from "@/components/AmbientRoom";
import FuturisticButton from "@/components/FuturisticButton";
import GlitchText from "@/components/GlitchText";
import NeonGrid from "@/components/NeonGrid";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AudioWaveform from "@/components/AudioWaveform";
import soundEffects from "@/utils/soundEffects";

interface AmbientRoomsSectionProps {
  onExploreAllRooms: () => void;
}

const AmbientRoomsSection: React.FC<AmbientRoomsSectionProps> = ({ onExploreAllRooms }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  
  const rooms = [
    { 
      id: 1,
      name: "Cyber Lounge", 
      type: "music", 
      color: "#FF00E6", 
      participants: 4,
      badgeText: "MUSIC",
      description: "Join this room to connect with others in a voice-based chat experience."
    },
    { 
      id: 2,
      name: "Neon Dojo", 
      type: "conversation", 
      color: "#9D00FF", 
      participants: 1,
      badgeText: "CONVERSATION", 
      description: "Join this room to connect with others in a voice-based chat experience."
    },
    { 
      id: 3,
      name: "Virtual Nexus", 
      type: "chill", 
      color: "#FF00E6", 
      participants: 2,
      badgeText: "CHILL",
      description: "Join this room to connect with others in a voice-based chat experience."
    }
  ];

  const handleJoinRoom = (roomId: number) => {
    soundEffects.playClick();
    onExploreAllRooms();
    
    sessionStorage.setItem('pendingRoomNavigation', roomId.toString());
  };
  
  return (
    <section ref={sectionRef} id="ambient-rooms" className="py-24 px-4 sm:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-black z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9D00FF]/10 via-black to-[#FF00E6]/10 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-0"></div>
      </div>
      
      {/* NeonGrid background */}
      <div className="absolute inset-0 z-1">
        <NeonGrid 
          color="#FF00E6" 
          secondaryColor="#9D00FF" 
          density={40} 
          opacity={0.05} 
          animate={true} 
        />
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
        {/* Animated accent dots */}
        <div className="absolute top-[10%] right-[25%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] left-[10%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slower"></div>
        <div className="absolute top-[40%] left-[20%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#FF00E6]/5 blur-[150px] top-0 right-0"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#9D00FF]/5 blur-[120px] bottom-0 left-0"></div>
        
        {/* Animated lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#FF00E6]/20 to-transparent top-1/3 animate-pulse-slower"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#9D00FF]/20 to-transparent left-1/3 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/20 to-transparent right-1/3 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div data-aos="fade-up" data-aos-duration="800">
          <GlitchText
            text="Discover Ambient Rooms"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-6"
            color="pink"
            intensity="medium"
            activeOnView={true}
          />
          <p className="text-center mb-6 max-w-2xl mx-auto text-sm sm:text-base opacity-80">
            Explore specially designed voice environments with unique visual and audio characteristics
          </p>
          
          {/* Audio waveform visualization */}
          <div className="mb-16 flex justify-center">
            <AudioWaveform 
              width={300} 
              height={40} 
              bars={50} 
              color="#9D00FF" 
              activeColor="#FF00E6" 
              className="transform scale-90"
            />
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.name}
              className="rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 100}
              onMouseEnter={() => {
                setHoveredRoom(room.name);
                soundEffects.playHover();
              }}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <GlassmorphicCard
                gradient="purple-pink"
                glowOnHover={true}
                className="h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="relative h-52 md:h-64 rounded-lg overflow-hidden mb-4">
                    <AmbientRoom 
                      roomName={room.name}
                      roomType={room.type as "music" | "conversation" | "chill"}
                      participantCount={room.participants}
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-md bg-black/40 text-[10px] px-3 py-1 rounded-full border border-[#FF00E6]/50 text-[#FF00E6] font-semibold">
                      {room.badgeText}
                    </div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="px-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl text-white font-orbitron mb-1">
                        <span className="relative">
                          {room.name}
                          {hoveredRoom === room.name && (
                            <span 
                              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#FF00E6] to-[#9D00FF] w-full"
                            />
                          )}
                        </span>
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-sm mb-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-white/80">{room.participants} listening</span>
                      </div>
                    </div>
                    
                    <p className="text-sm opacity-70 mb-4 line-clamp-2">{room.description}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2 mb-4">
                      {/* Connected users visualization */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const avatarColors = [
                          'bg-gradient-to-br from-[#FF00E6] to-[#9D00FF]',
                          'bg-gradient-to-br from-[#9D00FF] to-[#FF00E6]',
                          'bg-gradient-to-br from-[#FF00E6] to-[#FF00E6]/70',
                          'bg-gradient-to-br from-[#9D00FF] to-[#9D00FF]/70',
                          'bg-gradient-to-br from-[#FF00E6]/70 to-[#9D00FF]/70',
                        ];
                      
                        return (
                          <div 
                            key={i} 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${avatarColors[i % avatarColors.length]} border border-black/30 transition-transform duration-300 hover:scale-125 hover:shadow-[0_0_10px_rgba(255,0,230,0.6)]`}
                            style={{ transform: `translateX(${i * -5}px)` }}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        );
                      })}
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/60 border border-[#FF00E6]/30 transition-transform duration-300 hover:scale-110"
                      >
                        +{room.participants - 5}
                      </div>
                    </div>
                    
                    <div className="mt-auto hover:scale-[1.03] transition-transform duration-300 active:scale-[0.97]">
                      <FuturisticButton
                        text="Join Room"
                        type="neon"
                        className="w-full py-2 text-sm"
                        rippleEffect={true}
                        glitchEffect={true}
                        onClick={() => handleJoinRoom(room.id)}
                      />
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          ))}
        </div>
        
        <div 
          className="mt-16 text-center"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
        >
          <FuturisticButton 
            text="Explore All Rooms" 
            type="secondary"
            glitchEffect={true}
            accessibilityLabel="Explore all ambient rooms"
            soundEffect="click"
            onClick={onExploreAllRooms}
          />
        </div>
      </div>
    </section>
  );
};

export default AmbientRoomsSection; 