'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

// ─── Authentication Actions ───

export async function loginUser(email: string, password?: string) {
  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));
  
  if (existing.length === 0) {
    throw new Error('Email tidak terdaftar.');
  }

  const user = existing[0];
  
  // Basic password check (in a real app, use bcrypt)
  if (!user.password || user.password !== password) {
    throw new Error('Email atau password salah.');
  }

  return user;
}

export async function signupUser(email: string, name: string, password?: string) {
  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));
  
  if (existing.length > 0) {
    throw new Error('Email sudah terdaftar. Silakan login.');
  }

  // Create new user
  const newUser = await db.insert(schema.users).values({ email, name, password }).returning();
  const user = newUser[0];

  // Seed default data for the new user so the dashboard isn't completely empty
  await db.insert(schema.accounts).values([
    { userId: user.id, name: 'BCA Utama', type: 'Bank', balance: 5000000 },
    { userId: user.id, name: 'Gopay', type: 'E-Wallet', balance: 250000 },
    { userId: user.id, name: 'Cash', type: 'Cash', balance: 500000 },
  ]);

  await db.insert(schema.budgetCategories).values([
    { userId: user.id, name: 'Makanan & Minuman', icon: 'restaurant', allocated: 3000000, spent: 0 },
    { userId: user.id, name: 'Transportasi', icon: 'directions_car', allocated: 1000000, spent: 0 },
    { userId: user.id, name: 'Belanja Harian', icon: 'shopping_cart', allocated: 1500000, spent: 0 },
    { userId: user.id, name: 'Tagihan & Utilitas', icon: 'receipt_long', allocated: 2000000, spent: 0 },
  ]);

  await db.insert(schema.goals).values([
    { userId: user.id, name: 'Dana Darurat', icon: 'health_and_safety', target: 20000000, current: 5000000, deadline: 'Des 2026', color: 'primary' },
    { userId: user.id, name: 'Liburan Jepang', icon: 'flight', target: 15000000, current: 2000000, deadline: 'Agt 2026', color: 'tertiary' },
  ]);

  return user;
}

// ─── Fetch All User Data ───
export async function fetchUserData(userId: string) {
  const [userAccounts, userTransactions, userBudgets, userGoals] = await Promise.all([
    db.select().from(schema.accounts).where(eq(schema.accounts.userId, userId)),
    db.select().from(schema.transactions).where(eq(schema.transactions.userId, userId)),
    db.select().from(schema.budgetCategories).where(eq(schema.budgetCategories.userId, userId)),
    db.select().from(schema.goals).where(eq(schema.goals.userId, userId)),
  ]);

  return {
    accounts: userAccounts.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      balance: a.balance,
    })),
    transactions: userTransactions.map(t => ({
      id: t.id,
      desc: t.description || '',
      amount: t.amount,
      type: t.type as 'income' | 'expense',
      category: t.category,
      date: t.date.toISOString(),
      account: t.accountName,
      isSplit: t.isSplit,
      splitDetails: t.splitDetails as any,
      isRecurring: t.isRecurring,
      frequency: t.frequency as any,
      nextOccurrence: t.nextOccurrence?.toISOString(),
      currency: t.currency,
      originalAmount: t.originalAmount as number,
      exchangeRate: t.exchangeRate as number,
    })),
    budgetCategories: userBudgets.map(b => ({
      id: b.id,
      name: b.name,
      icon: b.icon,
      allocated: b.allocated,
      spent: b.spent,
    })),
    goals: userGoals.map(g => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      target: g.target,
      current: g.current,
      deadline: g.deadline || '',
      color: g.color as 'primary' | 'tertiary' | 'secondary',
    })),
  };
}

