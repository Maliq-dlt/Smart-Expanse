'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AISmartInsight() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0]);

  const insights = [
    "Menganalisis pola pengeluaran bulanan...",
    "Anda menghemat 25% lebih banyak bulan ini.",
    "Alokasikan sisa dana ke tabungan darurat."
  ];

  return (
    <section ref={containerRef} className="relative py-32 px-6 overflow-hidden bg-[var(--color-surface)] border-y border-[var(--color-surface-variant)]/30">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-primary-container)]/10 via-transparent to-transparent opacity-50" />
      <motion.div 
        style={{ y, opacity }}
        className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
        className="absolute left-0 bottom-1/4 w-[400px] h-[400px] bg-[var(--color-tertiary)]/5 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 space-y-8 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-container)]/20 border border-[var(--color-primary)]/20"
          >
            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm animate-[spin_4s_linear_infinite]">settings_suggest</span>
            <span className="text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-primary)]">AI-Powered</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-on-surface)] leading-[1.1] tracking-tight"
          >
            Bukan Sekadar <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)]">Pencatat Keuangan.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-[var(--color-on-surface-variant)] leading-relaxed max-w-lg font-light"
          >
            Smart AI Insight membaca pola pengeluaran Anda dan memberikan saran cerdas secara otomatis. Biarkan asisten virtual kami memandu Anda menuju kebebasan finansial.
          </motion.p>
        </div>

        {/* Right Side: Interactive Animation Component */}
        <motion.div 
          className="flex-1 w-full max-w-md relative perspective-1000 z-10"
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Glass Panel */}
          <motion.div 
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
            className="bg-[var(--color-surface-lowest)]/60 backdrop-blur-2xl border border-[var(--color-surface-variant)]/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden transform-gpu transition-all duration-500"
          >
            <motion.div 
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-tertiary)] to-[var(--color-primary)] bg-[length:200%_100%]" 
            />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-tertiary)] flex items-center justify-center shadow-inner z-10 relative">
                  <span className="material-symbols-outlined text-[var(--color-on-primary)] text-2xl">auto_awesome</span>
                </div>
                <div className="absolute inset-0 bg-[var(--color-primary)] blur-xl opacity-50 animate-[pulse_3s_ease-in-out_infinite]" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[var(--color-on-surface)] font-semibold">Smart Insight</h3>
                <p className="text-xs text-[var(--color-primary)] uppercase tracking-wider font-mono">Status: Active</p>
              </div>
            </div>

            {/* Sequence of Insights */}
            <div className="space-y-4">
              {insights.map((text, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.6 + (i * 0.4), ease: "easeOut" }}
                  className="bg-[var(--color-surface-container)]/50 border border-[var(--color-surface-variant)]/30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]/20 group-hover:bg-[var(--color-primary)] transition-colors duration-300" />
                  <p className="text-sm font-medium text-[var(--color-on-surface)] pl-2">{text}</p>
                </motion.div>
              ))}
            </div>

            {/* Scanning line animation */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[var(--color-primary)]/5 to-transparent pointer-events-none -z-10"
            />
          </motion.div>

          {/* Floating Ornaments */}
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 -top-8 w-20 h-20 bg-[var(--color-tertiary-container)]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl flex items-center justify-center rotate-12"
          >
            <span className="material-symbols-outlined text-[var(--color-tertiary)] text-3xl">trending_up</span>
          </motion.div>
          
          <motion.div 
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-6 -bottom-6 w-16 h-16 bg-[var(--color-primary-container)]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-xl flex items-center justify-center -rotate-12"
          >
            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">savings</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
