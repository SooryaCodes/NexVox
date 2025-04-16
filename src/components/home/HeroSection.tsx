"use client";

import React, { useRef } from 'react';
import FuturisticButton from "@/components/FuturisticButton";
import ShimmeringText from "@/components/ShimmeringText";
import AudioWaveform from "@/components/AudioWaveform";
import AnimatedTitle from "@/components/AnimatedTitle";
import NeonGrid from "@/components/NeonGrid";
import ParticlesBackground from "@/components/ParticlesBackground";
import soundEffects from "@/utils/soundEffects";

interface HeroSectionProps {
  onExploreRooms: () => void;
  onLearnMore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreRooms,
  onLearnMore
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const headlines = [
    "Connect Globally with NexVox",
    "Experience the Future of Voice",
    "Join the Cybernetic Revolution",
    "Connect Like Never Before"
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen p-4 sm:p-8 pt-16 grid place-items-center overflow-hidden">
      {/* Enhanced backgrounds - ensure z-index is proper */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Particle background with animated dots */}
        <ParticlesBackground />
        
        {/* Vibrant grid with proper density and visibility */}
        <NeonGrid 
          color="#00FFFF" 
          secondaryColor="#9D00FF" 
          density={40} 
          opacity={0.1} 
          animate={true} 
        />
        
        {/* Animated accent dots */}
        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse"></div>
        <div className="absolute top-[60%] left-[80%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse-slower"></div>
        <div className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow"></div>
        
        {/* Gradient overlay for depth */}
        <div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/70 z-0" 
          style={{ 
            background: 'radial-gradient(circle at 50% 30%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        />
      </div>
      
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Cyan blob */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#00FFFF]/10 blur-[120px] -top-64 -left-20 opacity-60"></div>
        
        {/* Purple blob */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#9D00FF]/10 blur-[100px] bottom-0 right-0 opacity-60"></div>
        
        {/* Pink accent blob */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#FF00E6]/10 blur-[80px] top-1/3 left-1/4 opacity-50"></div>
        
        {/* Extra subtle bloom for depth */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 blur-[50px] top-1/2 right-1/4"></div>
      </div>
      
      {/* Animated vertical lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/30 to-transparent left-1/4 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#9D00FF]/30 to-transparent left-1/2 animate-pulse-slower"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/30 to-transparent left-3/4 animate-pulse-slow"></div>
        
        {/* Horizontal accent line */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent top-1/3 animate-pulse-slower"></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center z-10 pt-16 relative">
        {/* Text content - reduce vertical padding to center better */}
        <div className="mb-6 sm:mb-8" data-aos="fade-up" data-aos-duration="1000">
          <AnimatedTitle 
            titles={headlines} 
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#00FFFF] font-orbitron glow mb-3 sm:mb-4" 
          />
          <ShimmeringText
            text="The next-generation voice platform where the world meets in real-time"
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto px-2" 
            variant="gradient"
            as="p"
          />
        </div>
        
        {/* Move buttons above waveform */}
        <div 
          className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center mb-8"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
        >
          <FuturisticButton 
            text="Explore Rooms" 
            type="neon"
            glitchEffect={true}
            rippleEffect={true}
            accessibilityLabel="Explore NexVox voice rooms"
            soundEffect="special"
            onClick={onExploreRooms}
          />
          <FuturisticButton 
            text="Learn More" 
            type="secondary"
            accessibilityLabel="Learn more about NexVox features"
            soundEffect="default"
            onClick={onLearnMore}
          />
        </div>
        
        {/* Audio waveform visualization */}
        <div 
          className="mt-6"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="400"
        >
          <p className="text-sm mb-2 opacity-60">Live global audio activity</p>
          <div className="flex justify-center">
            <AudioWaveform 
              width={500} 
              height={80} 
              bars={100} 
              color="#FF00E6" 
              activeColor="#FF00E6" 
              className="transform scale-75 md:scale-100 max-w-full"
            />
          </div>
          
          {/* Move scroll indicator below waveform */}
          <div className="mt-10 flex justify-center items-center">
            <div 
              className="flex flex-col items-center"
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-duration="1000"
            >
              <p className="mb-3 text-sm font-orbitron tracking-wider text-[#00FFFF]/80">SCROLL TO EXPLORE</p>
              
              {/* Cyberpunk styled scroll indicator */}
              <div className="relative h-14 w-6 border border-[#00FFFF]/50 rounded-full flex justify-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-full w-full bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm"></div>
                
                {/* Animated dot */}
                <div className="absolute top-1 w-3 h-3 rounded-full animate-scroll-pulse">
                  <div className="w-full h-full rounded-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"></div>
                </div>
                
                {/* Glow effect at bottom */}
                <div className="absolute bottom-1 w-3 h-1 rounded-full bg-[#00FFFF]/30 blur-sm"></div>
              </div>
              
              {/* Arrow indicators */}
              <div className="relative mt-2 flex flex-col">
                <svg width="14" height="8" viewBox="0 0 14 8" className="mb-1 text-[#00FFFF]/80 animate-arrow-pulse-1">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <svg width="14" height="8" viewBox="0 0 14 8" className="text-[#00FFFF]/50 animate-arrow-pulse-2">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animations to style block */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        @keyframes scroll-pulse {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(9px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.8; }
        }
        
        .animate-scroll-pulse {
          animation: scroll-pulse 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        @keyframes arrow-pulse-1 {
          0%, 100% { opacity: 0.8; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(2px); }
        }
        
        @keyframes arrow-pulse-2 {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 0.3; transform: translateY(2px); }
        }
        
        .animate-arrow-pulse-1 {
          animation: arrow-pulse-1 1.5s ease-in-out infinite;
        }
        
        .animate-arrow-pulse-2 {
          animation: arrow-pulse-2 1.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        /* Keep existing float animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(20px); }
          75% { transform: translateY(-30px) translateX(-10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(-20px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(15px); }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection; 