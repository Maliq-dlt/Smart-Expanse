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

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Tanggal', 'Nama Transaksi', 'Kategori', 'Akun', 'Tipe', 'Jumlah (Rp)'];
    const rows = transactions.map(t => {
      const date = new Date(t.date).toLocaleDateString('id-ID');
      const type = t.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
      return `"${date}","${t.desc}","${t.category}","${t.account}","${type}","${t.amount}"`;
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_smartexpense_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Dynamic monthly data
  const monthlyMap = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('en-US', { month: 'short' });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0, _order: new Date(t.date).getMonth() };
    if (t.type === 'income') acc[month].income += t.amount;
    else acc[month].expense += t.amount;
    return acc;
  }, {} as Record<string, { month: string, income: number, expense: number, _order: number }>);
  
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a._order - b._order);

  // Dynamic top categories
  const catColors = ['primary-container', 'tertiary-container', 'inverse-primary', 'secondary-container', 'error', 'outline'];
  const catMap = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCats = Object.entries(catMap)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const topCategories = sortedCats.map(([name, amount], idx) => ({
    name,
    amount,
    percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    color: catColors[idx % catColors.length]
  }));

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
          <div className="h-[300px] w-full pt-6">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={8}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-outline)' }} dy={10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-container)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Pemasukan" fill="var(--color-primary-container)" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={true} animationDuration={1000} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="var(--color-tertiary-container)" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={true} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-outline)] border border-dashed border-[var(--color-outline)]/20 rounded-xl">
                Belum ada data transaksi
              </div>
            )}
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
          <button onClick={handleExportCSV} className="text-[var(--color-primary)] text-xs font-semibold tracking-[0.05em] uppercase hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
        <div className="flex flex-col justify-center h-full gap-6">
          {topCategories.length > 0 ? (
            topCategories.map((category, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-${category.color})` }}></div>
                    <span className="text-sm font-medium text-[var(--color-on-surface)]">{category.name}</span>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(category.amount)}</span>
                </div>
                <div className="w-full bg-[var(--color-surface-container)] rounded-full h-1.5 overflow-hidden flex items-center">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: `var(--color-${category.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 * idx }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-outline)] py-10">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">receipt_long</span>
              <span className="text-sm">Belum ada pengeluaran</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
