'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { SkeletonTransactionItem } from '@/components/ui/SkeletonCard';
import { formatRupiah, formatCurrency } from '@/utils/format';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { transactions, deleteTransaction, isPrivacyMode } = useFinanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Simulate network delay for premium feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 lg:p-16 space-y-10 max-w-[1200px] mx-auto">
      {/* Header with search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif flex overflow-hidden"
        >
          {"Daftar Transaksi".split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className="mr-3"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-surface-variant)] text-sm">search</span>
          <input
            className="bg-[var(--color-surface-low)] text-[var(--color-on-surface)] text-sm rounded-full pl-10 pr-4 py-2 border-none focus:ring-1 focus:ring-[var(--color-primary)] w-64 transition-all"
            placeholder="Search transactions..."
            type="text"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl shadow-soft p-6 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300 border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Total Transaksi</span>
          <div className="flex items-end justify-between mt-auto">
            <span className="text-2xl font-medium font-mono text-[var(--color-on-surface)]">{transactions.length}</span>
            <div className="bg-[var(--color-surface-container)] px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[var(--color-on-surface-variant)]">receipt</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl shadow-soft p-6 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300 border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Total Pemasukan</span>
          <div className="flex items-end justify-between mt-auto">
            <span className="text-2xl font-medium font-mono text-[var(--color-primary)]">{formatRupiah(totalIncome, isPrivacyMode)}</span>
            <div className="bg-[var(--color-primary-container)]/20 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-xs text-[var(--color-primary)]">trending_up</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl shadow-soft p-6 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300 border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Total Pengeluaran</span>
          <div className="flex items-end justify-between mt-auto">
            <span className="text-2xl font-medium font-mono text-[var(--color-error)]">{formatRupiah(totalExpense, isPrivacyMode)}</span>
            <div className="bg-[var(--color-error-container)]/40 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-xs text-[var(--color-error)]">trending_down</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Filter Bar */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-surface-lowest)] p-2 rounded-xl shadow-soft border border-[var(--color-surface-variant)]/30"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-[var(--color-surface-low)] px-3 py-2 rounded-lg border border-transparent hover:border-[var(--color-surface-variant)] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] text-sm">calendar_today</span>
            <span className="text-sm text-[var(--color-on-surface)]">All Time</span>
          </div>
          <select className="bg-[var(--color-surface-low)] text-[var(--color-on-surface)] text-sm rounded-lg px-3 py-2 border border-transparent hover:border-[var(--color-surface-variant)] focus:border-[var(--color-primary)] focus:outline-none transition-colors">
            <option>All Categories</option>
          </select>
          <select className="bg-[var(--color-surface-low)] text-[var(--color-on-surface)] text-sm rounded-lg px-3 py-2 border border-transparent hover:border-[var(--color-surface-variant)] focus:border-[var(--color-primary)] focus:outline-none transition-colors">
            <option>All Accounts</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-on-surface-variant)]">Sort by:</span>
          <select className="bg-[var(--color-surface-low)] text-[var(--color-on-surface)] text-sm rounded-lg px-3 py-2 border border-transparent hover:border-[var(--color-surface-variant)] focus:border-[var(--color-primary)] focus:outline-none transition-colors">
            <option>Date (Newest)</option>
            <option>Date (Oldest)</option>
            <option>Amount (High-Low)</option>
          </select>
        </div>
      </motion.section>

      {/* Transaction Table */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--color-surface-lowest)] rounded-xl shadow-soft border border-[var(--color-surface-variant)]/30 overflow-hidden"
      >
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[var(--color-surface-variant)] bg-[var(--color-surface-low)]/50">
          <div className="col-span-2 text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Date</div>
          <div className="col-span-4 text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Transaction Name</div>
          <div className="col-span-2 text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Category</div>
          <div className="col-span-2 text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">Account</div>
          <div className="col-span-2 text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] text-right">Amount</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="p-4">
              <SkeletonTransactionItem />
              <SkeletonTransactionItem />
              <SkeletonTransactionItem />
            </div>
          ) : (
            <>
              {transactions.map((tx, i) => (
                <div key={tx.id} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6">
                    <span className="material-symbols-outlined text-white">delete</span>
                  </div>
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -80, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -50 && user) {
                        deleteTransaction(tx.id, user.userId);
                      }
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center bg-[var(--color-surface-lowest)] hover:bg-[var(--color-surface-low)] transition-colors duration-200 cursor-grab active:cursor-grabbing ${
                      i < transactions.length - 1 ? 'border-b border-[var(--color-surface-variant)]/30' : ''
                    }`}
                  >
                    <div className="col-span-2 text-sm font-mono text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-on-surface)] transition-colors">{formatDate(tx.date)}</div>
                    <div className="col-span-4 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate text-[var(--color-on-surface)]">{tx.desc}</span>
                        {tx.isRecurring && (
                          <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)]" title={`Rutin (${tx.frequency})`}>sync</span>
                        )}
                        {tx.isSplit && (
                          <span className="material-symbols-outlined text-[14px] text-[var(--color-tertiary)]" title="Split Bill">groups</span>
                        )}
                      </div>
                      {tx.isSplit && tx.splitDetails && (
                        <span className="text-[10px] text-[var(--color-outline)]">
                          Ditanggung oleh: {tx.splitDetails.partners.map(p => p.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'income' ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]' : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">{tx.type === 'income' ? 'payments' : 'receipt_long'}</span>
                      </div>
                      <span className="text-sm text-[var(--color-on-surface-variant)]">{tx.category}</span>
                    </div>
                    <div className="col-span-2 text-sm text-[var(--color-on-surface-variant)]">{tx.account}</div>
                    <div className={`col-span-2 text-sm font-mono text-right flex flex-col ${tx.type === 'expense' ? 'text-[var(--color-error)]' : 'text-[var(--color-primary)]'}`}>
                      <span>
                        {tx.type === 'expense' ? '-' : '+'} {formatRupiah(tx.amount, isPrivacyMode)}
                      </span>
                      {tx.currency && tx.currency !== 'IDR' && tx.originalAmount && (
                        <span className="text-[10px] text-[var(--color-outline)]">
                          ({tx.type === 'expense' ? '-' : '+'} {formatCurrency(tx.originalAmount, tx.currency, isPrivacyMode)})
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="p-8 text-center text-[var(--color-outline)]">Belum ada transaksi.</div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-[var(--color-surface-variant)] bg-[var(--color-surface-lowest)] relative z-20">
          <span className="text-sm text-[var(--color-on-surface-variant)]">
            Showing <span className="font-medium text-[var(--color-on-surface)]">{transactions.length > 0 ? 1 : 0}</span> to <span className="font-medium text-[var(--color-on-surface)]">{transactions.length}</span> of <span className="font-medium text-[var(--color-on-surface)]">{transactions.length}</span> entries
          </span>
          <div className="flex items-center gap-2">
             <span className="text-xs text-[var(--color-outline)] italic hidden md:block">*Swipe kiri untuk menghapus</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
