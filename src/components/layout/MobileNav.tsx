'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';

const mobileNavItems = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/transactions', label: 'Trans', icon: 'receipt_long' },
  { href: '/budget', label: 'Budget', icon: 'account_balance_wallet' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { openTransactionModal } = useModal();

  return (
    <nav className="md:hidden fixed bottom-0 w-full apple-glass border-t border-[var(--color-surface-variant)] flex justify-around items-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-colors duration-300">
      {mobileNavItems.slice(0, 2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive
                ? 'text-[var(--color-primary-container)] dark:text-[var(--color-primary)]'
                : 'text-[var(--color-outline)]'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.05em] uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Center FAB */}
      <div className="relative -top-5">
        <button
          onClick={openTransactionModal}
          className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] p-3 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] outline-none transition-transform"
          aria-label="Tambah Transaksi"
          title="Tambah Transaksi"
        >
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
        </button>
      </div>

      {mobileNavItems.slice(2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive
                ? 'text-[var(--color-primary-container)] dark:text-[var(--color-primary)]'
                : 'text-[var(--color-outline)]'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.05em] uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
