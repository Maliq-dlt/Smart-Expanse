'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

// ─── Sync User (Upsert) ───
// Called during login/signup — creates user if doesn't exist, returns user with ID
export async function syncUser(email: string, name: string) {
  // Check if user exists
  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));
  
  if (existing.length > 0) {
    return existing[0];
  }

  // Create new user
  const newUser = await db.insert(schema.users).values({ email, name }).returning();
  
  // We no longer seed default accounts or budgets.
  // The user will start with completely 0 data and add them manually.

  return newUser[0];
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
  data: { desc: string; amount: number; type: 'income' | 'expense'; category: string; date: string; account: string }
) {
  const [newTx] = await db.insert(schema.transactions).values({
    userId,
    accountName: data.account,
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.desc,
    date: new Date(data.date),
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
