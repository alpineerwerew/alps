#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const conn = process.env.SUPABASE_DB_URL;
  if (!conn) {
    throw new Error('SUPABASE_DB_URL missing in server/.env');
  }
  const sqlPath = path.join(__dirname, '..', 'sql', 'supabase_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log('✅ Supabase schema applied successfully.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('❌ bootstrap-supabase failed:', err.message);
  process.exit(1);
});

