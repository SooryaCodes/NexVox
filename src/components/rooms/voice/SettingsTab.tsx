"use client";

import React from "react";
import { m } from "framer-motion";
import HolographicCard from "@/components/HolographicCard";
import { User } from "@/types/room";

interface SettingsTabProps {
  currentUser: User;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ currentUser }) => {
  return (
    <div className="overflow-y-auto h-full">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-white/10">
        <h3 className="text-lg font-orbitron text-[#00FFFF]">Room Settings</h3>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Audio Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Audio Settings
          </h4>
          
          <div className="space-y-3 pl-2 border-l-2 border-[#00FFFF]/30">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Audio Input</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                <option>Default Microphone</option>
                <option>External Microphone</option>
                <option>Headset Microphone</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Audio Output</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                <option>Default Speakers</option>
                <option>Headphones</option>
                <option>External Speakers</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Microphone Volume</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="80"
                className="w-full accent-[#00FFFF]" 
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Spatial Audio Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Spatial Audio Settings
          </h4>
          
          <div className="space-y-4 pl-2 border-l-2 border-[#9D00FF]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Enable Spatial Audio</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                <m.div
                  className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#9D00FF]"
                  layout
                  animate={{ x: 20 }} 
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Distance Model</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors">
                <option>Inverse</option>
                <option>Linear</option>
                <option>Exponential</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Room Size</label>
              <div className="grid grid-cols-3 gap-2">
                <m.button
                  className="py-2 bg-black/40 rounded-md border border-[#9D00FF] text-[#9D00FF] text-sm"
                  whileHover={{ backgroundColor: "rgba(157, 0, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Small
                </m.button>
                <m.button
                  className="py-2 bg-black/40 rounded-md border border-white/10 text-sm"
                  whileHover={{ borderColor: "#9D00FF", color: "#9D00FF" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Medium
                </m.button>
                <m.button
                  className="py-2 bg-black/40 rounded-md border border-white/10 text-sm"
                  whileHover={{ borderColor: "#9D00FF", color: "#9D00FF" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Large
                </m.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Voice Processing Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Voice Processing
          </h4>
          
          <div className="space-y-3 pl-2 border-l-2 border-[#FF00E6]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Noise Suppression</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                <m.div
                  className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#FF00E6]"
                  layout
                  animate={{ x: 20 }} 
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Echo Cancellation</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                <m.div
                  className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#FF00E6]"
                  layout
                  animate={{ x: 20 }} 
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Auto Gain Control</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                <m.div
                  className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#FF00E6]"
                  layout
                  animate={{ x: 0 }} 
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <HolographicCard className="p-4 border border-[#00FFFF]/10">
          <h4 className="font-orbitron text-[#00FFFF] text-sm mb-3">Avatar Animation</h4>
          <p className="text-xs text-white/70 mb-3">Choose how your avatar reacts to your voice</p>
          <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
            <option>Pulse</option>
            <option>Wave</option>
            <option>Bounce</option>
            <option>None</option>
          </select>
          
          {/* Avatar preview */}
          <div className="mt-3 flex justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center relative">
              <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
                <span className="text-xl font-bold">{currentUser?.name?.charAt(0)}</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF] animate-pulse"></div>
            </div>
          </div>
        </HolographicCard>
        
        <div className="pt-4 border-t border-white/10 text-center">
          <m.button 
            className="bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30 rounded-md py-2 px-6 text-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Save Settings
          </m.button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
