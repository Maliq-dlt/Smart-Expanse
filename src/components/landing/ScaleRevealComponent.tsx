'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScaleRevealComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["48px", "0px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="py-24 px-4 md:px-8 bg-[var(--color-background)] overflow-hidden">
      <motion.div 
        style={{ scale, borderRadius, opacity }}
        className="w-full aspect-video md:aspect-[21/9] bg-[var(--color-surface-lowest)] border border-[var(--color-surface-variant)]/50 shadow-2xl relative overflow-hidden mx-auto max-w-[1400px] flex items-center justify-center group"
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-surface-variant)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-surface-variant)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/10 via-transparent to-[var(--color-tertiary)]/10" />
        
        {/* Floating mini-UI elements */}
        <motion.div
          className="absolute top-8 left-8 bg-[var(--color-surface-low)] backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-surface-variant)]/50 shadow-lg hidden md:flex items-center gap-3"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-sm">trending_up</span>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-outline)] uppercase tracking-wider">Pemasukan</div>
            <div className="text-sm font-mono font-bold text-emerald-500">+12.5%</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-8 bg-[var(--color-surface-low)] backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-surface-variant)]/50 shadow-lg hidden md:flex items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-container)]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">savings</span>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-outline)] uppercase tracking-wider">Tabungan</div>
            <div className="text-sm font-mono font-bold text-[var(--color-primary)]">Rp 24.5M</div>
          </div>
        </motion.div>

        <div className="text-center z-10 p-8 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-6xl font-serif text-[var(--color-on-background)] mb-6 tracking-tight">Ketenangan Pikiran.</h2>
            <p className="text-[var(--color-on-surface-variant)] text-xl">Dibungkus dalam desain yang mulus, sistem kami bekerja tanpa lelah menjaga arus kas Anda tetap sehat.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
