"use client";

import React from 'react';
import { m } from "framer-motion";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import NeonGrid from "@/components/NeonGrid";
import soundEffects from "@/utils/soundEffects";

const FooterSection: React.FC = () => {
  return (
    <footer className="py-16 px-4 sm:px-8 relative border-t border-white/10">
      <div className="absolute inset-0 opacity-10">
        <NeonGrid color="#9D00FF" secondaryColor="#00FFFF" density={40} opacity={0.1} />
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <GlitchText
            text="NexVox"
            className="font-orbitron text-xl mb-4"
            color="cyan"
            intensity="low"
            activeOnHover={true}
          />
          <p className="opacity-70">Your next-generation voice communication platform.</p>
          
          <div className="mt-6 flex gap-4">
            {['X', 'F', 'I'].map((icon, index) => (
              <m.a 
                key={index}
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00FFFF] hover:text-[#00FFFF]"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                  color: "#00FFFF",
                  borderColor: "#00FFFF" 
                }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
              >
                <span>{icon}</span>
              </m.a>
            ))}
          </div>
        </div>
        
        {[
          { title: "Product", items: ["Features", "Rooms", "Community", "Pricing"] },
          { title: "Company", items: ["About", "Blog", "Careers", "Contact"] }
        ].map((column, colIndex) => (
          <div key={colIndex}>
            <h4 className="font-orbitron mb-4">{column.title}</h4>
            <ul className="flex flex-col space-y-2 opacity-70">
              {column.items.map((item, itemIndex) => (
                <Link 
                  href={item === "Rooms" ? "/rooms" : 
                       item === "Features" ? "/#features" :
                       item === "Community" ? "/#testimonials" :
                       item === "About" ? "/#how-it-works" : 
                       "#"}
                  key={itemIndex}
                >
                  <m.li 
                    className="cursor-pointer animated-underline"
                    whileHover={{ color: "#00FFFF", x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onMouseEnter={() => soundEffects.playHover()}
                    onClick={() => soundEffects.playClick()}
                  >
                    {item}
                  </m.li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
        
        <div>
          <h4 className="font-orbitron mb-4">Stay Updated</h4>
          <div className="relative mt-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full bg-black border border-[#00FFFF]/30 rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-all"
              aria-label="Email subscription"
            />
            <m.button 
              className="mt-2 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-2 w-full hover:opacity-90 font-orbitron" 
              aria-label="Subscribe"
              whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => soundEffects.loadAndPlay('subscribe-footer', '/audios/final-accept.mp3')}
            >
              Subscribe
            </m.button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center opacity-60 text-sm">
        © 2023 NexVox. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection; 