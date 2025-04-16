"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import soundEffects from '@/utils/soundEffects';
import { SoundToggle } from '@/components/SoundProvider';
import { IoMenuOutline, IoClose, IoLogInOutline, IoPersonAddOutline } from "react-icons/io5";
import { useNavigation } from '@/hooks/useNavigation';
import { throttle } from '@/utils/performance';
import { buttonSounds } from '@/utils/sectionSoundEffects';

// Memoized Header component for better performance
const Header = memo(() => {
  const { isNavigating, navigate } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [currentHash, setCurrentHash] = useState('');

  // Optimized scroll handler with reduced throttle time
  const handleScroll = useCallback(throttle(() => {
    setIsScrolled(window.scrollY > 20);
  }, 50), []);
  
  // Close mobile menu on resize to desktop - faster response
  const handleResize = useCallback(throttle(() => {
    if (window.innerWidth >= 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, 100), [isMobileMenuOpen]);
  
  useEffect(() => {
    // Set current path on component mount and when URL changes
    setCurrentPath(window.location.pathname);
    setCurrentHash(window.location.hash);

    // Setup URL change detection with optimized event names
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('navigation-end', handleRouteChange);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize); 
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('navigation-end', handleRouteChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);

  // Immediately close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navItems = [
    { name: 'Features', href: '/#features' },
    { name: 'Rooms', href: '/rooms' }, 
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Testimonials', href: '/#testimonials' },
  ];

  // Simplified animation variants for better performance
  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    }
  };

  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05, 
      color: "#00FFFF",
      transition: { duration: 0.2 }
    }
  };

  const navItemVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      color: "#00FFFF",
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 }
    }
  };

  const toggleMobileMenu = useCallback(() => {
    soundEffects.playClick();
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  // Optimized navigation handler with instant response
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, isMobile: boolean = false) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href') || '/';
    
    // Play subtle click sound - but don't wait for it to finish
    setTimeout(() => soundEffects.playClick('soft'), 0);
    
    // First close mobile menu if needed - for instant UI feedback
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    
    // Use our optimized navigation function immediately
    requestAnimationFrame(() => navigate(href));
    
  }, [navigate]);

  const isNavItemActive = useCallback((href: string) => {
    if (href.includes('#') && currentPath === '/') {
      // Check hash for homepage sections
      return currentHash === href.substring(href.indexOf('#'));
    }
    // Check base path for other pages
    return currentPath === href || currentPath.startsWith(href + '/'); 
  }, [currentHash, currentPath]);

  return (
    <m.header 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-[#0ff]/10' : 'bg-transparent'
      } ${isNavigating ? 'pointer-events-none opacity-80' : ''}`}
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <m.div 
            className="relative"
            variants={logoVariants}
            initial="normal"
            whileHover="hover"
          >
            <Link 
              href="/" 
              onClick={handleNavClick} 
              className="font-orbitron text-xl sm:text-2xl font-bold text-[#0ff] glow flex items-center"
            >
              <span className="relative z-10">Nex<span className="text-purple-400">Vox</span></span>
            </Link>
          </m.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <m.div
                key={item.name}
                variants={navItemVariants}
                initial="normal"
                whileHover="hover"
              >
                <Link 
                  href={item.href} 
                  className={`text-sm lg:text-base transition-colors duration-200 ${
                    isNavItemActive(item.href) 
                      ? 'text-[#0ff] font-semibold' 
                      : 'text-white/80 hover:text-[#0ff]'
                  }`}
                  onClick={(e) => handleNavClick(e)}
                  aria-current={isNavItemActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </m.div>
            ))}
          
            <div className="mr-2">
              <SoundToggle />
            </div>
            
            {/* Auth buttons for all users */}
            <div className="flex items-center space-x-3">
              <m.div
                variants={buttonVariants}
                initial="normal"
                whileHover="hover"
                className="group"
              >
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 text-sm rounded-md bg-black/60 border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all duration-200 backdrop-blur-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] group-hover:scale-105"
                  onClick={(e) => {
                    buttonSounds.secondary();
                    handleNavClick(e);
                  }}
                >
                  <IoLogInOutline className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                  <span>Login</span>
                </Link>
              </m.div>
              
              <m.div
                variants={buttonVariants}
                initial="normal"
                whileHover="hover"
                className="group"
              >
                <Link 
                  href="/register" 
                  className="relative px-5 py-2.5 text-sm rounded-md overflow-hidden group"
                  onClick={(e) => {
                    buttonSounds.primary();
                    handleNavClick(e);
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00E6] opacity-80 animate-gradient-x"></span>
                  <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <span className="relative flex items-center gap-2 font-medium text-white group-hover:scale-105 transition-transform duration-200">
                    <IoPersonAddOutline className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                    Register
                  </span>
                  <span className="absolute inset-0 rounded-md shadow-[0_0_15px_rgba(157,0,255,0.5)] opacity-70 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </m.div>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <SoundToggle />
            
            <m.button
              className="ml-2 p-2 rounded-md text-white/80 hover:text-white focus:outline-none"
              onClick={toggleMobileMenu}
              variants={buttonVariants}
              initial="normal"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <IoMenuOutline className="h-6 w-6" />
              )}
            </m.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            className="md:hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md border-b border-white/10">
              {navItems.map((item) => (
                <m.div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block py-2.5 px-4 rounded-md text-base font-medium transition-colors duration-200 ${
                      isNavItemActive(item.href) 
                        ? 'text-[#0ff] bg-white/5' 
                        : 'text-white/80 hover:text-[#0ff] hover:bg-white/5'
                    }`}
                    onClick={(e) => handleNavClick(e, true)}
                  >
                    <span>{item.name}</span>
                  </Link>
                </m.div>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="flex items-center justify-center space-x-3 pt-4 pb-2">
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 text-sm rounded-md bg-black/60 border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all duration-200 backdrop-blur-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                  onClick={(e) => {
                    buttonSounds.secondary();
                    handleNavClick(e, true);
                  }}
                >
                  <IoLogInOutline className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                
                <Link 
                  href="/register" 
                  className="relative px-5 py-2.5 text-sm rounded-md overflow-hidden group"
                  onClick={(e) => {
                    buttonSounds.primary();
                    handleNavClick(e, true);
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00E6] opacity-80 animate-gradient-x"></span>
                  <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <span className="relative flex items-center gap-2 font-medium text-white">
                    <IoPersonAddOutline className="h-4 w-4" />
                    Register
                  </span>
                  <span className="absolute inset-0 rounded-md shadow-[0_0_15px_rgba(157,0,255,0.5)] opacity-70 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
});

Header.displayName = 'Header';

export default Header; 

{/* Add CSS for the animated gradient button */}
<style jsx global>{`
  @keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-gradient-x {
    background-size: 200% 100%;
    animation: gradient-x 8s ease infinite;
  }
`}</style> 