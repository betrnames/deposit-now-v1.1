import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const file = process.argv[2] || 'migrations/001_transaction_guardrails.sql';
const sql = readFileSync(resolve(file), 'utf8');

const db = neon(url);
try {
  await db(sql);
  console.log(`migration applied: ${file}`);
} catch (err) {
  console.error('migration failed:', err.message);
  process.exit(1);
}
