"use client";

import React from 'react';
import soundEffects from '@/utils/soundEffects';
import { useSectionSoundEffects, handleClickSound, buttonSounds } from '@/utils/sectionSoundEffects';

const SpatialAudioSection: React.FC = () => {
  const sectionRef = useSectionSoundEffects('spatial-audio', true, 'oscillation');
  
  return (
    <section 
      ref={sectionRef}
      id="spatial-audio" 
      className="py-24 px-4 sm:px-8 relative min-h-screen flex items-center"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/20 via-black to-[#9D00FF]/20 z-0"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-1"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
        {/* Animated accent lines */}
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/30 to-transparent left-1/5 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#9D00FF]/30 to-transparent right-1/5 animate-pulse-slower"></div>
        
        {/* Horizontal accent lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent top-1/3 animate-pulse-slower"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent bottom-1/3 animate-pulse-slow"></div>
        
        {/* Accent dots */}
        <div className="absolute top-[25%] right-[10%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slower"></div>
        
        {/* Subtle blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00FFFF]/5 blur-[120px] -top-10 right-0"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#9D00FF]/5 blur-[120px] bottom-0 left-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <h2 
              className="text-3xl sm:text-4xl font-orbitron mb-6 text-[#00FFFF]"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              Spatial Audio Experience
            </h2>
            
            <p 
              className="text-base sm:text-lg opacity-80 mb-8"
              data-aos="fade-up" 
              data-aos-delay="300"
            >
              NexVox brings conversations to life with immersive spatial audio technology that places each voice in a virtual environment, creating a sense of presence that traditional audio cannot match.
            </p>
            
            <div className="space-y-6 sm:space-y-8">
              <div 
                className="flex gap-4 sm:gap-6 items-start hover:translate-x-2 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay="400"
                onClick={() => handleClickSound('soft')}
              >
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
              
              <div 
                className="flex gap-4 sm:gap-6 items-start hover:translate-x-2 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay="500"
                onClick={() => handleClickSound('soft')}
              >
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
              
              <div 
                className="flex gap-4 sm:gap-6 items-start hover:translate-x-2 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay="600"
                onClick={() => handleClickSound('soft')}
              >
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
          
          <div 
            className="relative h-72 sm:h-96 mt-8 md:mt-0"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            {/* Spatial audio visualization */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl border border-[#00FFFF]/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                  {/* Center user */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#0088FF] border-4 border-black flex items-center justify-center animate-pulse"
                      data-aos="zoom-in"
                      data-aos-delay="600"
                      onClick={buttonSounds.primary}
                    >
                      <span className="text-black font-bold text-xs sm:text-base">YOU</span>
                    </div>
                    {/* Audio waves around center user */}
                    <div className="absolute -inset-4 rounded-full border-4 border-[#00FFFF]/20 animate-ping-slow"></div>
                    <div className="absolute -inset-8 rounded-full border-2 border-[#00FFFF]/10 animate-ping-slower"></div>
                  </div>
                  
                  {/* Orbital paths */}
                  <svg className="absolute inset-0 w-full h-full z-0 animate-spin-very-slow">
                    <circle cx="50%" cy="50%" r="80" fill="none" stroke="#00FFFF" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />
                    <circle cx="50%" cy="50%" r="120" fill="none" stroke="#9D00FF" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />
                  </svg>
                  
                  {/* Orbital users */}
                  {/* User 1 */}
                  <div 
                    className="absolute top-[15%] right-[30%] z-10"
                    data-aos="fade-down-left"
                    data-aos-delay="800"
                  >
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#FF00E6] to-[#9D00FF] flex items-center justify-center animate-pulse-slow relative group cursor-pointer"
                      onClick={buttonSounds.icon}
                    >
                      <span className="text-white text-xs">P1</span>
                      <div className="absolute -inset-1 rounded-full border border-[#9D00FF]/30 animate-ping-slow opacity-70"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Alex</div>
                    </div>
                  </div>
                  
                  {/* User 2 */}
                  <div 
                    className="absolute bottom-[20%] right-[20%] z-10"
                    data-aos="fade-up-left"
                    data-aos-delay="1000"
                  >
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#00E6FF] flex items-center justify-center animate-pulse-slower relative group cursor-pointer"
                      onClick={buttonSounds.icon}
                    >
                      <span className="text-black text-xs">P2</span>
                      <div className="absolute -inset-1 rounded-full border border-[#00FFFF]/30 animate-ping-slower opacity-70"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Taylor</div>
                    </div>
                  </div>
                  
                  {/* User 3 */}
                  <div 
                    className="absolute top-[30%] left-[15%] z-10"
                    data-aos="fade-down-right" 
                    data-aos-delay="1200"
                  >
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#FF9D00] to-[#FFE600] flex items-center justify-center animate-pulse relative group cursor-pointer"
                      onClick={buttonSounds.icon}
                    >
                      <span className="text-black text-xs">P3</span>
                      <div className="absolute -inset-1 rounded-full border border-[#FFE600]/30 animate-ping opacity-70"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Jordan</div>
                    </div>
                  </div>
                  
                  {/* User 4 - far away/faded to show distance */}
                  <div 
                    className="absolute bottom-[10%] left-[30%] z-10"
                    data-aos="fade-up-right"
                    data-aos-delay="1400"
                  >
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#00FF9D]/70 to-[#00FFE6]/70 flex items-center justify-center animate-pulse-slow relative group opacity-60 cursor-pointer"
                      onClick={buttonSounds.icon}
                    >
                      <span className="text-black text-xs">P4</span>
                      <div className="absolute -inset-1 rounded-full border border-[#00FFE6]/20 animate-ping-slower opacity-50"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Morgan</div>
                    </div>
                  </div>
                  
                  {/* Sound indicator lines */}
                  <svg className="absolute inset-0 w-full h-full z-0 animate-pulse-slow">
                    <line x1="50%" y1="50%" x2="70%" y2="15%" stroke="#FF00E6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#00FFFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <line x1="50%" y1="50%" x2="15%" y2="30%" stroke="#FFE600" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <line x1="50%" y1="50%" x2="30%" y2="90%" stroke="#00FFE6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.2" />
                  </svg>
                </div>
              </div>
              
              {/* Label */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div 
                  className="inline-block bg-black/60 px-4 py-2 rounded-full text-[#00FFFF] text-sm border border-[#00FFFF]/30 cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay="800"
                  onClick={buttonSounds.secondary}
                >
                  Virtual Room Positioning
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