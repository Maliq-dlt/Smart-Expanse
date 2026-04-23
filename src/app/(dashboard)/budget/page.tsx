'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const budgetCategories = [
  { name: 'Belanja Harian', allocated: 3000000, spent: 1200000, icon: 'shopping_cart', color: 'primary' },
  { name: 'Transportasi', allocated: 1500000, spent: 1275000, icon: 'directions_car', color: 'warning' },
  { name: 'Makanan & Minuman', allocated: 2000000, spent: 1400000, icon: 'restaurant', color: 'primary' },
  { name: 'Hiburan', allocated: 500000, spent: 550000, icon: 'movie', color: 'error' },
  { name: 'Tagihan & Utilitas', allocated: 1200000, spent: 800000, icon: 'receipt_long', color: 'primary' },
  { name: 'Kesehatan', allocated: 500000, spent: 150000, icon: 'health_and_safety', color: 'primary' },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export default function BudgetPage() {
  const totalAllocated = budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">Oktober 2023</p>
        <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
          Anggaran Bulanan
        </h1>
      </motion.div>

      {/* Overview Cards */}
      <motion.section className="grid grid-cols-1 md:grid-cols-3 gap-6" initial="hidden" animate="show" variants={stagger}>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] mb-4 block">Total Anggaran</span>
          <h3 className="text-2xl font-medium font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(totalAllocated)}</h3>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] mb-4 block">Total Terpakai</span>
          <h3 className="text-2xl font-medium font-mono text-[var(--color-tertiary)]">Rp {formatRupiah(totalSpent)}</h3>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] mb-4 block">Sisa Anggaran</span>
          <h3 className={`text-2xl font-medium font-mono ${totalRemaining >= 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-error)]'}`}>
            Rp {formatRupiah(Math.abs(totalRemaining))}
          </h3>
        </motion.div>
      </motion.section>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-normal text-[var(--color-on-surface)] font-serif">Penggunaan Keseluruhan</h3>
          <span className="text-lg font-medium font-mono text-[var(--color-on-surface)]">
            {Math.round((totalSpent / totalAllocated) * 100)}%
          </span>
        </div>
        <div className="w-full bg-[var(--color-surface-container)] h-3 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              totalSpent / totalAllocated > 0.9 ? 'bg-[var(--color-error)]' :
              totalSpent / totalAllocated > 0.7 ? 'bg-[var(--color-warning)]' :
              'bg-[var(--color-primary-container)]'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Budget Categories */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {budgetCategories.map((cat, i) => {
          const percentage = Math.round((cat.spent / cat.allocated) * 100);
          const remaining = cat.allocated - cat.spent;
          const isOver = remaining < 0;
          const barColor = isOver ? 'bg-[var(--color-error)]' : percentage > 80 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-primary-container)]';

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isOver
                      ? 'bg-[var(--color-error-container)]/30 text-[var(--color-error)]'
                      : 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]'
                  }`}>
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-on-surface)]">{cat.name}</p>
                    <p className="text-xs text-[var(--color-outline)]">
                      {isOver ? `Over budget Rp ${formatRupiah(Math.abs(remaining))}` : `Sisa Rp ${formatRupiah(remaining)}`}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-mono ${isOver ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface)]'}`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`${barColor} h-full rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-[var(--color-outline)]">
                <span>Rp {formatRupiah(cat.spent)} terpakai</span>
                <span>dari Rp {formatRupiah(cat.allocated)}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}
