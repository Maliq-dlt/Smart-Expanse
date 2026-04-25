import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon("postgresql://neondb_owner:npg_5izPdoxL7stZ@ep-holy-shadow-anurjc66-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require");
const db = drizzle(sql);

async function check() {
  try {
    const res = await db.execute('SELECT * FROM users');
    console.log('Users in DB:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
