'use client';

import { useRef, useState } from 'react';
import { motion, Variants, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { useModal } from '@/contexts/ModalContext';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, PieChart, Pie, Cell } from 'recharts';
import MagneticButton from '@/components/ui/MagneticButton';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import HoverCard from '@/components/ui/HoverCard';
import EmptyState from '@/components/ui/EmptyState';
import { formatRupiah } from '@/utils/format';

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

const categoryColors = ['var(--color-primary-container)', 'var(--color-tertiary-container)', 'var(--color-inverse-primary)', 'var(--color-secondary-container)'];

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label, isPrivacyMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 400 }}
        className="bg-[var(--color-surface-lowest)]/80 backdrop-blur-2xl border border-[var(--color-surface-variant)] p-4 rounded-2xl shadow-2xl text-sm min-w-[200px]"
      >
        <p className="font-bold text-[10px] tracking-widest uppercase text-[var(--color-outline)] mb-4 border-b border-[var(--color-surface-variant)]/50 pb-2">{label}</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 font-medium text-[var(--color-on-surface)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary-container)] shadow-sm"></span> Masuk
            </span>
            <span className="text-[var(--color-on-surface)] font-mono font-semibold text-xs">{formatRupiah(payload[0].value, isPrivacyMode)}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 font-medium text-[var(--color-on-surface)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-tertiary-container)] shadow-sm"></span> Keluar
            </span>
            <span className="text-[var(--color-on-surface)] font-mono font-semibold text-xs">{formatRupiah(payload[1].value, isPrivacyMode)}</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export default function HomePage() {
  const { openTransactionModal } = useModal();
  const { transactions, getTotalBalance, goals, budgetCategories, isPrivacyMode, togglePrivacyMode } = useFinanceStore();
  const user = useAuthStore((s) => s.user);
  
  const txListRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40 && !isScrolled) setIsScrolled(true);
    else if (latest <= 40 && isScrolled) setIsScrolled(false);
  });

  useGSAP(() => {
    if (!txListRef.current) return;
    // GSAP buttery stagger for transactions, skip ease if reduced motion
    gsap.fromTo(txListRef.current.children,
      { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
      { opacity: 1, y: 0, stagger: 0.05, ease: shouldReduceMotion ? "none" : "back.out(1.2)", duration: 0.5, delay: 0.3 }
    );
  }, { scope: txListRef, dependencies: [transactions.length, shouldReduceMotion] });

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

  // Dynamic pie data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: categoryColors[index % categoryColors.length]
  }));

  // Dynamic Chart Data
  const chartDataMap = transactions.reduce((acc, t) => {
    const day = new Date(t.date).getDate().toString();
    if (!acc[day]) acc[day] = { name: day, masuk: 0, keluar: 0 };
    if (t.type === 'income') acc[day].masuk += t.amount;
    else acc[day].keluar += t.amount;
    return acc;
  }, {} as Record<string, { name: string, masuk: number, keluar: number }>);

  // Sort by day number
  const chartData = Object.values(chartDataMap).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));

  // Dynamic Savings Goal
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalGoalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const savingsProgress = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;

  const recentTransactions = transactions.slice(0, 5);

  // Generate simple AI insight + weather
  const getFinancialWeather = () => {
    if (transactions.length === 0) return { icon: 'routine', color: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-variant)]/20', title: 'Belum Ada Data', text: "Mulai catat transaksi untuk melihat prediksi cuaca keuangan Anda." };
    if (totalExpense > totalIncome && totalIncome > 0) return { icon: 'thunderstorm', color: 'text-rose-500', bg: 'bg-rose-500/10', title: 'Badai Pengeluaran', text: "Pengeluaran bulan ini lebih besar dari pemasukan. Kurangi pengeluaran non-esensial segera." };
    if (totalExpense === 0 && totalIncome > 0) return { icon: 'clear_day', color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Sangat Cerah', text: "Belum ada pengeluaran bulan ini. Awal yang sangat bagus!" };
    
    // Find highest expense category
    const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > (totalIncome * 0.4) && totalIncome > 0) {
      return { icon: 'partly_cloudy_day', color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Berawan Berpotensi Hujan', text: `Pengeluaran ${topCategory[0]} mengambil >40% porsi income. Waspadai pengeluaran berlebih di area ini.` };
    }
    
    if (totalIncome > 0 && totalExpense < totalIncome * 0.5) {
      return { icon: 'sunny', color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Cerah Bersinar', text: "Anda menghemat >50% pemasukan! Bagus sekali, pertimbangkan untuk dialokasikan ke investasi." };
    }

    return { icon: 'routine', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-container)]/20', title: 'Cuaca Stabil', text: "Kondisi keuangan stabil. Tetap pertahankan kebiasaan mencatat transaksi." };
  };
  const weather = getFinancialWeather();

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.header
        className={`flex flex-col md:flex-row md:items-end justify-between gap-6 sticky top-0 z-30 pt-4 pb-4 -mt-4 transition-all duration-500 rounded-b-2xl ${isScrolled ? 'backdrop-blur-xl bg-[var(--color-surface-lowest)]/80 border-b border-[var(--color-surface-variant)] shadow-sm px-6 -mx-6' : 'bg-transparent'}`}
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </p>
          <div className="flex items-center gap-4">
            <h2 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
              <AnimatedNumber value={totalBalance} prefix="Rp " className="inline-block" />
            </h2>
            <button
              onClick={togglePrivacyMode}
              className="text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-colors rounded-full p-2 flex items-center justify-center"
              aria-label={isPrivacyMode ? "Show Balance" : "Hide Balance"}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPrivacyMode ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {/* Income */}
        <HoverCard variants={fadeUp} className="flex flex-col justify-between">
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
        </HoverCard>

        {/* Expenses */}
        <HoverCard variants={fadeUp} className="flex flex-col justify-between">
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
        </HoverCard>

        {/* Savings Goal */}
        <HoverCard variants={fadeUp} className="flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">Savings Goal</span>
            <span className="material-symbols-outlined text-[var(--color-secondary-container)] bg-[var(--color-secondary-container)]/10 p-1.5 rounded-full text-xl">savings</span>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-[var(--color-on-surface)] font-mono mb-1">{savingsProgress}%</h3>
            <div className="w-full bg-[var(--color-surface-high)] rounded-full h-2 mt-2 overflow-hidden relative z-20">
              <motion.div
                className="bg-[var(--color-primary-container)] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${savingsProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>
        </HoverCard>
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
            {chartData.length > 0 ? (
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
                  <Tooltip content={<CustomTooltip isPrivacyMode={isPrivacyMode} />} />
                  <Area type="monotone" dataKey="masuk" stroke="var(--color-primary-container)" strokeWidth={2} fillOpacity={1} fill="url(#colorMasuk)" isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                  <Area type="monotone" dataKey="keluar" stroke="var(--color-tertiary-container)" strokeWidth={2} fillOpacity={1} fill="url(#colorKeluar)" isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-outline)] border border border-dashed border-[var(--color-outline)]/20 rounded-xl">
                Belum ada data transaksi
              </div>
            )}
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
                        formatter={(value: any) => formatRupiah(value, isPrivacyMode)}
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
              <EmptyState icon="pie_chart" title="Belum Ada Pengeluaran" description="Data donut chart akan muncul setelah Anda mencatat transaksi pengeluaran pertama." />
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
          <div className="space-y-1" ref={txListRef}>
            {recentTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                whileTap={{ scale: 0.98 }}
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
                  {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount, isPrivacyMode)}
                </span>
              </motion.div>
            ))}
            {recentTransactions.length === 0 && (
              <EmptyState icon="receipt_long" title="Belum Ada Transaksi" description="Mulai catat transaksi pertamamu untuk melihat riwayat keuangan di sini." actionLabel="Transaksi Baru" onAction={openTransactionModal} />
            )}
          </div>
        </motion.div>

        {/* Budget Progress */}
        <motion.div variants={fadeUp} className="lg:col-span-5 bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <h3 className="text-2xl font-normal text-[var(--color-on-surface)] font-serif mb-6">Anggaran Bulan Ini</h3>
          <div className="space-y-6">
            {budgetCategories.length > 0 ? (
              budgetCategories.map((cat, idx) => {
                const pct = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                const sisa = cat.allocated - cat.spent;
                const barColor = pct >= 100 ? 'bg-[var(--color-error)]' : pct >= 75 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-primary-container)]';
                const textColor = pct >= 100 ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface)]';
                return (
                  <div key={cat.id || idx}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="font-medium text-[var(--color-on-surface)]">{cat.name}</p>
                        <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">
                          {sisa >= 0 ? `Sisa ${formatRupiah(sisa, isPrivacyMode)}` : `Over budget ${formatRupiah(Math.abs(sisa), isPrivacyMode)}`}
                        </p>
                      </div>
                      <span className={`text-sm font-normal font-mono ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                      <motion.div
                        className={`${barColor} h-full rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + idx * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState icon="account_balance_wallet" title="Belum Ada Anggaran" description="Buat kategori anggaran di menu Budget untuk memantau pengeluaran Anda." />
            )}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
