import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { m, motion } from "framer-motion";

interface Room {
  id: number;
  name: string;
  description?: string;
  participantCount: number;
  type: 'music' | 'conversation' | 'gaming' | 'chill';
  isPrivate?: boolean;
}

interface RoomCardProps {
  room: Room;
  index: number;
  activeCategory?: number;
}

// Enhanced Room Card Component
const EnhancedRoomCard: React.FC<RoomCardProps> = ({ room, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  const isNew = room.id % 3 === 0;
  const isPopular = room.participantCount > 10;
  
  // Get room type colors and label
  const getRoomTypeDetails = () => {
    switch (room.type) {
      case 'music':
        return {
          primaryColor: '#FF00E6', // pink
          secondaryColor: '#9D00FF', // purple
          label: 'MUSIC',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )
        };
      case 'conversation':
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#0088FF', // blue
          label: 'CONVERSATION',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.174 0-2.298-.222-3.335-.624C8.665 19.376 7.976 20 7 20c-1.5 0-2.5-1.5-2.5-1.5S2 14 2 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        };
      case 'gaming':
        return {
          primaryColor: '#9D00FF', // purple
          secondaryColor: '#FF00E6', // pink
          label: 'GAMING',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 8v.01M15 12v.01M14 16v.01M9 8h1v2h2v1h-2v2H9v-2H7v-1h2V8z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2" />
            </svg>
          )
        };
      case 'chill':
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#FF00E6', // pink
          label: 'CHILL',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        };
      default:
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#9D00FF', // purple
          label: 'ROOM',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        };
    }
  };
  
  const roomDetails = getRoomTypeDetails();

  // Define glow gradient based on mouse position
  const glowGradient = `radial-gradient(
    circle at ${mousePosition.x}% ${mousePosition.y}%, 
    ${roomDetails.primaryColor}40 0%, 
    transparent 70%
  )`;
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    
    // Calculate mouse position relative to card center
    const mouseXRelative = e.clientX - rect.left;
    const mouseYRelative = e.clientY - rect.top;
    
    // Calculate rotation (transform mouse position to be between -10 and 10 degrees)
    const rotX = ((mouseYRelative / cardHeight) * 2 - 1) * -10;
    const rotY = ((mouseXRelative / cardWidth) * 2 - 1) * 10;
    
    // Update state
    setRotateX(rotX);
    setRotateY(rotY);
    
    // Update mouse position for glow effect
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
  
  // Initialize and animate waveform bars
  useEffect(() => {
    // Generate initial bar heights
    const initialHeights = Array.from({ length: 18 }, () => Math.random() * 20 + 10);
    setBarHeights(initialHeights);
    
    // Update bar heights with animation
    const intervalId = setInterval(() => {
      setBarHeights(prev => 
        prev.map(height => {
          // Gradually move toward a new random height
          const targetHeight = Math.random() * 20 + 10;
          return height + (targetHeight - height) * 0.3;
        })
      );
    }, 150); // Update every 150ms for smooth animation
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Render waveform bars with current heights
  const renderWaveformBars = () => {
    return barHeights.map((height, i) => (
      <div 
        key={i}
        className="inline-block w-1 mx-0.5 rounded-sm transition-all duration-300 ease-in-out"
        style={{ 
          height: `${height}px`,
          backgroundColor: i % 2 === 0 ? roomDetails.primaryColor : roomDetails.secondaryColor
        }}
      />
    ));
  };

  return (
    <m.div
      ref={cardRef}
      className="group relative h-full rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 rounded-xl z-0"
        style={{ 
          background: `linear-gradient(135deg, ${roomDetails.primaryColor}15, ${roomDetails.secondaryColor}15)`,
        }} 
      />
      
      {/* Moving particles */}
      <div 
        ref={visualizerRef}
        className="absolute inset-0 rounded-xl overflow-hidden z-0"
      />
      
      {/* Magic glow effect that follows cursor */}
      <div
        className={`absolute inset-0 rounded-xl z-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          background: glowGradient,
        }}
      />
      
      {/* Content container */}
      <m.div 
        className="relative h-full flex flex-col p-6 bg-black/60 backdrop-blur-sm rounded-xl z-10 border border-white/10 group-hover:border-[#00FFFF]/30"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          boxShadow: isHovered ? `0 10px 30px -5px ${roomDetails.primaryColor}30` : 'none'
        }}
      >
        {/* Room type label */}
        <div className="absolute top-2 right-2">
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: `${roomDetails.primaryColor}20`,
              color: roomDetails.primaryColor
            }}
          >
            {roomDetails.label}
          </div>
        </div>
        
        {/* Room header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center" 
                style={{ 
                  backgroundColor: `${roomDetails.primaryColor}20`,
                  color: roomDetails.primaryColor
                }}
              >
                {roomDetails.icon}
              </div>
              <h3 
                className="text-xl font-orbitron"
                style={{ color: roomDetails.primaryColor }}
              >
                {room.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: roomDetails.primaryColor }}
              ></span>
              <p className="text-xs opacity-70">{room.participantCount} participants</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {isNew && (
              <div 
                className="px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse"
                style={{ 
                  backgroundColor: `${roomDetails.primaryColor}20`,
                  color: roomDetails.primaryColor
                }}
              >
                NEW
              </div>
            )}
            {isPopular && (
              <div 
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: `${roomDetails.secondaryColor}20`,
                  color: roomDetails.secondaryColor
                }}
              >
                POPULAR
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm opacity-70 mb-4">
          {room.description || "Join this room to connect with others in a voice-based chat experience!"}
        </p>
        
        {/* Animated Audio waveform with vertical bars */}
        <div className="mt-2 mb-4 flex items-center justify-center h-10">
          <div className="flex items-end justify-center w-full h-full">
            {renderWaveformBars()}
          </div>
        </div>
        
        {/* User avatars */}
        <div className="flex -space-x-2 mb-4">
          {[...Array(Math.min(5, room.participantCount))].map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full border border-black/50 flex items-center justify-center text-xs overflow-hidden"
              style={{
                background: `linear-gradient(to right, ${
                  i % 2 === 0 ? roomDetails.primaryColor + '80' : roomDetails.secondaryColor + '80'
                }, ${
                  i % 2 === 0 ? roomDetails.secondaryColor + '80' : roomDetails.primaryColor + '80'
                })`
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {room.participantCount > 5 && (
            <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs">
              +{room.participantCount - 5}
            </div>
          )}
        </div>
        
        {/* Room tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
            #cyberpunk
          </div>
          <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
            #{room.type}
          </div>
        </div>
        
        {/* Join button */}
        <div className="mt-auto">
          <Link href={`/rooms/${room.id}`}>
            <m.button
              className="w-full py-3 px-6 bg-black/50 backdrop-blur-sm border text-white rounded-lg relative overflow-hidden group"
              style={{ 
                borderColor: roomDetails.primaryColor + '50',
                color: roomDetails.primaryColor 
              }}
              whileHover={{ 
                y: -2,
                boxShadow: `0 10px 20px -5px ${roomDetails.primaryColor}30`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 font-medium">Join Room</span>
              <m.span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                style={{ 
                  background: `linear-gradient(135deg, ${roomDetails.primaryColor}30, ${roomDetails.secondaryColor}30)`,
                  borderRadius: 'inherit',
                  transformOrigin: 'center'
                }}
                transition={{ duration: 0.3 }}
              />
            </m.button>
          </Link>
        </div>
      </m.div>
    </m.div>
  );
};

export default EnhancedRoomCard; 