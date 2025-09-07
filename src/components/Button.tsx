"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden btn-glow";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 focus:ring-blue-500/50 shadow-lg hover:shadow-xl",
    secondary: "glass-subtle border border-white/20 text-white hover:glass-strong focus:ring-purple-500/50 hover:border-white/30", 
    outline: "border border-white/30 glass-subtle text-gray-200 hover:glass-strong hover:text-white focus:ring-blue-500/50"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    onDrag,
    onDragStart,
    onDragEnd,
    ...buttonProps 
  } = props;

  // Suppress unused variable warnings for excluded props
  void onAnimationStart;
  void onAnimationEnd; 
  void onAnimationIteration;
  void onDrag;
  void onDragStart;
  void onDragEnd;

  return (
    <motion.button 
      className={classes}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
