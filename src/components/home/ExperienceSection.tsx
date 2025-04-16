"use client";

import React from 'react';
import { m } from "framer-motion";
import GlitchText from "@/components/GlitchText";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AppMockup from "@/components/AppMockup";
import AudioWaveform from "@/components/AudioWaveform";
import ShimmeringText from "@/components/ShimmeringText";

const ExperienceSection: React.FC = () => {
  return (
    <section id="rooms" className="py-24 px-4 sm:px-8 relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid"></div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <GlitchText
            text="Experience NexVox"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-4"
            color="cyan"
            intensity="high"
            activeOnView={true}
          />
          <p className="text-center text-[#00FFFF]/70 max-w-2xl mx-auto">
            Join the future of voice communication with our cutting-edge interface
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <ShimmeringText
              text="Intuitive Interface"
              className="text-2xl sm:text-3xl font-orbitron mb-4 text-[#00FFFF]"
              variant="cyan"
              as="h3"
            />
            
            <p className="text-base sm:text-lg opacity-80">
              Our interface is designed for seamless interaction. Experience a platform that responds to your needs with minimal learning curve.
            </p>
            
            <div className="space-y-4">
              {[
                { id: 1, feature: "Simple room navigation" },
                { id: 2, feature: "One-click microphone controls" },
                { id: 3, feature: "Responsive audio indicators" }
              ].map(item => (
                <m.div 
                  key={item.id}
                  className="flex items-center gap-3"
                  whileHover={{ x: 10, color: "#00FFFF" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-[#00FFFF]">✓</span>
                  <span>{item.feature}</span>
                </m.div>
              ))}
            </div>
            
            {/* Audio activity indicator */}
            <div>
              <p className="text-sm mb-2 opacity-60">Live voice activity</p>
              <AudioWaveform 
                width={300} 
                height={40} 
                bars={30} 
                color="#FF00E6" 
                activeColor="#00FFFF" 
              />
            </div>
          </div>
          
          <GlassmorphicCard
            gradient="cyan-purple"
            glowOnHover={true}
            className="p-4"
          >
            <AppMockup
              roomName="Cyber Lounge"
              className="mx-auto"
              showTooltips={true}
            />
          </GlassmorphicCard>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 