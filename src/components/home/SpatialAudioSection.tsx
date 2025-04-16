"use client";

import React from 'react';
import { m } from "framer-motion";

const SpatialAudioSection: React.FC = () => {
  return (
    <section id="spatial-audio" className="py-24 px-4 sm:px-8 relative min-h-screen flex items-center">
      {/* Black background */}
      <div className="absolute inset-0 bg-black"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-orbitron mb-6 text-[#00FFFF]">
              Spatial Audio Experience
            </h2>
            
            <p className="text-base sm:text-lg opacity-80 mb-8">
              NexVox brings conversations to life with immersive spatial audio technology that places each voice in a virtual environment, creating a sense of presence that traditional audio cannot match.
            </p>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="bg-gradient-to-br from-[#00FFFF]/30 to-transparent rounded-full p-3 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#00FFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-orbitron mb-2 text-[#00FFFF]">Room Positioning</h3>
                  <p className="opacity-80 text-sm sm:text-base">Voices are positioned in a virtual space, so you can hear where people are &quot;sitting&quot; in the room, making group conversations more natural.</p>
                </div>
              </div>
              
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="bg-gradient-to-br from-[#00FFFF]/30 to-transparent rounded-full p-3 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#00FFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-orbitron mb-2 text-[#00FFFF]">Directional Sound</h3>
                  <p className="opacity-80 text-sm sm:text-base">Experience audio that pans left and right based on a speaker&apos;s virtual position, creating an immersive soundscape that mimics real-world acoustics.</p>
                </div>
              </div>
              
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="bg-gradient-to-br from-[#00FFFF]/30 to-transparent rounded-full p-3 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#00FFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-orbitron mb-2 text-[#00FFFF]">Distance Perception</h3>
                  <p className="opacity-80 text-sm sm:text-base">Voices naturally fade as virtual distance increases, allowing you to focus on nearby conversations while still being aware of others in the room.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-72 sm:h-96 mt-8 md:mt-0">
            {/* Spatial audio visualization */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl border border-[#00FFFF]/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                  {/* Center user */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#0088FF] border-4 border-black flex items-center justify-center animate-pulse">
                      <span className="text-black font-bold text-xs sm:text-base">YOU</span>
                    </div>
                  </div>
                  
                  {/* Surrounding users */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * Math.PI * 2) / 8;
                    const radius = 100;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const colors = [
                      'from-[#00FFFF] to-[#0088FF]',
                      'from-[#9D00FF] to-[#FF00E6]',
                      'from-[#FF00E6] to-[#FF3300]'
                    ];
                    const colorIndex = i % colors.length;
                    
                    return (
                      <m.div
                        key={i}
                        className="absolute w-8 h-8 sm:w-12 sm:h-12"
                        animate={{
                          x: [x - 6 + Math.random() * 5, x + 6 + Math.random() * 5],
                          y: [y - 6 + Math.random() * 5, y + 6 + Math.random() * 5],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut'
                        }}
                        style={{ left: 'calc(50% - 24px)', top: 'calc(50% - 24px)' }}
                      >
                        <div className={`w-full h-full rounded-full bg-gradient-to-r ${colors[colorIndex]} border-2 border-black flex items-center justify-center`}>
                          <span className="text-black font-bold text-xs">{String.fromCharCode(65 + i)}</span>
                        </div>
                        
                        {/* Sound waves for active speakers */}
                        {(i === 2 || i === 5 || i === 7) && (
                          <div className="absolute inset-0 -z-10">
                            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
                            <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse"></div>
                          </div>
                        )}
                      </m.div>
                    );
                  })}
                  
                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full z-0">
                    <circle cx="50%" cy="50%" r="100" fill="none" stroke="#00FFFF" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />
                  </svg>
                </div>
              </div>
              
              {/* Label */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-block bg-black/60 px-4 py-2 rounded-full text-[#00FFFF] text-sm border border-[#00FFFF]/30">
                  3D Spatial Positioning
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpatialAudioSection; 