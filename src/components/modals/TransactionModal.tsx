'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { useModal } from '@/contexts/ModalContext';
import { useFinanceStore, TransactionType, SplitPartner } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const categories = [
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'transport', label: 'Transport', icon: 'directions_car' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { id: 'bills', label: 'Bills', icon: 'receipt' },
  { id: 'more', label: 'More', icon: 'more_horiz' },
];

const currencies = [
  { code: 'IDR', symbol: 'Rp', rate: 1 },
  { code: 'USD', symbol: '$', rate: 15800 },
  { code: 'EUR', symbol: '€', rate: 17200 },
  { code: 'SGD', symbol: 'S$', rate: 11800 },
  { code: 'JPY', symbol: '¥', rate: 105 },
];

const frequencies = [
  { id: 'daily', label: 'Harian' },
  { id: 'weekly', label: 'Mingguan' },
  { id: 'monthly', label: 'Bulanan' },
  { id: 'yearly', label: 'Tahunan' },
];

export default function TransactionModal() {
  const { isTransactionModalOpen, closeTransactionModal } = useModal();
  const { addTransaction, accounts } = useFinanceStore();
  const userId = useAuthStore((s) => s.user?.userId);

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTransactionModalOpen || !scrollWrapperRef.current || !scrollContentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [isTransactionModalOpen]);

  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [nominal, setNominal] = useState('');
  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.name || 'Cash');

  // New features state
  const [currency, setCurrency] = useState('IDR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [isSplit, setIsSplit] = useState(false);
  const [partners, setPartners] = useState<SplitPartner[]>([]);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerAmount, setNewPartnerAmount] = useState('');

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].name);
    }
  }, [accounts, selectedAccount]);

  const handleReset = () => {
    setTransactionType('expense');
    setSelectedCategory('food');
    setNominal('');
    setNama('');
    setCatatan('');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedAccount(accounts[0]?.name || 'Cash');
    setCurrency('IDR');
    setExchangeRate(1);
    setIsRecurring(false);
    setFrequency('monthly');
    setIsSplit(false);
    setPartners([]);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = currencies.find(c => c.code === e.target.value);
    if (selected) {
      setCurrency(selected.code);
      setExchangeRate(selected.rate);
    }
  };

  const addPartner = () => {
    if (!newPartnerName || !newPartnerAmount) return;
    const amount = parseInt(newPartnerAmount.replace(/\D/g, ''), 10);
    setPartners([...partners, { name: newPartnerName, amount, paid: false }]);
    setNewPartnerName('');
    setNewPartnerAmount('');
  };

  const removePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const rawNominal = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!rawNominal || rawNominal <= 0) return; 
    if (!nama) return;

    if (!userId) return;

    // Convert to IDR for main amount
    const amountInIdr = Math.round(rawNominal * exchangeRate);

    addTransaction({
      desc: nama,
      amount: amountInIdr,
      type: transactionType,
      category: categories.find(c => c.id === selectedCategory)?.label || 'Other',
      date: new Date(date).toISOString(),
      account: selectedAccount,
      currency,
      originalAmount: rawNominal,
      exchangeRate,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
      isSplit,
      splitDetails: isSplit ? { partners } : undefined
    }, userId);

    closeTransactionModal();
    toast.success('Transaksi berhasil ditambahkan!', {
      description: `${transactionType === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${currency} ${nominal} untuk ${nama}`,
    });
    setTimeout(handleReset, 300);
  };

  const handleClose = () => {
    closeTransactionModal();
    setTimeout(handleReset, 300);
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue) {
      const numValue = parseInt(rawValue, 10);
      if (numValue <= 9999999999) { // Max 1 digit miliar (9.999.999.999)
        setNominal(new Intl.NumberFormat('id-ID').format(numValue));
      }
    } else {
      setNominal('');
    }
  };

  const handlePartnerAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue) {
      setNewPartnerAmount(new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)));
    } else {
      setNewPartnerAmount('');
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
              ref={scrollWrapperRef}
              data-lenis-prevent="true"
              className="bg-[var(--color-surface-lowest)] w-full max-w-xl max-h-[92vh] overflow-y-auto border border-[var(--color-surface-variant)]/40 pointer-events-auto rounded-t-[32px] md:rounded-[32px] shadow-2xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              initial={{ y: "100%", opacity: 0, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={scrollContentRef}>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-surface-variant)] sticky top-0 bg-[var(--color-surface-lowest)] z-30">
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
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Nominal & Type Section */}
                <div className="flex flex-col items-center justify-center pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-[var(--color-surface-container)] p-1 rounded-full inline-flex">
                      <button
                        type="button"
                        onClick={() => setTransactionType('expense')}
                        className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                          transactionType === 'expense'
                            ? 'bg-[var(--color-surface-lowest)] text-[var(--color-on-surface)] shadow-sm'
                            : 'text-[var(--color-outline)] hover:text-[var(--color-on-surface-variant)]'
                        }`}
                      >
                        Pengeluaran
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionType('income')}
                        className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                          transactionType === 'income'
                            ? 'bg-[var(--color-surface-lowest)] text-[var(--color-on-surface)] shadow-sm'
                            : 'text-[var(--color-outline)] hover:text-[var(--color-on-surface-variant)]'
                        }`}
                      >
                        Pemasukan
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 relative group">
                    <select
                      value={currency}
                      onChange={handleCurrencyChange}
                      className="absolute -left-16 bg-transparent text-[var(--color-outline)] font-medium text-lg outline-none cursor-pointer hover:text-[var(--color-on-surface)] transition-colors appearance-none"
                    >
                      {currencies.map(c => (
                        <option key={c.code} value={c.code} className="bg-[var(--color-surface)]">{c.code}</option>
                      ))}
                    </select>
                    <span className={`font-light text-[var(--color-outline)] transition-all ${nominal.length > 11 ? 'text-2xl md:text-3xl' : nominal.length > 7 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>
                      {currencies.find(c => c.code === currency)?.symbol}
                    </span>
                    <input
                      type="text"
                      value={nominal}
                      onChange={handleNominalChange}
                      className={`bg-transparent border-none font-light text-[var(--color-on-surface)] text-center outline-none w-full max-w-[320px] placeholder:text-[var(--color-surface-variant)] transition-all ${nominal.length > 11 ? 'text-3xl md:text-4xl' : nominal.length > 7 ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'}`}
                      placeholder="0"
                      autoFocus
                    />
                  </div>
                </div>

                  {currency !== 'IDR' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[var(--color-surface-variant)]/30 p-4 rounded-xl flex justify-between items-center"
                    >
                      <span className="text-sm text-[var(--color-on-surface-variant)]">Estimasi Kurs (ke IDR)</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-outline)]">1 {currency} =</span>
                        <input 
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                          className="bg-transparent border-b border-[var(--color-outline)] focus:border-[var(--color-primary)] w-24 text-right font-mono text-sm outline-none"
                        />
                        <span className="text-xs text-[var(--color-outline)]">IDR</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-5">
                  {/* Nama Transaksi */}
                  <div className="border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors pb-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-1">
                      Nama Transaksi
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-[var(--color-on-surface)] placeholder:text-[var(--color-surface-variant)]"
                      placeholder="Misal: Makan Siang, Netflix..."
                    />
                  </div>


                  {/* Options Toggles */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        isRecurring 
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)]/10 text-[var(--color-primary)]' 
                          : 'border-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
                      }`}
                    >
                      <span className="material-symbols-outlined">sync</span>
                      <div className="text-left">
                        <p className="text-sm font-bold">Rutin</p>
                        <p className="text-[10px]">Langganan/Cicilan</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSplit(!isSplit)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        isSplit 
                          ? 'border-[var(--color-tertiary)] bg-[var(--color-tertiary-container)]/10 text-[var(--color-tertiary)]' 
                          : 'border-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
                      }`}
                    >
                      <span className="material-symbols-outlined">groups</span>
                      <div className="text-left">
                        <p className="text-sm font-bold">Split Bill</p>
                        <p className="text-[10px]">Patungan bersama</p>
                      </div>
                    </button>
                  </div>

                  {/* Recurring Details */}
                  {isRecurring && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[var(--color-surface-low)] p-4 rounded-xl space-y-3"
                    >
                      <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">
                        Frekuensi Pengulangan
                      </label>
                      <div className="flex gap-2">
                        {frequencies.map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFrequency(f.id as any)}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                              frequency === f.id 
                                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' 
                                : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/80'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Split Bill Details */}
                  {isSplit && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[var(--color-surface-low)] p-4 rounded-xl space-y-4"
                    >
                      <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)]">
                        Patungan Bersama (Split Bill)
                      </label>
                      
                      {/* Partner List */}
                      <div className="space-y-2">
                        {partners.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[var(--color-surface-lowest)] p-3 rounded-lg border border-[var(--color-surface-variant)]">
                            <span className="text-sm font-medium">{p.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono">{currency} {new Intl.NumberFormat('id-ID').format(p.amount)}</span>
                              <button onClick={() => removePartner(idx)} className="text-[var(--color-error)]">
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Partner Form */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPartnerName}
                          onChange={(e) => setNewPartnerName(e.target.value)}
                          placeholder="Nama teman"
                          className="flex-[2] bg-[var(--color-surface-lowest)] border border-[var(--color-surface-variant)] rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={newPartnerAmount}
                          onChange={handlePartnerAmountChange}
                          placeholder="Nominal"
                          className="flex-[1] bg-[var(--color-surface-lowest)] border border-[var(--color-surface-variant)] rounded-lg px-3 py-2 text-sm font-mono"
                        />
                        <button 
                          onClick={addPartner}
                          className="bg-[var(--color-primary)] text-[var(--color-on-primary)] p-2 rounded-lg"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

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
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-[var(--color-on-surface)]"
                        />
                      </div>
                    </div>
                    <div className="border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors pb-2">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-1">
                        Akun / Dompet
                      </label>
                      <div className="relative">
                        <select 
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-[var(--color-on-surface)] appearance-none cursor-pointer"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.name} className="bg-[var(--color-surface)]">{acc.name}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div className="border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors pb-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-1">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-base text-[var(--color-on-surface)] transition-colors resize-none h-10 placeholder:text-[var(--color-surface-variant)]"
                      placeholder="Tambahkan detail transaksi..."
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-6">
                    <motion.button
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-semibold py-4 rounded-xl shadow-soft flex justify-center items-center gap-2"
                      onClick={handleSubmit}
                    >
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      Simpan Transaksi
                    </motion.button>
                  </div>

                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
