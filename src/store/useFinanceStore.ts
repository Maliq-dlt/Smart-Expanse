import { create } from 'zustand';
import {
  addTransactionAction,
  deleteTransactionAction,
  addBudgetCategoryAction,
  updateBudgetCategoryAction,
  deleteBudgetCategoryAction,
  addGoalAction,
  addFundsToGoalAction,
  deleteGoalAction,
} from '@/actions/finance';

export type TransactionType = 'income' | 'expense';

export interface SplitPartner {
  name: string;
  amount: number;
  paid: boolean;
}

export interface Transaction {
  id: string;
  desc: string;
  amount: number; // In IDR (converted if multi-currency)
  type: TransactionType;
  category: string;
  date: string;
  account: string;
  
  // New features
  isSplit?: boolean;
  splitDetails?: { partners: SplitPartner[] };
  isRecurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextOccurrence?: string;
  currency?: string;
  originalAmount?: number;
  exchangeRate?: number;
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
  isLoaded: boolean;
  
  // Hydration from DB
  setInitialData: (data: {
    accounts: Account[];
    transactions: Transaction[];
    budgetCategories: BudgetCategory[];
    goals: Goal[];
  }) => void;

  // Transaction Actions
  addTransaction: (tx: Omit<Transaction, 'id'>, userId: string) => Promise<void>;
  deleteTransaction: (id: string, userId: string) => Promise<void>;
  
  // Budget Actions
  addBudgetCategory: (cat: Omit<BudgetCategory, 'id'>, userId: string) => Promise<void>;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<void>;
  deleteBudgetCategory: (id: string) => Promise<void>;

  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id'>, userId: string) => Promise<void>;
  addFundsToGoal: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Derived state helpers
  getTotalBalance: () => number;
  getIncomeExpenseByMonth: (month: string) => { income: number; expense: number };
  getSpentByCategory: (categoryName: string) => number;

  // UI state
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

export const useFinanceStore = create<FinanceState>()(
  (set, get) => ({
    transactions: [],
    accounts: [],
    budgetCategories: [],
    goals: [],
    isLoaded: false,
    isPrivacyMode: false,

    togglePrivacyMode: () => set((state) => ({ isPrivacyMode: !state.isPrivacyMode })),

    // ─── Hydrate from Database ───
    setInitialData: (data) => set({
      accounts: data.accounts,
      transactions: data.transactions,
      budgetCategories: data.budgetCategories,
      goals: data.goals,
      isLoaded: true,
    }),

    // ─── Transaction Actions ───
    addTransaction: async (tx, userId) => {
      try {
        const newTx = await addTransactionAction(userId, tx);
        
        // Optimistically update local state
        const updatedAccounts = get().accounts.map(acc => {
          if (acc.name === tx.account) {
            return {
              ...acc,
              balance: tx.type === 'income' ? acc.balance + tx.amount : acc.balance - tx.amount
            };
          }
          return acc;
        });

        let updatedBudget = get().budgetCategories;
        if (tx.type === 'expense') {
          const catMap: Record<string, string> = {
            'Food': 'Makanan & Minuman',
            'Transport': 'Transportasi',
            'Shopping': 'Belanja Harian',
            'Bills': 'Tagihan & Utilitas',
          };
          const budgetName = catMap[tx.category];
          if (budgetName) {
            updatedBudget = get().budgetCategories.map(b =>
              b.name === budgetName ? { ...b, spent: b.spent + tx.amount } : b
            );
          }
        }

        set({
          transactions: [newTx, ...get().transactions],
          accounts: updatedAccounts,
          budgetCategories: updatedBudget,
        });
      } catch (error) {
        console.error('Failed to add transaction:', error);
      }
    },

    deleteTransaction: async (id, userId) => {
      try {
        const txToDelete = get().transactions.find(t => t.id === id);
        if (!txToDelete) return;

        await deleteTransactionAction(id, userId);

        const updatedAccounts = get().accounts.map(acc => {
          if (acc.name === txToDelete.account) {
            return {
              ...acc,
              balance: txToDelete.type === 'income' ? acc.balance - txToDelete.amount : acc.balance + txToDelete.amount
            };
          }
          return acc;
        });

        let updatedBudget = get().budgetCategories;
        if (txToDelete.type === 'expense') {
          const catMap: Record<string, string> = {
            'Food': 'Makanan & Minuman',
            'Transport': 'Transportasi',
            'Shopping': 'Belanja Harian',
            'Bills': 'Tagihan & Utilitas',
          };
          const budgetName = catMap[txToDelete.category];
          if (budgetName) {
            updatedBudget = get().budgetCategories.map(b =>
              b.name === budgetName ? { ...b, spent: Math.max(0, b.spent - txToDelete.amount) } : b
            );
          }
        }

        set({
          transactions: get().transactions.filter(t => t.id !== id),
          accounts: updatedAccounts,
          budgetCategories: updatedBudget,
        });
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    },

    // ─── Budget Actions ───
    addBudgetCategory: async (cat, userId) => {
      try {
        const newCat = await addBudgetCategoryAction(userId, cat);
        set({ budgetCategories: [...get().budgetCategories, newCat] });
      } catch (error) {
        console.error('Failed to add budget category:', error);
      }
    },

    updateBudgetCategory: async (id, updates) => {
      try {
        await updateBudgetCategoryAction(id, updates);
        set({
          budgetCategories: get().budgetCategories.map(b =>
            b.id === id ? { ...b, ...updates } : b
          )
        });
      } catch (error) {
        console.error('Failed to update budget category:', error);
      }
    },

    deleteBudgetCategory: async (id) => {
      try {
        await deleteBudgetCategoryAction(id);
        set({ budgetCategories: get().budgetCategories.filter(b => b.id !== id) });
      } catch (error) {
        console.error('Failed to delete budget category:', error);
      }
    },

    // ─── Goal Actions ───
    addGoal: async (goal, userId) => {
      try {
        const newGoal = await addGoalAction(userId, goal);
        set({ goals: [...get().goals, newGoal] });
      } catch (error) {
        console.error('Failed to add goal:', error);
      }
    },

    addFundsToGoal: async (id, amount) => {
      try {
        await addFundsToGoalAction(id, amount);
        set({
          goals: get().goals.map(g =>
            g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g
          )
        });
      } catch (error) {
        console.error('Failed to add funds to goal:', error);
      }
    },

    deleteGoal: async (id) => {
      try {
        await deleteGoalAction(id);
        set({ goals: get().goals.filter(g => g.id !== id) });
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    },

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
  })
);
