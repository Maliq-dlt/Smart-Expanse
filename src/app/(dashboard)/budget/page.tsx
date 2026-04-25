'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore, BudgetCategory } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const iconOptions = [
  { id: 'shopping_cart', label: 'Belanja' },
  { id: 'restaurant', label: 'Makan' },
  { id: 'directions_car', label: 'Transport' },
  { id: 'movie', label: 'Hiburan' },
  { id: 'receipt_long', label: 'Tagihan' },
  { id: 'health_and_safety', label: 'Kesehatan' },
  { id: 'school', label: 'Pendidikan' },
  { id: 'checkroom', label: 'Pakaian' },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export default function BudgetPage() {
  const { budgetCategories, addBudgetCategory, updateBudgetCategory, deleteBudgetCategory } = useFinanceStore();
  const userId = useAuthStore((s) => s.user?.userId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form state
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('shopping_cart');
  const [formAllocated, setFormAllocated] = useState('');

  const totalAllocated = budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  const resetForm = () => {
    setFormName('');
    setFormIcon('shopping_cart');
    setFormAllocated('');
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEdit = (cat: BudgetCategory) => {
    setFormName(cat.name);
    setFormIcon(cat.icon);
    setFormAllocated(formatRupiah(cat.allocated));
    setEditingId(cat.id);
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    const amount = parseInt(formAllocated.replace(/\D/g, ''), 10);
    if (!formName || !amount) return;

    if (editingId) {
      updateBudgetCategory(editingId, { name: formName, icon: formIcon, allocated: amount });
    } else {
      if (!userId) return;
      addBudgetCategory({ name: formName, icon: formIcon, allocated: amount, spent: 0 }, userId);
    }
    setShowAddModal(false);
    resetForm();
  };

  const handleAllocatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setFormAllocated(raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw, 10)) : '');
  };

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">Oktober 2024</p>
          <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif flex overflow-hidden flex-wrap">
            {"Anggaran Bulanan".split(' ').map((word, i) => (
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
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-medium py-3 px-6 rounded-lg shadow-soft shimmer-btn flex items-center gap-2 w-fit hover:-translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Kategori
        </button>
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
            {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-[var(--color-surface-container)] h-3 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              totalAllocated > 0 && totalSpent / totalAllocated > 0.9 ? 'bg-[var(--color-error)]' :
              totalAllocated > 0 && totalSpent / totalAllocated > 0.7 ? 'bg-amber-500' :
              'bg-[var(--color-primary-container)]'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${totalAllocated > 0 ? Math.min((totalSpent / totalAllocated) * 100, 100) : 0}%` }}
            transition={{ type: 'spring', bounce: 0.4, duration: 1.5, delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Budget Categories */}
      {budgetCategories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--color-surface-lowest)] rounded-xl p-12 shadow-soft border border-[var(--color-surface-variant)]/50 text-center"
        >
          <span className="material-symbols-outlined text-5xl text-[var(--color-outline)] mb-4 block">account_balance_wallet</span>
          <p className="text-[var(--color-outline)] mb-4">Belum ada kategori anggaran.</p>
          <button onClick={openAdd} className="text-[var(--color-primary)] font-medium hover:underline">
            + Tambah Kategori Pertama
          </button>
        </motion.div>
      ) : (
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {budgetCategories.map((cat, i) => {
            const percentage = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
            const remaining = cat.allocated - cat.spent;
            const isOver = remaining < 0;
            const barColor = isOver ? 'bg-[var(--color-error)]' : percentage > 80 ? 'bg-amber-500' : 'bg-[var(--color-primary-container)]';

            return (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isOver
                        ? 'bg-rose-100 dark:bg-rose-500/10 text-[var(--color-error)]'
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
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-mono ${isOver ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface)]'}`}>
                      {percentage}%
                    </span>
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-[var(--color-outline)] hover:text-[var(--color-primary)] p-1 rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => deleteBudgetCategory(cat.id)}
                      className="text-[var(--color-outline)] hover:text-[var(--color-error)] p-1 rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
                <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
                  <motion.div
                    className={`${barColor} h-full rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 1.5, delay: 0.3 + i * 0.1 }}
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
      )}

      {/* ─── Add / Edit Modal ─── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); resetForm(); }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[var(--color-surface-lowest)] rounded-2xl w-full max-w-md p-8 shadow-2xl border border-[var(--color-surface-variant)] pointer-events-auto"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-serif text-[var(--color-on-surface)] mb-6">
                  {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Nama Kategori</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-all"
                      placeholder="Misal: Belanja Harian"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Ikon</label>
                    <div className="grid grid-cols-4 gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon.id}
                          type="button"
                          onClick={() => setFormIcon(icon.id)}
                          className={`flex flex-col items-center p-2 rounded-xl text-xs gap-1 transition-all ${
                            formIcon === icon.id
                              ? 'bg-[var(--color-primary-container)]/20 border border-[var(--color-primary-container)] text-[var(--color-primary)]'
                              : 'bg-[var(--color-surface-low)] text-[var(--color-outline)] hover:bg-[var(--color-surface-variant)]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{icon.id}</span>
                          <span>{icon.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Anggaran (Rp)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-lg font-mono text-[var(--color-outline)]">Rp</span>
                      <input
                        type="text"
                        value={formAllocated}
                        onChange={handleAllocatedChange}
                        className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] pl-12 pr-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-all text-right font-mono text-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setShowAddModal(false); resetForm(); }}
                      className="flex-1 py-3 rounded-xl bg-[var(--color-surface-low)] text-[var(--color-on-surface)] font-medium hover:bg-[var(--color-surface-container)] transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
                    >
                      {editingId ? 'Simpan' : 'Tambah'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
