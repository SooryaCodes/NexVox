"use client";

import React, { useRef } from 'react';
import GlitchText from "@/components/GlitchText";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AppMockup from "@/components/AppMockup";
import AudioWaveform from "@/components/AudioWaveform";
import ShimmeringText from "@/components/ShimmeringText";
import soundEffects from "@/utils/soundEffects";

const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  return (
    <section ref={sectionRef} id="rooms" className="py-24 px-4 sm:px-8 relative scanlines">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid z-0"></div>
      <div className="absolute inset-0 bg-black/50 z-1"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
        {/* Accent dots */}
        <div className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse"></div>
        <div className="absolute bottom-[25%] left-[15%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse-slower"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#00FFFF]/5 blur-[80px] top-0 left-10"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#FF00E6]/5 blur-[100px] bottom-0 right-0"></div>
        
        {/* Animated lines */}
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/20 to-transparent right-1/4 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16" data-aos="fade-up" data-aos-duration="800">
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
          <div className="space-y-8" data-aos="fade-right" data-aos-duration="1000">
            <ShimmeringText
              text="Intuitive Interface"
              className="text-2xl sm:text-3xl font-orbitron mb-4 text-[#00FFFF]"
              variant="cyan"
              as="h3"
            />
            
            <p className="text-base sm:text-lg opacity-80" data-aos="fade-up" data-aos-delay="200">
              Our interface is designed for seamless interaction. Experience a platform that responds to your needs with minimal learning curve.
            </p>
            
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="300">
              {[
                { id: 1, feature: "Simple room navigation" },
                { id: 2, feature: "One-click microphone controls" },
                { id: 3, feature: "Responsive audio indicators" }
              ].map(item => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 transition-all duration-300 hover:translate-x-2 hover:text-[#00FFFF]"
                  onMouseEnter={() => soundEffects.playHover()}
                  data-aos="fade-up"
                  data-aos-delay={300 + item.id * 100}
                >
                  <span className="text-[#00FFFF]">✓</span>
                  <span>{item.feature}</span>
                </div>
              ))}
            </div>
            
            {/* Audio activity indicator */}
            <div data-aos="fade-up" data-aos-delay="700">
              <p className="text-sm mb-2 opacity-60">Live voice activity</p>
              <AudioWaveform 
                width={300} 
                height={40} 
                bars={30} 
                color="#00FFFF" 
                activeColor="#FF00E6" 
              />
            </div>
          </div>
          
          <div 
            className="transform transition-all duration-500 hover:scale-105"
            data-aos="fade-left"
            data-aos-duration="1200"
            data-aos-delay="300"
          >
            <GlassmorphicCard
              gradient="cyan-purple"
              glowOnHover={true}
              className="p-4 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300"
            >
              <AppMockup
                roomName="Cyber Lounge"
                className="mx-auto"
                showTooltips={true}
              />
            </GlassmorphicCard>
          </div>
        </div>
      </div>
      
      {/* Style for scanlines and grid */}
      <style jsx global>{`
        .scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 255, 255, 0.05) 0.5px,
            transparent 1px
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 10;
        }
        
        .bg-grid {
          background-image: linear-gradient(to right, rgba(157, 0, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(157, 0, 255, 0.05) 1px, transparent 1px);
          background-size: 25px 25px;
          z-index: 0;
        }
      `}</style>
    </section>
  );
};

export default ExperienceSection; 