"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";
import Header from "@/components/Header";
import NeonGrid from "@/components/NeonGrid";
import CyberMarquee from "@/components/CyberMarquee";
import useSoundEffects from "@/hooks/useSoundEffects";
import LoadingScreen from "@/components/LoadingScreen";
import PageTransition from "@/components/PageTransition";
import useHomeNavigation from "@/hooks/useHomeNavigation";
// Import AOS
import AOS from "aos";
import 'aos/dist/aos.css';

// Import page sections
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ExperienceSection from "@/components/home/ExperienceSection"; 
import SpatialAudioSection from "@/components/home/SpatialAudioSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LiveRoomsSection from "@/components/home/LiveRoomsSection";
import AmbientRoomsSection from "@/components/home/AmbientRoomsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";
import setupNavigationOptimizations from "@/utils/navigation-optimizer";

// Sound Effects Hook Component
const SoundEffectsController = () => {
  const { playTransition } = useSoundEffects();
  
  // Initialize navigation optimizations on component mount
  useEffect(() => {
    setupNavigationOptimizations();
  }, []);
  
  return null; // This component doesn't render anything
};

export default function Home() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Use special home navigation
  const { 
    navigateTo, 
    isTransitioning, 
    targetRoute, 
    completeTransition 
  } = useHomeNavigation();
  
  // Set isMounted to true when component mounts client-side
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize AOS
    AOS.init({
      once: false,
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 100
    });
    
    // Simple handler for resizing
    const handleResize = () => {
      AOS.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Refresh AOS when page finishes loading
  useEffect(() => {
    if (!isLoading) {
      // Refresh AOS after loading completes
      AOS.refresh();
      
      // Ensure animations are properly initialized
      setTimeout(() => {
        AOS.refreshHard();
      }, 300);
    }
  }, [isLoading]);
  
  // Navigation handlers using the transition system
  const handleExploreRooms = () => {
    navigateTo('/rooms');
  };
  
  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleBrowseRooms = () => {
    navigateTo('/rooms');
  };
  
  const handleExploreAllRooms = () => {
    navigateTo('/rooms');
  };
  
  const handleStartForFree = () => {
    navigateTo('/register');
  };

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Don't render anything during SSR or before mounting
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LoadingScreen 
        isLoading={isLoading} 
        onLoadingComplete={handleLoadingComplete} 
      />
      
      {/* Page transition component */}
      <PageTransition 
        isOpen={isTransitioning}
        targetRoute={targetRoute}
        onTransitionComplete={completeTransition}
      />
      
      <div 
        ref={mainRef} 
        className={`min-h-screen bg-black text-white overflow-x-hidden ${isLoading ? 'hidden' : ''}`}
      >
        {/* Header included only on homepage */}
        <Header onNavigate={navigateTo} />
        
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
          <div 
            className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-[#00FFFF] opacity-70 shadow-[0_0_10px_#00FFFF] animate-pulse"
          ></div>
          <div 
            className="absolute top-[60%] left-[80%] w-2 h-2 rounded-full bg-[#FF00E6] opacity-70 shadow-[0_0_10px_#FF00E6] animate-pulse-slower"
          ></div>
          <div 
            className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full bg-[#9D00FF] opacity-70 shadow-[0_0_10px_#9D00FF] animate-pulse-slow"
          ></div>
          
          {/* Gradient overlay for depth */}
          <div 
            className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/70 z-0" 
            style={{ 
              background: 'radial-gradient(circle at 50% 30%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%)'
            }}
          />
        </div>
        
        {/* Hero Section */}
        <HeroSection 
          onExploreRooms={handleExploreRooms}
          onLearnMore={handleLearnMore}
        />

        {/* Enhanced Scrolling text band */}
        <CyberMarquee 
          text="NEXT-GEN VOICE COMMUNICATION • SPATIAL AUDIO • GLOBAL CONNECTIONS • CYBERPUNK EXPERIENCE"
          className="py-4 font-orbitron text-lg"
          speed={50}
          color="cyan"
        />

        {/* Features Section */}
        <FeaturesSection />

        {/* Experience Section */}
        <ExperienceSection />

        {/* Scrolling text band - reverse direction */}
        <CyberMarquee 
          text="IMMERSIVE AUDIO • FUTURISTIC DESIGN • CONNECT GLOBALLY • NEXT-GEN EXPERIENCE"
          className="py-4 font-orbitron text-lg"
          speed={50}
          direction="right"
          color="purple"
        />

        {/* Live Rooms Section */}
        <LiveRoomsSection 
          onBrowseRooms={handleBrowseRooms}
        />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Spatial Audio Section */}
        <SpatialAudioSection />

        {/* Ambient Rooms Section */}
        <AmbientRoomsSection 
          onExploreAllRooms={handleExploreAllRooms}
        />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection 
          onStartForFree={handleStartForFree}
        />

        {/* Footer */}
        <FooterSection onNavigate={navigateTo} />
        
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
        `}</style>
      </div>
    </>
  );
}