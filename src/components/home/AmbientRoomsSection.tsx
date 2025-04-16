"use client";

import React from 'react';
import Link from "next/link";
import ShimmeringText from "@/components/ShimmeringText";
import AmbientRoom from "@/components/AmbientRoom";
import FuturisticButton from "@/components/FuturisticButton";

interface AmbientRoomsSectionProps {
  onExploreAllRooms: () => void;
}

const AmbientRoomsSection: React.FC<AmbientRoomsSectionProps> = ({ onExploreAllRooms }) => {
  return (
    <section id="ambient-rooms" className="py-24 px-4 sm:px-8 relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9D00FF]/10 via-black to-[#00FFFF]/10"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div>
          <ShimmeringText
            text="Discover Ambient Rooms"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-6"
            variant="gradient"
            as="h2"
          />
          <p className="text-center mb-16 max-w-2xl mx-auto text-sm sm:text-base">
            Explore specially designed voice environments with unique visual and audio characteristics
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Link href="/rooms">
            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden group cursor-pointer">
              <AmbientRoom 
                roomName="Neon District"
                roomType="music"
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                <h3 className="text-xl font-orbitron text-[#00FFFF] mb-2">Neon District</h3>
                <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  A cyberpunk-themed lounge with ambient city sounds and neon aesthetics.
                </p>
              </div>
            </div>
          </Link>
          
          <Link href="/rooms">
            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden group cursor-pointer">
              <AmbientRoom 
                roomName="Quantum Realm"
                roomType="conversation"
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                <h3 className="text-xl font-orbitron text-[#9D00FF] mb-2">Quantum Realm</h3>
                <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  An abstract space with quantum visualizations and ethereal audio textures.
                </p>
              </div>
            </div>
          </Link>
          
          <Link href="/rooms">
            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden group cursor-pointer">
              <AmbientRoom 
                roomName="Digital Oasis"
                roomType="chill"
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                <h3 className="text-xl font-orbitron text-[#FF00E6] mb-2">Digital Oasis</h3>
                <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  A calming digital environment with water elements and relaxing audio.
                </p>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <FuturisticButton 
            text="Explore All Rooms" 
            type="secondary"
            rippleEffect={true}
            accessibilityLabel="Explore all ambient rooms"
            onClick={onExploreAllRooms}
          />
        </div>
      </div>
    </section>
  );
};

export default AmbientRoomsSection; 