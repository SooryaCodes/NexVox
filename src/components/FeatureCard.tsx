import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

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
  const iconRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Define colors based on the bgColor prop
  const getGradient = () => {
    switch (bgColor) {
      case 'cyan':
        return 'from-[#00FFFF]/20 to-transparent';
      case 'purple':
        return 'from-[#9D00FF]/20 to-transparent';
      case 'pink':
        return 'from-[#FF00E6]/20 to-transparent';
      case 'gradient':
        return 'from-[#00FFFF]/20 via-[#9D00FF]/20 to-[#FF00E6]/20';
      default:
        return 'from-[#00FFFF]/20 to-transparent';
    }
  };

  const getBorderColor = () => {
    switch (bgColor) {
      case 'cyan': return '#00FFFF';
      case 'purple': return '#9D00FF';
      case 'pink': return '#FF00E6';
      case 'gradient': return '#00FFFF';
      default: return '#00FFFF';
    }
  };

  // GSAP animations for icon
  useEffect(() => {
    if (!iconRef.current) return;
    
    // Floating animation for icon
    gsap.to(iconRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    return () => {
      gsap.killTweensOf(iconRef.current);
    };
  }, []);

  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage positions (-0.5 to 0.5)
    const xPercent = (x / rect.width - 0.5);
    const yPercent = (y / rect.height - 0.5);
    
    setPosition({ x: xPercent * 20, y: yPercent * -20 }); // Adjust multiplier for tilt intensity
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden border border-[${getBorderColor()}]/40 h-full ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }}
      style={{
        transform: `perspective(1000px) rotateX(${position.y}deg) rotateY(${position.x}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
      }}
    >
      {/* Animated border */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00FFFF]/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Background */}
      <div className={`relative z-10 bg-black p-6 h-full`}>
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50 z-0`} />
        
        {/* Icon */}
        <div 
          ref={iconRef}
          className="mb-6 relative z-10"
        >
          {iconPath ? (
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center overflow-hidden`}>
              <img 
                src={iconPath} 
                alt={title} 
                className="w-8 h-8 object-contain"
              />
            </div>
          ) : icon ? (
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
              {icon}
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
              <div className="w-8 h-8 bg-white rounded-full opacity-60" />
            </div>
          )}
          
          {/* Glow effect on hover */}
          {isHovered && (
            <div className={`absolute inset-0 filter blur-md bg-[${getBorderColor()}]/30 z-0`} />
          )}
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className={`text-xl md:text-2xl font-orbitron mb-3 text-[${getBorderColor()}]`}>{title}</h3>
          <p className="text-gray-300 text-sm md:text-base">{description}</p>
        </div>
        
        {/* Hover indicator */}
        {isHovered && (
          <motion.div 
            className="absolute bottom-3 right-3 text-xs font-orbitron text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Explore
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard; 