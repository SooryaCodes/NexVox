"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import soundEffects from "@/utils/soundEffects";
import { SoundToggle } from "@/components/SoundProvider";
import {
  IoMenuOutline,
  IoClose,
  IoLogInOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import { throttle } from "@/utils/performance";
import { buttonSounds } from "@/utils/sectionSoundEffects";
import HardNavLink from "./HardNavLink";

interface HeaderProps {
  onNavigate?: (route: string) => boolean;
}

// Header component
const Header = memo<HeaderProps>(({ onNavigate }) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentHash, setCurrentHash] = useState("");

  // Handle scroll to update header appearance
  const handleScroll = useCallback(
    throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100),
    []
  );

  // Close mobile menu on resize to desktop
  const handleResize = useCallback(
    throttle(() => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }, 200),
    [isMobileMenuOpen]
  );

  useEffect(() => {
    // Set current path on component mount
    setCurrentPath(window.location.pathname);
    setCurrentHash(window.location.hash);

    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navItems = [
    { name: "Features", href: "/#features" },
    { name: "Rooms", href: "/rooms" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Testimonials", href: "/#testimonials" },
  ];

  // Animation variants
  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
  };

  const logoVariants = {
    normal: { scale: 1 },
    hover: {
      scale: 1.05,
      color: "#00FFFF",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const navItemVariants = {
    normal: { scale: 1 },
    hover: {
      scale: 1.05,
      color: "#00FFFF",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    normal: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const toggleMobileMenu = useCallback(() => {
    soundEffects.playClick();
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Navigation handler with custom navigation support
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, isMobile: boolean = false) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href") || "/";

      // Play subtle click sound
      soundEffects.playClick("soft");

      // Close mobile menu if needed
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }

      // Try to use custom navigation if provided (for home page)
      if (onNavigate && onNavigate(href)) {
        return; // Navigation handled by custom handler
      }

      // Handle hash navigation for scrolling
      if (href.includes("#")) {
        const [path, hash] = href.split("#");
        const currentPath = window.location.pathname;

        // If only changing hash on same page
        if (path === "" || path === currentPath) {
          const element = document.getElementById(hash);
          if (element) {
            // Smooth scroll to element
            element.scrollIntoView({ behavior: "smooth" });

            // Update URL without full navigation
            window.history.pushState({}, "", href);
            return;
          }
        }
      }

      // Handle route change with more aggressive approach
      try {
        // First try the router
        router.push(href);

        // Then use location directly as backup after a brief delay
        setTimeout(() => {
          window.location.href = href;
        }, 200);
      } catch (error) {
        console.error("Navigation failed, using direct approach", error);
        window.location.href = href;
      }
    },
    [router, onNavigate]
  );

  // Check if a nav item is active
  const isNavItemActive = useCallback(
    (href: string) => {
      if (href.includes("#") && currentPath === "/") {
        // Check hash for homepage sections
        return currentHash === href.substring(href.indexOf("#"));
      }
      // Check base path for other pages
      return currentPath === href || currentPath.startsWith(href + "/");
    },
    [currentHash, currentPath]
  );

  return (
    <m.header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-[#0ff]/10"
          : "bg-transparent"
      }`}
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
            <HardNavLink
              href="/"
              onClick={(e) => handleNavClick(e)}
              className="font-orbitron text-xl sm:text-2xl font-bold text-[#0ff] glow flex items-center"
            >
              <span className="relative z-10">
                Nex<span className="text-purple-400">Vox</span>
              </span>
            </HardNavLink>
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
                <HardNavLink
                  href={item.href}
                  className={`text-sm lg:text-base transition-colors duration-300 ${
                    isNavItemActive(item.href)
                      ? "text-[#0ff] font-semibold"
                      : "text-white/80 hover:text-[#0ff]"
                  }`}
                  onClick={(e) => handleNavClick(e)}
                  aria-current={isNavItemActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </HardNavLink>
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
                onClick={buttonSounds.secondary}
                className="group"
              >
                <HardNavLink
                  href="/login"
                  className="px-5 py-2.5 text-sm rounded-md bg-black/60 border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] group-hover:scale-105"
                  onClick={(e) => handleNavClick(e)}
                >
                  <IoLogInOutline className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Login</span>
                </HardNavLink>
              </m.div>
              <m.div
                variants={buttonVariants}
                initial="normal"
                whileHover="hover"
                onClick={buttonSounds.secondary}
                className="group"
              >
                <HardNavLink
                  href="/register"
                  className="px-5 py-2.5 text-sm rounded-md bg-black/60 border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] group-hover:scale-105"
                  onClick={(e) => handleNavClick(e)}
                >
                  <IoLogInOutline className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Register</span>
                </HardNavLink>
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
              {navItems.map((item, idx) => (
                <m.div key={item.name}>
                  <HardNavLink
                    href={item.href}
                    className={`block py-2.5 px-4 rounded-md text-base font-medium transition-colors duration-300 ${
                      isNavItemActive(item.href)
                        ? "text-[#0ff] bg-white/5"
                        : "text-white/80 hover:text-[#0ff] hover:bg-white/5"
                    }`}
                    onClick={(e) => handleNavClick(e, true)}
                  >
                    <span>{item.name}</span>
                  </HardNavLink>
                </m.div>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="flex items-center justify-center space-x-3 pt-4 pb-2">
                <HardNavLink
                  href="/login"
                  className="px-5 py-2.5 text-sm rounded-md bg-black/60 border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                  onClick={(e) => {
                    handleNavClick(e, true);
                    buttonSounds.secondary();
                  }}
                >
                  <IoLogInOutline className="h-4 w-4" />
                  <span>Login</span>
                </HardNavLink>

                <HardNavLink
                  href="/register"
                  className="relative px-5 py-2.5 text-sm rounded-md overflow-hidden group"
                  onClick={(e) => {
                    handleNavClick(e, true);
                    buttonSounds.primary();
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00E6] opacity-80 animate-gradient-x"></span>
                  <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <span className="relative flex items-center gap-2 font-medium text-white">
                    <IoPersonAddOutline className="h-4 w-4" />
                    Register
                  </span>
                  <span className="absolute inset-0 rounded-md shadow-[0_0_15px_rgba(157,0,255,0.5)] opacity-70 group-hover:opacity-100 transition-opacity"></span>
                </HardNavLink>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
});

Header.displayName = "Header";

export default Header;

{
  /* Add CSS for the animated gradient button */
}
<style jsx global>{`
  @keyframes gradient-x {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient-x {
    background-size: 200% 100%;
    animation: gradient-x 8s ease infinite;
  }
`}</style>;
