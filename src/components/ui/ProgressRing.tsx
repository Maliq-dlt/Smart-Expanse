'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  icon?: string;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 12,
  color = 'var(--color-primary)',
  trackColor = 'var(--color-surface-variant)',
  icon
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 drop-shadow-md"
      >
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="opacity-30"
        />
        
        {/* Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center">
        {icon && (
          <span 
            className="material-symbols-outlined mb-1" 
            style={{ color, fontSize: size / 4 }}
          >
            {icon}
          </span>
        )}
        <span className="font-mono font-bold" style={{ fontSize: size / 5, color: 'var(--color-on-surface)' }}>
          {Math.round(safeProgress)}%
        </span>
      </div>

      {/* Completion Confetti/Glow */}
      {safeProgress >= 100 && (
        <motion.div 
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ border: `2px solid ${color}` }}
        />
      )}
    </div>
  );
}
