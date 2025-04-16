"use client";

import React from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';

interface PulsatingIconProps {
  iconPath: string;
  size?: number;
  color?: string;
  pulseColor?: string;
  pulseIntensity?: number;
  pulseSpeed?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

const PulsatingIcon: React.FC<PulsatingIconProps> = ({
  iconPath,
  size = 48,
  color = 'rgba(255, 255, 255, 0.8)',
  pulseColor = 'rgba(59, 130, 246, 0.6)',
  pulseIntensity = 1.5,
  pulseSpeed = 2,
  className = '',
  alt = 'Icon',
  onClick
}) => {
  const containerVariants = {
    initial: {
      scale: 1,
      boxShadow: `0 0 0 0px ${pulseColor}`,
    },
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        `0 0 0 0px ${pulseColor}`,
        `0 0 0 ${pulseIntensity * 8}px ${pulseColor}`,
        `0 0 0 0px ${pulseColor}`
      ],
      transition: {
        duration: pulseSpeed,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      transition: {
        duration: pulseSpeed * 0.8,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };
  
  return (
    <m.div
      className={`relative rounded-full flex items-center justify-center cursor-pointer ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <m.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        className="relative"
        style={{
          width: size * 0.6,
          height: size * 0.6
        }}
      >
        <Image
          src={iconPath}
          alt={alt}
          width={size * 0.6}
          height={size * 0.6}
          style={{ objectFit: 'contain' }}
        />
      </m.div>
    </m.div>
  );
};

export default PulsatingIcon; 