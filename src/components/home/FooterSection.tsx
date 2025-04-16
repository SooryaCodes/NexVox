"use client";

import React from 'react';
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import NeonGrid from "@/components/NeonGrid";
import soundEffects from "@/utils/soundEffects";

interface FooterSectionProps {
  onNavigate?: (route: string) => boolean;
}

const FooterSection: React.FC<FooterSectionProps> = ({ onNavigate }) => {
  return (
    <footer className="py-16 px-4 sm:px-8 relative border-t border-white/10 backdrop-blur-sm bg-black/40">
      <div className="absolute inset-0 opacity-10">
        <NeonGrid color="#9D00FF" secondaryColor="#00FFFF" density={40} opacity={0.15} />
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <GlitchText
            text="NexVox"
            className="font-orbitron text-2xl mb-4"
            color="cyan"
            intensity="low"
            activeOnHover={true}
          />
          <p className="opacity-70 mb-4">Your next-generation voice communication platform with spatial audio and cyberpunk aesthetics.</p>
          
          <div className="mt-6 flex gap-4">
            {['X', 'F', 'I'].map((icon, index) => (
              <a 
                key={index}
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00FFFF] hover:text-[#00FFFF] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
              >
                <span className="text-lg font-bold">{icon}</span>
              </a>
            ))}
          </div>
        </div>
        
        {[
          { title: "Product", items: ["Features", "Rooms", "Community", "Pricing"] },
          { title: "Company", items: ["About", "Blog", "Careers", "Contact"] }
        ].map((column, colIndex) => (
          <div key={colIndex}>
            <h4 className="font-orbitron mb-4 text-[#00FFFF]">{column.title}</h4>
            <ul className="flex flex-col space-y-3 opacity-80">
              {column.items.map((item, itemIndex) => (
                <Link 
                  href={item === "Rooms" ? "/rooms" : 
                       item === "Features" ? "/#features" :
                       item === "Community" ? "/#testimonials" :
                       item === "About" ? "/#how-it-works" : 
                       "#"}
                  key={itemIndex}
                  onClick={(e) => {
                    const path = item === "Rooms" ? "/rooms" : 
                                item === "Features" ? "/#features" :
                                item === "Community" ? "/#testimonials" :
                                item === "About" ? "/#how-it-works" : 
                                "#";
                    if (onNavigate && !path.includes('#')) {
                      e.preventDefault();
                      onNavigate(path);
                    }
                    soundEffects.playClick();
                  }}
                >
                  <li 
                    className="cursor-pointer before:content-['›'] before:mr-2 before:text-[#00FFFF] hover:text-[#00FFFF] hover:translate-x-2 transition-all duration-300"
                    onMouseEnter={() => soundEffects.playHover()}
                  >
                    {item}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
        
        <div>
          <h4 className="font-orbitron mb-4 text-[#00FFFF]">Stay Updated</h4>
          <div className="relative mt-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full bg-black/50 border border-[#00FFFF]/30 rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-all"
              aria-label="Email subscription"
            />
            <button 
              className="mt-2 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-2 w-full hover:opacity-90 font-orbitron transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] active:scale-[0.98]" 
              aria-label="Subscribe"
              onClick={() => soundEffects.loadAndPlay('subscribe-footer', '/audios/final-accept.mp3')}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center opacity-60 text-sm">
        <p>© 2023 NexVox. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="#" className="hover:text-[#00FFFF] transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-[#00FFFF] transition-colors duration-300">Terms of Service</a>
          <a href="#" className="hover:text-[#00FFFF] transition-colors duration-300">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection; 