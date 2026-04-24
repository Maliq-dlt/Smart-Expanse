'use client';

import React from 'react';
import { motion } from 'framer-motion';

const marqueeItems = [
  { icon: 'local_cafe', label: 'Ngopi', amount: '- Rp 35.000', type: 'expense' },
  { icon: 'payments', label: 'Gaji Bulanan', amount: '+ Rp 8.500.000', type: 'income' },
  { icon: 'shopping_bag', label: 'Belanja', amount: '- Rp 1.200.000', type: 'expense' },
  { icon: 'movie', label: 'Nonton Bioskop', amount: '- Rp 150.000', type: 'expense' },
  { icon: 'home', label: 'Cicilan Rumah', amount: '- Rp 3.000.000', type: 'expense' },
  { icon: 'flight', label: 'Tiket Liburan', amount: '- Rp 2.500.000', type: 'expense' },
  { icon: 'restaurant', label: 'Makan Malam', amount: '- Rp 120.000', type: 'expense' },
];

export default function InfiniteMarquee() {
  return (
    <section className="py-6 border-y border-[var(--color-surface-variant)]/40 overflow-hidden flex whitespace-nowrap bg-[var(--color-background)]">
      <motion.div
        className="flex gap-4 px-2 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {/* Double array for seamless loop */}
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--color-surface-lowest)]/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[var(--color-outline-variant)]/30 cursor-default hover:border-[var(--color-outline-variant)]/60 transition-colors">
            <span className={`material-symbols-outlined text-sm ${item.type === 'income' ? 'text-emerald-500' : 'text-[var(--color-outline)]'}`}>{item.icon}</span>
            <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">{item.label}</span>
            <span className={`text-sm font-mono ${item.type === 'income' ? 'text-emerald-500 font-semibold' : 'text-[var(--color-on-surface)]'}`}>{item.amount}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
