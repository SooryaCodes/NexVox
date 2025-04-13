import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  color?: 'cyan' | 'purple' | 'pink' | 'white';
  intensity?: 'low' | 'medium' | 'high';
  activeOnHover?: boolean;
  activeOnView?: boolean;
  alwaysActive?: boolean;
}

const GlitchText = ({
  text,
  className = '',
  as: Component = 'h2',
  color = 'cyan',
  intensity = 'medium',
  activeOnHover = false,
  activeOnView = true,
  alwaysActive = false
}: GlitchTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isActive, setIsActive] = useState(alwaysActive);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Define text color based on the prop
  const getTextColor = () => {
    switch (color) {
      case 'cyan': return 'text-[#00FFFF]';
      case 'purple': return 'text-[#9D00FF]';
      case 'pink': return 'text-[#FF00E6]';
      case 'white': return 'text-white';
      default: return 'text-[#00FFFF]';
    }
  };
  
  // Use IntersectionObserver to detect when the text is in view
  useEffect(() => {
    if (!activeOnView || !textRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    const currentTextRef = textRef.current;
    observer.observe(currentTextRef);
    
    return () => {
      observer.unobserve(currentTextRef);
    };
  }, [activeOnView]);
  
  // Determine if glitch effect should be active
  useEffect(() => {
    setIsActive(alwaysActive || (activeOnHover && isHovered) || (activeOnView && isInView));
  }, [alwaysActive, activeOnHover, isHovered, activeOnView, isInView]);
  
  // Apply glitch animation with GSAP
  useEffect(() => {
    if (!textRef.current) return;
    const currentTextRef = textRef.current;
    
    // Determine intensity values based on prop
    const getIntensityValues = () => {
      switch (intensity) {
        case 'low': return { glitchFrequency: 3000, glitchDuration: 200, glitchIntensity: 5 };
        case 'medium': return { glitchFrequency: 2000, glitchDuration: 400, glitchIntensity: 10 };
        case 'high': return { glitchFrequency: 1000, glitchDuration: 500, glitchIntensity: 20 };
        default: return { glitchFrequency: 2000, glitchDuration: 400, glitchIntensity: 10 };
      }
    };
    
    // Initial setup - create pseudo-elements for glitch layers
    if (!isInitialized) {
      const textStyles = window.getComputedStyle(currentTextRef);
      
      const createGlitchLayer = (offset: number, color: string) => {
        const layer = document.createElement('div');
        layer.textContent = text;
        layer.style.position = 'absolute';
        layer.style.top = '0';
        layer.style.left = '0';
        layer.style.color = color;
        layer.style.zIndex = '-1';
        layer.className = 'glitch-layer';
        return layer;
      };
      
      // Create red and blue offset layers for chromatic aberration effect
      const redLayer = createGlitchLayer(2, 'rgba(255, 0, 76, 0.8)');
      const blueLayer = createGlitchLayer(-2, 'rgba(0, 255, 255, 0.8)');
      
      currentTextRef.style.position = 'relative';
      currentTextRef.appendChild(redLayer);
      currentTextRef.appendChild(blueLayer);
      
      setIsInitialized(true);
    }
    
    const intensityValues = getIntensityValues();
    let glitchInterval: NodeJS.Timeout;
    
    if (isActive) {
      const glitchLayers = currentTextRef.querySelectorAll('.glitch-layer');
      
      const applyGlitch = () => {
        // Create timeline for coordinated animation
        const tl = gsap.timeline();
        
        // Random offset for main text
        tl.to(currentTextRef, {
          skewX: () => Math.random() * intensityValues.glitchIntensity - intensityValues.glitchIntensity/2,
          skewY: () => Math.random() * intensityValues.glitchIntensity/4 - intensityValues.glitchIntensity/8,
          x: () => Math.random() * 4 - 2,
          duration: 0.1
        });
        
        // Animate each glitch layer with slightly different values
        glitchLayers.forEach((layer) => {
          const direction = 1;
          tl.to(layer, {
            x: () => direction * (Math.random() * intensityValues.glitchIntensity - intensityValues.glitchIntensity/2),
            skewX: () => direction * Math.random() * intensityValues.glitchIntensity,
            opacity: () => 0.7 + Math.random() * 0.3,
            duration: 0.1
          }, 0);
        });
        
        // Reset everything after the glitch
        tl.to([currentTextRef, ...glitchLayers], {
          skewX: 0,
          skewY: 0,
          x: 0,
          opacity: index => index === 0 ? 1 : 0.5,
          duration: 0.1
        });
        
        return tl;
      };
      
      // Periodically trigger the glitch effect
      glitchInterval = setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance of glitching
          applyGlitch();
        }
      }, intensityValues.glitchFrequency);
      
      // Initial glitch
      applyGlitch();
    }
    
    return () => {
      if (glitchInterval) {
        clearInterval(glitchInterval);
      }
    };
  }, [isActive, isInitialized, text, intensity]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        ref={textRef}
        className={`${getTextColor()} font-orbitron relative inline-block`}
        data-text={text}
      >
        {text}
      </Component>
    </div>
  );
};

export default GlitchText; 