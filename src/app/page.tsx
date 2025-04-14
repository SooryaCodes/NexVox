"use client";

import React from 'react';
import { useEffect, useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";
import AnimatedTitle from "@/components/AnimatedTitle";
import FuturisticButton from "@/components/FuturisticButton";
import ScrollReveal from "@/components/ScrollReveal";
import Header from "@/components/Header";
import AudioWaveform from "@/components/AudioWaveform";
import NeonGrid from "@/components/NeonGrid";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import ShimmeringText from "@/components/ShimmeringText";
import FeatureCard from "@/components/FeatureCard";
import AppMockup from "@/components/AppMockup";
import GlitchText from "@/components/GlitchText";
import CyberMarquee from "@/components/CyberMarquee";
import HolographicCard from "@/components/HolographicCard";
import AmbientRoom from "@/components/AmbientRoom";
import useSoundEffects from "@/hooks/useSoundEffects";
import { useNavigation } from "@/hooks/useNavigation";
import soundEffects from "@/utils/soundEffects";
import setupNavigationOptimizations from "@/utils/navigation-optimizer";
import Link from "next/link";
import { IoMenuOutline } from "react-icons/io5";

const features = [
  {
    iconPath: "/assets/voice-icon.svg",
    title: "Live Voice Rooms",
    description: "Join pre-defined rooms populated with global participants. Engage in lively discussions across cultures and time zones.",
    color: "cyan" as const
  },
  {
    iconPath: "/assets/spatial-icon.svg",
    title: "Spatial Audio",
    description: "Experience immersive conversations with spatial audio. Voices pan left and right based on virtual position in the room.",
    color: "purple" as const
  },
  {
    iconPath: "/assets/vibe-icon.svg",
    title: "Vibe Toasts",
    description: "Random positive messages pop up to boost energy and personality. Experience a dynamic, vibrant communication environment.",
    color: "pink" as const
  },
  {
    iconPath: "/assets/avatar-icon.svg",
    title: "Animated Avatars",
    description: "Express yourself with reactive avatars that animate based on your voice input and selected reactions.",
    color: "gradient" as const
  }
];

const testimonials = [
  {
    name: "Alex Chen",
    location: "Tokyo, Japan",
    quote: "NexVox has completely changed how I connect with people globally. The spatial audio makes it feel like we're all in the same room.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Maria López",
    location: "Madrid, Spain",
    quote: "I've made friends from six continents through NexVox! The cyberpunk aesthetic and vibe toasts add such a unique personality to the platform.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "David Okafor",
    location: "Lagos, Nigeria",
    quote: "As a digital nomad, NexVox helps me stay connected to communities worldwide. The intuitive controls and immersive design are unmatched.",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg"
  }
];

// Sound Effects Hook Component
const SoundEffectsController = () => {
  const { playTransition } = useSoundEffects();
  
  // Initialize navigation optimizations on component mount
  useEffect(() => {
    // Initialize navigation optimizations
    setupNavigationOptimizations();
    
    // Remove the initial transition sound on load
    // const timer = setTimeout(() => {
    //   playTransition();
    // }, 1000);
    
    // return () => clearTimeout(timer);
  }, [playTransition]);
  
  return null; // This component doesn't render anything
};

export default function Home() {
  const router = useRouter();
  const { navigate, isNavigating } = useNavigation();
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  
  const headlines = [
    "Connect Globally with NexVox",
    "Experience the Future of Voice",
    "Join the Cybernetic Revolution",
    "Connect Like Never Before"
  ];

  // Optimized navigation handlers using the new hook
  const handleExploreRooms = () => {
    // Force immediate navigation to rooms page without transition sound
    navigate("/rooms", { skipTransition: true });
  };
  
  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleBrowseRooms = () => {
    // Force immediate navigation to rooms page without transition sound
    navigate("/rooms", { skipTransition: true });
  };
  
  const handleExploreAllRooms = () => {
    // Force immediate navigation to rooms page without transition sound
    navigate("/rooms", { skipTransition: true });
  };
  
  const handleStartForFree = () => {
    // Force immediate navigation to register page without transition sound
    navigate("/register", { skipTransition: true });
  };

  return (
    <div 
      ref={mainRef} 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      aria-busy={isNavigating ? "true" : "false"}
    >
      {/* Header included only on homepage */}
      <Header />
      
      {/* Sound effects controller (invisible) */}
      <SoundEffectsController />
      
      {/* Enhanced backgrounds - ensure z-index is proper */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Particle background with animated dots */}
      <ParticlesBackground />
        
        {/* Vibrant grid with proper density and visibility like the first image */}
        <NeonGrid 
          color="#00FFFF" 
          secondaryColor="#9D00FF" 
          density={40} 
          opacity={0.1} 
          animate={true} 
        />
        
        {/* Animated accent dots */}
        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse"></div>
        <div className="absolute top-[60%] left-[80%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse-slower"></div>
        <div className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow"></div>
        
        {/* Gradient overlay for depth */}
        <div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/70 z-0" 
          style={{ 
            background: 'radial-gradient(circle at 50% 30%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        />
      </div>
      
      {/* Hero Section with enhanced visuals */}
      <section ref={heroRef} className="relative min-h-screen p-4 sm:p-8 pt-16 grid place-items-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Cyan blob */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#00FFFF]/10 blur-[120px] -top-64 -left-20 opacity-60"></div>
          
          {/* Purple blob */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#9D00FF]/10 blur-[100px] bottom-0 right-0 opacity-60"></div>
          
          {/* Pink accent blob */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[#FF00E6]/10 blur-[80px] top-1/3 left-1/4 opacity-50"></div>
          
          {/* Extra subtle bloom for depth */}
          <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 blur-[50px] top-1/2 right-1/4"></div>
        </div>
        
        {/* Animated vertical lines - similar to the ones in other sections */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00FFFF]/30 to-transparent left-1/4 animate-pulse-slow"></div>
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#9D00FF]/30 to-transparent left-1/2 animate-pulse-slower"></div>
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/30 to-transparent left-3/4 animate-pulse-slow"></div>
          
          {/* Horizontal accent line */}
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent top-1/3 animate-pulse-slower"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center z-10 pt-16 relative">
          {/* Text content - reduce vertical padding to center better */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 sm:mb-8" /* Reduced bottom margin */
          >
            <AnimatedTitle 
              titles={headlines} 
              className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#00FFFF] font-orbitron glow mb-3 sm:mb-4" /* Reduced bottom margin */
            />
            <ShimmeringText
              text="The next-generation voice platform where the world meets in real-time"
              className="text-lg sm:text-xl md:text-2xl mb-6 max-w-3xl mx-auto px-2" /* Reduced bottom margin */
              variant="gradient"
              as="p"
            />
          </m.div>
          
          {/* Move buttons above waveform */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center mb-8">
            <FuturisticButton 
              text="Explore Rooms" 
              type="neon"
              glitchEffect={true}
              rippleEffect={true}
              accessibilityLabel="Explore NexVox voice rooms"
              soundEffect="special"
              onClick={handleExploreRooms}
            />
            <FuturisticButton 
              text="Learn More" 
              type="secondary"
              accessibilityLabel="Learn more about NexVox features"
              soundEffect="default"
              onClick={handleLearnMore}
            />
          </div>
          
          {/* Audio waveform visualization */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6"
          >
            <p className="text-sm mb-2 opacity-60">Live global audio activity</p>
            <div className="flex justify-center">
              <AudioWaveform 
                width={500} 
                height={80} 
                bars={100} 
                color="#00FFFF" 
                activeColor="#FF00E6" 
                className="transform scale-75 md:scale-100 max-w-full"
              />
            </div>
            
            {/* Move scroll indicator below waveform */}
            <div className="mt-10 flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="mb-3 text-sm font-orbitron tracking-wider text-[#00FFFF]/80">SCROLL TO EXPLORE</p>
                
                {/* Cyberpunk styled scroll indicator */}
                <div className="relative h-14 w-6 border border-[#00FFFF]/50 rounded-full flex justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-full w-full bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm"></div>
                  
                  {/* Animated dot */}
                  <div className="absolute top-1 w-3 h-3 rounded-full animate-scroll-pulse">
                    <div className="w-full h-full rounded-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"></div>
                  </div>
                  
                  {/* Glow effect at bottom */}
                  <div className="absolute bottom-1 w-3 h-1 rounded-full bg-[#00FFFF]/30 blur-sm"></div>
                </div>
                
                {/* Arrow indicators */}
                <div className="relative mt-2 flex flex-col">
                  <svg width="14" height="8" viewBox="0 0 14 8" className="mb-1 text-[#00FFFF]/80 animate-arrow-pulse-1">
                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <svg width="14" height="8" viewBox="0 0 14 8" className="text-[#00FFFF]/50 animate-arrow-pulse-2">
                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </m.div>
          
          {/* Remove the absolute positioned scroll indicator since we moved it */}
          {/* Enhanced Scroll indicator with cyberpunk style */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center" style={{ display: 'none' }}>
            <div className="flex flex-col items-center">
              <p className="mb-3 text-sm font-orbitron tracking-wider text-[#00FFFF]/80">SCROLL TO EXPLORE</p>
              
              {/* Cyberpunk styled scroll indicator */}
              <div className="relative h-14 w-6 border border-[#00FFFF]/50 rounded-full flex justify-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-full w-full bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm"></div>
                
                {/* Animated dot */}
                <div className="absolute top-1 w-3 h-3 rounded-full animate-scroll-pulse">
                  <div className="w-full h-full rounded-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"></div>
                </div>
                
                {/* Glow effect at bottom */}
                <div className="absolute bottom-1 w-3 h-1 rounded-full bg-[#00FFFF]/30 blur-sm"></div>
              </div>
              
              {/* Arrow indicators */}
              <div className="relative mt-2 flex flex-col">
                <svg width="14" height="8" viewBox="0 0 14 8" className="mb-1 text-[#00FFFF]/80 animate-arrow-pulse-1">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <svg width="14" height="8" viewBox="0 0 14 8" className="text-[#00FFFF]/50 animate-arrow-pulse-2">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Add animations to style block */}
          <style jsx global>{`
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.4; }
            }
            
            @keyframes pulse-slower {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.3; }
            }
            
            .animate-pulse-slow {
              animation: pulse-slow 8s ease-in-out infinite;
            }
            
            .animate-pulse-slower {
              animation: pulse-slower 12s ease-in-out infinite;
            }
            
            @keyframes bounce-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            
            .animate-bounce-slow {
              animation: bounce-slow 2s ease-in-out infinite;
            }
            
            @keyframes scroll-pulse {
              0% { transform: translateY(0); opacity: 0.8; }
              50% { transform: translateY(9px); opacity: 1; }
              100% { transform: translateY(0); opacity: 0.8; }
            }
            
            .animate-scroll-pulse {
              animation: scroll-pulse 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
            }
            
            @keyframes arrow-pulse-1 {
              0%, 100% { opacity: 0.8; transform: translateY(0); }
              50% { opacity: 0.5; transform: translateY(2px); }
            }
            
            @keyframes arrow-pulse-2 {
              0%, 100% { opacity: 0.5; transform: translateY(0); }
              50% { opacity: 0.3; transform: translateY(2px); }
            }
            
            .animate-arrow-pulse-1 {
              animation: arrow-pulse-1 1.5s ease-in-out infinite;
            }
            
            .animate-arrow-pulse-2 {
              animation: arrow-pulse-2 1.5s ease-in-out infinite;
              animation-delay: 0.2s;
            }
            
            /* Keep existing float animations */
            @keyframes float-slow {
              0%, 100% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-20px) translateX(10px); }
              50% { transform: translateY(-10px) translateX(20px); }
              75% { transform: translateY(-30px) translateX(-10px); }
            }
            
            @keyframes float-medium {
              0%, 100% { transform: translateY(0) translateX(0); }
              50% { transform: translateY(-30px) translateX(-20px); }
            }
            
            @keyframes float-fast {
              0%, 100% { transform: translateY(0) translateX(0); }
              50% { transform: translateY(-15px) translateX(15px); }
            }
            
            .animate-float-slow {
              animation: float-slow 20s ease-in-out infinite;
            }
            
            .animate-float-medium {
              animation: float-medium 15s ease-in-out infinite;
            }
            
            .animate-float-fast {
              animation: float-fast 10s ease-in-out infinite;
            }
          `}</style>
        </div>
      </section>

      {/* Enhanced Scrolling text band */}
      <CyberMarquee 
        text="NEXT-GEN VOICE COMMUNICATION • SPATIAL AUDIO • GLOBAL CONNECTIONS • CYBERPUNK EXPERIENCE"
        className="py-4 font-orbitron text-lg"
        speed={50}
        color="cyan"
      />

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-24 px-8 relative bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#9D00FF]/10 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <GlitchText
              text="Experience the Future of Voice"
              className="text-4xl font-orbitron text-center mb-16"
              color="cyan"
              intensity="medium"
              activeOnView={true}
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={feature.title} 
                delay={index * 0.1}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  bgColor={feature.color as 'cyan' | 'purple' | 'pink' | 'gradient'}
                  iconPath={feature.iconPath}
                  className="h-full"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive App Demo */}
      <section id="rooms" className="py-24 px-8 relative scanlines">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <GlitchText
              text="Experience NexVox"
              className="text-4xl font-orbitron text-center mb-16"
              color="cyan"
              intensity="high"
              activeOnView={true}
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <ShimmeringText
                  text="Intuitive Interface"
                  className="text-3xl font-orbitron mb-4"
                  variant="cyan"
                  as="h3"
                />
                <p className="text-lg opacity-80">Our interface is designed for seamless interaction. Experience a platform that responds to your needs with minimal learning curve.</p>
                <ul className="space-y-4">
                  <m.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10, color: "#00FFFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-[#00FFFF]">✓</span>
                    <span>Simple room navigation</span>
                  </m.li>
                  <m.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10, color: "#00FFFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-[#00FFFF]">✓</span>
                    <span>One-click microphone controls</span>
                  </m.li>
                  <m.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10, color: "#00FFFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-[#00FFFF]">✓</span>
                    <span>Responsive audio indicators</span>
                  </m.li>
                </ul>
                
                {/* Audio activity indicator */}
                <div>
                  <p className="text-sm mb-2 opacity-60">Live voice activity</p>
                  <AudioWaveform 
                    width={300} 
                    height={40} 
                    bars={30} 
                    color="#00FFFF" 
                    activeColor="#FF00E6" 
                  />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <GlassmorphicCard
                gradient="cyan-purple"
                glowOnHover={true}
                className="p-4"
              >
                <AppMockup
                  roomName="Cyber Lounge"
                  className="mx-auto"
                  showTooltips={true}
                />
              </GlassmorphicCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#9D00FF]/10 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <ShimmeringText
              text="How NexVox Works"
              className="text-4xl font-orbitron text-center mb-16"
              variant="gradient"
              as="h2"
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-12">
                <ScrollReveal direction="left" delay={0.1}>
                  <m.div 
                    className="flex gap-4 items-start"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">1</div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Create Your Profile</h3>
                      <p className="opacity-80">Choose your username and customize your animated avatar to represent you in voice rooms.</p>
                    </div>
                  </m.div>
                </ScrollReveal>
                
                <ScrollReveal direction="left" delay={0.3}>
                  <m.div 
                    className="flex gap-4 items-start"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">2</div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Browse Active Rooms</h3>
                      <p className="opacity-80">Explore a variety of voice rooms organized by topic, language, or vibe.</p>
                    </div>
                  </m.div>
                </ScrollReveal>
                
                <ScrollReveal direction="left" delay={0.5}>
                  <m.div 
                    className="flex gap-4 items-start"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">3</div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Join the Conversation</h3>
                      <p className="opacity-80">Drop into any room and start connecting with people from around the world in real-time.</p>
                    </div>
                  </m.div>
                </ScrollReveal>
              </div>
            </div>
            
            <ScrollReveal direction="right" className="order-1 md:order-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <AmbientRoom 
                  roomName="Synthwave Dreams" 
                  participantCount={128} 
                  roomType="music" 
                  className="h-48"
                />
                <AmbientRoom 
                  roomName="Global Chat" 
                  participantCount={245} 
                  roomType="conversation" 
                  className="h-48"
                />
                <AmbientRoom 
                  roomName="Gaming Lobby" 
                  participantCount={87} 
                  roomType="gaming" 
                  className="h-48"
                />
                <AmbientRoom 
                  roomName="Chill Vibes" 
                  participantCount={164} 
                  roomType="chill" 
                  className="h-48"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#FF00E6]/10 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
            <ShimmeringText
              text="What Users Say"
              className="text-4xl font-orbitron text-center mb-16"
              variant="gradient"
              as="h2"
            />
        </ScrollReveal>
        
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial) => (
              <ScrollReveal key={testimonial.name} delay={0.1}>
                <HolographicCard className="p-6 h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <p className="text-gray-300 mb-6">&quot;{testimonial.quote}&quot;</p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00FFFF]/30">
                            <img 
                              src={testimonial.avatar} 
                              alt="User" 
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
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

      {/* Scrolling text band - reverse direction */}
      <CyberMarquee 
        text="IMMERSIVE AUDIO • FUTURISTIC DESIGN • CONNECT GLOBALLY • NEXT-GEN EXPERIENCE"
        className="py-4 font-orbitron text-lg"
        speed={50}
        direction="right"
        color="purple"
      />

      {/* JOIN LIVE ROOMS - NEW SECTION */}
      <section id="live-rooms" className="py-24 px-8 relative min-h-screen flex items-center">
        {/* Gradient background effect */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF00E6]/20 via-black to-[#00FFFF]/20"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <GlitchText
              text="Join Live Rooms"
              className="text-5xl font-orbitron text-center mb-6"
              color="pink"
              intensity="high"
              activeOnView={true}
            />
            <p className="text-center opacity-80 mb-16 max-w-4xl mx-auto text-lg">
              We&apos;re revolutionizing how people connect across the globe.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-[#FF00E6]/20 transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,230,0.3)]">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#FF00E6]/20 to-transparent rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF00E6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-orbitron mb-4 text-[#FF00E6]">Global Access</h3>
                <p className="opacity-80">Connect with people from every corner of the world, breaking down geographical barriers in real-time voice conversations.</p>
                <div className="mt-6 bg-black/60 rounded-lg py-2 px-4 text-sm inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF00E6] animate-pulse"></span>
                  <span>12,546 online now</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-[#9D00FF]/20 transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(157,0,255,0.3)]">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#9D00FF]/20 to-transparent rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9D00FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.663 17h4.673M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-orbitron mb-4 text-[#9D00FF]">Themed Rooms</h3>
                <p className="opacity-80">Explore a universe of &quot;sonic meeting spaces&quot; designed for global collaboration.</p>
                <div className="mt-6 bg-black/60 rounded-lg py-2 px-4 text-sm inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9D00FF] animate-pulse"></span>
                  <span>543 active rooms</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.3}>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-[#00FFFF]/20 transform transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#00FFFF]/20 to-transparent rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-orbitron mb-4 text-[#00FFFF]">24/7 Availability</h3>
                <p className="opacity-80">Join conversations any time, day or night. With users across all time zones, there&apos;s always an active room waiting for you.</p>
                <div className="mt-6 bg-black/60 rounded-lg py-2 px-4 text-sm inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse"></span>
                  <span>Always online</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          <div className="mt-16 flex justify-center">
            <FuturisticButton 
              text="Browse All Rooms" 
              type="neon"
              glitchEffect={true}
              rippleEffect={true}
              accessibilityLabel="Browse all voice rooms"
              onClick={handleBrowseRooms}
            />
          </div>
        </div>
      </section>

      {/* SPATIAL AUDIO EXPERIENCE - NEW SECTION */}
      <section id="spatial-audio" className="py-24 px-8 relative min-h-screen flex items-center">
        {/* Gradient background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/20 via-black to-[#9D00FF]/20"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <GlitchText
                  text="Spatial Audio Experience"
                  className="text-4xl font-orbitron mb-6"
                  color="cyan"
                  intensity="medium"
                  activeOnView={true}
                />
                
                <p className="text-lg opacity-80 mb-8">
                  NexVox brings conversations to life with immersive spatial audio technology that places each voice in a virtual environment, creating a sense of presence that traditional audio cannot match.
                </p>
                
                <div className="space-y-8">
                  <m.div 
                    className="flex gap-6 items-start"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-transparent p-3 rounded-xl flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Room Positioning</h3>
                      <p className="opacity-80">Voices are positioned in a virtual space, so you can hear where people are &quot;sitting&quot; in the room, making group conversations more natural.</p>
                    </div>
                  </m.div>
                  
                  <m.div 
                    className="flex gap-6 items-start"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-transparent p-3 rounded-xl flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Directional Sound</h3>
                      <p className="opacity-80">Experience audio that pans left and right based on a speaker&apos;s virtual position, creating an immersive soundscape that mimics real-world acoustics.</p>
                    </div>
                  </m.div>
                  
                  <m.div 
                    className="flex gap-6 items-start"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-transparent p-3 rounded-xl flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Distance Perception</h3>
                      <p className="opacity-80">Voices naturally fade as virtual distance increases, allowing you to focus on nearby conversations while still being aware of others in the room.</p>
                    </div>
                  </m.div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <div className="relative h-96">
                {/* Spatial audio visualization */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl border border-[#00FFFF]/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {/* Center user */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#0088FF] border-4 border-black flex items-center justify-center animate-pulse">
                          <span className="text-black font-bold">YOU</span>
                        </div>
                      </div>
                      
                      {/* Surrounding users in a circle */}
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
                            className="absolute w-12 h-12"
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* NEW AMBIENT ROOMS SHOWCASE */}
      <section id="ambient-rooms" className="py-24 px-8 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9D00FF]/10 via-black to-[#00FFFF]/10"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <ShimmeringText
              text="Discover Ambient Rooms"
              className="text-4xl font-orbitron text-center mb-6"
              variant="gradient"
              as="h2"
            />
            <p className="text-center mb-16 max-w-2xl mx-auto">
              Explore specially designed voice environments with unique visual and audio characteristics
            </p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <Link href="/rooms">
                <div className="relative h-80 rounded-xl overflow-hidden group cursor-pointer">
                  <AmbientRoom 
                    roomName="Neon District"
                    roomType="music"
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                    <h3 className="text-xl font-orbitron text-[#00FFFF] mb-2">Neon District</h3>
                    <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      A cyberpunk-themed lounge with ambient city sounds and neon aesthetics.
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.2}>
              <Link href="/rooms">
                <div className="relative h-80 rounded-xl overflow-hidden group cursor-pointer">
                  <AmbientRoom 
                    roomName="Quantum Realm"
                    roomType="conversation"
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                    <h3 className="text-xl font-orbitron text-[#9D00FF] mb-2">Quantum Realm</h3>
                    <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      An abstract space with quantum visualizations and ethereal audio textures.
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.3}>
              <Link href="/rooms">
                <div className="relative h-80 rounded-xl overflow-hidden group cursor-pointer">
                  <AmbientRoom 
                    roomName="Digital Oasis"
                    roomType="chill"
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                    <h3 className="text-xl font-orbitron text-[#FF00E6] mb-2">Digital Oasis</h3>
                    <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      A calming digital environment with water elements and relaxing audio.
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
          
          <div className="mt-16 text-center">
            <FuturisticButton 
              text="Explore All Rooms" 
              type="secondary"
              rippleEffect={true}
              accessibilityLabel="Explore all ambient rooms"
              onClick={handleExploreAllRooms}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 via-black to-[#9D00FF]/20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <ShimmeringText
                text="Ready to Connect Globally?"
                className="text-4xl md:text-5xl font-orbitron mb-6"
                variant="gradient"
                as="h2"
              />
              <p className="text-xl opacity-80 mb-10 max-w-3xl mx-auto">Join thousands of users already experiencing the future of voice communication</p>
            </m.div>
          </ScrollReveal>
          
          <div className="mb-12 flex justify-center">
            <FuturisticButton 
              text="Start for Free" 
              type="neon"
              className="px-10 py-4 text-lg"
              glitchEffect={true}
              rippleEffect={true}
              accessibilityLabel="Get started with NexVox"
              soundEffect="success"
              onClick={handleStartForFree}
            />
          </div>
          
          {/* Email subscription with sound effects */}
          <ScrollReveal direction="up">
            <GlassmorphicCard
              gradient="cyan-purple"
              className="py-6 px-8 max-w-md mx-auto"
            >
              <ShimmeringText
                text="Stay Updated"
                className="text-xl mb-4 font-orbitron"
                variant="cyan"
                as="h3"
              />
              <div className="relative mt-4">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full bg-black/60 border border-[#00FFFF]/30 rounded-md px-4 py-3 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-all"
                  aria-label="Email subscription"
                />
                <m.button 
                  className="mt-3 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-3 w-full hover:opacity-90 font-orbitron" 
                  aria-label="Subscribe"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => soundEffects.loadAndPlay('subscribe', '/audios/final-accept.mp3')}
                >
                  Subscribe
                </m.button>
              </div>
            </GlassmorphicCard>
          </ScrollReveal>
          
          {/* Waveform effect for CTA */}
          <div className="max-w-xl mx-auto mt-12">
            <AudioWaveform 
              width={600} 
              height={100} 
              bars={150} 
              color="#9D00FF" 
              activeColor="#00FFFF" 
              className="transform scale-90 md:scale-100"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 relative border-t border-white/10">
        <div className="absolute inset-0 opacity-10">
          <NeonGrid color="#9D00FF" secondaryColor="#00FFFF" density={40} opacity={0.1} />
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 relative z-10">
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
    </div>
  );
}