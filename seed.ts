import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon("postgresql://neondb_owner:npg_5izPdoxL7stZ@ep-holy-shadow-anurjc66-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require");
const db = drizzle(sql);

async function seedExisting() {
  try {
    const allUsers = await db.select().from(schema.users);
    for (const user of allUsers) {
      const existingAccounts = await db.select().from(schema.accounts).where(eq(schema.accounts.userId, user.id));
      if (existingAccounts.length === 0) {
        console.log('Seeding data for', user.email);
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
          { userId: user.id, name: 'Dana Darurat', icon: 'health_and_safety', target: 20000000, current: 5000000, deadline: new Date('2026-12-31'), color: 'primary' },
          { userId: user.id, name: 'Liburan Jepang', icon: 'flight', target: 15000000, current: 2000000, deadline: new Date('2026-08-15'), color: 'tertiary' },
        ]);
      }
    }
    console.log('Done');
  } catch (err) {
    console.error('Error:', err);
  }
}

seedExisting();
