'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const faqs = [
  { q: "Apakah data finansial saya aman?", a: "Ya, kami tidak menyimpan kredensial bank Anda. Semua data diamankan dengan enkripsi standar industri." },
  { q: "Apakah aplikasi ini gratis?", a: "Fitur dasar pencatatan selamanya gratis. Kami tidak akan pernah mengunci data Anda." },
  { q: "Apakah bisa disambungkan ke rekening bank?", a: "Saat ini SmartExpense fokus pada pencatatan manual untuk memberikan Anda kontrol dan kesadaran penuh atas setiap sen yang keluar." }
];

export default function ThemeFAQ() {
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start border-t border-[var(--color-surface-variant)]/30">
      
      {/* Theme Toggle Visualizer */}
      <div className="space-y-8 sticky top-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-on-background)] mb-4 tracking-tight">Terang atau Gelap.</h2>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Dirancang untuk beradaptasi dengan kenyamanan mata Anda.</p>
        </motion.div>

        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-surface-variant)] cursor-pointer group" onClick={() => setPreviewTheme(prev => prev === 'dark' ? 'light' : 'dark')}>
          {/* Dark Mode Mockup (Base) */}
          <div className="absolute inset-0 bg-[#121212] p-8 flex flex-col items-center justify-center transition-all">
            <div className="w-full max-w-sm space-y-4">
              <div className="w-full h-12 bg-[#1e1e1e] rounded-xl border border-white/5" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-[#1e1e1e] rounded-xl border border-white/5" />
                <div className="h-24 bg-[#1e1e1e] rounded-xl border border-white/5" />
              </div>
            </div>
          </div>

          {/* Light Mode Mockup (Overlay with clip-path transition) */}
          <motion.div 
            className="absolute inset-0 bg-[#ffffff] p-8 flex flex-col items-center justify-center"
            initial={false}
            animate={{ clipPath: previewTheme === 'light' ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full max-w-sm space-y-4">
              <div className="w-full h-12 bg-[#f4f4f5] rounded-xl border border-black/5 shadow-sm" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-[#f4f4f5] rounded-xl border border-black/5 shadow-sm" />
                <div className="h-24 bg-[#f4f4f5] rounded-xl border border-black/5 shadow-sm" />
              </div>
            </div>
          </motion.div>

          {/* Floating Toggle Button */}
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-white/90 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-sm">{previewTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            <span className="text-xs font-medium">Ubah Tema</span>
          </div>
        </div>
      </div>

      {/* Minimalist FAQ Accordion */}
      <div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
          <h2 className="text-3xl font-serif text-[var(--color-on-background)] mb-2">Pertanyaan Umum</h2>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Masih ragu? Kami punya jawabannya.</p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="border-b border-[var(--color-surface-variant)]/50"
            >
              <button 
                onClick={() => setFaqOpenIndex(faqOpenIndex === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left group"
              >
                <span className="text-lg font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{faq.q}</span>
                <motion.span 
                  className="material-symbols-outlined text-[var(--color-outline)]"
                  animate={{ rotate: faqOpenIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  expand_more
                </motion.span>
              </button>
              <AnimatePresence>
                {faqOpenIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[var(--color-on-surface-variant)] leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
