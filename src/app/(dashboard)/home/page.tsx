'use client';

import { motion, Variants } from 'framer-motion';
import { useModal } from '@/contexts/ModalContext';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, PieChart, Pie, Cell } from 'recharts';
import MagneticButton from '@/components/ui/MagneticButton';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const chartData = [
  { name: '1', masuk: 4000, keluar: 2400 },
  { name: '5', masuk: 3000, keluar: 1398 },
  { name: '10', masuk: 2000, keluar: 4800 },
  { name: '15', masuk: 2780, keluar: 3908 },
  { name: '20', masuk: 1890, keluar: 4800 },
  { name: '25', masuk: 2390, keluar: 3800 },
  { name: '30', masuk: 3490, keluar: 4300 },
];

const categoryColors = ['var(--color-primary-container)', 'var(--color-tertiary-container)', 'var(--color-inverse-primary)', 'var(--color-secondary-container)'];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-surface-lowest)] border border-[var(--color-surface-variant)] p-3 rounded-lg shadow-hover text-sm">
        <p className="font-medium text-[var(--color-on-surface)] mb-2">Tanggal {label}</p>
        <div className="flex gap-4">
          <p className="text-[var(--color-primary)] font-mono">Masuk: Rp {formatRupiah(payload[0].value)}</p>
          <p className="text-[var(--color-tertiary)] font-mono">Keluar: Rp {formatRupiah(payload[1].value)}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function HomePage() {
  const { openTransactionModal } = useModal();
  const { transactions, getTotalBalance } = useFinanceStore();
  const user = useAuthStore((s) => s.user);

  // Get greeting based on Jakarta time
  const getGreeting = () => {
    const d = new Date();
    // Get hours in Jakarta (UTC+7)
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const jakartaTime = utc + (3600000 * 7);
    const jktDate = new Date(jakartaTime);
    const hour = jktDate.getHours();

    if (hour >= 5 && hour < 12) return 'Selamat Pagi';
    if (hour >= 12 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const totalBalance = getTotalBalance();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Group transactions by category for PieChart
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
  const pieData = Object.keys(expensesByCategory).map((key, index) => ({
    name: key,
    value: expensesByCategory[key],
    color: categoryColors[index % categoryColors.length]
  }));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.header
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">
            Overview
          </p>
          <h2 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h2>
        </motion.div>
        <motion.div variants={fadeUp}>
          <MagneticButton
            onClick={openTransactionModal}
            className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-medium py-3 px-6 rounded-lg shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 w-fit shimmer-btn"
          >
            <span className="material-symbols-outlined">add</span>
            Transaksi Baru
          </MagneticButton>
        </motion.div>
      </motion.header>

      {/* Summary Cards */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {/* Total Balance */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-transparent hover:border-[var(--color-surface-variant)] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Total Balance</span>
            <span className="material-symbols-outlined text-[var(--color-primary-container)] bg-[var(--color-primary-container)]/10 p-1.5 rounded-full text-xl">account_balance</span>
          </div>
          <div>
            <AnimatedNumber value={totalBalance} prefix="Rp " className="block text-2xl font-medium text-[var(--color-on-surface)] font-mono mb-1" />
            <div className="flex items-center gap-1 text-[var(--color-primary)] text-sm font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>Live Updated</span>
            </div>
          </div>
        </motion.div>

        {/* Income */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-transparent hover:border-[var(--color-surface-variant)] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Income</span>
            <span className="material-symbols-outlined text-[var(--color-primary-container)] bg-[var(--color-primary-container)]/10 p-1.5 rounded-full text-xl">arrow_downward</span>
          </div>
          <div>
            <AnimatedNumber value={totalIncome} prefix="Rp " className="block text-2xl font-medium text-[var(--color-on-surface)] font-mono mb-1" />
            <div className="flex items-center gap-1 text-[var(--color-outline)] text-sm">
              <span>All time</span>
            </div>
          </div>
        </motion.div>

        {/* Expenses */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-transparent hover:border-[var(--color-surface-variant)] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Expenses</span>
            <span className="material-symbols-outlined text-[var(--color-tertiary-container)] bg-[var(--color-tertiary-container)]/10 p-1.5 rounded-full text-xl">arrow_upward</span>
          </div>
          <div>
            <AnimatedNumber value={totalExpense} prefix="Rp " className="block text-2xl font-medium text-[var(--color-on-surface)] font-mono mb-1" />
            <div className="flex items-center gap-1 text-[var(--color-tertiary)] text-sm font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>All time</span>
            </div>
          </div>
        </motion.div>

        {/* Savings Goal */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-transparent hover:border-[var(--color-surface-variant)] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Savings Goal</span>
            <span className="material-symbols-outlined text-[var(--color-secondary-container)] bg-[var(--color-secondary-container)]/10 p-1.5 rounded-full text-xl">savings</span>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-[var(--color-on-surface)] font-mono mb-1">68%</h3>
            <div className="w-full bg-[var(--color-surface-high)] rounded-full h-2 mt-2 overflow-hidden">
              <motion.div
                className="bg-[var(--color-primary-container)] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Charts Row */}
      <motion.section
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {/* Cash Flow Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-7 bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif">Arus Kas 30 Hari</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary-container)]"></div>
                <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Masuk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--color-tertiary-container)]"></div>
                <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Keluar</span>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full flex items-end pt-4 pb-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-container)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary-container)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-tertiary-container)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-tertiary-container)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-outline)' }} dy={10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="masuk" stroke="var(--color-primary-container)" strokeWidth={2} fillOpacity={1} fill="url(#colorMasuk)" isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                <Area type="monotone" dataKey="keluar" stroke="var(--color-tertiary-container)" strokeWidth={2} fillOpacity={1} fill="url(#colorKeluar)" isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Donut Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-5 bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50 flex flex-col">
          <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif mb-8">Kategori Pengeluaran</h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6">
            {pieData.length > 0 ? (
              <>
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface-lowest)', border: '1px solid var(--color-surface-variant)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--color-on-surface)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-[var(--color-on-surface)]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--color-outline)]">Belum ada data pengeluaran.</p>
            )}
          </div>
        </motion.div>
      </motion.section>

      {/* Bottom Row */}
      <motion.section
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {/* Recent Transactions */}
        <motion.div variants={fadeUp} className="lg:col-span-7 bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif">Transaksi Terakhir</h3>
            <a className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] hover:underline" href="/transactions">
              Lihat Semua
            </a>
          </div>
          <div className="space-y-1">
            {recentTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-3 hover:bg-[var(--color-surface)] rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-[var(--color-surface-variant)]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                    tx.type === 'income'
                      ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]'
                      : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
                  }`}>
                    <span className="material-symbols-outlined">{tx.type === 'income' ? 'payments' : 'receipt_long'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-on-surface)]">{tx.desc}</p>
                    <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">{tx.category} • {formatDate(tx.date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-normal font-mono ${tx.type === 'income' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>
                  {tx.type === 'income' ? '+' : '-'} Rp {formatRupiah(tx.amount)}
                </span>
              </motion.div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-sm text-[var(--color-outline)] p-4 text-center">Belum ada transaksi.</p>
            )}
          </div>
        </motion.div>

        {/* Budget Progress */}
        <motion.div variants={fadeUp} className="lg:col-span-5 bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif mb-6">Anggaran Bulan Ini</h3>
          <div className="space-y-6">
            {/* Budget: Safe */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="font-medium text-[var(--color-on-surface)]">Belanja Harian</p>
                  <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Sisa Rp 1.200.000</p>
                </div>
                <span className="text-sm font-normal font-mono text-[var(--color-on-surface)]">40%</span>
              </div>
              <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[var(--color-primary-container)] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                />
              </div>
            </div>

            {/* Budget: Warning */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="font-medium text-[var(--color-on-surface)]">Transportasi</p>
                  <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Sisa Rp 200.000</p>
                </div>
                <span className="text-sm font-normal font-mono text-[var(--color-on-surface)]">85%</span>
              </div>
              <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[var(--color-warning)] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
                />
              </div>
            </div>

            {/* Budget: Danger */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="font-medium text-[var(--color-on-surface)]">Hiburan</p>
                  <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Over budget Rp 150.000</p>
                </div>
                <span className="text-sm font-normal font-mono text-[var(--color-error)]">110%</span>
              </div>
              <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[var(--color-error)] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
