'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { m, motion, useAnimation, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SmoothScroll from '@/components/ScrollTriggerSetup';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import FuturisticButton from '@/components/FuturisticButton';
import { useSoundContext } from '@/components/SoundProvider';
import soundEffects from '@/utils/soundEffects';

// Custom toast notification component
const CyberToast = ({ 
  message, 
  type = 'error',
  onClose
}: { 
  message: string; 
  type?: 'success' | 'error' | 'warning'; 
  onClose: () => void;
}) => {
  // Set color based on type
  const colors = {
    success: 'border-[#00FFFF] bg-[#00FFFF]/10 text-[#00FFFF]',
    error: 'border-[#FF00E6] bg-[#FF00E6]/10 text-[#FF00E6]',
    warning: 'border-[#FFC700] bg-[#FFC700]/10 text-[#FFC700]'
  };
  
  return (
    <m.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      exit={{ x: '120%', opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-6 right-6 max-w-sm py-3 px-5 backdrop-blur-md border-l-4 rounded shadow-lg z-50 ${colors[type]}`}
      onClick={onClose}
    >
      <div className="flex items-center gap-3">
        {type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'error' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'warning' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        <p className="font-medium text-sm">{message}</p>
      </div>
      <m.div 
        className="absolute bottom-0 left-0 h-1 bg-current" 
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        onAnimationComplete={onClose}
      />
    </m.div>
  );
};

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
  const [hoverState, setHoverState] = useState({ rotateX: 0, rotateY: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt values (max 5 degrees)
    const tiltX = ((y / rect.height) * 2 - 1) * -5;
    const tiltY = ((x / rect.width) * 2 - 1) * 5;
    
    setHoverState({ rotateX: tiltX, rotateY: tiltY });
  };
  
  return (
    <m.div 
      className="relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border border-[#00FFFF]/30 p-4 cursor-pointer transition-all duration-300 hover:border-[#00FFFF] group"
      whileHover={{ scale: 1.02 }}
      style={{ 
        rotateX: hoverState.rotateX,
        rotateY: hoverState.rotateY,
        transformPerspective: 1000
      }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverState({ rotateX: 0, rotateY: 0 })}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/5 to-transparent opacity-50 z-0"></div>
      <div className="relative z-10">
        <m.div 
          className="mb-3 text-[#00FFFF] w-10 h-10 flex items-center justify-center rounded-lg bg-black/50 border border-[#00FFFF]/30"
          whileHover={{ scale: 1.1 }}
        >
          {icon}
        </m.div>
        <h3 className="text-lg font-orbitron text-[#00FFFF] mb-2">{title}</h3>
        <p className="text-sm text-gray-300 opacity-80">{description}</p>
      </div>
      <m.div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF]"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </m.div>
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
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'warning'} | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Animation controls
  const leftSectionControls = useAnimation();
  const rightSectionControls = useAnimation();
  const successCircleControls = useAnimation();
  const cursorControls = useAnimation();

  // Refs for animations
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const successCircleRef = useRef<HTMLDivElement>(null);

  // Initialize sound context
  const soundContext = useSoundContext();

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

  // Initialize animations
  useEffect(() => {
    // Run entrance animations
    leftSectionControls.start({ 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    });
    
    rightSectionControls.start({ 
      opacity: 1, 
      transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } 
    });

    // Play sound if available
    if (soundContext?.playSound) {
      soundContext.playSound("transition");
    }

    // Set up mouse follower
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorControls.start({
          x: e.clientX,
          y: e.clientY,
          transition: { duration: 0, ease: "linear" }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [leftSectionControls, rightSectionControls, cursorControls, soundContext]);

  // Handle hover states for cursor
  useEffect(() => {
    if (isHovering) {
      cursorControls.start({
        scale: 1.5,
        opacity: 0.7,
        transition: { duration: 0.3 }
      });
    } else {
      cursorControls.start({
        scale: 1,
        opacity: 0.3,
        transition: { duration: 0.3 }
      });
    }
  }, [isHovering, cursorControls]);

  // Show success animation
  useEffect(() => {
    if (registerSuccess && successCircleRef.current) {
      // Reset first
      successCircleControls.set({ scale: 0, opacity: 0 });
      
      // Grow animation
      successCircleControls.start({
        scale: 10,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeOut"
        }
      }).then(() => {
        // Pulse animation
        successCircleControls.start({
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }
        });
      });
      
      // Title glitch effect
      const glitchInterval = setInterval(() => {
        const title = document.getElementById('app-title');
        if (title) {
          // Apply random skew
          const skewX = Math.random() * 10 - 5;
          const skewY = Math.random() * 10 - 5;
          
          title.style.transform = `skew(${skewX}deg, ${skewY}deg)`;
          
          // Reset after a short delay
          setTimeout(() => {
            title.style.transform = 'skew(0deg, 0deg)';
          }, 100);
        }
      }, 2000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [registerSuccess, successCircleControls]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Play soft key sound
    soundEffects.play('key-press');
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Clear existing toast when showing a new one
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    // Clear any existing timeout to prevent multiple toasts
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    
    // Set the new toast
    setToast({ message, type });
    
    // Auto-dismiss after 5 seconds
    const timeoutId = setTimeout(() => {
      setToast(null);
    }, 5000);
    
    setToastTimeoutId(timeoutId);
  };
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
      }
    };
  }, [toastTimeoutId]);

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
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores and hyphens';
      valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
    
    // Password strength validation
    if (formData.password.trim()) {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      
      if (!hasUpperCase && !hasNumber) {
        newErrors.password = 'Password should contain a number or uppercase letter';
        valid = false;
      }
    }

    setErrors(newErrors);
    
    if (!valid) {
      // Show error toast only if validation fails
      showToast('Please fix the form errors', 'error');
      
      // Play error sound
      soundEffects.play('error');
    }
    
    return valid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      soundEffects.play('processing');
      
      // Simulated backend registration (2 second delay)
      setTimeout(() => {
        // Store in localStorage (mocked backend)
        localStorage.setItem('nexvox_user', JSON.stringify(formData));
        
        // Show success toast
        showToast('Account created successfully!', 'success');
        
        // Trigger success animation
        setRegisterSuccess(true);
      }, 2000);
    }
  };

  // Handle input hover for custom cursor
  const handleInputHover = (inputName: string) => {
    setIsHovering(inputName);
  };

  // Handle input blur for custom cursor
  const handleInputBlur = () => {
    setIsHovering('');
  };

  return (
    <div className="min-h-screen w-full flex items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SmoothScroll />
      
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <CyberToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      
      {/* Background effects */}
      <div className="bg-grid absolute inset-0 opacity-10 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#9D00FF]/5 via-black to-[#00FFFF]/5 z-0"></div>
      
      {/* Custom cursor */}
      <m.div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full bg-[#9D00FF] bg-opacity-30 pointer-events-none z-50 mix-blend-screen"
        initial={{ opacity: 0.3, scale: 1 }}
        animate={cursorControls}
      />
      
      {/* Success overlay */}
      {registerSuccess && (
        <m.div
          ref={successCircleRef}
          className="fixed z-40 top-1/2 left-1/2 w-10 h-10 rounded-full bg-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.7)]"
          style={{ 
            translateX: '-50%', 
            translateY: '-50%'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={successCircleControls}
        />
      )}
      
      <div className="container mx-auto max-w-7xl z-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left side - App name and features */}
        <div 
          ref={leftSectionRef} 
          className="w-full lg:w-1/2 space-y-8"
        >
          <div className="text-center lg:text-left mb-8">
            <h1 
              id="register-title"
              className="text-4xl md:text-5xl font-orbitron text-[#9D00FF] glow-purple mb-4 hardware-accelerated"
            >
              Join <span className="text-[#00FFFF]">NexVox</span>
            </h1>
            <p className="text-lg text-gray-300">
              Create your voice chat account
            </p>
            <div className="mt-6 bg-black/40 backdrop-blur-sm border border-[#00FFFF]/30 p-4 rounded-md">
              <p className="text-sm text-[#00FFFF] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                For demo purposes, you can use any information to register
              </p>
            </div>
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
          <div className="hidden lg:block h-1 w-full bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#00FFFF] rounded-full opacity-70"></div>
          
          {/* Cyberpunk decoration */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#00FFFF]/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#9D00FF]/50 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Right side - registration form */}
        <div 
          ref={rightSectionRef}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          {!registerSuccess ? (
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
                    Sign Up
                  </h2>
                  <p className="mt-2 text-gray-300">
                    Create your NexVox account
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
                      value={formData.username}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border-2 border-[#9D00FF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                      placeholder="CyberUser123"
                      aria-label="Username input"
                    />
                    {/* Glow effect on focus */}
                    <div className="absolute inset-0 rounded-md pointer-events-none border border-[#9D00FF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    {errors.username && (
                      <div className="mt-1 text-[#FF00E6] text-xs font-medium flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-tight">{errors.username}</span>
                      </div>
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
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border-2 border-[#9D00FF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                      placeholder="your.email@example.com"
                      aria-label="Email input"
                    />
                    {/* Glow effect on focus */}
                    <div className="absolute inset-0 rounded-md pointer-events-none border border-[#9D00FF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    {errors.email && (
                      <div className="mt-1 text-[#FF00E6] text-xs font-medium flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-tight">{errors.email}</span>
                      </div>
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
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border-2 border-[#9D00FF]/50 rounded-md bg-black/50 placeholder-gray-500 text-white focus:outline-none focus:ring-[#FF00E6] focus:border-[#FF00E6] sm:text-sm transition-all duration-300"
                      placeholder="••••••••"
                      aria-label="Password input"
                    />
                    {/* Glow effect on focus */}
                    <div className="absolute inset-0 rounded-md pointer-events-none border border-[#9D00FF]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    {errors.password && (
                      <div className="mt-1 text-[#FF00E6] text-xs font-medium flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-tight">{errors.password}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit button */}
                <div className="pt-4">
                  <FuturisticButton
                    text={isSubmitting ? "Creating account..." : "Sign Up"}
                    type="neon"
                    className="w-full bg-transparent hover:bg-[#9D00FF]/20 border-[#9D00FF] text-[#9D00FF] hover:text-white hover:border-[#9D00FF]"
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
                      className="text-[#00FFFF] hover:text-[#FF00E6] font-medium animated-underline transition-colors duration-300"
                    >
                      Login
                    </Link>
                  </p>
                </div>
                
                {/* Loading indicator */}
                {isSubmitting && (
                  <div className="mt-6 text-xs text-center text-gray-400 flex flex-col items-center">
                    <p>Creating your account. Please wait...</p>
                    <div className="mt-2 w-full max-w-xs h-1 bg-black/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#9D00FF] to-[#00FFFF] w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </form>
            </GlassmorphicCard>
          ) : (
            <GlassmorphicCard
              gradient="cyan-purple"
              className="p-8 text-center"
              glowOnHover={true}
            >
              <m.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="py-10"
              >
                <h3 className="text-3xl font-bold text-[#00FFFF] mb-6 font-orbitron">Welcome to NexVox!</h3>
                <p className="text-lg mb-6">Your account has been successfully created.</p>
                <FuturisticButton
                  text="Continue to Login"
                  type="neon"
                  className="mx-auto mt-4"
                  accessibilityLabel="Go to login page"
                  rippleEffect={true}
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                />
              </m.div>
            </GlassmorphicCard>
          )}
        </div>
      </div>
    </div>
  );
} 