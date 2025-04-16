"use client";

import React, { useRef } from 'react';
import GlitchText from "@/components/GlitchText";
import FeatureCard from "@/components/FeatureCard";
import { features } from '@/data/features';

const FeaturesSection: React.FC = () => {
  const featuresRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={featuresRef} 
      id="features" 
      className="py-24 px-4 sm:px-8 relative bg-grid"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#9D00FF]/10 to-black z-0"></div>
      
      {/* Animated accent dots */}
      <div className="absolute top-[10%] right-[15%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow z-1"></div>
      <div className="absolute bottom-[20%] left-[10%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse-slower z-1"></div>
      
      {/* Animated vertical lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#9D00FF]/30 to-transparent left-1/3 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/30 to-transparent right-1/3 animate-pulse-slower"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          data-aos="fade-up" 
          data-aos-duration="1000"
        >
          <GlitchText
            text="Experience the Future of Voice"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-16"
            color="cyan"
            intensity="medium"
            activeOnView={true}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="800"
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                bgColor={feature.color as 'cyan' | 'purple' | 'pink' | 'gradient'}
                iconPath={feature.iconPath}
                className="h-full transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Style for animations */}
      <style jsx global>{`
        .bg-grid {
          background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: 0;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection; 