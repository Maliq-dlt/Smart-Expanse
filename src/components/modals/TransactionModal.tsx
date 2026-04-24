'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '@/contexts/ModalContext';
import { useFinanceStore, TransactionType } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const categories = [
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'transport', label: 'Transport', icon: 'directions_car' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { id: 'bills', label: 'Bills', icon: 'receipt' },
  { id: 'more', label: 'More', icon: 'more_horiz' },
];

export default function TransactionModal() {
  const { isTransactionModalOpen, closeTransactionModal } = useModal();
  const { addTransaction, accounts } = useFinanceStore();
  const userId = useAuthStore((s) => s.user?.userId);

  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [nominal, setNominal] = useState('');
  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.name || 'Cash');

  const handleReset = () => {
    setTransactionType('expense');
    setSelectedCategory('food');
    setNominal('');
    setNama('');
    setCatatan('');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedAccount(accounts[0]?.name || 'Cash');
  };

  const handleSubmit = () => {
    const amount = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!amount || amount <= 0) return; // Basic validation
    if (!nama) return;

    if (!userId) return;
    addTransaction({
      desc: nama,
      amount: amount,
      type: transactionType,
      category: categories.find(c => c.id === selectedCategory)?.label || 'Other',
      date: new Date(date).toISOString(),
      account: selectedAccount
    }, userId);

    closeTransactionModal();
    toast.success('Transaksi berhasil ditambahkan!', {
      description: `${transactionType === 'income' ? 'Pemasukan' : 'Pengeluaran'} Rp ${nominal} untuk ${nama}`,
    });
    setTimeout(handleReset, 300);
  };

  const handleClose = () => {
    closeTransactionModal();
    setTimeout(handleReset, 300);
  };

  // Helper to format input as Rupiah while typing
  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue) {
      setNominal(new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)));
    } else {
      setNominal('');
    }
  };

  return (
    <AnimatePresence>
      {isTransactionModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-0 md:p-4 md:items-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="apple-glass shadow-[var(--shadow-modal)] w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-[var(--color-surface-variant)] pointer-events-auto rounded-t-3xl md:rounded-3xl"
              initial={{ y: "100%", opacity: 0, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-surface-variant)]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    className="hover:bg-[var(--color-surface-container)] transition-colors p-2 rounded-full"
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-[var(--color-on-surface)]">close</span>
                  </button>
                  <span className="text-xl font-bold text-[var(--color-on-surface)] font-serif italic">
                    SmartExpense
                  </span>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="text-[var(--color-primary)] dark:text-[var(--color-primary)] font-bold hover:bg-[var(--color-surface-container)] transition-colors px-4 py-2 rounded-full text-sm"
                >
                  Save
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-10">
                {/* Title */}
                <div className="mb-8 text-center">
                  <h2 className="text-[32px] leading-[1.3] font-normal text-[var(--color-on-surface)] font-serif mb-1">
                    Tambah Transaksi Baru
                  </h2>
                  <p className="text-base text-[var(--color-on-surface-variant)]">
                    Catat pengeluaran atau pemasukan dengan detail.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Nominal */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-1">
                      Nominal
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-2xl font-medium text-[var(--color-on-surface-variant)] font-mono">
                        Rp
                      </span>
                      <input
                        type="text"
                        value={nominal}
                        onChange={handleNominalChange}
                        className="w-full bg-[var(--color-surface-low)] border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-lg py-4 pl-14 pr-4 text-[32px] font-medium text-[var(--color-on-surface)] text-right font-mono transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Type Toggle */}
                  <div className="flex justify-center">
                    <div className="bg-[var(--color-surface-low)] p-1 rounded-full inline-flex relative">
                      <button
                        type="button"
                        onClick={() => setTransactionType('expense')}
                        className={`px-6 py-2 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-all z-10 relative ${
                          transactionType === 'expense'
                            ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm'
                            : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                        }`}
                      >
                        Pengeluaran
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionType('income')}
                        className={`px-6 py-2 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-all z-10 relative ${
                          transactionType === 'income'
                            ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm'
                            : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                        }`}
                      >
                        Pemasukan
                      </button>
                    </div>
                  </div>

                  {/* Nama Transaksi */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-1">
                      Nama Transaksi
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full bg-[var(--color-surface-low)] border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-lg py-3 px-4 text-base text-[var(--color-on-surface)] transition-colors"
                      placeholder="Misal: Makan Siang"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-3">
                      Kategori
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors gap-2 ${
                            selectedCategory === cat.id
                              ? 'bg-[var(--color-primary-container)]/20 border border-[var(--color-primary-container)] text-[var(--color-on-primary-container)]'
                              : 'bg-[var(--color-surface-low)] border border-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={selectedCategory === cat.id ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            {cat.icon}
                          </span>
                          <span className="text-[10px] font-medium">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tanggal & Akun */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-1">
                        Tanggal
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[var(--color-surface-low)] border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-lg py-3 px-4 text-base text-[var(--color-on-surface)] transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-1">
                        Akun / Dompet
                      </label>
                      <div className="relative">
                        <select 
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-full bg-[var(--color-surface-low)] border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-lg py-3 px-4 text-base text-[var(--color-on-surface)] transition-colors appearance-none"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.name}>{acc.name}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-1">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full bg-[var(--color-surface-low)] border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-lg py-3 px-4 text-base text-[var(--color-on-surface)] transition-colors resize-none"
                      placeholder="Tambahkan deskripsi detail..."
                      rows={2}
                    />
                  </div>

                  {/* Lampiran */}
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-1">
                      Lampiran
                    </label>
                    <button
                      type="button"
                      className="w-full border border-dashed border-[var(--color-outline-variant)] rounded-lg py-4 flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors gap-2"
                    >
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                      <span className="text-sm">Tambahkan Struk / Bukti</span>
                    </button>
                  </div>

                  {/* Submit */}
                  <div className="pt-2 mt-4">
                    <motion.button
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-xs font-semibold tracking-[0.05em] uppercase py-4 rounded-xl shadow-soft shimmer-btn flex justify-center items-center gap-2"
                      onClick={handleSubmit}
                    >
                      <span className="material-symbols-outlined fill">check_circle</span>
                      Simpan Transaksi
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
