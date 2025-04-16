"use client";

import React from 'react';
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import NeonGrid from "@/components/NeonGrid";
import soundEffects from "@/utils/soundEffects";
import { m } from 'framer-motion';
import { FaGithub, FaTwitter, FaDiscord, FaEnvelope } from 'react-icons/fa';

interface FooterSectionProps {
  onNavigate?: (route: string) => boolean;
}

const FooterSection = ({ onNavigate }: FooterSectionProps) => {
  // Links with href and label
  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
  ];
  
  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ];
  
  const socialLinks = [
    { href: 'https://github.com', icon: <FaGithub className="w-5 h-5" />, label: 'GitHub' },
    { href: 'https://twitter.com', icon: <FaTwitter className="w-5 h-5" />, label: 'Twitter' },
    { href: 'https://discord.com', icon: <FaDiscord className="w-5 h-5" />, label: 'Discord' },
    { href: 'mailto:contact@nexvox.com', icon: <FaEnvelope className="w-5 h-5" />, label: 'Email' },
  ];

  // Custom link handler to use the navigation hook
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Skip for external links
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      return;
    }
    
    e.preventDefault();
    
    // Use navigation handler if provided
    if (onNavigate && onNavigate(href)) {
      return; // Navigation handled by the custom handler
    }
    
    // Otherwise use normal navigation (link's default behavior)
    window.location.href = href;
  };

  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <m.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/" 
                className="font-orbitron text-2xl font-bold text-[#0ff] glow"
                onClick={(e) => handleLinkClick(e, '/')}
              >
                Nex<span className="text-purple-400">Vox</span>
              </Link>
              <p className="mt-2 text-sm text-gray-400">
                Next-generation voice communication for the modern web.
              </p>
            </m.div>
            
            <m.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#0ff] transition-colors duration-300"
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </m.div>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-[#0ff] text-lg font-medium mb-4">Main Links</h3>
              <ul className="space-y-2">
                {mainLinks.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white hover:underline transition-colors duration-300"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </m.div>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-[#0ff] text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white hover:underline transition-colors duration-300"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </m.div>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-[#0ff] text-lg font-medium mb-4">Subscribe</h3>
              <p className="text-gray-400 text-sm mb-4">Stay updated with our latest features and releases.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-gray-900 text-white rounded-l-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0ff] focus:border-transparent flex-grow"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black font-medium rounded-r-md hover:opacity-90 transition-opacity duration-300"
                >
                  Join
                </button>
              </form>
            </m.div>
          </div>
        </div>
        
        <m.div 
          className="pt-8 mt-8 border-t border-gray-800 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>© {new Date().getFullYear()} NexVox. All rights reserved.</p>
        </m.div>
      </div>
    </footer>
  );
};

export default FooterSection; 