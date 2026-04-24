'use client';

import React, { useState, useEffect } from 'react';
import { motion, useTransform, useSpring, useMotionValue, Variants } from 'framer-motion';
import Link from 'next/link';
import Magnetic from '@/components/ui/Magnetic';
import { useAuthStore } from '@/store/useAuthStore';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const heroStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 2.0 }, // Wait for preloader
  },
};

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-500, 500], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-5, 5]), springConfig);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative pt-20 pb-20 px-6 max-w-7xl mx-auto">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[var(--color-primary-container)]/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[var(--color-tertiary-container)]/10 rounded-full blur-3xl -z-10" />

      {/* Floating 3D Geometric Shapes */}
      <motion.div
        className="absolute top-[15%] left-[8%] w-16 h-16 border-2 border-[var(--color-primary-container)]/30 rounded-xl -z-[5] hidden lg:block"
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        style={{ rotateX, rotateY }}
      />
      <motion.div
        className="absolute top-[30%] right-[12%] w-10 h-10 border-2 border-[var(--color-tertiary-container)]/40 rounded-full -z-[5] hidden lg:block"
        animate={{ scale: [1, 1.3, 1], y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[15%] w-6 h-6 bg-[var(--color-primary-container)]/20 rounded-md -z-[5] hidden lg:block"
        animate={{ rotate: -360, x: [0, 10, 0] }}
        transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, x: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      />
      <motion.div
        className="absolute top-[60%] right-[5%] w-3 h-3 bg-[var(--color-tertiary)]/30 rounded-full -z-[5] hidden lg:block"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[10%] right-[35%] w-20 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary-container)]/30 to-transparent -z-[5] hidden lg:block"
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Text Content */}
        <motion.div className="space-y-8 z-10" initial="hidden" animate="show" variants={heroStagger}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-low)] border border-[var(--color-surface-variant)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-outline)]">Versi 2.0 Telah Hadir</span>
          </motion.div>
          
          <motion.h1 variants={heroStagger} initial="hidden" animate="show" className="text-[64px] lg:text-[80px] leading-[1.05] text-[var(--color-on-background)] font-serif tracking-tight flex flex-col">
            <div className="overflow-hidden">
              <motion.span variants={fadeUp} className="inline-block">Uangmu</motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span variants={fadeUp} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] italic pr-4">
                Kemana?
              </motion.span>
            </div>
          </motion.h1>
          
          <motion.p variants={heroStagger} initial="hidden" animate="show" className="text-xl text-[var(--color-on-surface-variant)] max-w-md leading-relaxed flex flex-wrap">
            {"Lupakan pencatatan manual yang membosankan. Mulai kelola keuangan dengan antarmuka yang indah, cepat, dan interaktif.".split(' ').map((word, i) => (
              <span key={i} className="overflow-hidden inline-block mr-1.5 mb-1">
                <motion.span variants={fadeUp} className="inline-block">{word}</motion.span>
              </span>
            ))}
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4">
            <Magnetic>
              <Link href={isMounted && isAuthenticated ? "/home" : "/signup"} className="group shimmer-btn bg-[var(--color-on-surface)] text-[var(--color-surface)] px-8 py-4 rounded-full font-medium transition-all flex items-center gap-2 hover:shadow-xl hover:shadow-[var(--color-on-surface)]/20">
                Mulai Sekarang
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Right: Parallax Interactive Mockup */}
        <motion.div 
          className="relative lg:h-[600px] flex items-center justify-center perspective-[1200px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-md bg-[var(--color-surface-lowest)] rounded-3xl p-6 shadow-2xl border border-[var(--color-surface-variant)]/50 relative"
          >
            {/* Glass Header */}
            <div className="flex justify-between items-center mb-8 border-b border-[var(--color-surface-variant)]/50 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="w-24 h-4 bg-[var(--color-surface-variant)] rounded-full" />
            </div>

            {/* Floating Element 1 (Balance) */}
            <motion.div 
              data-speed="1.2"
              style={{ translateZ: 50 }}
              className="bg-[var(--color-primary-container)]/10 p-6 rounded-2xl mb-6 shadow-lg border border-[var(--color-primary-container)]/20 backdrop-blur-md"
            >
              <div className="w-16 h-4 bg-[var(--color-primary)]/40 rounded-full mb-3" />
              <div className="w-48 h-8 bg-[var(--color-primary)]/80 rounded-lg mb-4" />
              <div className="w-full h-2 bg-[var(--color-primary-container)]/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--color-primary)]" 
                  initial={{ width: 0 }} 
                  animate={{ width: '68%' }} 
                  transition={{ duration: 1.5, delay: 0.5 }} 
                />
              </div>
            </motion.div>

            {/* Floating Element 2 (Chart) */}
            <motion.div 
              data-speed="0.8"
              style={{ translateZ: 30 }}
              className="flex items-end gap-3 h-32 mb-6 px-2"
            >
              {[40, 70, 45, 90, 65, 80].map((height, i) => (
                <motion.div 
                  key={i}
                  className="flex-1 bg-[var(--color-tertiary-container)]/40 rounded-t-lg relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                >
                  <div className="absolute -top-2 left-0 w-full h-full bg-[var(--color-tertiary)]/80 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>

            {/* Floating Element 3 (Floating Card) */}
            <motion.div 
              data-speed="1.5"
              style={{ translateZ: 80 }}
              className="absolute -right-12 bottom-12 bg-[var(--color-surface-lowest)] p-4 rounded-2xl shadow-xl border border-[var(--color-surface-variant)] flex items-center gap-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <div className="w-20 h-3 bg-[var(--color-surface-variant)] rounded-full mb-2" />
                <div className="text-sm font-mono font-bold text-emerald-600">+ Rp 6.5M</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
