"use client";

import React, { ReactNode, useRef } from 'react';
import { m, useInView, Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  threshold?: number;
  stagger?: boolean;
  staggerChildren?: number;
  ease?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut";
}

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  duration = 0.6,
  distance = 30,
  threshold = 0.1,
  className = "",
  stagger = false,
  staggerChildren = 0.1,
  ease = "easeOut"
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration,
        ease: ease,
        delay: delay,
        staggerChildren: stagger ? staggerChildren : 0,
        delayChildren: stagger ? delay : 0
      }
    }
  };

  const childVariants: Variants = stagger ? {
    hidden: { opacity: 0, ...getInitialPosition() },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        duration: duration,
        ease: ease
      }
    }
  } : {
    hidden: {},
    visible: {}
  };

  return (
    <m.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {stagger && React.Children.map(children, child => (
        <m.div variants={childVariants}>
          {child}
        </m.div>
      ))}
      
      {!stagger && children}
    </m.div>
  );
};

export default ScrollReveal; 