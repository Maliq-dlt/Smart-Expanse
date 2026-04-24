'use client';

import { motion } from 'framer-motion';
import { ReactNode, MouseEvent, useState, useRef } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  variants?: any;
}

export default function HoverCard({ children, className = '', variants }: HoverCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-[var(--color-surface-lowest)]/80 backdrop-blur-md rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50 transition-all duration-300 hover:-translate-y-1 group ${className}`}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--color-primary-container), transparent 40%)`,
        }}
      />
      
      {/* Content wrapper to keep it above the spotlight */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
