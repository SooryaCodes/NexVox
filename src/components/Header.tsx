"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { m, motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import soundEffects from '@/utils/soundEffects';
import { SoundToggle } from '@/components/SoundProvider';
import { IoMenuOutline, IoClose } from "react-icons/io5";

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]); // Add dependency

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

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2
      }
    }
  };

  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05, 
      color: "#00FFFF", 
      textShadow: "0 0 15px rgba(0, 255, 255, 0.8)",
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };

  const navItemVariants = {
    normal: { scale: 1, x: 0 },
    hover: { 
      scale: 1.1, 
      x: 5,
      color: "#00FFFF",
      textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
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
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 }
  };

  const buttonVariants = {
    normal: { scale: 1, boxShadow: "0 0 0 rgba(0, 255, 255, 0)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };

  const glowCircleVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { 
      scale: [0.5, 1.5, 0.5], 
      opacity: [0, 0.3, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const toggleMobileMenu = () => {
    soundEffects.play(isMobileMenuOpen ? 'digital-click' : 'digital-click2');
    setIsMobileMenuOpen(prev => !prev);
  };
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, isMobile: boolean = false) => {
    soundEffects.playClick();
    const href = e.currentTarget.getAttribute('href');
    
    if (href && href.includes('#') && pathname === '/') {
      e.preventDefault();
        const targetId = href.substring(href.indexOf('#') + 1);
      const element = document.getElementById(targetId);
      if (element) {
            // Calculate offset for fixed header
            const headerOffset = 80; // Adjust as needed based on header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        setCurrentHash('#' + targetId);
      }
    }
    // No else needed for direct links like /rooms, NextLink handles it
    
    if (isMobile) {
        setIsMobileMenuOpen(false); // Close menu after mobile click
    }
  };

  const isNavItemActive = (href: string) => {
      if (href.includes('#') && pathname === '/') {
          // Check hash for homepage sections
          return currentHash === href.substring(href.indexOf('#'));
      }
      // Check base path for other pages
      return pathname === href || pathname.startsWith(href + '/'); 
  };

  return (
    <m.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-[#0ff]/10' : 'bg-transparent'
      }`}
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
             <Link href="/" className="font-orbitron text-xl sm:text-2xl font-bold text-[#0ff] glow flex items-center" onClick={(e) => handleNavClick(e)}>
                <m.div 
                  className="absolute -inset-1 rounded-full bg-[#0ff]"
                  variants={glowCircleVariants}
                  initial="initial"
                  animate="animate"
                />
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
            
            <div className="flex items-center space-x-3"> {/* Grouped Auth buttons */}
            <m.div
                variants={buttonVariants}
              initial="normal"
              whileHover="hover"
            >
              <Link 
                href="/login" 
                  className="px-3 py-1.5 lg:px-4 lg:py-2 text-sm lg:text-base font-medium text-white border border-[#0ff]/50 rounded-md hover:border-[#0ff] hover:text-[#0ff] transition-all"
                  onClick={(e) => handleNavClick(e)}
              >
                  Sign In
              </Link>
            </m.div>
            
            <m.div
              variants={buttonVariants}
              initial="normal"
              whileHover="hover"
            >
              <Link 
                href="/register"
                  className="px-3 py-1.5 lg:px-4 lg:py-2 text-sm lg:text-base font-medium text-black bg-[#0ff] rounded-md hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg shadow-[#0ff]/30"
                   onClick={(e) => handleNavClick(e)}
              >
                  Sign Up
              </Link>
            </m.div>
          </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
              <div className="mr-2">
                <SoundToggle />
              </div>
              <button
              onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#0ff] hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0ff]"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
              >
                <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
                {/* Correctly toggle icon based on state */}
                {isMobileMenuOpen ? (
                  <IoClose className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <IoMenuOutline className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-40 pt-16 md:hidden" // Use fixed positioning and ensure it's on top
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-lg"></div>

            <div className="relative h-full overflow-y-auto px-5 pb-6 pt-5 space-y-6"> {/* Content container */}
              {/* Explicit close button at the top right */}
              <button 
                onClick={toggleMobileMenu}
                className="absolute top-2 right-2 p-2 rounded-full bg-[#0ff]/20 text-white hover:bg-[#0ff]/30 hover:text-[#0ff] transition-colors z-50"
                aria-label="Close menu"
              >
                <IoClose className="h-6 w-6" />
              </button>
              
              {navItems.map((item) => (
                <m.div
                  key={item.name}
                  variants={mobileItemVariants}
                  className="border-b border-white/10 pb-4"
                >
                  <Link 
                    href={item.href}
                    className={`block rounded-md py-2 text-base font-medium transition-colors duration-300 ${
                      isNavItemActive(item.href) ? 'text-[#0ff]' : 'text-white/80 hover:text-[#0ff]'
                    }`}
                    // Pass true for isMobile to close menu on click
                    onClick={(e) => handleNavClick(e, true)} 
                    aria-current={isNavItemActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </m.div>
              ))}
              
              {/* Auth buttons for mobile */}
              <m.div variants={mobileItemVariants} className="pt-6 flex flex-col space-y-4">
                <Link 
                  href="/login"
                  className="w-full px-4 py-3 font-semibold text-white text-center border border-[#0ff] rounded-md"
                  onClick={(e) => handleNavClick(e, true)}
                >
                  Sign In
                </Link>
              
                <Link 
                  href="/register"
                  className="w-full px-4 py-3 font-semibold text-black text-center bg-[#0ff] rounded-md hover:bg-opacity-90 transition-colors"
                   onClick={(e) => handleNavClick(e, true)}
                >
                  Sign Up
                </Link>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
};

export default Header; 