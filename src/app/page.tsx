'use client';

import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import Lenis from 'lenis';

import HeroSection from '@/components/landing/HeroSection';
import InfiniteMarquee from '@/components/landing/InfiniteMarquee';
import StatsCounter from '@/components/landing/StatsCounter';
import AISmartInsight from '@/components/landing/AISmartInsight';
import FeatureBentoBox from '@/components/landing/FeatureBentoBox';
import FeatureTabs from '@/components/landing/FeatureTabs';
import TrustedBy from '@/components/landing/TrustedBy';
import ThemeFAQ from '@/components/landing/ThemeFAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import MegaFooter from '@/components/landing/MegaFooter';
import HorizontalTestimonials from '@/components/landing/HorizontalTestimonials';
import ScaleRevealComponent from '@/components/landing/ScaleRevealComponent';
import ScrollRevealText from '@/components/ui/ScrollRevealText';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Lenis Smooth Scroll ---
  useEffect(() => {
    setIsMounted(true);
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // --- Scroll Progress ---
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const scaleX = useSpring(pageScrollProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- Preloader timer ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* --- PAGE PRELOADER --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-white/90 tracking-tight">SmartExpense.</h1>
              <motion.div 
                className="mt-8 mx-auto h-[2px] bg-white/20 w-48 rounded-full overflow-hidden"
              >
                <motion.div 
                  className="h-full bg-white/80 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SCROLL PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-primary)] z-[60] origin-left"
        style={{ scaleX }}
      />

      <div className="bg-[var(--color-background)] text-[var(--color-on-background)] min-h-screen overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white">
        
        {/* --- Navigation --- */}
        <nav className="fixed top-0 w-full z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/30">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
            <Link href={isMounted && isAuthenticated ? "/home" : "/"} className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)] font-serif italic">
              SmartExpense.
            </Link>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#bento" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Visualisasi</a>
              <a href="#tabs" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Cara Kerja</a>
            </div>
            <div className="flex space-x-4 items-center">
              <Link
                href="/login"
                className="group relative px-6 py-2 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-semibold text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              </Link>
            </div>
          </div>
        </nav>

        <HeroSection />
        <InfiniteMarquee />
        <StatsCounter />
        <AISmartInsight />
        
        <section className="bg-[var(--color-background)] border-b border-[var(--color-surface-variant)]/30">
          <ScrollRevealText text="Kebebasan finansial dimulai dari satu langkah kecil. Lacak, kelola, dan raih impian Anda." />
        </section>

        <FeatureBentoBox />
        <ScaleRevealComponent />
        <FeatureTabs />
        <TrustedBy />
        <HorizontalTestimonials />
        <ThemeFAQ />
        <FinalCTA />
        <MegaFooter />
        
      </div>
    </>
  );
}
