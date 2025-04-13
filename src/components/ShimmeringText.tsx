import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ShimmeringTextProps {
  text: string;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'gradient';
  highlight?: boolean;
  speed?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const ShimmeringText = ({
  text,
  className = '',
  variant = 'cyan',
  highlight = true,
  speed = 2,
  delay = 0,
  as: Component = 'h2'
}: ShimmeringTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !textContainerRef.current) return;

    // Define base color
    let mainColor, shimmerColor;
    switch(variant) {
      case 'cyan':
        mainColor = '#00FFFF';
        shimmerColor = 'rgba(0, 255, 255, 0.9)';
        break;
      case 'purple':
        mainColor = '#9D00FF';
        shimmerColor = 'rgba(157, 0, 255, 0.9)';
        break;
      case 'pink':
        mainColor = '#FF00E6';
        shimmerColor = 'rgba(255, 0, 230, 0.9)';
        break;
      case 'gradient':
        mainColor = 'linear-gradient(90deg, #00FFFF, #9D00FF, #FF00E6)';
        shimmerColor = 'rgba(157, 120, 255, 0.9)';
        break;
      default:
        mainColor = '#00FFFF';
        shimmerColor = 'rgba(0, 255, 255, 0.9)';
    }

    // Set up shimmer animation
    const shimmerAnimation = () => {
      const tl = gsap.timeline({ repeat: -1 });
      
      // Create shimmer effect
      tl.fromTo(textRef.current, 
        { 
          backgroundImage: `linear-gradient(90deg, ${mainColor}, ${mainColor}, ${mainColor})`,
          backgroundSize: '200% 100%',
          backgroundPosition: '100% 0%'
        },
        { 
          backgroundImage: `linear-gradient(90deg, ${mainColor}, ${shimmerColor}, ${mainColor})`,
          backgroundPosition: '0% 0%',
          duration: speed,
          ease: 'power1.inOut'
        }
      )
      .to(textRef.current, {
        backgroundPosition: '-100% 0%',
        duration: speed,
        ease: 'power1.inOut'
      });
      
      // Create subtle pulsing glow if highlight is enabled
      if (highlight) {
        tl.to(textContainerRef.current, {
          textShadow: `0 0 10px ${shimmerColor}, 0 0 20px ${shimmerColor}`,
          duration: speed / 2,
          ease: 'power1.inOut',
          repeat: 1,
          yoyo: true
        }, 0);
      }
      
      return tl;
    };

    // Create master timeline with delay
    const masterTl = gsap.timeline();
    masterTl.add(shimmerAnimation(), delay);

    return () => {
      masterTl.kill();
    };
  }, [variant, highlight, speed, delay]);

  // Apply appropriate base styles for the variant
  const getBaseStyles = () => {
    switch(variant) {
      case 'cyan':
        return 'text-[#00FFFF]';
      case 'purple':
        return 'text-[#9D00FF]';
      case 'pink':
        return 'text-[#FF00E6]';
      case 'gradient':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00E6]';
      default:
        return 'text-[#00FFFF]';
    }
  };

  return (
    <div ref={textContainerRef} className={`inline-block ${highlight ? 'glow' : ''}`}>
      <Component
        ref={textRef}
        className={`bg-clip-text text-transparent font-orbitron ${getBaseStyles()} ${className}`}
        style={{
          backgroundSize: '200% 100%',
          backgroundPosition: '100% 0%',
        }}
      >
        {text}
      </Component>
    </div>
  );
};

export default ShimmeringText; 