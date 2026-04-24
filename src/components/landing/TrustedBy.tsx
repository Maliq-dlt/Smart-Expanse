'use client';

import React from 'react';

export default function TrustedBy() {
  return (
    <section className="py-16 border-y border-[var(--color-surface-variant)]/30 bg-[var(--color-surface-lowest)] overflow-hidden">
      <p className="text-center text-sm font-semibold tracking-wider text-[var(--color-outline)] uppercase mb-8">Dipercaya oleh pengguna dan diliput oleh</p>
      <div className="flex gap-16 md:gap-32 px-6 items-center justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="text-2xl font-bold font-serif tracking-tight">TechInAsia</div>
        <div className="text-2xl font-bold font-serif tracking-tight">DailySocial</div>
        <div className="text-2xl font-bold font-serif tracking-tight">Kompas</div>
        <div className="text-2xl font-bold font-serif tracking-tight hidden md:block">Forbes</div>
      </div>
    </section>
  );
}
