"use client";

import React from 'react';
import { m } from "framer-motion";
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 via-black to-[#9D00FF]/20"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div>
          <ShimmeringText
            text="Ready to Connect Globally?"
            className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-6"
            variant="gradient"
            as="h2"
          />
          <p className="text-base sm:text-lg md:text-xl opacity-80 mb-10 max-w-3xl mx-auto">Join thousands of users already experiencing the future of voice communication</p>
        </div>
        
        <div className="mb-12 flex justify-center">
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
        <div>
          <GlassmorphicCard
            gradient="cyan-purple"
            className="py-6 px-6 sm:px-8 max-w-md mx-auto"
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
                className="w-full bg-black/50 border border-[#00FFFF]/30 rounded-md px-4 py-3 focus:outline-none focus:border-[#00FFFF] text-white"
                aria-label="Email subscription"
              />
              <m.button 
                className="mt-3 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-3 w-full hover:opacity-90 font-orbitron" 
                aria-label="Subscribe"
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => soundEffects.loadAndPlay('subscribe', '/audios/final-accept.mp3')}
              >
                Subscribe
              </m.button>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 