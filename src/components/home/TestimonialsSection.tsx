"use client";

import React from 'react';
import ShimmeringText from "@/components/ShimmeringText";
import HolographicCard from "@/components/HolographicCard";
import { testimonials } from '@/data/testimonials';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#FF00E6]/10 to-black"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div>
          <ShimmeringText
            text="What Users Say"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-16"
            variant="gradient"
            as="h2"
          />
        </div>
      
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name}>
              <HolographicCard className="p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <p className="text-gray-300 mb-6">&quot;{testimonial.quote}&quot;</p>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00FFFF]/30">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-[#00FFFF]">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 