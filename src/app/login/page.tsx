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

// Feature highlight component
const FeatureHighlight = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  // Play hover sound
  const handleMouseEnter = () => {
    soundEffects.playHover();
  };
  
  return (
    <div 
      className="flex gap-4 items-start group"
      onMouseEnter={handleMouseEnter}
    >
      <div className="text-[#9D00FF] w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-black/50 border border-[#9D00FF]/30 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-orbitron text-[#9D00FF] mb-1">{title}</h3>
        <p className="text-sm text-gray-300 opacity-80">{description}</p>
      </div>
    </div>
  );
};

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
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

  // Memoized highlights data to prevent unnecessary re-renders
  const highlights = useMemo(() => [
    {
      title: "Seamless Experience",
      description: "Jump right back into conversations where you left off.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: "Voice History",
      description: "Access your past room interactions and saved conversations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Privacy Controls",
      description: "Manage who can connect with you and access your content.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
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
      
      // Check if user exists in localStorage (mock backend)
      const savedUser = localStorage.getItem('nexvox_user');
      
      if (savedUser) {
        const user = JSON.parse(savedUser);
        
        // Simple mock authentication
        if (user.email === formData.email && user.password === formData.password) {
          // Show success animation
          if (formRef.current) {
            gsap.to(formRef.current, {
              y: -20,
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut',
              onComplete: () => {
                // Save login state
                localStorage.setItem('nexvox_logged_in', 'true');
                
                // Redirect to home (in real app would use router)
                setTimeout(() => {
                  window.location.href = '/';
                }, 500);
              }
            });
          }
        } else {
          // Show error
          soundEffects.play('error');
          setIsSubmitting(false);
          alert('Invalid email or password');
        }
      } else {
        // No user found
        soundEffects.play('error');
        setIsSubmitting(false);
        alert('No account found. Please register first.');
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

  // Cyberpunk flicker effect for title
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const title = document.getElementById('login-title');
        if (title) {
          const originalOpacity = window.getComputedStyle(title).opacity;
          
          gsap.to(title, {
            opacity: 0.3,
            duration: 0.1,
            onComplete: () => {
              gsap.to(title, {
                opacity: originalOpacity,
                duration: 0.1
              });
            }
          });
        }
      }
    }, 3000);
    
    return () => clearInterval(flickerInterval);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ScrollTriggerSetup />
      
      {/* Background effects */}
      <div className="bg-grid absolute inset-0 opacity-10 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#9D00FF]/5 via-black to-[#FF00E6]/5 z-0"></div>
      
      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className={`${isHovering ? 'scale-150' : 'scale-100'} pointer-events-none fixed z-50 w-8 h-8 rounded-full bg-[#9D00FF]/30 backdrop-blur-sm mix-blend-screen transition-transform duration-300 hidden sm:block`}
        style={{ 
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(157, 0, 255, 0.5)'
        }}
      />
      
      {/* Main content container */}
      <div className="container mx-auto max-w-7xl z-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Section - Welcome back and benefits */}
        <div 
          ref={leftSectionRef} 
          className="w-full lg:w-1/2 space-y-8"
        >
          <div className="text-center lg:text-left mb-8">
            <h1 
              id="login-title"
              className="text-4xl md:text-5xl font-orbitron text-[#9D00FF] glow-purple mb-4 hardware-accelerated"
            >
              Welcome <span className="text-[#FF00E6]">Back</span>
            </h1>
            <p className="text-lg text-gray-300">
              Resume your journey in the cybernetic voice realm
            </p>
          </div>
          
          {/* Login benefits */}
          <div className="space-y-8 px-4">
            {highlights.map((highlight, index) => (
              <FeatureHighlight
                key={index}
                title={highlight.title}
                description={highlight.description}
                icon={highlight.icon}
              />
            ))}
          </div>
          
          {/* Decorative element */}
          <div className="hidden lg:block h-1 w-full bg-gradient-to-r from-[#9D00FF] via-[#FF00E6] to-[#9D00FF] rounded-full opacity-70"></div>
          
          {/* Cyberpunk decoration */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9D00FF]/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#9D00FF]/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#FF00E6]/50 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Login Form */}
        <div 
          ref={rightSectionRef}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <GlassmorphicCard 
            gradient="purple-pink" 
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
                <h2 className="text-2xl md:text-3xl font-orbitron text-[#9D00FF] glow-purple">
                  Log In
                </h2>
                <p className="mt-2 text-gray-300">
                  Access your NexVox account
                </p>
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
                    className="appearance-none block w-full px-4 py-3 border-2 border-[#9D00FF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                    placeholder="you@example.com"
                    aria-label="Email input"
                  />
                  {/* Glow effect on focus */}
                  <div className="absolute inset-0 rounded-md pointer-events-none border border-[#9D00FF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-[#9D00FF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                    placeholder="••••••••"
                    aria-label="Password input"
                  />
                  {/* Glow effect on focus */}
                  <div className="absolute inset-0 rounded-md pointer-events-none border border-[#9D00FF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  {errors.password && (
                    <p className="mt-1 text-[#FF00E6] text-xs font-medium">{errors.password}</p>
                  )}
                </div>
              </div>
              
              {/* Forgot password link */}
              <div className="flex items-center justify-end">
                <Link 
                  href="#" 
                  className="text-sm text-[#00FFFF] hover:text-white font-medium animated-underline transition-colors duration-300"
                  onMouseEnter={() => soundEffects.playHover()}
                >
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit button */}
              <div className="pt-4">
                <FuturisticButton
                  text="Log In"
                  type="neon"
                  className="w-full bg-transparent hover:bg-[#9D00FF]/20 border-[#9D00FF] text-[#9D00FF] hover:text-white hover:border-[#9D00FF]"
                  accessibilityLabel="Log in to NexVox"
                  rippleEffect={true}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Register link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-300">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-[#00FFFF] hover:text-[#FF00E6] font-medium animated-underline transition-colors duration-300"
                    onMouseEnter={() => soundEffects.playHover()}
                  >
                    Register
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