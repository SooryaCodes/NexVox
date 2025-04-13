import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';

interface HolographicCardProps {
  children?: ReactNode;
  avatar?: string;
  name?: string;
  location?: string;
  quote?: string;
  className?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
}

const HolographicCard = ({
  children,
  avatar,
  name,
  location,
  quote,
  className = '',
  glowIntensity = 'medium',
  color = 'cyan'
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Get primary color based on prop
  const getPrimaryColor = () => {
    switch (color) {
      case 'cyan': return '#00FFFF';
      case 'purple': return '#9D00FF';
      case 'pink': return '#FF00E6';
      case 'gradient': return 'linear-gradient(135deg, #00FFFF, #9D00FF, #FF00E6)';
      default: return '#00FFFF';
    }
  };
  
  // Calculate glow intensity
  const getGlowIntensity = () => {
    switch (glowIntensity) {
      case 'low': return 10;
      case 'medium': return 20;
      case 'high': return 30;
      default: return 20;
    }
  };

  // Set up hologram effect
  useEffect(() => {
    if (!hologramRef.current || !cardRef.current) return;
    
    const hologram = hologramRef.current;
    const card = cardRef.current;
    
    // Initial horizontal scan line animation
    const scanLine = document.createElement('div');
    scanLine.className = 'absolute left-0 w-full h-[1px] bg-[#00FFFF] opacity-60 z-10';
    hologram.appendChild(scanLine);
    
    // Create holographic effect animation
    const tl = gsap.timeline({ repeat: -1 });
    
    // Scan line animation
    tl.to(scanLine, {
      top: '100%',
      duration: 2,
      ease: 'power1.inOut',
      onComplete: () => {
        scanLine.style.top = '0%';
      }
    });
    
    // Flickering effect
    gsap.to(hologram, {
      opacity: () => 0.8 + Math.random() * 0.2,
      duration: 0.2,
      repeat: -1,
      yoyo: true
    });
    
    // Clean up
    return () => {
      tl.kill();
      gsap.killTweensOf(hologram);
      if (scanLine.parentNode) {
        scanLine.parentNode.removeChild(scanLine);
      }
    };
  }, []);
  
  // Track mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };
  
  // Calculate rotation and movement based on mouse position
  const calculateStyles = () => {
    if (!isHovered) {
      return {
        transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.5s ease-out',
      };
    }
    
    // Map mouse position to rotation values (-15 to 15 degrees)
    const rotateY = (mousePosition.x - 0.5) * 30;
    const rotateX = (0.5 - mousePosition.y) * 30;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: 'transform 0.1s ease-out',
    };
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      style={calculateStyles()}
    >
      {/* Card background with holographic effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div 
          ref={hologramRef}
          className="absolute inset-0 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(0,255,255,0.1), rgba(157,0,255,0.1))`,
            filter: `blur(1px)`,
            pointerEvents: 'none'
          }}
        >
          {/* Horizontal lines for holographic effect */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full h-[1px] bg-white opacity-20"
              style={{ top: `${i * 5}%` }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 p-6"
      >
        {children || (
          <>
            {/* User info with avatar */}
            {(avatar || name) && (
              <div className="flex items-center mb-4">
                {avatar && (
                  <div className="w-14 h-14 rounded-full mr-4 overflow-hidden border-2 border-[#00FFFF]/50 relative">
                    <Image 
                      src={avatar} 
                      alt={name || 'User avatar'} 
                      width={56} 
                      height={56} 
                      className="object-cover w-full h-full"
                    />
                    
                    {/* Avatar glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFFF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                
                <div>
                  {name && <h4 className="font-orbitron text-[#00FFFF]">{name}</h4>}
                  {location && <p className="text-sm opacity-60">{location}</p>}
                </div>
              </div>
            )}
            
            {/* Quote */}
            {quote && (
              <p className="opacity-80 italic text-white">"{quote}"</p>
            )}
          </>
        )}
      </div>
      
      {/* Edge glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 ${getGlowIntensity()}px ${getPrimaryColor()}`,
        }}
      ></div>
      
      {/* Subtle edges */}
      <div className="absolute inset-0 border border-[#00FFFF]/20 rounded-xl pointer-events-none"></div>
    </motion.div>
  );
};

export default HolographicCard; 