"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import soundEffects from '@/utils/soundEffects';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'cyan' | 'purple' | 'pink' | 'white';
  type?: 'spinner' | 'dots' | 'progress' | 'circular';
  text?: string;
  withSound?: boolean;
}

export default function LoadingSpinner({
  size = 'medium',
  color = 'cyan',
  type = 'spinner',
  text,
  withSound = true
}: LoadingSpinnerProps) {
  const [showLoading, setShowLoading] = useState(true);
  
  // Determine size in pixels
  const getSizeInPixels = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 40;
      case 'large': return 64;
      default: return 40;
    }
  };
  
  // Determine color
  const getColor = () => {
    switch (color) {
      case 'cyan': return '#00FFFF';
      case 'purple': return '#9D00FF';
      case 'pink': return '#FF00E6';
      case 'white': return '#FFFFFF';
      default: return '#00FFFF';
    }
  };

  // Play loading sound
  useEffect(() => {
    if (!withSound) return;
    
    // Play initial loading sound
    soundEffects.loadAndPlay('loading-start', '/audios/digital-load2.mp3');
    
    // Play periodic loading sounds
    const intervalId = setInterval(() => {
      soundEffects.loadAndPlay('loading-loop', '/audios/digital-process.mp3');
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
      // Play completion sound when component unmounts (loading done)
      soundEffects.loadAndPlay('loading-complete', '/audios/accept-loading-resolve.mp3');
    };
  }, [withSound]);

  // Spinner variants
  const renderSpinner = () => {
    const pixelSize = getSizeInPixels();
    const colorValue = getColor();
    
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: pixelSize / 4,
                  height: pixelSize / 4,
                  borderRadius: '50%',
                  backgroundColor: colorValue
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
        
      case 'progress':
        return (
          <div 
            style={{ 
              width: pixelSize * 5,
              height: pixelSize / 5,
              backgroundColor: `${colorValue}20`,
              borderRadius: pixelSize / 10
            }}
          >
            <motion.div
              style={{
                height: '100%',
                backgroundColor: colorValue,
                borderRadius: pixelSize / 10
              }}
              animate={{
                width: ['0%', '100%', '0%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        );
        
      case 'circular':
        return (
          <div className="relative" style={{ width: pixelSize, height: pixelSize }}>
            <motion.span
              style={{
                width: pixelSize,
                height: pixelSize,
                border: `${Math.max(2, pixelSize / 16)}px solid ${colorValue}30`,
                borderTop: `${Math.max(2, pixelSize / 16)}px solid ${colorValue}`,
                borderRadius: '50%',
                display: 'block'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ fontSize: pixelSize / 3 }}
            >
              {/* Center content if needed */}
            </div>
          </div>
        );
        
      case 'spinner':
      default:
        return (
          <div className="relative" style={{ width: pixelSize, height: pixelSize }}>
            <motion.div
              style={{
                width: pixelSize,
                height: pixelSize,
                borderRadius: '10%',
                border: `${Math.max(2, pixelSize / 16)}px solid transparent`,
                borderTopColor: colorValue,
                borderLeftColor: colorValue,
                display: 'block',
                position: 'absolute'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            <motion.div
              style={{
                width: pixelSize * 0.7,
                height: pixelSize * 0.7,
                borderRadius: '20%',
                border: `${Math.max(2, pixelSize / 16)}px solid transparent`,
                borderBottomColor: colorValue,
                borderRightColor: colorValue,
                display: 'block',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderSpinner()}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center font-orbitron text-sm"
          style={{ color: getColor() }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
} 