-- Database Schema untuk SmartExpense (PostgreSQL)

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Tabel Accounts (Rekening/Dompet)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    balance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Tabel Transactions (Pemasukan/Pengeluaran)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    amount BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Tabel Budget Categories (Kategori Anggaran)
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    allocated BIGINT NOT NULL DEFAULT 0,
    spent BIGINT NOT NULL DEFAULT 0
);

-- 5. Tabel Goals (Target Tabungan)
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    target_amount BIGINT NOT NULL,
    current_amount BIGINT NOT NULL DEFAULT 0,
    deadline VARCHAR(50),
    color VARCHAR(50) NOT NULL
);

-- ==========================================
-- CONTOH DATA AWAL (DUMMY DATA)
-- Jalankan kode di bawah jika ingin mengisi database dengan data awal
-- ==========================================

-- Insert User (Ganti ID dengan UUID yang sesuai jika perlu)
INSERT INTO users (id, email, name) 
VALUES ('11111111-1111-1111-1111-111111111111', 'maliq@example.com', 'Maliq')
ON CONFLICT (email) DO NOTHING;

-- Insert Accounts
INSERT INTO accounts (id, user_id, name, type, balance) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bank BCA', 'Rekening Utama', 32000000),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Cash', 'Dompet', 450000),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'GoPay', 'E-Wallet', 1600000);

-- Insert Transactions
INSERT INTO transactions (user_id, account_id, type, amount, category, description) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'income', 15000000, 'Salary', 'Gaji Bulanan'),
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'expense', 55000, 'Food', 'Makan Siang'),
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'expense', 35000, 'Food', 'Beli Kopi');

-- Insert Budget Categories
INSERT INTO budget_categories (user_id, name, icon, allocated, spent) VALUES
('11111111-1111-1111-1111-111111111111', 'Belanja Harian', 'shopping_cart', 3000000, 1200000),
('11111111-1111-1111-1111-111111111111', 'Transportasi', 'directions_car', 1500000, 1275000),
('11111111-1111-1111-1111-111111111111', 'Makanan & Minuman', 'restaurant', 2000000, 1400000);

-- Insert Goals
INSERT INTO goals (user_id, name, icon, target_amount, current_amount, deadline, color) VALUES
('11111111-1111-1111-1111-111111111111', 'Dana Darurat', 'shield', 30000000, 20400000, 'Des 2024', 'primary'),
('11111111-1111-1111-1111-111111111111', 'Liburan Jepang', 'flight', 25000000, 15000000, 'Mar 2025', 'tertiary');
