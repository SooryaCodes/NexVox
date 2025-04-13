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
  const toastRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const toast = toastRef.current;
    if (toast) {
      // Entrance animation
      gsap.fromTo(
        toast,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        gsap.to(toast, {
          x: '120%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose
        });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [onClose]);
  
  // Set color based on type
  const colors = {
    success: 'border-[#00FFFF] bg-[#00FFFF]/10 text-[#00FFFF]',
    error: 'border-[#FF00E6] bg-[#FF00E6]/10 text-[#FF00E6]',
    warning: 'border-[#FFC700] bg-[#FFC700]/10 text-[#FFC700]'
  };
  
  return (
    <div 
      ref={toastRef}
      className={`fixed top-6 right-6 max-w-sm py-3 px-5 backdrop-blur-md border-l-4 rounded shadow-lg z-50 ${colors[type]}`}
      onClick={() => {
        gsap.to(toastRef.current, {
          x: '120%',
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: onClose
        });
      }}
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
      <div className="absolute bottom-0 left-0 h-1 bg-current" style={{ animation: 'shrink 5s linear forwards' }}></div>
    </div>
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
  
  return (
    <div 
      ref={cardRef}
      className="relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border border-[#00FFFF]/30 p-4 cursor-pointer transition-all duration-300 hover:border-[#00FFFF] group"
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
  return (
    <div className="flex gap-4 items-start group">
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
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'warning'} | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Refs for animations
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const successCircleRef = useRef<HTMLDivElement>(null);
  
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

  // Success circle animation
  useEffect(() => {
    if (loginSuccess && successCircleRef.current) {
      // Play success sound
      soundEffects.play('success');
      
      // Animate success circle
      const circle = successCircleRef.current;
      
      gsap.fromTo(
        circle,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
          onComplete: () => {
            // Pulse animation
            gsap.to(circle, {
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
              duration: 1,
              repeat: 2,
              yoyo: true,
              onComplete: () => {
                // Redirect to home page
                setTimeout(() => {
                  window.location.href = '/';
                }, 1000);
              }
            });
          }
        }
      );
    }
  }, [loginSuccess]);

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

  // Add style for toast animation
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please include an @ in the email address';
      valid = false;
    }

    // Advanced email validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailPattern.test(formData.email)) {
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
      
      // Simulated backend authentication (2 second delay)
      setTimeout(() => {
        // Check if user exists in localStorage (mock backend)
        const savedUser = localStorage.getItem('nexvox_user');
        
        // Assume login success for demo purposes, regardless of saved user
        showToast('Login successful!', 'success');
        
        // Trigger success animation
        setLoginSuccess(true);
        localStorage.setItem('nexvox_logged_in', 'true');
        
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
      
      {/* Toast notification */}
      {toast && (
        <CyberToast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => {
            if (toastTimeoutId) {
              clearTimeout(toastTimeoutId);
              setToastTimeoutId(null);
            }
            setToast(null);
          }} 
        />
      )}
      
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
              id="login-title"
              className="text-4xl md:text-5xl font-orbitron text-[#9D00FF] glow-purple mb-4 hardware-accelerated"
            >
              Welcome <span className="text-[#00FFFF]">Back</span>
            </h1>
            <p className="text-lg text-gray-300">
              Sign in to your voice chat account
            </p>
            <div className="mt-6 bg-black/40 backdrop-blur-sm border border-[#00FFFF]/30 p-4 rounded-md">
              <p className="text-sm text-[#00FFFF] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                For demo purposes, you can use any email/password combination
              </p>
            </div>
          </div>
          
          {/* Feature cards grid - from register page */}
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
        
        {/* Right Section - Login Form */}
        <div 
          ref={rightSectionRef}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          {loginSuccess ? (
            <div className="w-full max-w-md flex flex-col items-center justify-center">
              <div 
                ref={successCircleRef} 
                className="w-32 h-32 rounded-full bg-[#00FFFF]/20 border-2 border-[#00FFFF] flex items-center justify-center opacity-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-8 text-2xl font-orbitron text-[#00FFFF] glow">Login Successful</h2>
              <p className="mt-4 text-gray-300 text-center max-w-xs">
                Redirecting to your dashboard...
              </p>
              
              {/* Animated terminal text */}
              <div className="mt-8 w-full max-w-xs bg-black/60 border border-[#00FFFF]/30 p-4 rounded-md font-mono text-sm">
                <p className="text-[#00FFFF]">{'>'} Logging you in...</p>
                <p className="text-[#00FFFF]">{'>'} Connecting to servers...</p>
                <p className="text-white opacity-80">{'>'} <span className="inline-block w-3 h-4 bg-white/80 animate-pulse"></span></p>
              </div>
            </div>
          ) : (
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
                    Login
                  </h2>
                  <p className="mt-2 text-gray-300">
                    Sign in to your NexVox account
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
                      autoComplete="current-password"
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
                
                {/* Forgot password link */}
                <div className="flex items-center justify-end">
                  <Link 
                    href="#" 
                    className="text-sm text-[#00FFFF] hover:text-white font-medium animated-underline transition-colors duration-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                {/* Submit button */}
                <div className="pt-4">
                  <FuturisticButton
                    text={isSubmitting ? "Logging in..." : "Login"}
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
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
                
                {/* Loading indicator */}
                {isSubmitting && (
                  <div className="mt-6 text-xs text-center text-gray-400 flex flex-col items-center">
                    <p>Logging in. Please wait...</p>
                    <div className="mt-2 w-full max-w-xs h-1 bg-black/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#9D00FF] to-[#FF00E6] w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </form>
            </GlassmorphicCard>
          )}
        </div>
      </div>
    </div>
  );
} 