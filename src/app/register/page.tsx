'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import ScrollTriggerSetup from '@/components/ScrollTriggerSetup';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import FuturisticButton from '@/components/FuturisticButton';
import { useSoundContext } from '@/components/SoundProvider';
import soundEffects from '@/utils/soundEffects';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature card component with hover effect
const FeatureCard = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Tilt effect on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate tilt values (max 5 degrees)
      const tiltX = ((y / rect.height) * 2 - 1) * -5;
      const tiltY = ((x / rect.width) * 2 - 1) * 5;
      
      gsap.to(card, {
        rotationX: tiltX,
        rotationY: tiltY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Play hover sound
  const handleMouseEnter = () => {
    soundEffects.playHover();
  };
  
  return (
    <div 
      ref={cardRef}
      className="relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border border-[#00FFFF]/30 p-4 cursor-pointer transition-all duration-300 hover:border-[#00FFFF] group"
      onMouseEnter={handleMouseEnter}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/5 to-transparent opacity-50 z-0"></div>
      <div className="relative z-10">
        <div className="mb-3 text-[#00FFFF] w-10 h-10 flex items-center justify-center rounded-lg bg-black/50 border border-[#00FFFF]/30 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-orbitron text-[#00FFFF] mb-2">{title}</h3>
        <p className="text-sm text-gray-300 opacity-80">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
    </div>
  );
};

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isHovering, setIsHovering] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for animations
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Initialize sound context
  const { playSound } = useSoundContext ?? { playSound: () => {} };

  // Memoized feature data to prevent unnecessary re-renders
  const features = useMemo(() => [
    {
      title: "Live Voice Rooms",
      description: "Join real-time voice conversations with people from around the globe.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: "Spatial Audio",
      description: "Experience immersive conversations with 3D positional sound technology.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      title: "Animated Avatars",
      description: "Express yourself with reactive avatars that animate as you speak.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: "Vibe Toasts",
      description: "Get random positive messages that boost energy and personality.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ], []);

  // GSAP animations on load
  useEffect(() => {
    if (leftSectionRef.current && rightSectionRef.current) {
      // Left section slide-in animation
      gsap.fromTo(
        leftSectionRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      
      // Right section fade-in animation
      gsap.fromTo(
        rightSectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const cursor = cursorRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: 'power1.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Custom cursor pulse effect when hovering inputs
  useEffect(() => {
    const cursor = cursorRef.current;
    if (cursor && isHovering) {
      gsap.to(cursor, {
        scale: 1.5,
        opacity: 0.7,
        duration: 0.3,
      });
    } else if (cursor) {
      gsap.to(cursor, {
        scale: 1,
        opacity: 0.3,
        duration: 0.3,
      });
    }
  }, [isHovering]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Play soft key sound
    soundEffects.loadAndPlay('key-press', '/audios/key-press.mp3', 0.1);
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Play success sound
      soundEffects.play('success');
      
      // Store in localStorage (mocked backend)
      localStorage.setItem('nexvox_user', JSON.stringify(formData));
      
      // Show success animation
      if (formRef.current) {
        gsap.to(formRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            // Reset form
            setFormData({
              username: '',
              email: '',
              password: '',
            });
            
            // Redirect to login (in real app would use router)
            setTimeout(() => {
              window.location.href = '/login';
            }, 500);
          }
        });
      }
    } else {
      // Play error sound
      soundEffects.play('error');
    }
  };

  // Handle input hover for custom cursor
  const handleInputHover = (inputName: string) => {
    setIsHovering(inputName);
    soundEffects.playHover();
  };

  // Handle input blur for custom cursor
  const handleInputBlur = () => {
    setIsHovering('');
  };

  // Neon glitch effect for title
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const title = document.getElementById('app-title');
        if (title) {
          gsap.to(title, {
            skewX: () => Math.random() * 10 - 5,
            skewY: () => Math.random() * 10 - 5,
            duration: 0.1,
            onComplete: () => {
              gsap.to(title, {
                skewX: 0,
                skewY: 0,
                duration: 0.1
              });
            }
          });
        }
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ScrollTriggerSetup />
      
      {/* Background effects */}
      <div className="bg-grid absolute inset-0 opacity-10 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00FFFF]/5 via-black to-[#9D00FF]/5 z-0"></div>
      
      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className={`${isHovering ? 'scale-150' : 'scale-100'} pointer-events-none fixed z-50 w-8 h-8 rounded-full bg-[#00FFFF]/30 backdrop-blur-sm mix-blend-screen transition-transform duration-300 hidden sm:block`}
        style={{ 
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
        }}
      />
      
      {/* Main content container */}
      <div className="container mx-auto max-w-7xl z-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Section - App name and features */}
        <div 
          ref={leftSectionRef} 
          className="w-full lg:w-1/2 space-y-8"
        >
          <div className="text-center lg:text-left mb-8">
            <h1 
              id="app-title"
              className="text-4xl md:text-5xl font-orbitron text-[#00FFFF] glow mb-4 hardware-accelerated"
            >
              Nex<span className="text-[#9D00FF]">Vox</span>
            </h1>
            <p className="text-lg text-gray-300">
              The next-generation voice platform for global connections
            </p>
          </div>
          
          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
          
          {/* Decorative element */}
          <div className="hidden lg:block h-1 w-full bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00E6] rounded-full opacity-70"></div>
        </div>
        
        {/* Right Section - Registration Form */}
        <div 
          ref={rightSectionRef}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <GlassmorphicCard 
            gradient="cyan-purple" 
            borderAnimation={true}
            className="w-full max-w-md"
            glowOnHover={true}
          >
            <form 
              ref={formRef} 
              onSubmit={handleSubmit} 
              className="space-y-6 p-2"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-orbitron text-[#00FFFF] glow">
                  Create Your Account
                </h2>
                <p className="mt-2 text-gray-300">
                  Join the NexVox community today
                </p>
              </div>
              
              {/* Username input */}
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-gray-200 mb-1 font-orbitron"
                >
                  Username
                </label>
                <div 
                  className="relative"
                  onMouseEnter={() => handleInputHover('username')}
                  onMouseLeave={handleInputBlur}
                >
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-[#00FFFF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                    placeholder="CyberUser123"
                    aria-label="Username input"
                  />
                  {/* Glow effect on focus */}
                  <div className="absolute inset-0 rounded-md pointer-events-none border border-[#00FFFF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  {errors.username && (
                    <p className="mt-1 text-[#FF00E6] text-xs font-medium">{errors.username}</p>
                  )}
                </div>
              </div>
              
              {/* Email input */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-200 mb-1 font-orbitron"
                >
                  Email
                </label>
                <div 
                  className="relative"
                  onMouseEnter={() => handleInputHover('email')}
                  onMouseLeave={handleInputBlur}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-[#00FFFF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                    placeholder="you@example.com"
                    aria-label="Email input"
                  />
                  {/* Glow effect on focus */}
                  <div className="absolute inset-0 rounded-md pointer-events-none border border-[#00FFFF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  {errors.email && (
                    <p className="mt-1 text-[#FF00E6] text-xs font-medium">{errors.email}</p>
                  )}
                </div>
              </div>
              
              {/* Password input */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-200 mb-1 font-orbitron"
                >
                  Password
                </label>
                <div 
                  className="relative"
                  onMouseEnter={() => handleInputHover('password')}
                  onMouseLeave={handleInputBlur}
                >
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-[#00FFFF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                    placeholder="••••••••"
                    aria-label="Password input"
                  />
                  {/* Glow effect on focus */}
                  <div className="absolute inset-0 rounded-md pointer-events-none border border-[#00FFFF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  {errors.password && (
                    <p className="mt-1 text-[#FF00E6] text-xs font-medium">{errors.password}</p>
                  )}
                </div>
              </div>
              
              {/* Submit button */}
              <div className="pt-4">
                <FuturisticButton
                  text="Register"
                  type="neon"
                  className="w-full bg-transparent hover:bg-[#FF00E6]/20 border-[#FF00E6] text-[#FF00E6] hover:text-white hover:border-[#FF00E6]"
                  accessibilityLabel="Register for NexVox"
                  rippleEffect={true}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Login link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-300">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-[#9D00FF] hover:text-[#FF00E6] font-medium animated-underline transition-colors duration-300"
                    onMouseEnter={() => soundEffects.playHover()}
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
} 