'use client';

import { useModal } from '@/contexts/ModalContext';
import { useFinanceStore } from '@/store/useFinanceStore';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function TopBar() {
  const { openTransactionModal } = useModal();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isPrivacyMode, togglePrivacyMode } = useFinanceStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 20 && isScrolled) {
      setIsScrolled(false);
    }
  });

  const width = useTransform(scrollY, [0, 50], ["100%", "90%"]);
  const y = useTransform(scrollY, [0, 50], [0, 10]);
  const borderRadius = useTransform(scrollY, [0, 50], ["0px", "9999px"]);
  const paddingX = useTransform(scrollY, [0, 50], ["24px", "16px"]);

  return (
    <motion.header 
      style={{ width, y, borderRadius, paddingLeft: paddingX, paddingRight: paddingX }}
      className={`md:hidden flex justify-between items-center h-14 apple-glass fixed top-0 left-0 right-0 mx-auto z-40 transition-shadow duration-300 ${isScrolled ? 'shadow-hover border border-[var(--color-surface-variant)]/50' : 'border-b border-[var(--color-surface-variant)]/50'}`}
    >
      <h1 className={`font-bold text-[var(--color-on-surface)] font-serif transition-all duration-300 hidden sm:block ${isScrolled ? 'text-sm ml-2' : 'text-xl'}`}>
        SmartExpense
      </h1>
      <h1 className={`font-bold text-[var(--color-on-surface)] font-serif transition-all duration-300 sm:hidden ${isScrolled ? 'text-sm' : 'text-lg'}`}>
        SE
      </h1>

      <button
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        className="flex-1 max-w-[200px] mx-2 flex items-center justify-between bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-variant)]/50 text-[var(--color-on-surface-variant)] px-3 py-1.5 rounded-full border border-[var(--color-surface-variant)]/30 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span className="text-xs font-medium">Search</span>
        </div>
        <span className="text-[10px] font-bold font-mono bg-[var(--color-surface-lowest)] px-1.5 py-0.5 rounded text-[var(--color-outline)] border border-[var(--color-outline)]/20">⌘K</span>
      </button>

      <div className="flex items-center space-x-1">
        <button
          onClick={togglePrivacyMode}
          className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] outline-none"
          aria-label={isPrivacyMode ? "Show Balance" : "Hide Balance"}
          title={isPrivacyMode ? "Show Balance" : "Hide Balance"}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            {isPrivacyMode ? 'visibility_off' : 'visibility'}
          </span>
        </button>
        <button
          className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] outline-none"
          aria-label="Notifications"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">notifications</span>
        </button>
        <button
          className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] outline-none"
          aria-label="Profile"
          title="Profile"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">account_circle</span>
        </button>
      </div>
    </motion.header>
  );
}
