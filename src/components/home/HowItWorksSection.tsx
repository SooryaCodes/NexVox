"use client";

import React, { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import Link from "next/link";
import ShimmeringText from "@/components/ShimmeringText";
import AmbientRoom from "@/components/AmbientRoom";
import soundEffects from "@/utils/soundEffects";

const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 px-4 sm:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#9D00FF]/10 to-black"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated accent dots */}
        <div className="absolute top-[10%] right-[15%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow"></div>
        <div className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse-slower"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#9D00FF]/5 blur-[100px] -top-10 right-0"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#00FFFF]/5 blur-[120px] bottom-0 left-20"></div>
        
        {/* Animated lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent top-1/3 animate-pulse-slower"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/20 to-transparent left-1/3 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <ShimmeringText
            text="How NexVox Works"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-16"
            variant="gradient"
            as="h2"
          />
        </m.div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-12">
              <m.div 
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              >
                <m.div 
                  className="flex gap-4 items-start"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  onMouseEnter={() => soundEffects.playHover()}
                >
                  <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">1</div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Create Your Profile</h3>
                    <p className="opacity-80">Choose your username and customize your animated avatar to represent you in voice rooms.</p>
                  </div>
                </m.div>
              </m.div>
              
              <m.div 
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              >
                <m.div 
                  className="flex gap-4 items-start"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  onMouseEnter={() => soundEffects.playHover()}
                >
                  <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">2</div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Browse Active Rooms</h3>
                    <p className="opacity-80">Explore a variety of voice rooms organized by topic, language, or vibe.</p>
                  </div>
                </m.div>
              </m.div>
              
              <m.div 
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              >
                <m.div 
                  className="flex gap-4 items-start"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  onMouseEnter={() => soundEffects.playHover()}
                >
                  <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">3</div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Join the Conversation</h3>
                    <p className="opacity-80">Drop into any room and start connecting with people from around the world in real-time.</p>
                  </div>
                </m.div>
              </m.div>
            </div>
          </div>
          
          <m.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <AmbientRoom 
                roomName="Synthwave Dreams" 
                participantCount={128} 
                roomType="music" 
                className="h-48"
              />
              <AmbientRoom 
                roomName="Global Chat" 
                participantCount={245} 
                roomType="conversation" 
                className="h-48"
              />
              <AmbientRoom 
                roomName="Gaming Lobby" 
                participantCount={87} 
                roomType="gaming" 
                className="h-48"
              />
              <AmbientRoom 
                roomName="Chill Vibes" 
                participantCount={164} 
                roomType="chill" 
                className="h-48"
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 