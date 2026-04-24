import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('🗑️  Dropping old tables...');
  await sql`DROP TABLE IF EXISTS transactions CASCADE`;
  await sql`DROP TABLE IF EXISTS accounts CASCADE`;
  await sql`DROP TABLE IF EXISTS budget_categories CASCADE`;
  await sql`DROP TABLE IF EXISTS goals CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;
  console.log('✅ Old tables dropped.');

  console.log('🏗️  Creating new tables...');
  
  await sql`CREATE TABLE "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "email" text NOT NULL,
    "name" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email")
  )`;

  await sql`CREATE TABLE "accounts" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "name" text NOT NULL,
    "type" text NOT NULL,
    "balance" bigint DEFAULT 0 NOT NULL
  )`;

  await sql`CREATE TABLE "transactions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "account_name" text NOT NULL,
    "type" text NOT NULL,
    "amount" bigint NOT NULL,
    "category" text NOT NULL,
    "description" text,
    "date" timestamp DEFAULT now() NOT NULL
  )`;

  await sql`CREATE TABLE "budget_categories" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "name" text NOT NULL,
    "icon" text NOT NULL,
    "allocated" bigint DEFAULT 0 NOT NULL,
    "spent" bigint DEFAULT 0 NOT NULL
  )`;

  await sql`CREATE TABLE "goals" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "name" text NOT NULL,
    "icon" text NOT NULL,
    "target" bigint NOT NULL,
    "current" bigint DEFAULT 0 NOT NULL,
    "deadline" text,
    "color" text NOT NULL
  )`;

  console.log('🔗 Adding foreign keys...');
  await sql`ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;
  await sql`ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;
  await sql`ALTER TABLE "budget_categories" ADD CONSTRAINT "budget_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;
  await sql`ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;

  console.log('✅ All tables created successfully!');
}

migrate().catch(console.error);
