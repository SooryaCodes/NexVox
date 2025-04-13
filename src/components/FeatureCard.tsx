import { useRef, useState } from 'react';
import { m, motion } from 'framer-motion';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode; 
  iconPath?: string;
  bgColor?: 'cyan' | 'purple' | 'pink' | 'gradient';
  className?: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  iconPath,
  bgColor = 'cyan',
  className = ''
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Define colors based on the bgColor prop
  const getColor = (): string => {
    switch (bgColor) {
      case 'cyan': return '#00FFFF';
      case 'purple': return '#9D00FF';
      case 'pink': return '#FF00E6';
      case 'gradient': return '#00FFFF';
      default: return '#00FFFF';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const mouseXRelative = e.clientX - rect.left;
    const mouseYRelative = e.clientY - rect.top;
    
    // Calculate rotation (transform mouse position to be between -15 and 15 degrees)
    const rotX = ((mouseYRelative / cardHeight) * 2 - 1) * -10;
    const rotY = ((mouseXRelative / cardWidth) * 2 - 1) * 10;
    
    // Update state
    setRotateX(rotX);
    setRotateY(rotY);
    
    // Update mouse position for the glow/spotlight effect
    const mouseXPercent = (mouseXRelative / cardWidth) * 100;
    const mouseYPercent = (mouseYRelative / cardHeight) * 100;
    setMouseX(mouseXPercent);
    setMouseY(mouseYPercent);
  };
  
  const handleMouseLeave = () => {
    // Reset rotations when mouse leaves
    setRotateX(0);
    setRotateY(0);
  };

  const cardColor = getColor();
  
  // Define glow gradient based on mouse position
  const glowGradient = `radial-gradient(
    circle at ${mouseX}% ${mouseY}%, 
    ${cardColor}40 0%, 
    transparent 50%
  )`;

  return (
    <m.div 
      ref={cardRef}
      className={`group relative h-full rounded-xl p-px overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-xl z-0 bg-black opacity-80"
        style={{ 
          background: `linear-gradient(to bottom right, ${cardColor}20, transparent)`,
          borderRadius: 'inherit',
        }} 
      />

      {/* Magic glow effect that follows cursor */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" 
        style={{ 
          background: glowGradient,
          borderRadius: 'inherit',
        }}
      />
      
      {/* Moving shine effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0 overflow-hidden"
        style={{ borderRadius: 'inherit' }}
      >
        <div
          className="absolute top-0 -left-[100%] w-[250%] h-[200%] -rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"
          style={{ 
            transform: 'translateX(0) rotate(-45deg)', 
            animation: 'shine 1.5s ease-in-out' 
          }}
        />
      </div>

      {/* Content container */}
      <m.div 
        className="relative h-full flex flex-col p-6 bg-black/60 backdrop-blur-sm rounded-xl z-10"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'all 0.1s ease-out'
        }}
      >
        {/* Icon */}
        <div 
          className="mb-6 transform transition-transform duration-300 group-hover:scale-110"
          style={{ transform: 'translateZ(20px)' }}
        >
          {iconPath ? (
            <div className={`w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-${bgColor === 'cyan' ? '[#00FFFF]' : bgColor === 'purple' ? '[#9D00FF]' : bgColor === 'pink' ? '[#FF00E6]' : '[#00FFFF]'}/20 to-transparent`}>
              <Image 
                src={iconPath} 
                alt={title} 
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
          ) : icon ? (
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-${bgColor === 'cyan' ? '[#00FFFF]' : bgColor === 'purple' ? '[#9D00FF]' : bgColor === 'pink' ? '[#FF00E6]' : '[#00FFFF]'}/20 to-transparent`}>
              {icon}
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-${bgColor === 'cyan' ? '[#00FFFF]' : bgColor === 'purple' ? '[#9D00FF]' : bgColor === 'pink' ? '[#FF00E6]' : '[#00FFFF]'}/20 to-transparent`}>
              <div className="w-8 h-8 bg-white rounded-full opacity-60" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div style={{ transform: 'translateZ(10px)' }}>
          <h3 
            className="text-xl md:text-2xl font-orbitron mb-3"
            style={{ color: cardColor }}
          >
            {title}
          </h3>
          <p className="text-gray-300 text-sm md:text-base">{description}</p>
        </div>
        
        {/* Hover indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-xs font-orbitron text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
            Explore
          </div>
        </div>
      </m.div>
    </m.div>
  );
};

export default FeatureCard;

// Add this to your global.css file or use a style tag in your layout
// @keyframes shine {
//   from { left: -100%; }
//   to { left: 100%; }
// } 