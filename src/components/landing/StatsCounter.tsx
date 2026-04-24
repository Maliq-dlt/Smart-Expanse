'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CountUpNumber from '@/components/ui/CountUpNumber';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export default function StatsCounter() {
  return (
    <section className="py-20 px-6 bg-[var(--color-surface-lowest)] border-y border-[var(--color-surface-variant)]/30">
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
      >
        {[
          { value: 12000, suffix: "+", label: "Pengguna Aktif", icon: "group" },
          { value: 500, suffix: "K+", label: "Transaksi Tercatat", icon: "receipt_long" },
          { value: 99, suffix: "%", label: "Uptime Server", icon: "cloud_done" },
          { value: 4.9, suffix: "/5", label: "Rating Pengguna", icon: "star" },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} className="text-center group">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-primary-container)]/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[var(--color-primary)]">{stat.icon}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-on-surface)] mb-1">
              <CountUpNumber value={stat.value} suffix={stat.suffix} />
            </h3>
            <p className="text-sm text-[var(--color-outline)]">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
