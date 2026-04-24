'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated icon container */}
      <motion.div
        className="w-20 h-20 rounded-2xl bg-[var(--color-primary-container)]/10 border border-dashed border-[var(--color-primary-container)]/30 flex items-center justify-center mb-6"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="material-symbols-outlined text-4xl text-[var(--color-primary-container)]/60">{icon}</span>
      </motion.div>

      <h4 className="text-lg font-medium text-[var(--color-on-surface)] mb-2 font-serif">{title}</h4>
      <p className="text-sm text-[var(--color-outline)] max-w-[280px] leading-relaxed mb-6">{description}</p>

      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
