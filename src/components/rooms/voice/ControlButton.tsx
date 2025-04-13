"use client";

import React from "react";
import { m } from "framer-motion";

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  isActive?: boolean;
  danger?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  color = "#FFFFFF", 
  isActive = false, 
  danger = false 
}) => {
  return (
    <m.button
      className={`p-3 rounded-full relative ${
        danger 
          ? 'bg-red-500/20' 
          : isActive 
            ? `bg-${color.replace('#', '')}/20` 
            : 'bg-white/5'
      } border ${
        danger 
          ? 'border-red-500/30' 
          : isActive 
            ? `border-${color.replace('#', '')}/30` 
            : 'border-white/10'
      } text-${
        danger 
          ? 'red-400' 
          : isActive 
            ? color.replace('#', '') 
            : 'white'
      }`}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: danger 
          ? "rgba(220, 38, 38, 0.3)" 
          : isActive 
            ? `rgba(${color === "#00FFFF" ? "0, 255, 255" : color === "#9D00FF" ? "157, 0, 255" : "255, 255, 255"}, 0.2)` 
            : "rgba(255, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </m.button>
  );
};

export default ControlButton;
