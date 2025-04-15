"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { m, motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import soundEffects from '@/utils/soundEffects';
import { SoundToggle } from '@/components/SoundProvider';
import { IoMenuOutline, IoClose } from "react-icons/io5";
import HeaderUserMenu from '@/components/HeaderUserMenu';
import { useNavigation } from '@/hooks/useNavigation';
import { throttle } from '@/utils/performance';

// Memoized Header component for better performance
const Header = memo(() => {
  const { pathname, isNavigating, navigate } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(throttle(() => {
    setIsScrolled(window.scrollY > 20);
  }, 100), []);
  
  // Close mobile menu on resize to desktop
  const handleResize = useCallback(throttle(() => {
    if (window.innerWidth >= 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, 200), [isMobileMenuOpen]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Features', href: '/#features' },
    { name: 'Rooms', href: '/rooms' }, // Direct link to rooms page
    // Update other links if they are sections on the homepage or separate pages
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Testimonials', href: '/#testimonials' },
  ];

  // Simplified variants with minimal properties
  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.1
      }
    }
  };

  // Simplified variants with reduced complexity
  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05, 
      color: "#00FFFF",
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };

  const navItemVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      color: "#00FFFF",
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
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

  const mobileItemVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const buttonVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };

  const toggleMobileMenu = useCallback(() => {
    soundEffects.playClick();
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, isMobile: boolean = false) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href') || '/';
    
    // Play subtle click sound instead of transition sound
    soundEffects.playClick('soft');
    
    // For non-hash links (like /rooms), force immediate navigation
    if (!href.includes('#')) {
      // Use our optimized navigation - force routing to happen immediately
      navigate(href, { skipTransition: true });
      
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
      return;
    }
    
    // For hash links, use hash navigation behavior
    if (href.includes('#') && pathname === '/') {
      const targetId = href.substring(href.indexOf('#') + 1);
      setCurrentHash('#' + targetId);
    }
    
    // Use our optimized navigation
    navigate(href, { skipTransition: true });
    
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [navigate, pathname]);

  const isNavItemActive = useCallback((href: string) => {
    if (href.includes('#') && pathname === '/') {
      // Check hash for homepage sections
      return currentHash === href.substring(href.indexOf('#'));
    }
    // Check base path for other pages
    return pathname === href || pathname.startsWith(href + '/'); 
  }, [currentHash, pathname]);

  return (
    <m.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-[#0ff]/10' : 'bg-transparent'
      } ${isNavigating ? 'pointer-events-none opacity-80' : ''}`}
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20"> {/* Consistent height */}
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
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8"> {/* Adjusted spacing */}
            {navItems.map((item) => (
              <m.div
                key={item.name}
                variants={navItemVariants}
                initial="normal"
                whileHover="hover"
              >
                <Link 
                  href={item.href} 
                  className={`text-sm lg:text-base transition-colors duration-300 ${ // Adjusted text size
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
            
            {/* Replace auth buttons with HeaderUserMenu for authenticated users */}
            <HeaderUserMenu />
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
              {navItems.map((item, idx) => (
                <m.div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block py-2.5 px-4 rounded-md text-base font-medium transition-colors duration-300 ${
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
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
});

Header.displayName = 'Header';

export default Header; 