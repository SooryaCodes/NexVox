"use client";

import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { IoChatbubbleOutline, IoSparklesOutline, IoPeopleOutline, IoRocketOutline, IoFlashOutline } from 'react-icons/io5';
import { gsap } from 'gsap';

export default function EmptyState() {
  const dotGridRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // Animate background dot grid
  useEffect(() => {
    if (!dotGridRef.current) return;

    const dots = dotGridRef.current.querySelectorAll('.dot');
    
    gsap.fromTo(dots, 
      { opacity: 0, scale: 0 },
      { 
        opacity: 0.3, 
        scale: 1,
        duration: 0.3,
        stagger: {
          grid: [20, 20],
          from: "center",
          amount: 1
        },
        ease: "power3.out"
      }
    );

    // Animate random dots periodically
    const interval = setInterval(() => {
      const randomDots = Array.from(dots).sort(() => 0.5 - Math.random()).slice(0, 20);
      
      gsap.to(randomDots, {
        opacity: gsap.utils.random(0.2, 0.5),
        scale: gsap.utils.random(0.8, 1.2),
        duration: 1,
        ease: "sine.inOut"
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Animate glow effect
  useEffect(() => {
    if (!circleRef.current) return;

    gsap.to(circleRef.current, {
      boxShadow: "0 0 60px rgba(0, 255, 255, 0.3), 0 0 120px rgba(157, 0, 255, 0.2)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated dot grid in background */}
      <div 
        ref={dotGridRef}
        className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none"
      >
        <div className="relative w-full h-full max-w-2xl max-h-2xl grid grid-cols-20 grid-rows-20">
          {Array.from({ length: 400 }).map((_, i) => (
            <div 
              key={i}
              className="dot w-1 h-1 rounded-full bg-[#0ff]"
              style={{ opacity: 0 }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-md px-6 text-center">
        <div className="mb-6 relative">
          <m.div
            ref={circleRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1
            }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-black/70 to-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,255,0.2)]"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0ff]/10 to-[#FF00E6]/10 flex items-center justify-center">
              <IoChatbubbleOutline className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
            </div>
          </m.div>
          
          {/* Animated rings around the icon */}
          <div className="absolute left-1/2 top-12 -translate-x-1/2 w-24 h-24 rounded-full border border-[#0ff]/20 opacity-60 animate-ping-slow"></div>
          <div className="absolute left-1/2 top-12 -translate-x-1/2 w-28 h-28 rounded-full border border-[#FF00E6]/10 opacity-40 animate-ping-slow animation-delay-500"></div>
        </div>
        
        <m.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold font-orbitron mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#FF00E6]"
        >
          Select a conversation
        </m.h2>
        
        <m.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-1"
        >
          <IoSparklesOutline className="text-[#0ff] animate-pulse" />
          <span className="text-white/60 text-sm">NexVox Chat</span>
          <IoSparklesOutline className="text-[#FF00E6] animate-pulse" />
        </m.div>
        
        <m.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-sm max-w-xs mx-auto mb-8"
        >
          Choose a friend from the list to start a conversation or continue a chat
        </m.p>
        
        <m.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
        >
          <m.div 
            className="flex flex-col items-center p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5 hover:border-[#0ff]/20 transition-all duration-300"
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 255, 255, 0.15)" }}
          >
            <div className="p-2 bg-[#0ff]/10 rounded-full mb-2">
              <IoPeopleOutline className="text-[#0ff] text-xl" />
            </div>
            <div className="text-[#0ff]/80 text-sm font-medium">Find Friends</div>
          </m.div>
          
          <m.div 
            className="flex flex-col items-center p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5 hover:border-[#FF00E6]/20 transition-all duration-300"
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(255, 0, 230, 0.15)" }}
          >
            <div className="p-2 bg-[#FF00E6]/10 rounded-full mb-2">
              <IoRocketOutline className="text-[#FF00E6] text-xl" />
            </div>
            <div className="text-[#FF00E6]/80 text-sm font-medium">Create Room</div>
          </m.div>
        </m.div>
          
        <m.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-white/30 flex items-center justify-center gap-3"
        >
          <IoFlashOutline className="text-[#0ff]/50" />
          <span>End-to-end encrypted</span>
        </m.div>
      </div>
      
      {/* Ambient background animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[#0ff]/5 via-transparent to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-[#0ff]/10 to-transparent"></div>
        <div className="absolute top-1/3 left-1/3 w-px h-40 bg-gradient-to-b from-transparent via-[#FF00E6]/10 to-transparent"></div>
        <div className="absolute top-1/2 right-1/3 w-px h-40 bg-gradient-to-b from-transparent via-[#0ff]/10 to-transparent"></div>
        
        {/* Moving particles */}
        <div className="absolute h-2 w-2 rounded-full bg-[#0ff]/30 blur-sm animate-float-slow left-1/5 top-1/4"></div>
        <div className="absolute h-3 w-3 rounded-full bg-[#FF00E6]/20 blur-sm animate-float-slow animation-delay-1000 right-1/4 top-1/3"></div>
        <div className="absolute h-2 w-2 rounded-full bg-[#0ff]/30 blur-sm animate-float-slow animation-delay-2000 left-1/3 bottom-1/4"></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#FF00E6]/30 blur-sm animate-float-slow animation-delay-3000 right-1/3 bottom-1/3"></div>
      </div>
      
      <style jsx global>{`
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-float-slow {
          animation: float 15s ease-in-out infinite;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(15px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
} 