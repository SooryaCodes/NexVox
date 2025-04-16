"use client";

import React, { useRef } from 'react';
import AudioWaveform from '@/components/AudioWaveform';
import FeatureCard from '@/components/FeatureCard';
import HolographicCard from '@/components/HolographicCard';
import ShimmeringText from '@/components/ShimmeringText';

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      id: 1,
      title: "Voice Synchronization",
      description: "Our AI-powered algorithms synchronize voice data across all connected devices with ultra-low latency.",
      iconPath: "/icons/sound-wave.svg",
    },
    {
      id: 2,
      title: "Spatial Positioning",
      description: "Experience precise spatial audio that positions each voice according to their virtual location.",
      iconPath: "/icons/location.svg",
    },
    {
      id: 3,
      title: "Immersive Audio",
      description: "Advanced audio processing creates an immersive soundscape that mimics real-world acoustics.",
      iconPath: "/icons/headphones.svg",
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 relative" id="how-it-works">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#090224] to-black">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-fadeIn" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
          <ShimmeringText
            as="h2"
            text="How It Works"
            className="text-4xl md:text-5xl font-orbitron mb-4"
            variant="gradient"
          />
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg">
              NexVox transforms voice communication using advanced AI and spatial audio technology
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <AudioWaveform 
              width={500} 
              height={70} 
              bars={120} 
              color="#0070f3" 
              activeColor="#00c6ff" 
              className="transform scale-75 sm:scale-90 md:scale-100"
            />
          </div>
        </div>
        
        {/* Technical visualization */}
        <div className="mb-20 opacity-0 animate-fadeIn" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <HolographicCard 
            className="p-6 md:p-10 max-w-4xl mx-auto"
            color="cyan"
            glowIntensity="medium"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-orbitron text-white">Technology Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-orbitron text-cyan-300 mb-3">Voice Processing Pipeline</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-cyan-500 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Audio capture and noise reduction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-500 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Compression and encryption</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-500 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Spatial positioning calculation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-purple-500 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Ultra-low latency transmission</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-orbitron text-blue-300 mb-3">AI-Enhanced Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-400 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Machine learning noise cancellation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-400 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Voice enhancement and clarity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-violet-400 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Dynamic room acoustic simulation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-purple-400 mr-3 mt-1 flex-shrink-0"></span>
                    <span>Real-time voice activity detection</span>
                  </li>
                </ul>
              </div>
            </div>
          </HolographicCard>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={feature.id} className="opacity-0 animate-fadeIn" style={{ animationDelay: `${300 + index * 150}ms`, animationFillMode: "forwards" }}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                iconPath={feature.iconPath}
                bgColor={index === 0 ? "cyan" : index === 1 ? "purple" : "gradient"}
              />
            </div>
          ))}
        </div>
        
        {/* Signal flow diagram */}
        <div className="opacity-0 animate-fadeIn" style={{ animationDelay: "800ms", animationFillMode: "forwards" }}>
          <div className="relative max-w-3xl mx-auto p-6 border border-blue-500/30 rounded-xl bg-gradient-to-r from-blue-950/50 to-indigo-950/50">
            <h3 className="text-2xl font-orbitron text-center mb-6 text-blue-300">Signal Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3 border border-blue-500/40">
                  <img src="/icons/microphone.svg" alt="Input" className="w-10 h-10" />
                </div>
                <p className="text-blue-200 font-medium">Voice Input</p>
              </div>
              
              <div className="hidden md:block">
                <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10H96" stroke="url(#paint0_linear)" strokeWidth="2" />
                  <path d="M90 1L99 10L90 19" stroke="url(#paint1_linear)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="10" x2="100" y2="10" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0070f3" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#0070f3" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="90" y1="10" x2="99" y2="10" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0070f3" />
                      <stop offset="1" stopColor="#00c6ff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="md:hidden">
                <svg width="20" height="40" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0V36" stroke="url(#paint0_linear_vertical)" strokeWidth="2" />
                  <path d="M1 30L10 39L19 30" stroke="url(#paint1_linear_vertical)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="paint0_linear_vertical" x1="10" y1="0" x2="10" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0070f3" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#0070f3" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_vertical" x1="10" y1="30" x2="10" y2="39" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0070f3" />
                      <stop offset="1" stopColor="#00c6ff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-3 border border-indigo-500/40">
                  <img src="/icons/cpu.svg" alt="Processing" className="w-10 h-10" />
                </div>
                <p className="text-indigo-200 font-medium">AI Processing</p>
              </div>
              
              <div className="hidden md:block">
                <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10H96" stroke="url(#paint0_linear)" strokeWidth="2" />
                  <path d="M90 1L99 10L90 19" stroke="url(#paint1_linear)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="10" x2="100" y2="10" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6b46c1" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#6b46c1" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="90" y1="10" x2="99" y2="10" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6b46c1" />
                      <stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="md:hidden">
                <svg width="20" height="40" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0V36" stroke="url(#paint0_linear_vertical)" strokeWidth="2" />
                  <path d="M1 30L10 39L19 30" stroke="url(#paint1_linear_vertical)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="paint0_linear_vertical" x1="10" y1="0" x2="10" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6b46c1" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#6b46c1" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_vertical" x1="10" y1="30" x2="10" y2="39" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6b46c1" />
                      <stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-violet-500/20 rounded-full flex items-center justify-center mb-3 border border-violet-500/40">
                  <img src="/icons/headphones.svg" alt="Output" className="w-10 h-10" />
                </div>
                <p className="text-violet-200 font-medium">Spatial Output</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection; 