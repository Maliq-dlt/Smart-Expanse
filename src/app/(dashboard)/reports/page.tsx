'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend } from 'recharts';
import { useFinanceStore } from '@/store/useFinanceStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const monthlyData = [
  { month: 'Jul', income: 6500000, expense: 4200000 },
  { month: 'Aug', income: 6500000, expense: 3800000 },
  { month: 'Sep', income: 7000000, expense: 4500000 },
  { month: 'Oct', income: 6500000, expense: 5100000 },
  { month: 'Nov', income: 8000000, expense: 3900000 },
  { month: 'Dec', income: 9500000, expense: 6200000 },
];

const topCategories = [
  { name: 'Housing', amount: 2400000, percentage: 40, color: 'primary-container' },
  { name: 'Food & Dining', amount: 1800000, percentage: 30, color: 'tertiary-container' },
  { name: 'Transport', amount: 1200000, percentage: 20, color: 'inverse-primary' },
  { name: 'Entertainment', amount: 600000, percentage: 10, color: 'secondary-container' },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-surface-lowest)] border border-[var(--color-surface-variant)] p-3 rounded-lg shadow-hover text-sm">
        <p className="font-medium text-[var(--color-on-surface)] mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          <p className="text-[var(--color-primary)] font-mono">Pemasukan: Rp {formatRupiah(payload[0].value)}</p>
          <p className="text-[var(--color-tertiary)] font-mono">Pengeluaran: Rp {formatRupiah(payload[1].value)}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const { transactions } = useFinanceStore();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">Analisis Keuangan</p>
          <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
            Laporan Keuangan
          </h1>
        </div>
        <div className="flex gap-2">
          {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-[0.05em] uppercase transition-all ${
                period === p
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm'
                  : 'bg-[var(--color-surface-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'
              }`}
            >
              {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.section className="grid grid-cols-1 md:grid-cols-4 gap-6" initial="hidden" animate="show" variants={stagger}>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] block mb-3">Total Pemasukan</span>
          <h3 className="text-xl font-medium font-mono text-[var(--color-primary)]">Rp {formatRupiah(totalIncome)}</h3>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] block mb-3">Total Pengeluaran</span>
          <h3 className="text-xl font-medium font-mono text-[var(--color-error)]">Rp {formatRupiah(totalExpense)}</h3>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] block mb-3">Net Savings</span>
          <h3 className="text-xl font-medium font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(netSavings)}</h3>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] block mb-3">Saving Rate</span>
          <h3 className="text-xl font-medium font-mono text-[var(--color-primary)]">{savingRate}%</h3>
        </motion.div>
      </motion.section>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif">Pemasukan vs Pengeluaran</h3>
        </div>

        {/* Bar Chart */}
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={8}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-outline)' }} dy={10} />
              <Tooltip cursor={{ fill: 'var(--color-surface-container)' }} content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="income" name="Pemasukan" fill="var(--color-primary-container)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" name="Pengeluaran" fill="var(--color-tertiary-container)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif">Breakdown per Kategori</h3>
          <button className="text-[var(--color-primary)] text-xs font-semibold tracking-[0.05em] uppercase hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
        </div>
        <div className="space-y-4">
          {topCategories.map((cat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full bg-[var(--color-${cat.color})]`}></div>
              <span className="w-32 text-sm text-[var(--color-on-surface)]">{cat.name}</span>
              <div className="flex-1 bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`bg-[var(--color-${cat.color})] h-full rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                />
              </div>
              <span className="w-28 text-right text-sm font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(cat.amount)}</span>
              <span className="w-10 text-right text-sm font-mono text-[var(--color-outline)]">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
