"use client";

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';

interface ScalingMessageProps {
  message: string;
  duration?: number;
  className?: string;
  onComplete?: () => void;
  fontSize?: string;
  color?: string;
  delay?: number;
  autoStart?: boolean;
  repeat?: boolean;
}

const ScalingMessage: React.FC<ScalingMessageProps> = ({
  message,
  duration = 3000,
  className = "",
  onComplete,
  fontSize = "text-2xl",
  color = "text-white",
  delay = 0,
  autoStart = true,
  repeat = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(autoStart);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500); // Wait for exit animation
        }
        
        if (repeat) {
          setTimeout(() => {
            setIsVisible(true);
          }, 1000); // Wait before repeating
        }
      }, delay + duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [showMessage, delay, duration, onComplete, repeat]);

  const start = () => {
    if (!autoStart) {
      setShowMessage(true);
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <AnimatePresence>
        {isVisible && (
          <m.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20
            }}
            className={`${fontSize} ${color} font-medium text-center`}
          >
            {message}
          </m.div>
        )}
      </AnimatePresence>
      {!autoStart && !showMessage && (
        <button 
          onClick={start} 
          className="text-blue-400 hover:text-blue-300 text-sm transition"
        >
          Show Message
        </button>
      )}
    </div>
  );
};

export default ScalingMessage; 