// ─── Transaction Actions ───
export async function addTransactionAction(
  userId: string,
  data: { 
    desc: string; 
    amount: number; 
    type: 'income' | 'expense'; 
    category: string; 
    date: string; 
    account: string;
    isSplit?: boolean;
    splitDetails?: any;
    isRecurring?: boolean;
    frequency?: string;
    currency?: string;
    originalAmount?: number;
    exchangeRate?: number;
  }
) {
  const [newTx] = await db.insert(schema.transactions).values({
    userId,
    accountName: data.account,
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.desc,
    date: new Date(data.date),
    isSplit: data.isSplit || false,
    splitDetails: data.splitDetails,
    isRecurring: data.isRecurring || false,
    frequency: data.frequency,
    currency: data.currency || 'IDR',
    originalAmount: data.originalAmount,
    exchangeRate: data.exchangeRate,
  }).returning();

  // Update account balance
  const accs = await db.select().from(schema.accounts).where(eq(schema.accounts.userId, userId));
  const acc = accs.find(a => a.name === data.account);
  if (acc) {
    const newBalance = data.type === 'income' ? acc.balance + data.amount : acc.balance - data.amount;
    await db.update(schema.accounts).set({ balance: newBalance }).where(eq(schema.accounts.id, acc.id));
  }

  // Update budget spent if expense
  if (data.type === 'expense') {
    const catMap: Record<string, string> = {
      'Food': 'Makanan & Minuman',
      'Transport': 'Transportasi',
      'Shopping': 'Belanja Harian',
      'Bills': 'Tagihan & Utilitas',
    };
    const budgetName = catMap[data.category];
    if (budgetName) {
      const budgets = await db.select().from(schema.budgetCategories).where(eq(schema.budgetCategories.userId, userId));
      const budget = budgets.find(b => b.name === budgetName);
      if (budget) {
        await db.update(schema.budgetCategories).set({ spent: budget.spent + data.amount }).where(eq(schema.budgetCategories.id, budget.id));
      }
    }
  }

  return {
    id: newTx.id,
    desc: data.desc,
    amount: data.amount,
    type: data.type,
    category: data.category,
    date: data.date,
    account: data.account,
    isSplit: newTx.isSplit,
    splitDetails: newTx.splitDetails as any,
    isRecurring: newTx.isRecurring,
    frequency: newTx.frequency as any,
    currency: newTx.currency,
    originalAmount: newTx.originalAmount as number,
    exchangeRate: newTx.exchangeRate as number,
  };
}

export async function deleteTransactionAction(txId: string, userId: string) {
  // Get the transaction first
  const txs = await db.select().from(schema.transactions).where(eq(schema.transactions.id, txId));
  if (txs.length === 0) return false;
  const tx = txs[0];

  // Revert account balance
  const accs = await db.select().from(schema.accounts).where(eq(schema.accounts.userId, userId));
  const acc = accs.find(a => a.name === tx.accountName);
  if (acc) {
    const newBalance = tx.type === 'income' ? acc.balance - tx.amount : acc.balance + tx.amount;
    await db.update(schema.accounts).set({ balance: newBalance }).where(eq(schema.accounts.id, acc.id));
  }

  // Revert budget if expense
  if (tx.type === 'expense') {
    const catMap: Record<string, string> = {
      'Food': 'Makanan & Minuman',
      'Transport': 'Transportasi',
      'Shopping': 'Belanja Harian',
      'Bills': 'Tagihan & Utilitas',
    };
    const budgetName = catMap[tx.category];
    if (budgetName) {
      const budgets = await db.select().from(schema.budgetCategories).where(eq(schema.budgetCategories.userId, userId));
      const budget = budgets.find(b => b.name === budgetName);
      if (budget) {
        await db.update(schema.budgetCategories).set({ spent: Math.max(0, budget.spent - tx.amount) }).where(eq(schema.budgetCategories.id, budget.id));
      }
    }
  }

  await db.delete(schema.transactions).where(eq(schema.transactions.id, txId));
  return true;
}

// ─── Budget Actions ───
export async function addBudgetCategoryAction(
  userId: string,
  data: { name: string; icon: string; allocated: number; spent: number }
) {
  const [newCat] = await db.insert(schema.budgetCategories).values({
    userId,
    name: data.name,
    icon: data.icon,
    allocated: data.allocated,
    spent: data.spent,
  }).returning();

  return { id: newCat.id, ...data };
}

export async function updateBudgetCategoryAction(id: string, updates: { name?: string; icon?: string; allocated?: number; spent?: number }) {
  await db.update(schema.budgetCategories).set(updates).where(eq(schema.budgetCategories.id, id));
  return true;
}

export async function deleteBudgetCategoryAction(id: string) {
  await db.delete(schema.budgetCategories).where(eq(schema.budgetCategories.id, id));
  return true;
}

// ─── Goal Actions ───
export async function addGoalAction(
  userId: string,
  data: { name: string; icon: string; target: number; current: number; deadline: string; color: string }
) {
  const [newGoal] = await db.insert(schema.goals).values({
    userId,
    name: data.name,
    icon: data.icon,
    target: data.target,
    current: data.current,
    deadline: data.deadline,
    color: data.color,
  }).returning();

  return { id: newGoal.id, ...data, color: data.color as 'primary' | 'tertiary' | 'secondary' };
}

export async function addFundsToGoalAction(id: string, amount: number) {
  const gs = await db.select().from(schema.goals).where(eq(schema.goals.id, id));
  if (gs.length === 0) return false;
  const goal = gs[0];
  const newCurrent = Math.min(goal.current + amount, goal.target);
  await db.update(schema.goals).set({ current: newCurrent }).where(eq(schema.goals.id, id));
  return true;
}

export async function deleteGoalAction(id: string) {
  await db.delete(schema.goals).where(eq(schema.goals.id, id));
  return true;
}
