"use client";

import { useState, useRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "onClick"> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export default function GlowButton({
  children,
  onClick,
  className = "",
  glowColor = "rgba(100, 108, 255, 0.5)",
  disabled = false,
  type = "button",
  size = "md",
  variant = "primary",
  ...props
}: GlowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-6",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-primary text-white border-transparent hover:bg-primary/90",
    secondary: "bg-secondary text-primary border-transparent hover:bg-secondary/90",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-primary hover:bg-primary/10 border-transparent",
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      disabled={disabled}
      className={cn(
        "relative rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden",
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {isHovered && (
        <div 
          className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}