import { useState, useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';

interface GlassmorphicCardProps {
  children: ReactNode;
  title?: string;
  gradient?: 'cyan-purple' | 'purple-pink' | 'cyan-pink' | 'none';
  className?: string;
  glowOnHover?: boolean;
  tiltEffect?: boolean;
  borderAnimation?: boolean;
}

const GlassmorphicCard = ({
  children,
  title,
  gradient = 'cyan-purple',
  className = '',
  glowOnHover = true,
  tiltEffect = true,
  borderAnimation = true,
}: GlassmorphicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltPosition, setTiltPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  
  // Get gradient class based on prop
  const getGradientClass = () => {
    switch (gradient) {
      case 'cyan-purple':
        return 'from-[#00FFFF]/10 to-[#9D00FF]/10';
      case 'purple-pink':
        return 'from-[#9D00FF]/10 to-[#FF00E6]/10';
      case 'cyan-pink':
        return 'from-[#00FFFF]/10 to-[#FF00E6]/10';
      case 'none':
        return 'from-white/5 to-white/10';
      default:
        return 'from-[#00FFFF]/10 to-[#9D00FF]/10';
    }
  };

  // Border animation with GSAP
  useEffect(() => {
    if (!borderAnimation || !borderRef.current) return;

    const borderEl = borderRef.current;
    
    // Create a timeline for border animation
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(borderEl, {
      backgroundPosition: '200% 0',
      duration: 10,
      ease: 'none'
    });
    
    return () => {
      tl.kill();
    };
  }, [borderAnimation]);

  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt values (-15 to 15 degrees)
    const tiltX = ((y / rect.height) * 2 - 1) * -10;
    const tiltY = ((x / rect.width) * 2 - 1) * 10;
    
    setTiltPosition({ x: tiltX, y: tiltY });
  };

  // Reset tilt when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className={`relative p-px rounded-xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
    >
      {/* Animated border */}
      {borderAnimation && (
        <div 
          ref={borderRef}
          className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent bg-[length:200%_100%] z-0 opacity-${isHovered ? '80' : '30'} transition-opacity duration-300`}
        />
      )}
      
      {/* Card content */}
      <div 
        className={`relative z-10 bg-black bg-opacity-80 backdrop-blur-sm rounded-xl p-6 h-full overflow-hidden transition-all duration-300`}
        style={{
          transform: `perspective(1000px) rotateX(${tiltPosition.x}deg) rotateY(${tiltPosition.y}deg) scale(${isHovered ? 1.02 : 1})`,
          boxShadow: isHovered && glowOnHover 
            ? '0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(157, 0, 255, 0.3)' 
            : 'none',
          transition: 'transform 0.2s ease-out, box-shadow 0.3s ease-out'
        }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} opacity-50 z-0`}></div>
        
        {/* Optional title */}
        {title && (
          <h3 className="text-2xl font-orbitron text-[#00FFFF] mb-4 relative z-10">{title}</h3>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassmorphicCard; 