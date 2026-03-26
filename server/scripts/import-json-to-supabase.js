#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ROOT = path.join(__dirname, '..');

function readJson(file, fallback) {
  try {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function userObjFromAny(u) {
  if (u && typeof u === 'object' && u.chat_id != null) return u;
  return { chat_id: u, username: null, first_name: null, last_name: null, first_seen: null, last_seen: null };
}

async function upsertUsers(client, users) {
  for (const u of users) {
    if (!u || u.chat_id == null) continue;
    await client.query(
      `insert into public.app_users
      (chat_id, username, first_name, last_name, first_seen, last_seen, updated_at)
      values ($1,$2,$3,$4,$5,$6,now())
      on conflict (chat_id) do update set
        username=excluded.username,
        first_name=excluded.first_name,
        last_name=excluded.last_name,
        first_seen=coalesce(public.app_users.first_seen, excluded.first_seen),
        last_seen=coalesce(excluded.last_seen, public.app_users.last_seen),
        updated_at=now()`,
      [
        String(u.chat_id),
        u.username || null,
        u.first_name || null,
        u.last_name || null,
        u.first_seen || null,
        u.last_seen || null
      ]
    );
  }
}

async function main() {
  const conn = process.env.SUPABASE_DB_URL;
  if (!conn) throw new Error('SUPABASE_DB_URL missing in server/.env');

  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const botUsersRaw = readJson('bot_users.json', []);
    const botUsers = (Array.isArray(botUsersRaw) ? botUsersRaw : []).map(userObjFromAny);
    await upsertUsers(client, botUsers);

    const activity = readJson('cart_activity.json', []);
    for (const a of (Array.isArray(activity) ? activity : [])) {
      if (!a || a.chat_id == null) continue;
      await upsertUsers(client, [a]);
      await client.query(
        `insert into public.cart_activity (chat_id, cart_non_empty, items_count, updated_at)
         values ($1,$2,$3,$4)
         on conflict (chat_id) do update set
           cart_non_empty=excluded.cart_non_empty,
           items_count=excluded.items_count,
           updated_at=excluded.updated_at`,
        [String(a.chat_id), !!a.cart_non_empty, Number(a.items_count) || 0, a.updated_at || new Date().toISOString()]
      );
    }

    const walletsObj = readJson('cashback_wallets.json', { users: {} });
    const wallets = walletsObj && walletsObj.users ? walletsObj.users : {};
    for (const [chatId, w] of Object.entries(wallets)) {
      await upsertUsers(client, [{ chat_id: chatId }]);
      await client.query(
        `insert into public.cashback_wallets (chat_id, balance_chf, updated_at)
         values ($1,$2,now())
         on conflict (chat_id) do update set balance_chf=excluded.balance_chf, updated_at=now()`,
        [String(chatId), Number(w?.balance_chf) || 0]
      );
      const txs = Array.isArray(w?.transactions) ? w.transactions : [];
      for (const tx of txs) {
        if (!tx || !tx.id) continue;
        await client.query(
          `insert into public.cashback_transactions
          (id, chat_id, at, delta_chf, balance_after, kind, note, payment_method)
          values ($1,$2,$3,$4,$5,$6,$7,$8)
          on conflict (id) do nothing`,
          [
            String(tx.id),
            String(chatId),
            tx.at || new Date().toISOString(),
            Number(tx.delta_chf) || 0,
            Number(tx.balance_after) || 0,
            String(tx.kind || 'adjustment'),
            tx.note || null,
            tx.payment_method || null
          ]
        );
      }
    }

    const orders = readJson('orders_history.json', []);
    for (const o of (Array.isArray(orders) ? orders : [])) {
      if (!o || o.user_id == null || !o.ref) continue;
      await upsertUsers(client, [{ chat_id: o.user_id, username: o.username, first_name: o.first_name, last_name: o.last_name }]);
      await client.query(
        `insert into public.orders_history
        (id, ref, chat_id, username, first_name, last_name, order_text, items, products, product_image, total_chf, status, created_at)
        values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,$11,$12,$13)
        on conflict (ref) do nothing`,
        [
          Number(o.id) || Date.now(),
          String(o.ref),
          String(o.user_id),
          o.username || null,
          o.first_name || null,
          o.last_name || null,
          o.order_text || '',
          JSON.stringify(Array.isArray(o.items) ? o.items : []),
          JSON.stringify(Array.isArray(o.products) ? o.products : []),
          o.product_image || null,
          o.total_chf != null ? Number(o.total_chf) : null,
          o.status || 'confirmed',
          o.created_at || new Date().toISOString()
        ]
      );
    }

    const loyaltyObj = readJson('loyalty_points.json', { users: {} });
    const loyaltyUsers = loyaltyObj && loyaltyObj.users ? loyaltyObj.users : {};
    for (const [chatId, row] of Object.entries(loyaltyUsers)) {
      await upsertUsers(client, [{ chat_id: chatId }]);
      await client.query(
        `insert into public.loyalty_points (chat_id, total_points, updated_at)
         values ($1,$2,now())
         on conflict (chat_id) do update set total_points=excluded.total_points, updated_at=now()`,
        [String(chatId), Number(row?.total_points) || 0]
      );
      const hist = Array.isArray(row?.history) ? row.history : [];
      for (const h of hist) {
        if (!h) continue;
        await client.query(
          `insert into public.loyalty_history
          (chat_id, at, points, kind, order_ref, order_total_chf, note)
          values ($1,$2,$3,$4,$5,$6,$7)`,
          [
            String(chatId),
            h.at || new Date().toISOString(),
            Number(h.points) || 0,
            String(h.kind || 'order'),
            h.order_ref || null,
            h.order_total_chf != null ? Number(h.order_total_chf) : null,
            h.note || null
          ]
        );
      }
    }

    const reviews = readJson('reviews.json', []);
    for (const r of (Array.isArray(reviews) ? reviews : [])) {
      if (!r || r.user_id == null || !r.order_ref) continue;
      await upsertUsers(client, [{ chat_id: r.user_id }]);
      await client.query(
        `insert into public.reviews
        (id, chat_id, name, rating, title, text, date, created_at, verified, approved, order_ref, ordered_items, product_id, product_name, product_image)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15)
        on conflict (id) do nothing`,
        [
          Number(r.id) || Date.now(),
          String(r.user_id),
          String(r.name || 'User').slice(0, 80),
          Math.max(1, Math.min(5, Number(r.rating) || 5)),
          String(r.title || '').slice(0, 120),
          String(r.text || '').slice(0, 1200),
          r.date || new Date().toISOString().slice(0, 10),
          r.created_at || new Date().toISOString(),
          !!r.verified,
          !!r.approved,
          String(r.order_ref),
          JSON.stringify(Array.isArray(r.ordered_items) ? r.ordered_items : []),
          r.product_id != null ? Number(r.product_id) : null,
          r.product_name || null,
          r.product_image || null
        ]
      );
    }

    console.log('✅ JSON data imported to Supabase successfully.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('❌ import-json-to-supabase failed:', err.message);
  process.exit(1);
});

