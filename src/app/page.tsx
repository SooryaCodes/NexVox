"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const headlines = [
    "Connect Globally with NexVox",
    "Next-Level Experience",
    "Future Is Here",
    "Connect Like Never Before"
  ];
  
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const featureRefs = useRef([]);
  const particlesRef = useRef(null);
  
  // Initialize animation timelines
  useEffect(() => {
    // Headline rotation animation
    const headlineInterval = setInterval(() => {
      setHeadlineIndex(prev => (prev + 1) % headlines.length);
    }, 3000);
    
    // Hero animations
    const heroTl = gsap.timeline();
    heroTl.from(heroRef.current.querySelector("h1"), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    heroTl.from(heroRef.current.querySelector("p"), {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4");
    heroTl.from(heroRef.current.querySelectorAll("button"), {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.3");
    
    // Feature section animations
    featureRefs.current.forEach((ref, index) => {
      gsap.from(ref, {
        scrollTrigger: {
          trigger: ref,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power3.out"
      });
    });
    
    // Create particle effect
    if (particlesRef.current) {
      initParticles();
    }
    
    return () => {
      clearInterval(headlineInterval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Particle system
  const initParticles = () => {
    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? "#00FFFF" : "#9D00FF",
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // React to mouse
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          particle.speedX = -Math.cos(angle) * 0.5;
          particle.speedY = -Math.sin(angle) * 0.5;
        }
      });
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* Particle Background */}
      <canvas ref={particlesRef} className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none"></canvas>
      
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-[calc(100vh-80px)] p-8 grid place-items-center bg-gradient-to-br from-cyan-900/50 via-black to-purple-900/50 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 ref={headlineRef} key={headlineIndex} className="text-5xl md:text-7xl font-bold text-[#0ff] font-orbitron glow mb-6 animate-fade-in">
            {headlines[headlineIndex]}
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            The next-generation voice platform where the world meets in real-time
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <button className="px-8 py-4 bg-transparent border-2 border-[#0ff] text-[#0ff] rounded-md font-medium hover:bg-[#0ff] hover:text-black transition-colors duration-300 font-orbitron text-lg relative group animate-pulse">
              <span className="absolute inset-0 bg-[#0ff]/20 rounded-md filter blur-md group-hover:blur-xl transition-all duration-300"></span>
              <span className="relative z-10">View Rooms</span>
            </button>
            <button className="px-8 py-4 bg-transparent border border-purple-500/50 rounded-md hover:bg-purple-500/10 hover:border-purple-500 transition-colors duration-300 text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-black to-purple-950 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-orbitron text-center mb-16 text-[#0ff] glow">Experience the Future of Voice</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div 
              ref={el => featureRefs.current[0] = el} 
              className="bg-black/50 p-8 rounded-xl border border-[#0ff]/20 hover:border-[#0ff]/70 transition-all duration-500 backdrop-blur-sm group hover:transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-purple-500 w-16 h-16 rounded-full grid place-items-center mb-6 text-2xl transform group-hover:rotate-12 transition-transform duration-300">🔊</div>
              <h3 className="text-2xl font-orbitron mb-4 text-[#0ff]">Live Voice Rooms</h3>
              <p className="opacity-80">Join pre-defined rooms populated with global participants. Engage in lively discussions across cultures and time zones.</p>
            </div>
            
            <div 
              ref={el => featureRefs.current[1] = el} 
              className="bg-black/50 p-8 rounded-xl border border-[#0ff]/20 hover:border-[#0ff]/70 transition-all duration-500 backdrop-blur-sm group hover:transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-purple-500 w-16 h-16 rounded-full grid place-items-center mb-6 text-2xl transform group-hover:rotate-12 transition-transform duration-300">🎧</div>
              <h3 className="text-2xl font-orbitron mb-4 text-[#0ff]">Spatial Audio</h3>
              <p className="opacity-80">Experience immersive conversations with spatial audio. Voices pan left and right based on virtual position in the room.</p>
            </div>
            
            <div 
              ref={el => featureRefs.current[2] = el} 
              className="bg-black/50 p-8 rounded-xl border border-[#0ff]/20 hover:border-[#0ff]/70 transition-all duration-500 backdrop-blur-sm group hover:transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-purple-500 w-16 h-16 rounded-full grid place-items-center mb-6 text-2xl transform group-hover:rotate-12 transition-transform duration-300">✨</div>
              <h3 className="text-2xl font-orbitron mb-4 text-[#0ff]">Vibe Toasts</h3>
              <p className="opacity-80">Random positive messages pop up to boost energy and personality. Experience a dynamic, vibrant communication environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App Demo */}
      <section ref={el => featureRefs.current[3] = el} className="py-20 px-8 bg-black relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-orbitron text-center mb-16 text-[#0ff] glow">Experience NexVox</h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl font-orbitron text-[#0ff] mb-4">Intuitive Interface</h3>
              <p className="text-lg opacity-80">Our interface is designed for seamless interaction. Experience a platform that responds to your needs with minimal learning curve.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="text-[#0ff]">✓</span>
                  <span>Simple room navigation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#0ff]">✓</span>
                  <span>One-click microphone controls</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#0ff]">✓</span>
                  <span>Responsive audio indicators</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-1 rounded-2xl group perspective-1000">
              <div className="bg-black rounded-2xl border border-[#0ff]/30 grid place-items-center p-4 transition-transform duration-500 group-hover:transform group-hover:rotate-y-10 group-hover:rotate-x-10 relative">
                {/* App mockup */}
                <div className="w-full aspect-[9/16] max-w-xs bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10 relative">
                  {/* App header */}
                  <div className="bg-gradient-to-r from-cyan-900 to-purple-900 p-4">
                    <h4 className="font-orbitron text-sm text-white">Cyber Lounge</h4>
                  </div>
                  
                  {/* User avatars */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                      {[1, 2, 3, 4, 5, 6].map(idx => (
                        <div key={idx} className="relative group/avatar">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl border-2 border-black">
                            {idx % 2 === 0 ? '👤' : '👩'}
                          </div>
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-xs text-white p-1 rounded opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-all duration-300 w-24 text-center border border-[#0ff]/30">
                            {idx % 2 === 0 ? 'Speaking...' : 'Tap to interact'}
                          </div>
                          <div className={`absolute inset-0 rounded-full ${idx % 3 === 0 ? 'animate-ping' : ''} opacity-40 bg-[#0ff]`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 backdrop-blur-sm border-t border-white/10">
                    <div className="flex justify-around">
                      <button className="w-12 h-12 rounded-full bg-[#0ff]/20 hover:bg-[#0ff]/40 transition-colors flex items-center justify-center">
                        <span className="text-xl">🎤</span>
                      </button>
                      <button className="w-12 h-12 rounded-full bg-[#0ff]/20 hover:bg-[#0ff]/40 transition-colors flex items-center justify-center">
                        <span className="text-xl">👋</span>
                      </button>
                      <button className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors flex items-center justify-center">
                        <span className="text-xl">✕</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Vibe toast */}
                  <div className="absolute top-16 right-4 bg-gradient-to-r from-cyan-500 to-purple-500 px-3 py-1 rounded-full text-xs animate-bounce">
                    Vibe: Epic!
                  </div>
                </div>
                
                {/* Floating indicators */}
                <div className="absolute -right-6 top-1/4 bg-[#0ff] text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Spatial Audio
                </div>
                <div className="absolute -left-6 top-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Active Speaker
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={el => featureRefs.current[4] = el} className="py-20 px-8 bg-gradient-to-br from-purple-950/50 to-black relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-orbitron text-center mb-16 text-[#0ff] glow">How NexVox Works</h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-8">
                <div className="flex gap-4 group hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-[#0ff] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold group-hover:shadow-[0_0_15px_rgba(0,255,255,0.7)] transition-all duration-300">1</div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#0ff]">Create Your Profile</h3>
                    <p className="opacity-80">Choose your username and customize your animated avatar to represent you in voice rooms.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-[#0ff] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold group-hover:shadow-[0_0_15px_rgba(0,255,255,0.7)] transition-all duration-300">2</div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#0ff]">Browse Active Rooms</h3>
                    <p className="opacity-80">Explore a variety of voice rooms organized by topic, language, or vibe.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-[#0ff] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold group-hover:shadow-[0_0_15px_rgba(0,255,255,0.7)] transition-all duration-300">3</div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#0ff]">Join the Conversation</h3>
                    <p className="opacity-80">Drop into any room and start connecting with people from around the world in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-1 rounded-2xl">
              <div className="bg-black rounded-2xl h-80 border border-[#0ff]/30 grid place-items-center relative overflow-hidden group">
                <span className="text-[#0ff] text-8xl opacity-50 group-hover:transform group-hover:scale-125 transition-transform duration-700 ease-in-out">🌐</span>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={el => featureRefs.current[5] = el} className="py-20 px-8 bg-gradient-to-b from-purple-950 to-black relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-orbitron text-center mb-4 text-[#0ff] glow">What Users Say</h2>
          <p className="text-center opacity-80 mb-16 max-w-3xl mx-auto">Join the global community already experiencing the next level of voice communication</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(157,0,255,0.3)] group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full mr-4 transform group-hover:rotate-12 transition-transform duration-300"></div>
                <div>
                  <h4 className="font-orbitron text-[#0ff]">Alex Chen</h4>
                  <p className="text-sm opacity-60">Tokyo, Japan</p>
                </div>
              </div>
              <p className="opacity-80">"NexVox has completely changed how I connect with people globally. The spatial audio makes it feel like we're all in the same room."</p>
            </div>
            
            <div className="bg-black/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(157,0,255,0.3)] group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full mr-4 transform group-hover:rotate-12 transition-transform duration-300"></div>
                <div>
                  <h4 className="font-orbitron text-[#0ff]">Maria López</h4>
                  <p className="text-sm opacity-60">Madrid, Spain</p>
                </div>
              </div>
              <p className="opacity-80">"I've made friends from six continents through NexVox! The cyberpunk aesthetic and vibe toasts add such a unique personality to the platform."</p>
            </div>
            
            <div className="bg-black/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(157,0,255,0.3)] group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full mr-4 transform group-hover:rotate-12 transition-transform duration-300"></div>
                <div>
                  <h4 className="font-orbitron text-[#0ff]">David Okafor</h4>
                  <p className="text-sm opacity-60">Lagos, Nigeria</p>
                </div>
              </div>
              <p className="opacity-80">"As a digital nomad, NexVox helps me stay connected to communities worldwide. The intuitive controls and immersive design are unmatched."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={el => featureRefs.current[6] = el} className="py-20 px-8 bg-gradient-to-r from-cyan-900 via-black to-purple-900 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-orbitron mb-6 text-[#0ff] glow">Ready to Connect Globally?</h2>
          <p className="text-xl opacity-80 mb-10 max-w-3xl mx-auto">Join thousands of users already experiencing the future of voice communication</p>
          <button className="relative px-10 py-4 bg-transparent border-2 border-[#0ff] rounded-md font-medium hover:bg-[#0ff] hover:text-black transition-colors duration-500 font-orbitron text-lg text-[#0ff] group overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
            <span className="absolute inset-0 w-0 bg-[#0ff] opacity-40 group-hover:w-full transition-all duration-700 ease-in-out -skew-x-12"></span>
            <span className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 blur opacity-30 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></span>
            <span className="relative">Start for Free</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-black border-t border-[#0ff]/20 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-orbitron text-[#0ff] text-xl mb-4">NexVox</h3>
            <p className="opacity-70">Your next-generation voice communication platform.</p>
            
            <div className="mt-6 flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0ff] hover:text-[#0ff] hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-300">
                <span>𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0ff] hover:text-[#0ff] hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-300">
                <span>ⓕ</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0ff] hover:text-[#0ff] hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-300">
                <span>ⓘ</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-orbitron mb-4">Product</h4>
            <ul className="space-y-2 opacity-70">
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Features</li>
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Rooms</li>
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Community</li>
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Pricing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-orbitron mb-4">Company</h4>
            <ul className="space-y-2 opacity-70">
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">About</li>
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Blog</li>
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Careers</li>
              <li className="hover:text-[#0ff] transition-colors duration-300 cursor-pointer">Contact</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-orbitron mb-4">Stay Updated</h4>
            <div className="relative mt-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-black border border-[#0ff]/30 rounded-md px-4 py-2 focus:outline-none focus:border-[#0ff] focus:ring-1 focus:ring-[#0ff] transition-all"
                aria-label="Email subscription"
              />
              <button className="mt-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-md px-4 py-2 w-full hover:opacity-90 transition-opacity font-orbitron" aria-label="Subscribe">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center opacity-60 text-sm">
          © 2023 NexVox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}