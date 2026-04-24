'use client';

import { useModal } from '@/contexts/ModalContext';

export default function TopBar() {
  const { openTransactionModal } = useModal();

  return (
    <header className="md:hidden flex justify-between items-center w-full px-6 h-16 apple-glass border-b border-[var(--color-sidebar-border)] fixed top-0 z-40 transition-colors duration-300">
      <h1 className="text-xl font-bold text-[var(--color-navy)] font-serif">
        SmartExpense
      </h1>
      <div className="flex items-center space-x-3">
        <button
          className="text-[var(--color-primary-container)] dark:text-[var(--color-primary)] hover:opacity-80 transition-colors rounded-full p-1"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button
          className="text-[var(--color-primary-container)] dark:text-[var(--color-primary)] hover:opacity-80 transition-colors rounded-full p-1"
          aria-label="Profile"
        >
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
