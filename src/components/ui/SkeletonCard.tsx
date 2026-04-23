'use client';

import { motion } from 'framer-motion';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[var(--color-surface-lowest)] rounded-xl p-6 border border-[var(--color-surface-variant)]/50 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="w-24 h-4 bg-[var(--color-surface-variant)] rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full animate-pulse" />
      </div>
      <div>
        <div className="w-32 h-8 bg-[var(--color-surface-variant)] rounded-md animate-pulse mb-3" />
        <div className="w-20 h-4 bg-[var(--color-surface-container)] rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonTransactionItem() {
  return (
    <div className="flex items-center justify-between p-4 bg-[var(--color-surface-lowest)] rounded-xl border border-[var(--color-surface-variant)]/50 mb-3">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container)] animate-pulse" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-[var(--color-surface-variant)] rounded-full animate-pulse" />
          <div className="w-20 h-3 bg-[var(--color-surface-container)] rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-right space-y-2 flex flex-col items-end">
        <div className="w-24 h-5 bg-[var(--color-surface-variant)] rounded-md animate-pulse" />
        <div className="w-16 h-3 bg-[var(--color-surface-container)] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
