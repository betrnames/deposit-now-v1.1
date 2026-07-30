import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const file = process.argv[2] || 'migrations/001_transaction_guardrails.sql';
const raw = readFileSync(resolve(file), 'utf8');

/** Split SQL file into statements (strip line comments; naive but fine for our migrations). */
function splitStatements(sql) {
  const withoutLineComments = sql
    .split('\n')
    .map((line) => {
      const i = line.indexOf('--');
      return i >= 0 ? line.slice(0, i) : line;
    })
    .join('\n');
  return withoutLineComments
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

const db = neon(url);
const statements = splitStatements(raw);

try {
  for (const stmt of statements) {
    await db.query(stmt);
  }
  console.log(`migration applied: ${file} (${statements.length} statements)`);
} catch (err) {
  console.error('migration failed:', err.message);
  process.exit(1);
}
