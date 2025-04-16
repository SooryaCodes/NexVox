"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import useSoundEffects from '@/hooks/useSoundEffects';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isLoading, 
  onLoadingComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [showScreen, setShowScreen] = useState(isLoading);
  const { playCustom } = useSoundEffects();
  const loadingRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isProgressComplete = progress === 100;
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts in browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate consistent particle data using useMemo
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    width: Math.random() * 4 + 1,
    height: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animDuration: Math.random() * 5 + 8,
    animDelay: Math.random() * 5
  })), []);

  // Generate grid cell flicker speeds
  const gridCellFlickers = useMemo(() => Array.from({ length: 100 }).map(() => 
    Math.random() * 2 + 1
  ), []);

  // Initialize and handle the loading audio
  useEffect(() => {
    if (isLoading && isClient) {
      // Create and configure audio element
      audioRef.current = new Audio('/audios/beep-beep.mp3');
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => console.error("Audio failed to play:", err));
      
      // Play additional loading sound
      playCustom('loading-process', '/audios/digital-load2.mp3');
      
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 3) + 1;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            // Play completion sound when reaching 100%
            playCustom('completion', '/audios/accept-loading-resolve.mp3');
            
            // Set timeout to hide loading screen after completion effect
            setTimeout(() => {
              setShowScreen(false);
              if (onLoadingComplete) onLoadingComplete();
              
              // Stop and cleanup audio
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
              }
            }, 1500);
            return 100;
          }
          
          // Play different sounds at certain progress milestones
          if (newProgress === 25) playCustom('milestone', '/audios/digital-click.mp3');
          if (newProgress === 50) playCustom('milestone', '/audios/digital-auth-process.mp3');
          if (newProgress === 75) playCustom('milestone', '/audios/process-request-accept.mp3');
          if (newProgress === 90) playCustom('milestone', '/audios/digital-process.mp3');
          
          return newProgress;
        });
      }, 120);
      
      return () => {
        clearInterval(interval);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [isLoading, playCustom, isClient]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!showScreen) return null;

  // Don't render anything on server
  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence>
      {showScreen && (
        <m.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          ref={loadingRef}
        >
          {/* Particle background effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
              {particles.map((particle, i) => (
                <div 
                  key={i}
                  className="absolute bg-cyan-400 opacity-30 rounded-full"
                  style={{
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    animation: `float ${particle.animDuration}s linear infinite`,
                    animationDelay: `${particle.animDelay}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 z-0 grid grid-cols-12 grid-rows-12 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`h-${i}`} className="w-full h-px bg-cyan-400" style={{ top: `${(i + 1) * (100 / 12)}%`, position: 'absolute' }} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`v-${i}`} className="h-full w-px bg-cyan-400" style={{ left: `${(i + 1) * (100 / 12)}%`, position: 'absolute' }} />
            ))}
          </div>
          
          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl px-6">
            {/* App logo/name */}
            <m.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="font-orbitron text-5xl font-bold tracking-wider text-white glow">
                NEXVOX
              </h1>
              <p className="mt-2 text-cyan-300 font-orbitron tracking-wide text-sm">
                NEXT-GEN VOICE COMMUNICATION
              </p>
            </m.div>
            
            {/* Loading visualization */}
            <m.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full max-w-md"
            >
              {/* Futuristic tech loading visualization */}
              <div className="relative w-full h-[200px] border border-cyan-700 bg-black/60 flex items-center justify-center overflow-hidden">
                {/* Box filling animation */}
                <div className="absolute inset-0">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400 transition-all duration-200"
                    style={{ height: `${progress}%`, opacity: 0.3 }}
                  />
                </div>
                
                {/* Grid pattern */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const shouldHighlight = (row * 10 + col) < progress;
                    
                    return (
                      <div 
                        key={i} 
                        className={`border border-cyan-900 transition-all duration-300 ${
                          shouldHighlight ? 'bg-cyan-500/30' : 'bg-transparent'
                        }`}
                        style={{
                          animation: shouldHighlight ? `neon-flicker ${gridCellFlickers[i]}s infinite` : 'none'
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Center text */}
                <div className="relative z-10 text-center">
                  <div className="font-orbitron text-6xl font-bold text-white glow">
                    {progress}%
                  </div>
                  <div className="text-sm text-cyan-300 font-orbitron mt-2 animate-pulse">
                    {progress < 25 && "INITIALIZING SYSTEMS..."}
                    {progress >= 25 && progress < 50 && "ESTABLISHING CONNECTION..."}
                    {progress >= 50 && progress < 75 && "LOADING VOICE MODULES..."}
                    {progress >= 75 && progress < 100 && "CALIBRATING AUDIO..."}
                    {progress === 100 && "SYSTEM READY"}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 w-full h-1 bg-gray-800 overflow-hidden">
                <m.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 border-glow"
                />
              </div>
            </m.div>
            
            {/* Console output simulation */}
            <m.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full max-w-md h-[80px] bg-black/80 border border-cyan-900 font-mono text-xs text-cyan-400 p-2 overflow-hidden"
            >
              <div className="animate-typing">{`> Initializing NexVox voice communication system...`}</div>
              {progress >= 20 && <div className="animate-typing">{`> Loading spatial audio modules...`}</div>}
              {progress >= 40 && <div className="animate-typing">{`> Calibrating voice enhancement algorithms...`}</div>}
              {progress >= 60 && <div className="animate-typing">{`> Connecting to global network...`}</div>}
              {progress >= 80 && <div className="animate-typing">{`> Preparing cyberpunk experience...`}</div>}
              {progress === 100 && <div className="animate-typing text-green-400">{`> System loaded successfully. Welcome to NexVox.`}</div>}
            </m.div>
          </div>
          
          {/* Custom animation styles */}
          <style jsx global>{`
            @keyframes neon-flicker {
              0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                opacity: 0.9;
              }
              20%, 24%, 55% {
                opacity: 0.3;
              }
            }
            
            @keyframes typing {
              from { width: 0 }
              to { width: 100% }
            }
            
            .animate-typing {
              overflow: hidden;
              white-space: nowrap;
              animation: typing 1.5s steps(40, end);
              margin-bottom: 2px;
            }
            
            @keyframes float {
              0% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-10px) translateX(10px); }
              50% { transform: translateY(0) translateX(20px); }
              75% { transform: translateY(10px) translateX(10px); }
              100% { transform: translateY(0) translateX(0); }
            }
          `}</style>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 