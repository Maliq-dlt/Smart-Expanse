'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import Magnetic from '@/components/ui/Magnetic';
import { useAuthStore } from '@/store/useAuthStore';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function FinalCTA() {
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-primary-container)]/20 -z-10" />
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
      >
        <h2 className="text-[48px] md:text-[64px] font-serif text-[var(--color-on-background)] mb-6 leading-tight">
          Kendalikan Uangmu. <br/><span className="italic">Sekarang Juga.</span>
        </h2>
        <p className="text-xl text-[var(--color-on-surface-variant)] mb-10">
          Bergabung dengan antarmuka yang dirancang untuk kedamaian finansial Anda.
        </p>
        <div className="flex justify-center">
          <Magnetic>
            <Link
              href={isMounted && isAuthenticated ? "/home" : "/login"}
              className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-[var(--color-on-surface)] text-[var(--color-surface)] text-lg font-semibold hover:scale-105 transition-transform shadow-2xl shadow-[var(--color-on-surface)]/20"
            >
              {isMounted && isAuthenticated ? "Masuk ke Dashboard" : "Mulai Gratis"}
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
