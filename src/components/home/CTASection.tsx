"use client";

import React from 'react';
import ShimmeringText from "@/components/ShimmeringText";
import FuturisticButton from "@/components/FuturisticButton";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AudioWaveform from "@/components/AudioWaveform";
import soundEffects from "@/utils/soundEffects";

interface CTASectionProps {
  onStartForFree: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartForFree }) => {
  return (
    <section className="py-24 px-4 sm:px-8 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 via-black to-[#9D00FF]/20"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Accent dots */}
        <div className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[25%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slower"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00FFFF]/5 blur-[100px] -top-20 left-0"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#9D00FF]/5 blur-[120px] bottom-0 right-0"></div>
        
        {/* Animated lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent top-1/3 animate-pulse-slower"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent bottom-1/3 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div data-aos="fade-up" data-aos-duration="800">
          <ShimmeringText
            text="Ready to Connect Globally?"
            className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-6"
            variant="gradient"
            as="h2"
          />
          <p className="text-base sm:text-lg md:text-xl opacity-80 mb-10 max-w-3xl mx-auto">
            Join thousands of users already experiencing the future of voice communication
          </p>
        </div>
        
        <div className="mb-12 flex justify-center" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
          <FuturisticButton 
            text="Start for Free" 
            type="neon"
            className="px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            glitchEffect={true}
            rippleEffect={true}
            accessibilityLabel="Get started with NexVox"
            soundEffect="success"
            onClick={onStartForFree}
          />
        </div>
        
        {/* Email subscription with sound effects */}
        <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
          <GlassmorphicCard
            gradient="cyan-purple"
            className="py-6 px-6 sm:px-8 max-w-md mx-auto hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-300"
          >
            <ShimmeringText
              text="Stay Updated"
              className="text-lg sm:text-xl mb-4 font-orbitron"
              variant="cyan"
            />
            <div className="mt-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-black/50 border border-[#00FFFF]/30 rounded-md px-4 py-3 focus:outline-none focus:border-[#00FFFF] text-white transition-all duration-300 focus:shadow-[0_0_0_2px_rgba(0,255,255,0.3)]"
                aria-label="Email subscription"
              />
              <button 
                className="mt-3 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-3 w-full hover:opacity-90 font-orbitron transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] active:scale-[0.98]" 
                aria-label="Subscribe"
                onClick={() => soundEffects.loadAndPlay('subscribe', '/audios/final-accept.mp3')}
              >
                Subscribe
              </button>
            </div>
          </GlassmorphicCard>
        </div>
        
        {/* Waveform effect for CTA */}
        <div 
          className="max-w-xl mx-auto mt-12"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="400"
        >
          <AudioWaveform 
            width={600} 
            height={100} 
            bars={150} 
            color="#9D00FF" 
            activeColor="#00FFFF" 
            className="transform scale-75 sm:scale-90 md:scale-100"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection; 