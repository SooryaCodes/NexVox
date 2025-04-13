"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import AnimatedTitle from "@/components/AnimatedTitle";
import FuturisticButton from "@/components/FuturisticButton";
import ScrollReveal from "@/components/ScrollReveal";
import Header from "@/components/Header";
import AudioWaveform from "@/components/AudioWaveform";
import HyperspeedEffect from "@/components/HyperspeedEffect";
import NeonGrid from "@/components/NeonGrid";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import ShimmeringText from "@/components/ShimmeringText";
import FeatureCard from "@/components/FeatureCard";
import AppMockup from "@/components/AppMockup";
import GlitchText from "@/components/GlitchText";
import CyberMarquee from "@/components/CyberMarquee";
import HolographicCard from "@/components/HolographicCard";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    iconPath: "/assets/voice-icon.svg",
    title: "Live Voice Rooms",
    description: "Join pre-defined rooms populated with global participants. Engage in lively discussions across cultures and time zones.",
    color: "cyan"
  },
  {
    iconPath: "/assets/spatial-icon.svg",
    title: "Spatial Audio",
    description: "Experience immersive conversations with spatial audio. Voices pan left and right based on virtual position in the room.",
    color: "purple"
  },
  {
    iconPath: "/assets/vibe-icon.svg",
    title: "Vibe Toasts",
    description: "Random positive messages pop up to boost energy and personality. Experience a dynamic, vibrant communication environment.",
    color: "pink"
  },
  {
    iconPath: "/assets/avatar-icon.svg",
    title: "Animated Avatars",
    description: "Express yourself with reactive avatars that animate based on your voice input and selected reactions.",
    color: "gradient"
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

export default function Home() {
  const [hyperspeedActive, setHyperspeedActive] = useState(false);
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
    // Trigger hyperspeed effect on initial load
    setTimeout(() => {
      setHyperspeedActive(true);
      
      // Turn it off after animation
      setTimeout(() => {
        setHyperspeedActive(false);
      }, 3000);
    }, 1000);

    // GSAP ScrollTrigger setup
    if (!mainRef.current) return;

    // Hero parallax effect
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('.hero-parallax');
      
      heroElements.forEach((element, index) => {
        const depth = index * 0.2;
        
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
      
      featureCards.forEach((card, index) => {
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
    <div ref={mainRef} className="min-h-screen bg-black text-white">
      {/* Enhanced backgrounds */}
      <ParticlesBackground />
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.1} />
      
      {/* Hyperspeed effect overlay */}
      <AnimatePresence>
        {hyperspeedActive && <HyperspeedEffect active={hyperspeedActive} />}
      </AnimatePresence>
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen p-8 grid place-items-center overflow-hidden">
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
              onClick={() => setHyperspeedActive(true)}
            />
            <FuturisticButton 
              text="Learn More" 
              type="secondary"
              accessibilityLabel="Learn more about NexVox features"
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
        <div className="absolute left-0 top-1/4 w-40 h-40 bg-gradient-to-r from-[#00FFFF]/20 to-transparent rounded-full blur-3xl hero-parallax"></div>
        <div className="absolute right-0 bottom-1/4 w-60 h-60 bg-gradient-to-l from-[#9D00FF]/20 to-transparent rounded-full blur-3xl hero-parallax"></div>
        <div className="absolute left-1/4 bottom-1/3 w-20 h-20 bg-gradient-to-tr from-[#FF00E6]/20 to-transparent rounded-full blur-2xl hero-parallax"></div>
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
              <div key={feature.title} className="feature-card">
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  bgColor={feature.color as any}
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
              <GlassmorphicCard
                gradient="purple-pink"
                glowOnHover={true}
                className="h-96"
              >
                <div className="h-full w-full relative overflow-hidden rounded-xl">
                  <Image 
                    src="https://cdn.midjourney.com/c1b39f04-3a3b-48e7-9200-d11aabd33448/0_1.webp" 
                    alt="Global Connection Visualization" 
                    fill
                    className="object-cover object-center opacity-70 transition-transform duration-1500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <GlitchText
                      text="Global Connections"
                      className="text-2xl font-orbitron"
                      color="cyan"
                      activeOnHover={true}
                    />
                  </div>
                </div>
              </GlassmorphicCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-8 relative">
        <ScrollReveal>
          <GlitchText
            text="What Users Say"
            className="text-4xl font-orbitron text-center mb-4"
            color="pink"
            activeOnView={true}
          />
          <p className="text-center opacity-80 mb-16 max-w-3xl mx-auto">Join the global community already experiencing the next level of voice communication</p>
        </ScrollReveal>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.name} delay={index * 0.2}>
                <HolographicCard
                  name={testimonial.name}
                  location={testimonial.location}
                  quote={testimonial.quote}
                  avatar={testimonial.avatar}
                  color={index === 0 ? "cyan" : index === 1 ? "purple" : "pink"}
                  glowIntensity="medium"
                  className="h-full"
                />
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
              onClick={() => setHyperspeedActive(true)}
            />
          </div>
          
          {/* Email subscription */}
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
      <footer className="py-12 px-8 bg-black border-t border-[#00FFFF]/20 relative z-10">
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
  );
}