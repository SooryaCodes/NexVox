"use client";

import React, { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import GlitchText from "@/components/GlitchText";
import FeatureCard from "@/components/FeatureCard";
import { features } from '@/data/features';

const FeaturesSection: React.FC = () => {
  const featuresRef = useRef<HTMLElement>(null);
  const isInView = useInView(featuresRef, { once: false, amount: 0.3 });

  return (
    <section 
      ref={featuresRef} 
      id="features" 
      className="py-24 px-4 sm:px-8 relative bg-grid"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#9D00FF]/10 to-black"></div>
      
      {/* Animated accent dots */}
      <div className="absolute top-[10%] right-[15%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] left-[10%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse-slower"></div>
      
      {/* Animated vertical lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#9D00FF]/30 to-transparent left-1/3 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/30 to-transparent right-1/3 animate-pulse-slower"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <GlitchText
            text="Experience the Future of Voice"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-16"
            color="cyan"
            intensity="medium"
            activeOnView={true}
          />
        </m.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {features.map((feature, index) => (
            <m.div 
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut", 
                delay: 0.2 + (index * 0.1) 
              }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                bgColor={feature.color as 'cyan' | 'purple' | 'pink' | 'gradient'}
                iconPath={feature.iconPath}
                className="h-full transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              />
            </m.div>
          ))}
        </div>
      </div>
      
      {/* Style for animations */}
      <style jsx global>{`
        .bg-grid {
          background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection; 