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
      <h1 className={`font-bold text-[var(--color-on-surface)] font-serif transition-all duration-300 ${isScrolled ? 'text-sm ml-2' : 'text-xl'}`}>
        SmartExpense
      </h1>
      <div className="flex items-center space-x-1">
        <button
          onClick={togglePrivacyMode}
          className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center"
          aria-label={isPrivacyMode ? "Show Balance" : "Hide Balance"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isPrivacyMode ? 'visibility_off' : 'visibility'}
          </span>
        </button>
        <button
          className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button
          className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center"
          aria-label="Profile"
        >
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
        </button>
      </div>
    </motion.header>
  );
}
