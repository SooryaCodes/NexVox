'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

// Mock components for React Bits
export const BitButton = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline'; 
  onClick?: () => void;
  className?: string;
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-neon-gradient text-white';
      case 'secondary':
        return 'bg-neon-gradient-subtle text-white';
      case 'outline':
        return 'bg-transparent border border-[#00FFFF] text-[#00FFFF]';
      default:
        return 'bg-neon-gradient text-white';
    }
  };
  
  return (
    <m.button
      className={`px-4 py-2 rounded-md ${getStyles()} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </m.button>
  );
};

export const BitCard = ({
  children,
  className = '',
  hoverEffect = true
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) => {
  return (
    <m.div
      className={`glass-panel rounded-lg p-6 ${hoverEffect ? 'hover-card' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </m.div>
  );
};

export const BitBadge = ({
  children,
  color = 'cyan',
  className = ''
}: {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink';
  className?: string;
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'cyan': return 'bg-[#00FFFF]/20 text-[#00FFFF]';
      case 'purple': return 'bg-[#9D00FF]/20 text-[#9D00FF]';
      case 'pink': return 'bg-[#FF00E6]/20 text-[#FF00E6]';
      default: return 'bg-[#00FFFF]/20 text-[#00FFFF]';
    }
  };
  
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getColorClass()} ${className}`}>
      {children}
    </span>
  );
};

export const BitToggle = ({
  checked = false,
  onChange,
  label,
  className = ''
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  
  const handleChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) onChange(newState);
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isChecked ? 'bg-[#00FFFF]' : 'bg-gray-700'}`}
        onClick={handleChange}
        aria-checked={isChecked}
        role="switch"
      >
        <m.div
          className="bg-white w-4 h-4 rounded-full shadow-md"
          animate={{ x: isChecked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="ml-2 text-sm text-white">{label}</span>}
    </div>
  );
};

// Export as a namespace
const ReactBits = {
  Button: BitButton,
  Card: BitCard,
  Badge: BitBadge,
  Toggle: BitToggle
};

export default ReactBits; 