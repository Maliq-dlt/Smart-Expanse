import { pgTable, text, timestamp, uuid, bigint } from 'drizzle-orm/pg-core';

// ─── Users ───
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Accounts (Rekening / Dompet) ───
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  balance: bigint('balance', { mode: 'number' }).notNull().default(0),
});

// ─── Transactions (Pemasukan / Pengeluaran) ───
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountName: text('account_name').notNull(),
  type: text('type').notNull(), // 'income' or 'expense'
  amount: bigint('amount', { mode: 'number' }).notNull(),
  category: text('category').notNull(),
  description: text('description'),
  date: timestamp('date').defaultNow().notNull(),
});

// ─── Budget Categories (Anggaran) ───
export const budgetCategories = pgTable('budget_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  allocated: bigint('allocated', { mode: 'number' }).notNull().default(0),
  spent: bigint('spent', { mode: 'number' }).notNull().default(0),
});

// ─── Goals (Target Tabungan) ───
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  target: bigint('target', { mode: 'number' }).notNull(),
  current: bigint('current', { mode: 'number' }).notNull().default(0),
  deadline: text('deadline'),
  color: text('color').notNull(),
});
