"use client";

import React from 'react';
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
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
import SoundProvider, { SoundToggle } from "@/components/SoundProvider";
import useSoundEffects from "@/hooks/useSoundEffects";
import soundEffects from "@/utils/soundEffects";
import Image from "next/image";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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
  
  // Add scrolling sound effects
  useEffect(() => {
    // Sound is handled by the useSoundEffects hook automatically
    
    // Play initial transition sound on load
    setTimeout(() => {
      playTransition();
    }, 1000);
  }, [playTransition]);
  
  return null; // This component doesn't render anything
};

export default function Home() {
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

  // Initialize animations and effects
  useEffect(() => {
    // GSAP ScrollTrigger setup
    if (!mainRef.current) return;

    // Hero parallax effect
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('.hero-parallax');
      
      heroElements.forEach((element) => {
        const depth = 0.2;
        
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            gsap.to(element, {
              y: self.progress * 100 * depth,
              ease: 'none',
              overwrite: 'auto'
            });
          }
        });
      });
    }

    // Features section animations
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      
      featureCards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top bottom-=100',
          toggleClass: { targets: card, className: 'active' },
          once: true
        });
      });
    }

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <SoundProvider>
      <div ref={mainRef} className="min-h-screen bg-black text-white">
        {/* Sound effects controller (invisible) */}
        <SoundEffectsController />
        
        {/* Enhanced backgrounds */}
        <ParticlesBackground />
        <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.1} />
        
        {/* Header with sound toggle */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
          <div className="absolute top-4 right-4">
            <SoundToggle />
          </div>
        </div>
        
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen p-8 grid place-items-center overflow-hidden">
          {/* Radial gradient background */}
          <div className="absolute inset-0 bg-black radial-gradient"></div>
          
          <div className="max-w-7xl mx-auto text-center z-10 pt-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12 hero-parallax"
            >
              <AnimatedTitle 
                titles={headlines} 
                className="text-5xl md:text-7xl font-bold text-[#00FFFF] font-orbitron glow mb-6"
              />
              <ShimmeringText
                text="The next-generation voice platform where the world meets in real-time"
                className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
                variant="gradient"
                as="p"
              />
            </motion.div>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <FuturisticButton 
                text="Explore Rooms" 
                type="neon"
                glitchEffect={true}
                rippleEffect={true}
                accessibilityLabel="Explore NexVox voice rooms"
                soundEffect="special"
              />
              <FuturisticButton 
                text="Learn More" 
                type="secondary"
                accessibilityLabel="Learn more about NexVox features"
                soundEffect="default"
              />
            </div>
            
            {/* Audio waveform visualization */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-16 hero-parallax"
            >
              <p className="text-sm mb-2 opacity-60">Live global audio activity</p>
              <div className="flex justify-center">
                <AudioWaveform 
                  width={500} 
                  height={80} 
                  bars={100} 
                  color="#00FFFF" 
                  activeColor="#FF00E6" 
                  className="transform scale-75 md:scale-100"
                />
              </div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ opacity: scrollOpacity }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center"
            >
              <p className="text-sm opacity-60 mb-2">Scroll to explore</p>
              <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                  className="w-2 h-2 bg-[#00FFFF] rounded-full mt-1"
                />
              </div>
            </motion.div>
          </motion.div>
          
          {/* Enhanced decorative elements */}
          <div className="absolute left-0 top-1/4 w-72 h-72 bg-gradient-to-r from-[#00FFFF]/30 to-transparent rounded-full blur-3xl hero-parallax"></div>
          <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-gradient-to-l from-[#9D00FF]/30 to-transparent rounded-full blur-3xl hero-parallax"></div>
          <div className="absolute left-1/4 bottom-1/3 w-40 h-40 bg-gradient-to-tr from-[#FF00E6]/30 to-transparent rounded-full blur-2xl hero-parallax"></div>
          <div className="absolute right-1/4 top-1/3 w-56 h-56 bg-gradient-to-bl from-[#00FFFF]/20 to-transparent rounded-full blur-3xl hero-parallax"></div>
          <div className="absolute left-1/3 top-1/4 w-48 h-48 bg-gradient-to-br from-[#9D00FF]/20 to-transparent rounded-full blur-3xl hero-parallax"></div>
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
              {features.map((feature) => (
                <div key={feature.title} className="feature-card">
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    bgColor={feature.color as 'cyan' | 'purple' | 'pink' | 'gradient'}
                    iconPath={feature.iconPath}
                    className="h-full"
                  />
                </div>
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
                    <motion.li 
                      className="flex items-center gap-3"
                      whileHover={{ x: 10, color: "#00FFFF" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-[#00FFFF]">✓</span>
                      <span>Simple room navigation</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3"
                      whileHover={{ x: 10, color: "#00FFFF" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-[#00FFFF]">✓</span>
                      <span>One-click microphone controls</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3"
                      whileHover={{ x: 10, color: "#00FFFF" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-[#00FFFF]">✓</span>
                      <span>Responsive audio indicators</span>
                    </motion.li>
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
                    <motion.div 
                      className="flex gap-4 items-start"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">1</div>
                      <div>
                        <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Create Your Profile</h3>
                        <p className="opacity-80">Choose your username and customize your animated avatar to represent you in voice rooms.</p>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                  
                  <ScrollReveal direction="left" delay={0.3}>
                    <motion.div 
                      className="flex gap-4 items-start"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">2</div>
                      <div>
                        <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Browse Active Rooms</h3>
                        <p className="opacity-80">Explore a variety of voice rooms organized by topic, language, or vibe.</p>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                  
                  <ScrollReveal direction="left" delay={0.5}>
                    <motion.div 
                      className="flex gap-4 items-start"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">3</div>
                      <div>
                        <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">Join the Conversation</h3>
                        <p className="opacity-80">Drop into any room and start connecting with people from around the world in real-time.</p>
                      </div>
                    </motion.div>
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
                              <Image 
                                src={testimonial.avatar} 
                                alt="User" 
                                width={48} 
                                height={48}
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
                    <motion.div 
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
                    </motion.div>
                    
                    <motion.div 
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
                    </motion.div>
                    
                    <motion.div 
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
                    </motion.div>
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
                            <motion.div
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
                            </motion.div>
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
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.2}>
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
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.3}>
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
              </ScrollReveal>
            </div>
            
            <div className="mt-16 text-center">
              <FuturisticButton 
                text="Explore All Rooms" 
                type="secondary"
                rippleEffect={true}
                accessibilityLabel="Explore all ambient rooms"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 via-black to-[#9D00FF]/20"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <motion.div
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
              </motion.div>
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
                  <motion.button 
                    className="mt-3 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-3 w-full hover:opacity-90 font-orbitron" 
                    aria-label="Subscribe"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => soundEffects.loadAndPlay('subscribe', '/audios/final-accept.mp3')}
                  >
                    Subscribe
                  </motion.button>
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
                  <motion.a 
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
                  </motion.a>
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
                    <motion.li 
                      key={itemIndex}
                      className="cursor-pointer animated-underline"
                      whileHover={{ color: "#00FFFF", x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      onMouseEnter={() => soundEffects.playHover()}
                      onClick={() => soundEffects.playClick()}
                    >
                      {item}
                    </motion.li>
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
                <motion.button 
                  className="mt-2 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white rounded-md px-4 py-2 w-full hover:opacity-90 font-orbitron" 
                  aria-label="Subscribe"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => soundEffects.loadAndPlay('subscribe-footer', '/audios/final-accept.mp3')}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center opacity-60 text-sm">
            © 2023 NexVox. All rights reserved.
          </div>
        </footer>
      </div>
    </SoundProvider>
  );
}