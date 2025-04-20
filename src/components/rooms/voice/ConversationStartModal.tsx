"use client";

import React from 'react';
import { m } from 'framer-motion';

interface ConversationStartModalProps {
  onStart: () => void;
  playSound?: () => void;
}

const ConversationStartModal: React.FC<ConversationStartModalProps> = ({ 
  onStart,
  playSound 
}) => {
  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Play sound effect if available
    if (playSound) playSound();
    
    // Log that the button was clicked
    console.log("[ConversationStartModal] START button clicked!");
    
    try {
      // Call the start function with a slight delay to ensure event propagation is complete
      setTimeout(() => {
        console.log("[ConversationStartModal] Calling onStart function");
        onStart();
        console.log("[ConversationStartModal] onStart function called");
      }, 100);
    } catch (error) {
      console.error("[ConversationStartModal] Error starting conversation:", error);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md"
    >
      <m.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-md w-full mx-4"
      >
        <div className="relative bg-black/90 border border-[#00FFFF]/30 rounded-lg overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9D00FF] to-transparent opacity-50"></div>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#00FFFF]"></div>
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#00FFFF]"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#00FFFF]"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#00FFFF]"></div>
          
          {/* Grid background */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-[#00FFFF]/5"></div>
            ))}
          </div>
          
          <div className="p-8 relative z-10">
            {/* Icon/Logo */}
            <div className="w-20 h-20 rounded-full mx-auto mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 animate-pulse"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00FFFF]/30 to-[#9D00FF]/30 flex items-center justify-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m3.828-10.9a9 9 0 010 14.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              
              {/* Sound wave circles */}
              <div className="absolute inset-[-5px] rounded-full border border-[#00FFFF]/40 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-[-10px] rounded-full border border-[#00FFFF]/30 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-[-15px] rounded-full border border-[#00FFFF]/20 animate-ping" style={{ animationDuration: '4s' }}></div>
            </div>
            
            <h3 className="text-[#00FFFF] text-2xl mb-2 font-orbitron text-center">Voice Conversation</h3>
            
            <p className="text-white/80 mb-6 text-center">
              Start an AI-powered voice conversation in this room. Experience realistic spatial audio with multiple virtual participants.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/40 rounded-lg p-3 border border-[#00FFFF]/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#00FFFF] rounded-full"></div>
                  </div>
                  <div className="text-[#00FFFF] text-sm font-medium">Spatial Audio</div>
                </div>
                <div className="text-white/60 text-xs">Hear voices from different directions in 3D space</div>
              </div>
              
              <div className="bg-black/40 rounded-lg p-3 border border-[#9D00FF]/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#9D00FF]/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#9D00FF] rounded-full"></div>
                  </div>
                  <div className="text-[#9D00FF] text-sm font-medium">Natural Dialogue</div>
                </div>
                <div className="text-white/60 text-xs">Context-aware conversations with realistic flow</div>
              </div>
            </div>
            
            {/* Start button with enhanced visual effects */}
            <m.button 
              className="w-full relative py-4 rounded-md bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 border-2 border-[#00FFFF]/70 group overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartClick}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Enhanced scanning line animation */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50 pointer-events-none">
                <div className="h-[2px] w-full bg-[#00FFFF] absolute -left-full animate-[scan_1.5s_linear_infinite]"></div>
              </div>
              
              {/* Button content with pulsing effect */}
              <div className="flex items-center justify-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/30 flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[#00FFFF] font-bold tracking-wide text-lg">START CONVERSATION</span>
              </div>
              
              {/* Enhanced hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[#00FFFF] blur-xl transition-opacity duration-300"></div>
            </m.button>
            
            {/* Note about conversation starting */}
            <div className="mt-3 text-center text-[#00FFFF]/80 text-xs border border-[#00FFFF]/30 rounded-md p-2 bg-[#00FFFF]/5">
              Click the button above to start the AI conversation. Once started, you can raise your hand to be acknowledged.
            </div>
            
            <div className="mt-4 text-center text-white/40 text-xs">
              Press any key or click anywhere to dismiss this dialog
            </div>
          </div>
        </div>
        
        {/* Keyframe animation for scan effect */}
        <style jsx global>{`
          @keyframes scan {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>
      </m.div>
    </m.div>
  );
};

export default ConversationStartModal; 