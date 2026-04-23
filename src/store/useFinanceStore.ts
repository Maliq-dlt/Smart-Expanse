import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  account: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  
  // Derived state helpers (getters)
  getTotalBalance: () => number;
  getIncomeExpenseByMonth: (month: string) => { income: number; expense: number };
}

// Initial Mock Data
const initialAccounts: Account[] = [
  { id: 'acc1', name: 'Bank BCA', type: 'Rekening Utama', balance: 32000000 },
  { id: 'acc2', name: 'Cash', type: 'Dompet', balance: 450000 },
  { id: 'acc3', name: 'GoPay', type: 'E-Wallet', balance: 1600000 },
];

const initialTransactions: Transaction[] = [
  { id: 'tx1', desc: 'Gaji Bulanan', amount: 15000000, type: 'income', category: 'Salary', date: new Date().toISOString(), account: 'Bank BCA' },
  { id: 'tx2', desc: 'Makan Siang', amount: 55000, type: 'expense', category: 'Food', date: new Date().toISOString(), account: 'GoPay' },
  { id: 'tx3', desc: 'Beli Kopi', amount: 35000, type: 'expense', category: 'Food', date: new Date(Date.now() - 86400000).toISOString(), account: 'Cash' },
  { id: 'tx4', desc: 'Tagihan Internet', amount: 450000, type: 'expense', category: 'Bills', date: new Date(Date.now() - 172800000).toISOString(), account: 'Bank BCA' },
  { id: 'tx5', desc: 'Freelance Project', amount: 3000000, type: 'income', category: 'Salary', date: new Date(Date.now() - 259200000).toISOString(), account: 'Bank BCA' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: initialTransactions,
      accounts: initialAccounts,

      addTransaction: (tx) => set((state) => {
        const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
        
        // Update account balance
        const updatedAccounts = state.accounts.map(acc => {
          if (acc.name === tx.account) {
            return {
              ...acc,
              balance: tx.type === 'income' ? acc.balance + tx.amount : acc.balance - tx.amount
            };
          }
          return acc;
        });

        return {
          transactions: [newTx, ...state.transactions],
          accounts: updatedAccounts
        };
      }),

      deleteTransaction: (id) => set((state) => {
        const txToDelete = state.transactions.find(t => t.id === id);
        if (!txToDelete) return state;

        // Revert account balance
        const updatedAccounts = state.accounts.map(acc => {
          if (acc.name === txToDelete.account) {
            return {
              ...acc,
              balance: txToDelete.type === 'income' ? acc.balance - txToDelete.amount : acc.balance + txToDelete.amount
            };
          }
          return acc;
        });

        return {
          transactions: state.transactions.filter(t => t.id !== id),
          accounts: updatedAccounts
        };
      }),

      getTotalBalance: () => {
        return get().accounts.reduce((sum, acc) => sum + acc.balance, 0);
      },

      getIncomeExpenseByMonth: (monthIndex) => {
        // For simplicity in mock, just calculating everything for current view
        const txs = get().transactions;
        return txs.reduce(
          (acc, tx) => {
            if (tx.type === 'income') acc.income += tx.amount;
            else acc.expense += tx.amount;
            return acc;
          },
          { income: 0, expense: 0 }
        );
      }
    }),
    {
      name: 'smartexpense-finance-storage', // unique name
    }
  )
);
