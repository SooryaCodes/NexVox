"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import AnimatedTitle from "@/components/AnimatedTitle";
import HeroCard from "@/components/HeroCard";
import FuturisticButton from "@/components/FuturisticButton";
import ScrollReveal from "@/components/ScrollReveal";
import Header from "@/components/Header";
import AudioWaveform from "@/components/AudioWaveform";
import HyperspeedEffect from "@/components/HyperspeedEffect";
import ScrollingText from "@/components/ScrollingText";

const features = [
  {
    icon: "🔊",
    title: "Live Voice Rooms",
    description: "Join pre-defined rooms populated with global participants. Engage in lively discussions across cultures and time zones."
  },
  {
    icon: "🎧",
    title: "Spatial Audio",
    description: "Experience immersive conversations with spatial audio. Voices pan left and right based on virtual position in the room."
  },
  {
    icon: "✨",
    title: "Vibe Toasts",
    description: "Random positive messages pop up to boost energy and personality. Experience a dynamic, vibrant communication environment."
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
  const { scrollYProgress } = useScroll();
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  
  const headlines = [
    "Connect Globally with NexVox",
    "Next-Level Experience",
    "Future Is Here",
    "Connect Like Never Before"
  ];

  useEffect(() => {
    // Trigger hyperspeed effect on initial load
    setTimeout(() => {
      setHyperspeedActive(true);
      
      // Turn it off after animation
      setTimeout(() => {
        setHyperspeedActive(false);
      }, 3000);
    }, 1000);
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-black text-white">
      {/* Particle Background */}
      <ParticlesBackground />
      
      {/* Hyperspeed effect overlay */}
      <AnimatePresence>
        {hyperspeedActive && <HyperspeedEffect active={hyperspeedActive} />}
      </AnimatePresence>
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen p-8 grid place-items-center overflow-hidden">
        <div className="max-w-7xl mx-auto text-center z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <AnimatedTitle 
              titles={headlines} 
              className="text-5xl md:text-7xl font-bold text-[#0ff] font-orbitron glow mb-6"
            />
            <motion.p 
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              The next-generation voice platform where the world meets in real-time
            </motion.p>
          </motion.div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <FuturisticButton 
              text="View Rooms" 
              type="primary"
              icon={<span>🚀</span>}
              onClick={() => setHyperspeedActive(true)}
            />
            <FuturisticButton 
              text="Learn More" 
              type="secondary"
            />
          </div>
          
          {/* Audio waveform visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16"
          >
            <p className="text-sm mb-2 opacity-60">Live global audio activity</p>
            <div className="flex justify-center">
              <AudioWaveform 
                width={500} 
                height={80} 
                bars={100} 
                color="#0ff" 
                activeColor="#FF00FF" 
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
                className="w-2 h-2 bg-[#0ff] rounded-full mt-1"
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute left-0 top-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-60 h-60 bg-gradient-to-l from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
      </section>

      {/* Scrolling text band */}
      <ScrollingText 
        text="NEXT-GEN VOICE COMMUNICATION • SPATIAL AUDIO • GLOBAL CONNECTIONS • CYBERPUNK EXPERIENCE"
        className="py-4 text-[#0ff] font-orbitron text-lg"
        speed={1.5}
      />

      {/* Features Section */}
      <section id="features" className="py-24 px-8 relative bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl font-orbitron text-center mb-16 text-[#0ff] glow">Experience the Future of Voice</h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.2} direction="up">
                <div className="gradient-border h-full">
                  <HeroCard
                    title={feature.title}
                    description={feature.description}
                  >
                    <div className="bg-gradient-to-br from-cyan-500 to-purple-500 w-16 h-16 rounded-full grid place-items-center mb-6 text-2xl">
                      {feature.icon}
                    </div>
                  </HeroCard>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive App Demo */}
      <section id="rooms" className="py-24 px-8 relative scanlines">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl font-orbitron text-center mb-16 text-[#0ff] glow glitch" data-text="Experience NexVox">Experience NexVox</h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <h3 className="text-3xl font-orbitron text-[#0ff] mb-4">Intuitive Interface</h3>
                <p className="text-lg opacity-80">Our interface is designed for seamless interaction. Experience a platform that responds to your needs with minimal learning curve.</p>
                <ul className="space-y-4">
                  <motion.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10, color: "#00FFFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-[#0ff]">✓</span>
                    <span>Simple room navigation</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10, color: "#00FFFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-[#0ff]">✓</span>
                    <span>One-click microphone controls</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10, color: "#00FFFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-[#0ff]">✓</span>
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
                    color="#0ff" 
                    activeColor="#FF00FF" 
                  />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-1 rounded-2xl">
                <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-[#0ff]/30 p-4 relative group">
                  {/* App mockup */}
                  <div className="w-full aspect-[9/16] max-w-xs mx-auto bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10 relative">
                    {/* App header */}
                    <div className="bg-gradient-to-r from-cyan-900 to-purple-900 p-4">
                      <h4 className="font-orbitron text-sm text-white">Cyber Lounge</h4>
                    </div>
                    
                    {/* User avatars */}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {[1, 2, 3, 4, 5, 6].map(idx => (
                          <motion.div 
                            key={idx} 
                            className="relative group/avatar"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl border-2 border-black">
                              {idx % 2 === 0 ? '👤' : '👩'}
                            </div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-xs text-white p-1 rounded opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-all duration-300 w-24 text-center border border-[#0ff]/30">
                              {idx % 2 === 0 ? 'Speaking...' : 'Tap to interact'}
                            </div>
                            {idx % 3 === 0 && (
                              <motion.div 
                                className="absolute inset-0 rounded-full bg-[#0ff] opacity-40"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.4, 0.2, 0.4]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 backdrop-blur-sm border-t border-white/10">
                      <div className="flex justify-around">
                        <motion.button 
                          className="w-12 h-12 rounded-full bg-[#0ff]/20 hover:bg-[#0ff]/40 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 255, 0.4)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="text-xl">🎤</span>
                        </motion.button>
                        <motion.button 
                          className="w-12 h-12 rounded-full bg-[#0ff]/20 hover:bg-[#0ff]/40 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 255, 0.4)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="text-xl">👋</span>
                        </motion.button>
                        <motion.button 
                          className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.4)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="text-xl">✕</span>
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Vibe toast */}
                    <motion.div 
                      className="absolute top-16 right-4 bg-gradient-to-r from-cyan-500 to-purple-500 px-3 py-1 rounded-full text-xs"
                      animate={{ 
                        y: [0, -10, 0],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Vibe: Epic!
                    </motion.div>
                  </div>
                  
                  {/* Floating indicators */}
                  <motion.div 
                    className="absolute -right-6 top-1/4 bg-[#0ff] text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Spatial Audio
                  </motion.div>
                  <motion.div 
                    className="absolute -left-6 top-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    Active Speaker
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl font-orbitron text-center mb-16 text-[#0ff] glow">How NexVox Works</h2>
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
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">1</div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#0ff]">Create Your Profile</h3>
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
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">2</div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#0ff]">Browse Active Rooms</h3>
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
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">3</div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#0ff]">Join the Conversation</h3>
                      <p className="opacity-80">Drop into any room and start connecting with people from around the world in real-time.</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              </div>
            </div>
            
            <ScrollReveal direction="right" className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl blur-3xl opacity-30"></div>
                <div className="bg-black rounded-2xl h-96 border border-[#0ff]/30 grid place-items-center relative overflow-hidden group p-8">
                  <motion.img 
                    src="https://cdn.midjourney.com/c1b39f04-3a3b-48e7-9200-d11aabd33448/0_1.webp" 
                    alt="Global Connection Visualization" 
                    className="w-full h-full object-cover object-center rounded-xl opacity-70"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 0.4 }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                  <motion.div 
                    className="absolute bottom-6 left-0 right-0 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="font-orbitron text-2xl text-[#0ff] glow">Global Connections</span>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-8 relative">
        <ScrollReveal>
          <h2 className="text-4xl font-orbitron text-center mb-4 text-[#0ff] glow">What Users Say</h2>
          <p className="text-center opacity-80 mb-16 max-w-3xl mx-auto">Join the global community already experiencing the next level of voice communication</p>
        </ScrollReveal>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.name} delay={index * 0.2}>
                <motion.div 
                  className="bg-gradient-to-br from-black to-purple-950/30 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300"
                  whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(157, 0, 255, 0.1), 0 10px 10px -5px rgba(157, 0, 255, 0.04)" }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full mr-4 overflow-hidden border-2 border-purple-500/50">
                      <Image 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        width={56} 
                        height={56} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-orbitron text-[#0ff]">{testimonial.name}</h4>
                      <p className="text-sm opacity-60">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="opacity-80 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling text band - reverse direction */}
      <ScrollingText 
        text="IMMERSIVE AUDIO • FUTURISTIC DESIGN • CONNECT GLOBALLY • NEXT-GEN EXPERIENCE"
        className="py-4 text-purple-400 font-orbitron text-lg"
        speed={1.5}
        direction="right"
      />

      {/* CTA Section */}
      <section className="py-24 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/50 via-black to-purple-900/50"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-orbitron mb-6 text-[#0ff] glow">Ready to Connect Globally?</h2>
              <p className="text-xl opacity-80 mb-10 max-w-3xl mx-auto">Join thousands of users already experiencing the future of voice communication</p>
            </motion.div>
          </ScrollReveal>
          
          <div className="mb-12 flex justify-center">
            <FuturisticButton 
              text="Start for Free" 
              type="primary"
              className="px-10 py-4 text-lg"
              onClick={() => setHyperspeedActive(true)}
            />
          </div>
          
          {/* Waveform effect for CTA */}
          <div className="max-w-xl mx-auto">
            <AudioWaveform 
              width={600} 
              height={100} 
              bars={150} 
              color="#9D00FF" 
              activeColor="#0ff" 
              className="transform scale-90 md:scale-100"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-black border-t border-[#0ff]/20 relative z-10 bg-grid">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-orbitron text-[#0ff] text-xl mb-4">NexVox</h3>
            <p className="opacity-70">Your next-generation voice communication platform.</p>
            
            <div className="mt-6 flex gap-4">
              {['𝕏', 'ⓕ', 'ⓘ'].map((icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0ff] hover:text-[#0ff]"
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
                className="w-full bg-black border border-[#0ff]/30 rounded-md px-4 py-2 focus:outline-none focus:border-[#0ff] focus:ring-1 focus:ring-[#0ff] transition-all"
                aria-label="Email subscription"
              />
              <motion.button 
                className="mt-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-md px-4 py-2 w-full hover:opacity-90 font-orbitron" 
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