'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function Magnetic({ children, className = "", strength = 0.35 }: MagneticProps) {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = magnetic.current;
    if (!element) return;

    // Use GSAP quickTo for high performance tracking
    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      
      // Calculate cursor position relative to the center of the element
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // Apply the magnetic pull based on strength
      xTo(x * strength);
      yTo(y * strength);
    };

    const handleMouseLeave = () => {
      // Snap back to center
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={magnetic} className={`inline-block cursor-pointer ${className}`}>
      {children}
    </div>
  );
}
