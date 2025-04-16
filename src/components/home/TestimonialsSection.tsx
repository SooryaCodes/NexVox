"use client";

import React, { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import ShimmeringText from "@/components/ShimmeringText";
import HolographicCard from "@/components/HolographicCard";
import { testimonials } from '@/data/testimonials';

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
      className="py-24 px-4 sm:px-8 relative"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#FF00E6]/10 to-black"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Accent dots */}
        <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse"></div>
        <div className="absolute bottom-[30%] right-[15%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse-slower"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#FF00E6]/5 blur-[100px] top-0 right-20"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00FFFF]/5 blur-[80px] -bottom-20 left-10"></div>
        
        {/* Animated lines */}
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/30 to-transparent left-1/3 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/20 to-transparent right-1/3 animate-pulse-slower"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <ShimmeringText
            text="What Users Say"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-16"
            variant="gradient"
            as="h2"
          />
        </m.div>
      
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {testimonials.map((testimonial, index) => (
            <m.div 
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut", 
                delay: 0.2 + (index * 0.1) 
              }}
            >
              <HolographicCard className="p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <m.p 
                      className="text-gray-300 mb-6"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    >
                      &quot;{testimonial.quote}&quot;
                    </m.p>
                    <div className="flex items-center">
                      <m.div 
                        className="mr-4"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00FFFF]/30">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </m.div>
                      <m.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                      >
                        <p className="font-semibold text-[#00FFFF]">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </m.div>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 