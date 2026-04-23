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

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
  deadline: string;
  color: 'primary' | 'tertiary' | 'secondary';
}

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  budgetCategories: BudgetCategory[];
  goals: Goal[];
  
  // Transaction Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  
  // Budget Actions
  addBudgetCategory: (cat: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;

  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  addFundsToGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  
  // Derived state helpers
  getTotalBalance: () => number;
  getIncomeExpenseByMonth: (month: string) => { income: number; expense: number };
  getSpentByCategory: (categoryName: string) => number;
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

const initialBudgetCategories: BudgetCategory[] = [
  { id: 'bgt1', name: 'Belanja Harian', icon: 'shopping_cart', allocated: 3000000, spent: 1200000 },
  { id: 'bgt2', name: 'Transportasi', icon: 'directions_car', allocated: 1500000, spent: 1275000 },
  { id: 'bgt3', name: 'Makanan & Minuman', icon: 'restaurant', allocated: 2000000, spent: 1400000 },
  { id: 'bgt4', name: 'Hiburan', icon: 'movie', allocated: 500000, spent: 550000 },
  { id: 'bgt5', name: 'Tagihan & Utilitas', icon: 'receipt_long', allocated: 1200000, spent: 800000 },
  { id: 'bgt6', name: 'Kesehatan', icon: 'health_and_safety', allocated: 500000, spent: 150000 },
];

const initialGoals: Goal[] = [
  { id: 'goal1', name: 'Dana Darurat', icon: 'shield', target: 30000000, current: 20400000, deadline: 'Des 2024', color: 'primary' },
  { id: 'goal2', name: 'Liburan Jepang', icon: 'flight', target: 25000000, current: 15000000, deadline: 'Mar 2025', color: 'tertiary' },
  { id: 'goal3', name: 'MacBook Pro', icon: 'laptop_mac', target: 35000000, current: 8750000, deadline: 'Jun 2025', color: 'secondary' },
  { id: 'goal4', name: 'Uang Muka Rumah', icon: 'home', target: 100000000, current: 42000000, deadline: 'Des 2026', color: 'primary' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: initialTransactions,
      accounts: initialAccounts,
      budgetCategories: initialBudgetCategories,
      goals: initialGoals,

      // ─── Transaction Actions ───
      addTransaction: (tx) => set((state) => {
        const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
        
        const updatedAccounts = state.accounts.map(acc => {
          if (acc.name === tx.account) {
            return {
              ...acc,
              balance: tx.type === 'income' ? acc.balance + tx.amount : acc.balance - tx.amount
            };
          }
          return acc;
        });

        // Auto-update budget spent if it's an expense
        let updatedBudget = state.budgetCategories;
        if (tx.type === 'expense') {
          const catMap: Record<string, string> = {
            'Food': 'Makanan & Minuman',
            'Transport': 'Transportasi',
            'Shopping': 'Belanja Harian',
            'Bills': 'Tagihan & Utilitas',
          };
          const budgetName = catMap[tx.category];
          if (budgetName) {
            updatedBudget = state.budgetCategories.map(b =>
              b.name === budgetName ? { ...b, spent: b.spent + tx.amount } : b
            );
          }
        }

        return {
          transactions: [newTx, ...state.transactions],
          accounts: updatedAccounts,
          budgetCategories: updatedBudget,
        };
      }),

      deleteTransaction: (id) => set((state) => {
        const txToDelete = state.transactions.find(t => t.id === id);
        if (!txToDelete) return state;

        const updatedAccounts = state.accounts.map(acc => {
          if (acc.name === txToDelete.account) {
            return {
              ...acc,
              balance: txToDelete.type === 'income' ? acc.balance - txToDelete.amount : acc.balance + txToDelete.amount
            };
          }
          return acc;
        });

        // Revert budget spent if it was an expense
        let updatedBudget = state.budgetCategories;
        if (txToDelete.type === 'expense') {
          const catMap: Record<string, string> = {
            'Food': 'Makanan & Minuman',
            'Transport': 'Transportasi',
            'Shopping': 'Belanja Harian',
            'Bills': 'Tagihan & Utilitas',
          };
          const budgetName = catMap[txToDelete.category];
          if (budgetName) {
            updatedBudget = state.budgetCategories.map(b =>
              b.name === budgetName ? { ...b, spent: Math.max(0, b.spent - txToDelete.amount) } : b
            );
          }
        }

        return {
          transactions: state.transactions.filter(t => t.id !== id),
          accounts: updatedAccounts,
          budgetCategories: updatedBudget,
        };
      }),

      // ─── Budget Actions ───
      addBudgetCategory: (cat) => set((state) => ({
        budgetCategories: [...state.budgetCategories, { ...cat, id: Math.random().toString(36).substr(2, 9) }]
      })),

      updateBudgetCategory: (id, updates) => set((state) => ({
        budgetCategories: state.budgetCategories.map(b =>
          b.id === id ? { ...b, ...updates } : b
        )
      })),

      deleteBudgetCategory: (id) => set((state) => ({
        budgetCategories: state.budgetCategories.filter(b => b.id !== id)
      })),

      // ─── Goal Actions ───
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Math.random().toString(36).substr(2, 9) }]
      })),

      addFundsToGoal: (id, amount) => set((state) => ({
        goals: state.goals.map(g =>
          g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g
        )
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      // ─── Derived Helpers ───
      getTotalBalance: () => {
        return get().accounts.reduce((sum, acc) => sum + acc.balance, 0);
      },

      getIncomeExpenseByMonth: () => {
        const txs = get().transactions;
        return txs.reduce(
          (acc, tx) => {
            if (tx.type === 'income') acc.income += tx.amount;
            else acc.expense += tx.amount;
            return acc;
          },
          { income: 0, expense: 0 }
        );
      },

      getSpentByCategory: (categoryName: string) => {
        return get().transactions
          .filter(tx => tx.type === 'expense' && tx.category === categoryName)
          .reduce((sum, tx) => sum + tx.amount, 0);
      },
    }),
    {
      name: 'smartexpense-finance-storage',
    }
  )
);
