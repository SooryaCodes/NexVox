"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { m, motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import soundEffects from '@/utils/soundEffects';
import { SoundToggle } from '@/components/SoundProvider';

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '/#features' },
    { name: 'Rooms', href: '/#rooms' },
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
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Play click sound
    soundEffects.playClick();
    
    // Handle smooth scrolling for hash links on the homepage
    const href = e.currentTarget.getAttribute('href');
    if (href && href.includes('#') && (pathname === '/' || href.startsWith('/#'))) {
      e.preventDefault();
      const targetId = href.includes('/#') ? href.split('/#')[1] : href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update current hash without using window directly
        setCurrentHash('#' + targetId);
      }
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    }
  };

  const isNavItemActive = (href: string) => {
    return pathname === href || (href.includes('#') && pathname === '/' && currentHash === href);
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
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <m.div 
              className="relative"
              variants={logoVariants}
              initial="normal"
              whileHover="hover"
            >
              <Link href="/" className="font-orbitron text-2xl font-bold text-[#0ff] glow flex items-center">
                <m.div 
                  className="absolute -inset-1 rounded-full bg-[#0ff]"
                  variants={glowCircleVariants}
                  initial="initial"
                  animate="animate"
                />
                <span className="relative">Nex<span className="text-purple-400">Vox</span></span>
              </Link>
            </m.div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <m.div
                key={item.name}
                variants={navItemVariants}
                initial="normal"
                whileHover="hover"
              >
                <Link 
                  href={item.href} 
                  className={`text-white/80 hover:text-[#0ff] transition-colors duration-300 ${
                    isNavItemActive(item.href) ? 'text-[#0ff]' : ''
                  }`}
                  onClick={handleNavClick}
                  onMouseEnter={() => soundEffects.playHover()}
                >
                  {item.name}
                </Link>
              </m.div>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* Sound Toggle */}
            <div className="mr-4">
              <SoundToggle />
            </div>
            
            <m.div
              variants={navItemVariants}
              initial="normal"
              whileHover="hover"
            >
              <Link 
                href="/login" 
                className={`text-white/80 hover:text-[#0ff] transition-colors duration-300 ${pathname === '/login' ? 'text-[#0ff]' : ''}`}
                onMouseEnter={() => soundEffects.playHover()}
              >
                Log In
              </Link>
            </m.div>
            
            <m.div
              variants={buttonVariants}
              initial="normal"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/register"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-2 rounded-lg font-orbitron text-sm"
                onClick={() => soundEffects.play('success')}
              >
                Register
              </Link>
            </m.div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Sound Toggle for mobile */}
            <div className="mr-4">
              <SoundToggle />
            </div>
            
            <m.button
              onClick={toggleMobileMenu}
              className="text-white p-2"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <m.span 
                  className="h-0.5 w-6 bg-[#0ff] block"
                  animate={isMobileMenuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <m.span 
                  className="h-0.5 w-6 bg-[#0ff] block"
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <m.span 
                  className="h-0.5 w-6 bg-[#0ff] block"
                  animate={isMobileMenuOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </m.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-[#0ff]/10 overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <m.div
                  key={item.name}
                  variants={mobileItemVariants}
                  className="py-2"
                >
                  <Link 
                    href={item.href}
                    className={`block text-lg text-white/80 hover:text-[#0ff] ${
                      isNavItemActive(item.href) ? 'text-[#0ff]' : ''
                    }`}
                    onClick={handleNavClick}
                  >
                    {item.name}
                  </Link>
                </m.div>
              ))}
              
              {/* Auth links for mobile */}
              <m.hr
                variants={mobileItemVariants}
                className="border-t border-[#0ff]/10 my-2"
              />
              
              <m.div
                variants={mobileItemVariants}
                className="py-2"
              >
                <Link 
                  href="/login"
                  className={`block text-lg text-white/80 hover:text-[#0ff] ${pathname === '/login' ? 'text-[#0ff]' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
              </m.div>
              
              <m.div
                variants={mobileItemVariants}
                className="py-2"
              >
                <Link 
                  href="/register"
                  className="block text-lg text-[#9D00FF] hover:text-[#FF00E6]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    soundEffects.play('success');
                  }}
                >
                  Register
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