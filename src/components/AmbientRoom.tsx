import { useRef, useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { gsap } from 'gsap';

interface AmbientRoomProps {
  className?: string;
  roomName?: string;
  participantCount?: number;
  roomType?: 'music' | 'conversation' | 'gaming' | 'chill';
}

const AmbientRoom = ({
  className = '',
  roomName = 'Synthwave Dreams',
  participantCount = 128,
  roomType = 'music'
}: AmbientRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const soundwaveRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  // Get room type colors and icons
  const getRoomTypeDetails = () => {
    switch (roomType) {
      case 'music':
        return {
          primaryColor: '#FF00E6', // pink
          secondaryColor: '#9D00FF', // purple
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        };
      case 'conversation':
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#0088FF', // blue
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.174 0-2.298-.222-3.335-.624C8.665 19.376 7.976 20 7 20c-1.5 0-2.5-1.5-2.5-1.5S2 14 2 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        };
      case 'gaming':
        return {
          primaryColor: '#9D00FF', // purple
          secondaryColor: '#FF00E6', // pink
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 8v.01M15 12v.01M14 16v.01M9 8h1v2h2v1h-2v2H9v-2H7v-1h2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        };
      case 'chill':
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#FF00E6', // pink
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        };
      default:
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#9D00FF', // purple
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        };
    }
  };
  
  const roomDetails = getRoomTypeDetails();
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const mouseXRelative = e.clientX - rect.left;
    const mouseYRelative = e.clientY - rect.top;
    
    // Calculate rotation (transform mouse position to be between -15 and 15 degrees)
    const rotX = ((mouseYRelative / cardHeight) * 2 - 1) * -15;
    const rotY = ((mouseXRelative / cardWidth) * 2 - 1) * 15;
    
    // Update state
    setRotateX(rotX);
    setRotateY(rotY);
    
    // Update mouse position for the glow/spotlight effect
    const mouseXPercent = (mouseXRelative / cardWidth) * 100;
    const mouseYPercent = (mouseYRelative / cardHeight) * 100;
    setMousePosition({ x: mouseXPercent, y: mouseYPercent });
  };
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };
  
  // Define glow gradient based on mouse position
  const glowGradient = `radial-gradient(
    circle at ${mousePosition.x}% ${mousePosition.y}%, 
    ${roomDetails.primaryColor}40 0%, 
    transparent 70%
  )`;

  // Animate sound wave
  useEffect(() => {
    if (!soundwaveRef.current) return;
    
    const bars = soundwaveRef.current.querySelectorAll('.sound-bar');
    
    bars.forEach((bar, index) => {
      const delay = index * 0.1;
      const height = 10 + Math.random() * 30;
      
      gsap.to(bar, {
        height: `${height}px`,
        duration: 0.8 + Math.random() * 0.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: delay
      });
    });
    
    return () => {
      gsap.killTweensOf(bars);
    };
  }, []);
  
  // Create ambient particles animation
  useEffect(() => {
    if (!visualizerRef.current) return;
    
    const visualizer = visualizerRef.current;
    const particles = 20;
    
    // Remove any existing particles
    while (visualizer.firstChild) {
      visualizer.removeChild(visualizer.firstChild);
    }
    
    // Create new particles
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      
      // Randomize size
      const size = 2 + Math.random() * 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Set position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Set color
      const isAlternateColor = Math.random() > 0.5;
      particle.style.backgroundColor = isAlternateColor 
        ? roomDetails.secondaryColor 
        : roomDetails.primaryColor;
      
      // Set opacity
      particle.style.opacity = (0.3 + Math.random() * 0.5).toString();
      
      visualizer.appendChild(particle);
      
      // Animate particle
      gsap.to(particle, {
        x: () => -20 + Math.random() * 40,
        y: () => -20 + Math.random() * 40,
        opacity: () => 0.1 + Math.random() * 0.5,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });
    }
    
    return () => {
      gsap.killTweensOf(visualizer.childNodes);
    };
  }, [roomDetails.primaryColor, roomDetails.secondaryColor]);

  return (
    <m.div
      ref={containerRef}
      className={`group relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 rounded-2xl z-0"
        style={{ 
          background: `linear-gradient(135deg, ${roomDetails.primaryColor}10, ${roomDetails.secondaryColor}10)`,
          borderRadius: 'inherit',
        }} 
      />
      
      {/* Moving particles */}
      <div 
        ref={visualizerRef}
        className="absolute inset-0 rounded-2xl overflow-hidden z-0"
      />
      
      {/* Magic glow effect that follows cursor */}
      <div
        className={`absolute inset-0 rounded-2xl z-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          background: glowGradient,
          borderRadius: 'inherit',
        }}
      />
      
      {/* Content container */}
      <m.div 
        className="relative h-full flex flex-col p-6 bg-black/60 backdrop-blur-sm rounded-2xl z-10"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'all 0.1s ease-out'
        }}
      >
        {/* Room header */}
        <div className="flex items-center justify-between mb-auto">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ color: roomDetails.primaryColor }}>
              {roomDetails.icon}
            </div>
            <h3 
              className="text-lg font-orbitron"
              style={{ color: roomDetails.primaryColor }}
            >
              {roomName}
            </h3>
          </div>
          
          {/* Participant count */}
          <div className="bg-black/50 px-2 py-1 rounded-full text-xs flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
            <span>{participantCount}</span>
          </div>
        </div>
        
        {/* Audio visualizer at the bottom */}
        <div className="mt-auto">
          <div 
            ref={soundwaveRef}
            className="h-12 flex items-end justify-between space-x-0.5"
          >
            {/* Generate sound bars */}
            {[...Array(30)].map((_, idx) => (
              <div
                key={idx}
                className="sound-bar w-1 bg-gradient-to-t rounded-sm"
                style={{ 
                  height: `${10 + Math.random() * 20}px`,
                  backgroundColor: idx % 2 === 0 ? roomDetails.primaryColor : roomDetails.secondaryColor,
                  opacity: 0.6 + Math.random() * 0.4
                }}
              ></div>
            ))}
          </div>
        </div>
      </m.div>
    </m.div>
  );
};

export default AmbientRoom; 