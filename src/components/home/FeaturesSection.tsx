"use client";

import React, { useRef, useEffect } from 'react';
import GlitchText from "@/components/GlitchText";
import FeatureCard from "@/components/FeatureCard";
import { features } from '@/data/features';
import { forceBackgroundRefresh, triggerResizeEvent } from '@/utils/triggerResize';
import { useSectionSoundEffects, buttonSounds } from '@/utils/sectionSoundEffects';

const FeaturesSection: React.FC = () => {
  // Use our custom hook for section sound effects
  const sectionRef = useSectionSoundEffects('features', true, 'select');
  
  // Ensure background elements are visible
  useEffect(() => {
    // Force refresh when the component mounts
    forceBackgroundRefresh();
    
    // Add intersection observer to trigger refresh when section comes into view
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // When section comes into view, force background refresh
              forceBackgroundRefresh();
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="features" 
      className="py-24 px-4 sm:px-8 relative bg-grid"
      onMouseEnter={() => triggerResizeEvent()} // Trigger resize on mouse enter as fallback
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
              onClick={buttonSounds.tertiary}
              className="cursor-pointer"
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
          opacity: 1 !important; /* Force visibility */
          visibility: visible !important;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection; 