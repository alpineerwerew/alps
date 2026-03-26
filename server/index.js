// Alpine Connexion — Bot + catalogue
// - Catalogue (Web App), panier, confirmation de commande sur Telegram
// - Reçoit les commandes, notifie le owner, envoie confirmation + choix de paiement au client

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { Readable } = require('stream');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;
const CATALOG_URL = (process.env.CATALOG_URL || 'https://alpine710.art').replace(/^http:\/\//i, 'https://');
const PORT = process.env.PORT || 3000;
// `all` (défaut) = bot + web dans le même processus. `web` = catalogue/API seuls. `bot` = Telegram seul (recommandé avec `web` pour uptime).
const PROCESS_ROLE_RAW = String(process.env.PROCESS_ROLE || 'all').toLowerCase().trim();
const PROCESS_ROLE = PROCESS_ROLE_RAW === 'web' || PROCESS_ROLE_RAW === 'bot' ? PROCESS_ROLE_RAW : 'all';
const IS_WEB = PROCESS_ROLE === 'all' || PROCESS_ROLE === 'web';
const IS_BOT = PROCESS_ROLE === 'all' || PROCESS_ROLE === 'bot';
if (PROCESS_ROLE_RAW && PROCESS_ROLE_RAW !== 'all' && PROCESS_ROLE_RAW !== 'web' && PROCESS_ROLE_RAW !== 'bot') {
  console.error('❌ PROCESS_ROLE doit être all, web ou bot');
  process.exit(1);
}
console.log(`ℹ️ PROCESS_ROLE=${PROCESS_ROLE} (web=${IS_WEB}, bot=${IS_BOT})`);

// Catalogue : API + pages d’entrée protégés (désactiver en dev navigateur : TELEGRAM_WEBAPP_ONLY=0)
const TELEGRAM_WEBAPP_ONLY = process.env.TELEGRAM_WEBAPP_ONLY !== '0';
const TELEGRAM_HTML_BLOCK = TELEGRAM_WEBAPP_ONLY && process.env.TELEGRAM_HTML_NO_BLOCK !== '1';
const TELEGRAM_HTML_UA_ONLY = process.env.TELEGRAM_HTML_UA_ONLY === '1';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing. Set it in server/.env');
  process.exit(1);
}

// ---- Validate Telegram WebApp initData ----
function validateInitData(initData) {
  if (!initData || !BOT_TOKEN) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const sorted = [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const dataCheckString = sorted.map(([k, v]) => `${k}=${v}`).join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (computedHash !== hash) return null;
  const userStr = params.get('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(decodeURIComponent(userStr));
    return user.id || null;
  } catch (e) {
    return null;
  }
}

function getInitDataUser(initData) {
  if (!initData || !BOT_TOKEN) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const sorted = [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const dataCheckString = sorted.map(([k, v]) => `${k}=${v}`).join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (computedHash !== hash) return null;
  const userStr = params.get('user');
  if (!userStr) return null;
  try {
    return JSON.parse(decodeURIComponent(userStr));
  } catch (e) {
    return null;
  }
}

// ---- Bot users (for broadcast + admin list) ----
const BOT_USERS_FILE = path.join(__dirname, 'bot_users.json');
const CART_ACTIVITY_FILE = path.join(__dirname, 'cart_activity.json');
const BOT_CHAT_LANG_FILE = path.join(__dirname, 'bot_chat_lang.json');
const CART_REMINDERS_FILE = path.join(__dirname, 'cart_reminders.json');
const CASHBACK_WALLETS_FILE = path.join(__dirname, 'cashback_wallets.json');
const ORDER_QUEUE_FILE = path.join(__dirname, 'order_queue.jsonl');

function loadBotUsers() {
  try {
    const data = fs.readFileSync(BOT_USERS_FILE, 'utf8');
    const arr = JSON.parse(data);
    if (!Array.isArray(arr)) return [];
    return arr.map((u) => {
      if (u && typeof u === 'object' && u.chat_id != null) return u;
      const id = Number(u) || u;
      return { chat_id: id, username: null, first_name: null, last_name: null, first_seen: null, last_seen: null };
    });
  } catch (e) {
    return [];
  }
}

function saveBotUsers(users) {
  const list = users.filter((u) => u && String(u.chat_id) !== String(OWNER_CHAT_ID));
  try {
    fs.writeFileSync(BOT_USERS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save bot_users.json:', err.message);
  }
  return list;
}

function addBotUserFromMsg(msg) {
  if (!msg || !msg.chat) return;
  const chatId = msg.chat.id;
  if (!chatId || String(chatId) === String(OWNER_CHAT_ID)) return;
  const from = msg.from || {};
  const username = from.username ? '@' + from.username : null;
  const first_name = from.first_name || null;
  const last_name = from.last_name || null;
  const now = new Date().toISOString();

  const list = loadBotUsers();
  let u = list.find((x) => String(x.chat_id) === String(chatId));
  if (!u) {
    u = { chat_id: chatId, username, first_name, last_name, first_seen: now, last_seen: now };
    list.push(u);
  } else {
    u.username = username != null ? username : u.username;
    u.first_name = first_name != null ? first_name : u.first_name;
    u.last_name = last_name != null ? last_name : u.last_name;
    u.last_seen = now;
  }
  saveBotUsers(list);
}

function addOrUpdateBotUserFromWebAppUser(user) {
  if (!user || !user.id || String(user.id) === String(OWNER_CHAT_ID)) return;
  const chatId = user.id;
  const username = user.username ? '@' + user.username : null;
  const first_name = user.first_name || null;
  const last_name = user.last_name || null;
  const now = new Date().toISOString();

  const list = loadBotUsers();
  let u = list.find((x) => String(x.chat_id) === String(chatId));
  if (!u) {
    u = { chat_id: chatId, username, first_name, last_name, first_seen: now, last_seen: now };
    list.push(u);
  } else {
    u.username = username != null ? username : u.username;
    u.first_name = first_name != null ? first_name : u.first_name;
    u.last_name = last_name != null ? last_name : u.last_name;
    u.last_seen = now;
  }
  saveBotUsers(list);
}

function loadCartActivity() {
  try {
    const data = fs.readFileSync(CART_ACTIVITY_FILE, 'utf8');
    const arr = JSON.parse(data);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && x.chat_id != null)
      .map((x) => ({
        chat_id: x.chat_id,
        username: x.username || null,
        first_name: x.first_name || null,
        last_name: x.last_name || null,
        cart_non_empty: !!x.cart_non_empty,
        items_count: Number(x.items_count) || 0,
        updated_at: x.updated_at || null
      }));
  } catch (e) {
    return [];
  }
}

function saveCartActivity(rows) {
  const list = Array.isArray(rows) ? rows.filter((x) => x && String(x.chat_id) !== String(OWNER_CHAT_ID)) : [];
  try {
    fs.writeFileSync(CART_ACTIVITY_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save cart_activity.json:', err.message);
  }
  return list;
}

function loadCartReminders() {
  try {
    const raw = fs.readFileSync(CART_REMINDERS_FILE, 'utf8');
    const o = JSON.parse(raw);
    return o && typeof o === 'object' ? o : {};
  } catch {
    return {};
  }
}

function saveCartReminders(map) {
  try {
    fs.writeFileSync(CART_REMINDERS_FILE, JSON.stringify(map || {}, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Could not save cart_reminders.json:', e.message);
  }
}

function roundMoneyChf(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

function loadCashbackWallets() {
  try {
    const raw = fs.readFileSync(CASHBACK_WALLETS_FILE, 'utf8');
    const o = JSON.parse(raw);
    if (!o || typeof o !== 'object') return { users: {} };
    const users = o.users && typeof o.users === 'object' && !Array.isArray(o.users) ? o.users : {};
    return { users };
  } catch {
    return { users: {} };
  }
}

function saveCashbackWallets(data) {
  const users = data && data.users && typeof data.users === 'object' ? data.users : {};
  try {
    fs.writeFileSync(CASHBACK_WALLETS_FILE, JSON.stringify({ users }, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save cashback_wallets.json:', err.message);
  }
}

function appendCashbackTransaction(chatId, { delta_chf, kind, note, payment_method }) {
  const id = String(chatId);
  const data = loadCashbackWallets();
  if (!data.users) data.users = {};
  let wallet = data.users[id];
  if (!wallet) {
    wallet = { balance_chf: 0, transactions: [] };
    data.users[id] = wallet;
  }
  if (typeof wallet.balance_chf !== 'number' || Number.isNaN(wallet.balance_chf)) wallet.balance_chf = 0;
  if (!Array.isArray(wallet.transactions)) wallet.transactions = [];

  const newBal = roundMoneyChf(wallet.balance_chf + delta_chf);
  if (newBal < -0.001) {
    const err = new Error('INSUFFICIENT_BALANCE');
    err.code = 'INSUFFICIENT_BALANCE';
    throw err;
  }
  const tx = {
    id: crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    at: new Date().toISOString(),
    delta_chf: roundMoneyChf(delta_chf),
    balance_after: newBal,
    kind: String(kind || 'adjustment').slice(0, 64),
    note: note ? String(note).slice(0, 500) : null,
    payment_method: payment_method ? String(payment_method).slice(0, 32) : null
  };
  wallet.balance_chf = newBal;
  wallet.transactions.unshift(tx);
  if (wallet.transactions.length > 100) wallet.transactions = wallet.transactions.slice(0, 100);
  saveCashbackWallets(data);
  return { wallet, tx };
}

function getCashbackBalance(chatId) {
  const data = loadCashbackWallets();
  const wallet = data.users[String(chatId)];
  const bal = wallet && typeof wallet.balance_chf === 'number' ? wallet.balance_chf : 0;
  return roundMoneyChf(bal);
}

function upsertCartActivity(user, payload) {
  if (!user || !user.id || String(user.id) === String(OWNER_CHAT_ID)) return;
  const now = new Date().toISOString();
  const rows = loadCartActivity();
  let row = rows.find((x) => String(x.chat_id) === String(user.id));
  const itemsCount = Math.max(0, Number(payload?.items_count) || 0);
  const nonEmpty = payload?.cart_non_empty !== undefined ? !!payload.cart_non_empty : itemsCount > 0;

  if (!row) {
    row = {
      chat_id: user.id,
      username: user.username ? '@' + user.username : null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      cart_non_empty: nonEmpty,
      items_count: itemsCount,
      updated_at: now
    };
    rows.push(row);
  } else {
    row.username = user.username ? '@' + user.username : row.username;
    row.first_name = user.first_name || row.first_name;
    row.last_name = user.last_name || row.last_name;
    row.cart_non_empty = nonEmpty;
    row.items_count = itemsCount;
    row.updated_at = now;
  }
  saveCartActivity(rows);
}

function loadChatLangMap() {
  try {
    const raw = fs.readFileSync(BOT_CHAT_LANG_FILE, 'utf8');
    const o = JSON.parse(raw);
    return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

function saveChatLangMap(map) {
  try {
    fs.writeFileSync(BOT_CHAT_LANG_FILE, JSON.stringify(map, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Could not save bot_chat_lang.json:', e.message);
  }
}

function getChatLang(chatId) {
  const v = loadChatLangMap()[String(chatId)];
  return v === 'fr' || v === 'en' || v === 'de' ? v : null;
}

function setChatLang(chatId, lang) {
  if (lang !== 'fr' && lang !== 'en' && lang !== 'de') return;
  const map = loadChatLangMap();
  map[String(chatId)] = lang;
  saveChatLangMap(map);
}

let broadcastPending = false;

// ---- Bot enable/disable (admin control) ----
const BOT_ENABLED_FILE = path.join(__dirname, 'bot_enabled.json');
function loadBotEnabled() {
  try {
    const raw = fs.readFileSync(BOT_ENABLED_FILE, 'utf8');
    const o = JSON.parse(raw);
    return !!o?.enabled;
  } catch {
    return true; // default enabled
  }
}

function saveBotEnabled(enabled) {
  const val = !!enabled;
  try {
    fs.writeFileSync(BOT_ENABLED_FILE, JSON.stringify({ enabled: val }, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Could not save bot_enabled.json:', e.message);
  }
  return val;
}

let botEnabled = loadBotEnabled();
function isBotEnabled() {
  return !!botEnabled;
}

function setBotEnabled(enabled) {
  botEnabled = saveBotEnabled(enabled);
  console.log(`🔧 Telegram bot enabled = ${botEnabled}`);
  return botEnabled;
}

// ---- Parse order total from message text ----
function parseOrderTotal(text) {
  // Match "Total : 123.45 CHF" or "💰 Total : 123.45" or "Gesamt : ..." (FR/EN/DE)
  const m = text.match(/(?:Total|Gesamt)\s*:\s*([\d.,]+)(?:\s*CHF)?/i) ||
    text.match(/([\d.,]+)\s*CHF\s*$/m);
  if (m && m[1]) {
    const num = parseFloat(String(m[1]).replace(/,/g, '.').trim());
    if (!isNaN(num)) return num;
  }
  return 0;
}

// ---- Telegram Bot (PROCESS_ROLE=web → pas de polling ici ; lancer un 2e processus PROCESS_ROLE=bot) ----
let bot = null;

process.on('unhandledRejection', (reason, p) => {
  console.error('❌ Unhandled Rejection:', reason);
});

if (IS_BOT) {
  bot = new TelegramBot(BOT_TOKEN, { polling: true });

  const DEFAULT_COMMANDS = [
    { command: 'start', description: 'Ouvrir le menu' }
  ];

  const OWNER_COMMANDS = [
    ...DEFAULT_COMMANDS,
    { command: 'admin', description: 'Admin (produits)' },
    { command: 'broadcast', description: 'Message à tous' }
  ];

  bot.setMyCommands(DEFAULT_COMMANDS).then(() => console.log('✅ Commandes (défaut) enregistrées')).catch((e) => console.warn('setMyCommands default:', e?.message));
  if (OWNER_CHAT_ID) {
    const ownerId = Number(OWNER_CHAT_ID) || OWNER_CHAT_ID;
    bot.setMyCommands(OWNER_COMMANDS, { scope: { type: 'chat', chat_id: ownerId } })
      .then(() => console.log('✅ Commandes (admin) enregistrées pour owner'))
      .catch((e) => console.warn('setMyCommands owner:', e?.message));
  }

  bot.on('polling_error', (err) => {
    console.error('❌ Telegram polling_error:', err.message);
  });

  console.log('✅ Bot started (long polling)');
} else {
  console.log('ℹ️ PROCESS_ROLE=web : pas de Telegram sur ce processus — lance aussi `alps-bot` (PROCESS_ROLE=bot).');
}

// Image de bienvenue (logo Alpine Connexion — tu peux remplacer par ton image dans .env WELCOME_IMAGE_URL)
const WELCOME_IMAGE_URL = process.env.WELCOME_IMAGE_URL || 'https://res.cloudinary.com/divcybeds/image/upload/v1771239856/Alpine_Connection_Wonka_LETTERING-V01_Logo_2022_o7rhyc.png';

const BOT_STRINGS = {
  fr: {
    choose_lang:
      '👋 Bienvenue !\n\n1️⃣ Choisis ta langue ci-dessous\n2️⃣ Appuie sur MENU\n3️⃣ Ouvre le catalogue\n\n🇫🇷 Français · 🇬🇧 English · 🇩🇪 Deutsch',
    after_lang:
      '✅ Parfait ! Appuie sur MENU → puis sur « Ouvrir le catalogue ».\n\n💡 AIDE = comment commander en 3 étapes.',
    menu_btn: 'MENU',
    help_btn: 'AIDE',
    catalog_prompt: 'Clique pour ouvrir le catalogue :',
    catalog_btn: '🌿 Ouvrir le catalogue',
    order_received: '✅ Commande bien reçue !\n\nPour te recontacter et confirmer, choisis le canal sur lequel tu veux qu’on t’écrive :',
    order_sla_line: '⏱ En général, nous te répondons sous {hours} h.',
    order_btn_signal: 'Signal',
    order_btn_threema: 'Threema',
    order_question_btn: '❓ Question sur ma commande',
    order_question_prompt:
      'Pour une question liée à ta commande, envoie un message ici en t’inspirant de ce modèle :\n\n• Date / heure (approx.)\n• Ton @pseudo ou prénom\n• Ta question\n\nOn te répond dès que possible.',
    order_ask_contact_id: 'Envoie maintenant ton identifiant {channel} (numéro, pseudo ou ID Threema) pour qu’on puisse te joindre.',
    order_contact_saved: 'Merci ! Nous te contacterons sur {channel} pour confirmer ta commande.',
    need_lang: 'Choisis d’abord ta langue avec /start.',
    contact_thanks: 'Merci, nous te recontacterons sur {channel} avec ces coordonnées.',
    menu_contact_reply: 'Pour nous contacter, envoie un message ici. Nous te répondrons au plus vite !',
    menu_infos_reply:
      'Alpine Connexion — Catalogue et commande via Telegram.\n\nAjoute des produits au panier, valide : ta commande est envoyée automatiquement.',
    help_how_to:
      '📖 Commander en 3 étapes :\n1) MENU → ouvrir le catalogue\n2) Ajouter au panier dans la boutique\n3) Envoyer la commande au bot (bouton dans le panier)',
    cart_reminder:
      'Coucou 👋 ton panier t’attend encore. Quand tu veux, ouvre le catalogue et envoie ta commande au bot — sans pression.',
    cart_reminder_cta: 'Une question ? Écris-nous ici, on te répond vite.',
    cart_reminder_question_btn: '❓ Poser une question',
    help_detail: `🌱 Bienvenue sur notre bot !

Découvrez nos produits ainsi que toutes nos vidéos en cliquant ci-dessous ⬇️
@Alpine710_bot

📍 Meetup Valais et alentours
Vérification obligatoire pour les meetup ! 🪪

📦 Expédition en Suisse  📤🌏

✅ Paiement en espèces 💶 (CHF)
✅ Paiement crypto


Pour plus d'informations, contactez-nous !
@Alpine710`
  },
  en: {
    choose_lang:
      '👋 Welcome!\n\n1️⃣ Pick your language below\n2️⃣ Tap MENU\n3️⃣ Open the catalog\n\n🇫🇷 Français · 🇬🇧 English · 🇩🇪 Deutsch',
    after_lang:
      '✅ Great! Tap MENU → then « Open catalog ».\n\n💡 HELP = how to order in 3 steps.',
    menu_btn: 'MENU',
    help_btn: 'HELP',
    catalog_prompt: 'Tap below to open the catalog:',
    catalog_btn: '🌿 Open catalog',
    order_received: '✅ Order received!\n\nChoose how you want us to contact you to confirm:',
    order_sla_line: '⏱ We usually reply within {hours} h.',
    order_btn_signal: 'Signal',
    order_btn_threema: 'Threema',
    order_question_btn: '❓ Question about my order',
    order_question_prompt:
      'For a question about your order, send a message here using this template:\n\n• Date / time (approx.)\n• Your @username or first name\n• Your question\n\nWe’ll get back to you as soon as we can.',
    order_ask_contact_id: 'Send your {channel} identifier now (number, username, or Threema ID) so we can reach you.',
    order_contact_saved: 'Thanks! We’ll contact you on {channel} to confirm your order.',
    need_lang: 'Please choose your language first with /start.',
    contact_thanks: 'Thanks, we will reach you on {channel} with these details.',
    menu_contact_reply: 'Message us here — we’ll reply as soon as we can!',
    menu_infos_reply:
      'Alpine Connexion — catalog and orders via Telegram.\n\nAdd items to your cart, confirm: your order is sent to the bot automatically.',
    help_how_to:
      '📖 Order in 3 steps:\n1) MENU → open catalog\n2) Add to cart in the shop\n3) Send the order to the bot (button in the cart)',
    cart_reminder:
      'Hi 👋 your cart is still waiting. Whenever you’re ready, open the catalog and send your order to the bot — no rush.',
    cart_reminder_cta: 'Questions? Message us here, we reply quickly.',
    cart_reminder_question_btn: '❓ Ask a question',
    help_detail: `🌱 Welcome to our bot!

Find our products and all our videos by clicking below ⬇️
@alpine710

📍 Meet up in Wallis
Verification required for meet ups! 🪪

📦 Shipping to Switzerland  📤🌏

✅ Cash payment 💶 (CHF)
✅ Crypto payment 📱


For more information, contact us!
@Alpine710`
  },
  de: {
    choose_lang:
      '👋 Willkommen!\n\n1️⃣ Wähle unten deine Sprache\n2️⃣ Tippe auf MENU\n3️⃣ Öffne den Katalog\n\n🇫🇷 Français · 🇬🇧 English · 🇩🇪 Deutsch',
    after_lang:
      '✅ Super! MENU → dann « Katalog öffnen ».\n\n💡 HILFE = Bestellen in 3 Schritten.',
    menu_btn: 'MENU',
    help_btn: 'HILFE',
    catalog_prompt: 'Tippe unten, um den Katalog zu öffnen:',
    catalog_btn: '🌿 Katalog öffnen',
    order_received: '✅ Bestellung erhalten!\n\nWähle, wie wir dich zur Bestätigung erreichen sollen:',
    order_sla_line: '⏱ Wir antworten in der Regel innerhalb von {hours} Std.',
    order_btn_signal: 'Signal',
    order_btn_threema: 'Threema',
    order_question_btn: '❓ Frage zu meiner Bestellung',
    order_question_prompt:
      'Bei einer Frage zu deiner Bestellung schreib uns hier, z. B. nach dieser Vorlage:\n\n• Datum / Uhrzeit (ca.)\n• Dein @Name oder Vorname\n• Deine Frage\n\nWir melden uns sobald wie möglich.',
    order_ask_contact_id: 'Sende jetzt deinen {channel}-Identifikator (Nummer, Nutzername oder Threema-ID).',
    order_contact_saved: 'Danke! Wir melden uns bei dir über {channel}, um die Bestellung zu bestätigen.',
    need_lang: 'Bitte wähle zuerst deine Sprache mit /start.',
    contact_thanks: 'Danke, wir melden uns bei dir über {channel} mit diesen Angaben.',
    menu_contact_reply: 'Schreib uns hier — wir antworten schnellstmöglich!',
    menu_infos_reply:
      'Alpine Connexion — Katalog und Bestellung per Telegram.\n\nProdukte in den Warenkorb, bestätigen: die Bestellung geht automatisch an den Bot.',
    help_how_to:
      '📖 Bestellen in 3 Schritten:\n1) MENU → Katalog öffnen\n2) Im Shop in den Warenkorb legen\n3) Bestellung an den Bot senden (Button im Warenkorb)',
    cart_reminder:
      'Hey 👋 dein Warenkorb wartet noch. Wenn du soweit bist: Katalog öffnen und Bestellung an den Bot senden — ganz ohne Druck.',
    cart_reminder_cta: 'Fragen? Schreib uns hier, wir melden uns schnell.',
    cart_reminder_question_btn: '❓ Frage stellen',
    help_detail: `🌱 Willkommen bei unserem Bot!

Entdecke unsere Produkte und alle unsere Videos – tippe unten auf MENU ⬇️
@Alpine710_bot

📍 Meetups im Wallis und Umgebung
Ausweiskontrolle bei Meetups Pflicht! 🪪

📦 Versand in der Schweiz 📤🌏

✅ Barzahlung 💶 (CHF)
✅ Krypto-Zahlung 📱


Mehr Infos? Schreib uns!
@Alpine710`
  }
};

const LANG_PICK_INLINE = {
  reply_markup: {
    inline_keyboard: [[
      { text: 'Français', callback_data: 'lang_fr' },
      { text: 'English', callback_data: 'lang_en' },
      { text: 'Deutsch', callback_data: 'lang_de' }
    ]]
  }
};

function getWelcomeCaption() {
  let c = BOT_STRINGS.fr.choose_lang;
  const promo = (process.env.WELCOME_PROMO_LINE || '').trim();
  if (promo) c += `\n\n${promo}`;
  return c;
}

function getOrderReceivedText(lang) {
  const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
  const base = L.order_received;
  const h = Number(process.env.ORDER_RESPONSE_SLA_HOURS);
  if (!Number.isFinite(h) || h <= 0) return base;
  const line = (L.order_sla_line || '').replace(/\{hours\}/g, String(Math.floor(h)));
  return line ? `${base}\n\n${line}` : base;
}

function getThankYouFollowupLine(lang) {
  const pick = (k) => String(process.env[k] || '').trim();
  const by = { fr: pick('THANK_YOU_LINE_FR'), en: pick('THANK_YOU_LINE_EN'), de: pick('THANK_YOU_LINE_DE') };
  return by[lang] || by.fr || pick('THANK_YOU_LINE');
}

function strLang(chatId) {
  return BOT_STRINGS[getChatLang(chatId) || 'fr'];
}

function getUserKeyboardReplyMarkup(lang) {
  const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
  return {
    // Fallback robuste : MENU est un bouton texte.
    // Quand l'utilisateur clique MENU, le bot répond avec un bouton `web_app` (inline),
    // ce qui marche sur tous les clients Telegram.
    keyboard: [[L.menu_btn, L.help_btn]],
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true
  };
}

function getOpenCatalogInline(lang) {
  const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
  return {
    reply_markup: {
      inline_keyboard: [[{ text: L.catalog_btn, web_app: { url: CATALOG_URL } }]]
    }
  };
}

function getCartReminderInline(lang) {
  const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: L.catalog_btn, web_app: { url: CATALOG_URL } }],
        [{ text: L.cart_reminder_question_btn, callback_data: 'menu_contact' }]
      ]
    }
  };
}

function startCartReminderScheduler() {
  const enabled = process.env.CART_REMINDER_ENABLED !== '0';
  if (!enabled) return;

  const afterMin = Number(process.env.CART_REMINDER_AFTER_MINUTES ?? 15);
  const repeatHours = Number(process.env.CART_REMINDER_REPEAT_HOURS ?? 24);
  const checkSeconds = Number(process.env.CART_REMINDER_CHECK_EVERY_SECONDS ?? 120);

  const afterMs = Math.max(1, afterMin) * 60 * 1000;
  const repeatMs = Math.max(1, repeatHours) * 60 * 60 * 1000;
  const intervalMs = Math.max(20, checkSeconds) * 1000;

  const interval = setInterval(async () => {
    if (!isBotEnabled()) return;

    const activity = loadCartActivity();
    if (!activity.length) return;

    const reminders = loadCartReminders();
    const now = Date.now();
    let changed = false;

    for (const row of activity) {
      const chatId = row?.chat_id;
      if (!chatId) continue;
      if (!row.cart_non_empty) continue;
      if (!row.updated_at) continue;
      const updatedMs = new Date(row.updated_at).getTime();
      if (!updatedMs || Number.isNaN(updatedMs)) continue;
      const ageMs = now - updatedMs;
      if (ageMs < afterMs) continue;

      const key = String(chatId);
      const last = reminders[key]?.lastRemindedAt;
      const lastMs = last ? new Date(last).getTime() : 0;
      if (lastMs && (now - lastMs) < repeatMs) continue;

      const lang = getChatLang(chatId) || 'fr';
      const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
      try {
        await bot.sendMessage(
          chatId,
          `${L.cart_reminder}\n\n${L.cart_reminder_cta}`,
          getCartReminderInline(lang)
        );
        reminders[key] = { lastRemindedAt: new Date().toISOString() };
        changed = true;
      } catch (e) {
        // ignore, we'll retry on next scheduler tick
      }
    }

    if (changed) saveCartReminders(reminders);
  }, intervalMs);

  // prevent unref so pm2 keeps process alive; interval is fine
  return interval;
}

// Start background reminder checks (cart abandoned)
if (IS_BOT) startCartReminderScheduler();

const ADMIN_INLINE = {
  reply_markup: {
    inline_keyboard: [[{ text: 'Produits', callback_data: 'admin_products' }]]
  }
};

function getOrderContactKeyboard(lang) {
  const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: L.order_btn_signal, callback_data: 'order_contact_signal' },
          { text: L.order_btn_threema, callback_data: 'order_contact_threema' }
        ],
        [{ text: L.order_question_btn, callback_data: 'order_question_help' }]
      ]
    }
  };
}

const KNOWN_CMD_RE = /^\/(start|menu|admin|help|broadcast|cancel)(\s|$)/i;
const ORDER_PREFIXES = ['🛒 Nouvelle Commande', '🛒 New Order', '🛒 Neue Bestellung'];
const lastOrderByChat = {};
function looksLikeOrder(text) {
  if (!text || text.length < 10) return false;
  if (ORDER_PREFIXES.some((p) => text.startsWith(p))) return true;
  if (/(?:Total|Gesamt)\s*:\s*[\d.,]+(?:\s*CHF)?/i.test(text) || /[\d.,]+\s*CHF\s*$/m.test(text)) return true;
  return false;
}

function buildHelpMessage(isOwner, lang) {
  const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
  let s = `${L.help_how_to}\n\n${L.help_detail}`;
  if (isOwner) {
    const adminLines = {
      fr: '/admin — Admin produits\n/broadcast — Message à tous les utilisateurs',
      en: '/admin — Product admin\n/broadcast — Message all users',
      de: '/admin — Produkt-Admin\n/broadcast — Nachricht an alle'
    };
    s += '\n\n——— Admin ———\n';
    s += adminLines[lang] || adminLines.fr;
  }
  return s;
}

// Suite commande : attente identifiant Signal / Threema
const contactState = {};

async function deliverQueuedWebOrder(user, orderText) {
  if (!bot) return;
  const userId = user.id;
  lastOrderByChat[userId] = orderText;
  delete contactState[userId];
  const fromLabel = user.username ? `@${user.username}` : [user.first_name, user.last_name].filter(Boolean).join(' ') || `ID ${userId}`;
  if (OWNER_CHAT_ID) {
    try {
      await bot.sendMessage(OWNER_CHAT_ID, `📥 Nouvelle commande reçue :\n\n${orderText}\n\n👤 Client : ${fromLabel}`);
    } catch (err) {
      console.error('❌ Error sending order to owner:', err.message);
    }
  }
  const langOrd = getChatLang(userId) || 'fr';
  const L = BOT_STRINGS[langOrd];
  try {
    await bot.sendMessage(userId, getOrderReceivedText(langOrd), getOrderContactKeyboard(langOrd));
  } catch (err) {
    console.error('❌ Error sending confirmation to user:', err.message);
  }
}

function drainOrderQueueOnce() {
  if (!bot) return;
  try {
    if (!fs.existsSync(ORDER_QUEUE_FILE)) return;
    const workPath = `${ORDER_QUEUE_FILE}.${process.pid}.work`;
    try {
      fs.renameSync(ORDER_QUEUE_FILE, workPath);
    } catch (e) {
      if (e.code === 'ENOENT') return;
      throw e;
    }
    const raw = fs.readFileSync(workPath, 'utf8');
    try {
      fs.unlinkSync(workPath);
    } catch (e) {
      /* ignore */
    }
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      let row;
      try {
        row = JSON.parse(line);
      } catch {
        continue;
      }
      if (row.type !== 'web_order' || !row.user?.id || !row.orderText) continue;
      void deliverQueuedWebOrder(row.user, row.orderText);
    }
  } catch (e) {
    console.error('❌ order_queue drain:', e.message);
  }
}

function enqueueWebOrderSync(user, orderText) {
  const line =
    JSON.stringify({
      type: 'web_order',
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name
      },
      orderText,
      enqueuedAt: new Date().toISOString()
    }) + '\n';
  fs.appendFileSync(ORDER_QUEUE_FILE, line, 'utf8');
}

if (IS_BOT) {
bot.onText(/\/start(?:\s+(.+))?/, async (msg) => {
  const chatId = msg.chat.id;
  const isOwner = String(chatId) === String(OWNER_CHAT_ID);
  if (!isBotEnabled() && !isOwner) return;
  addBotUserFromMsg(msg);
  delete contactState[chatId];
  const caption = getWelcomeCaption();
  try {
    await bot.sendPhoto(chatId, WELCOME_IMAGE_URL, { caption, ...LANG_PICK_INLINE });
  } catch (err) {
    await bot.sendMessage(chatId, caption, LANG_PICK_INLINE);
  }
});

// Réponses aux boutons du menu (bouton Accès boutique ouvre le Web App directement)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  const userId = msg.from?.id;
  const userName = msg.from?.username ? `@${msg.from.username}` : [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(' ') || (userId ? `ID ${userId}` : 'Client');
  const isOwner = String(chatId) === String(OWNER_CHAT_ID);
  if (!isBotEnabled() && !isOwner) return;

  // Identifiant Signal / Threema après une commande (Web App ou message)
  if (contactState[chatId]?.type === 'order' && contactState[chatId]?.awaitingContactId && text && !text.startsWith('/')) {
    const st = contactState[chatId];
    delete contactState[chatId];
    const Lc = strLang(chatId);
    const langOrd = getChatLang(chatId) || 'fr';
    await bot.sendMessage(chatId, Lc.order_contact_saved.replace('{channel}', st.channel));
    const ty = getThankYouFollowupLine(langOrd);
    if (ty) await bot.sendMessage(chatId, ty).catch(() => {});
    const orderSnap = lastOrderByChat[chatId] || '';
    if (OWNER_CHAT_ID) {
      const lines = [];
      lines.push('📇 Identifiant de contact (commande)');
      lines.push('');
      lines.push(`👤 Client : ${userName}`);
      lines.push(`📲 Canal : ${st.channel}`);
      lines.push(`📩 Identifiant : ${text}`);
      lines.push('');
      lines.push('──────────');
      lines.push(orderSnap);
      bot.sendMessage(OWNER_CHAT_ID, lines.join('\n')).catch(() => {});
    }
    return;
  }

  // Owner: /broadcast — demande le message à diffuser
  if (isOwner && /^\/broadcast\s*$/i.test(text)) {
    broadcastPending = true;
    await bot.sendMessage(chatId, '📢 Envoie le message à diffuser à tous les utilisateurs (texte ou photo avec légende).\nAnnule avec /cancel.');
    return;
  }
  if (isOwner && /^\/cancel\s*$/i.test(text)) {
    broadcastPending = false;
    await bot.sendMessage(chatId, 'Annulé.');
    return;
  }
  // Owner en mode broadcast : le message (texte ou photo) est envoyé à tous
  if (isOwner && broadcastPending) {
    broadcastPending = false;
    const users = loadBotUsers();
    if (!users.length) {
      await bot.sendMessage(chatId, 'Aucun utilisateur enregistré (personne n’a encore fait /start ou commandé).');
      return;
    }
    let sent = 0;
    let failed = 0;
    for (const u of users) {
      const id = u && typeof u === 'object' ? u.chat_id : u;
      try {
        if (msg.photo && msg.photo.length) {
          await bot.sendPhoto(id, msg.photo[msg.photo.length - 1].file_id, { caption: msg.caption || '' });
        } else if (msg.text) {
          await bot.sendMessage(id, msg.text);
        } else {
          continue;
        }
        sent++;
      } catch (e) {
        failed++;
      }
    }
    await bot.sendMessage(chatId, `✅ Diffusion terminée : ${sent} envoyé(s), ${failed} échec(s) (${users.length} destinataires).`);
    return;
  }

  // Afficher l'aide / langue : / , /help , commande inconnue
  if (text === '/' || /^\/help\s*$/i.test(text) || (text.startsWith('/') && !KNOWN_CMD_RE.test(text))) {
    const lang = getChatLang(chatId);
    if (!lang) {
      await bot.sendMessage(chatId, BOT_STRINGS.fr.choose_lang, LANG_PICK_INLINE);
      return;
    }
    await bot.sendMessage(chatId, buildHelpMessage(isOwner, lang), { reply_markup: getUserKeyboardReplyMarkup(lang) });
    return;
  }

  const langUi = getChatLang(chatId);
  const textNorm = (text || '').toLowerCase().trim();
  if (textNorm === 'menu' || textNorm === '/menu') {
    if (!langUi) {
      await bot.sendMessage(chatId, BOT_STRINGS.fr.choose_lang, LANG_PICK_INLINE);
      return;
    }
    const L = BOT_STRINGS[langUi];
    await bot.sendMessage(chatId, L.catalog_prompt, getOpenCatalogInline(langUi));
    return;
  }
  if ((text || '').trim() === CATALOG_URL || (text || '').trim() === CATALOG_URL + '/') {
    if (!langUi) {
      await bot.sendMessage(chatId, BOT_STRINGS.fr.choose_lang, LANG_PICK_INLINE);
      return;
    }
    const L = BOT_STRINGS[langUi];
    await bot.sendMessage(chatId, L.catalog_prompt, getOpenCatalogInline(langUi));
    return;
  }
  if (textNorm === 'help' || textNorm === 'aide' || textNorm === 'hilfe') {
    if (!langUi) {
      await bot.sendMessage(chatId, BOT_STRINGS.fr.choose_lang, LANG_PICK_INLINE);
      return;
    }
    await bot.sendMessage(chatId, buildHelpMessage(isOwner, langUi), { reply_markup: getUserKeyboardReplyMarkup(langUi) });
    return;
  }
  if (langUi) {
    const Lb = BOT_STRINGS[langUi];
    if (text === Lb.help_btn) {
      await bot.sendMessage(chatId, buildHelpMessage(isOwner, langUi), { reply_markup: getUserKeyboardReplyMarkup(langUi) });
      return;
    }
  }

  if (looksLikeOrder(text)) {
    lastOrderByChat[chatId] = text;
    delete contactState[chatId];

    const fromLabel = msg.chat.username ? `@${msg.chat.username}` : [msg.chat.first_name, msg.chat.last_name].filter(Boolean).join(' ') || `ID ${chatId}`;
    if (OWNER_CHAT_ID) {
      try {
        await bot.sendMessage(OWNER_CHAT_ID, `📥 Nouvelle commande reçue :\n\n${text}\n\n👤 Client : ${fromLabel}`);
      } catch (err) {
        console.error('❌ Error sending to owner:', err.message);
      }
    }
    addBotUserFromMsg(msg);
    const langOrd = getChatLang(chatId) || 'fr';
    const L = BOT_STRINGS[langOrd];
    try {
      await bot.sendMessage(chatId, getOrderReceivedText(langOrd), getOrderContactKeyboard(langOrd));
    } catch (err) {
      console.error('❌ Error sending confirmation:', err.message);
    }
    return;
  }

  if (String(chatId) === String(OWNER_CHAT_ID) && (textNorm === '/admin' || textNorm === 'admin')) {
    await bot.sendMessage(chatId, 'Admin — Gérer produits (commande /admin uniquement) :', ADMIN_INLINE);
    return;
  }
});

bot.on('callback_query', async (query) => {
  const data = query.data;
  const chatId = query.message?.chat?.id;
  const userId = query.from?.id;
  const userName = query.from?.username ? `@${query.from.username}` : [query.from?.first_name, query.from?.last_name].filter(Boolean).join(' ') || `ID ${userId}`;
  const isOwner = String(chatId) === String(OWNER_CHAT_ID);
  if (!isBotEnabled() && !isOwner) {
    try {
      await bot.answerCallbackQuery(query.id, { text: 'Bot désactivé', show_alert: true });
    } catch (e) {}
    return;
  }

  if (data === 'lang_fr' || data === 'lang_en' || data === 'lang_de') {
    try {
      await bot.answerCallbackQuery(query.id);
    } catch (e) {}
    if (!chatId) return;
    const lang = data.replace('lang_', '');
    setChatLang(chatId, lang);
    const L = BOT_STRINGS[lang];
    await bot.sendMessage(chatId, L.after_lang, { reply_markup: getUserKeyboardReplyMarkup(lang) });
    return;
  }

  if (data === 'order_question_help') {
    try {
      await bot.answerCallbackQuery(query.id);
    } catch (e) {}
    if (!chatId) return;
    const lang = getChatLang(chatId) || 'fr';
    const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
    await bot.sendMessage(chatId, L.order_question_prompt);
    return;
  }

  if (data === 'order_contact_signal' || data === 'order_contact_threema') {
    try {
      await bot.answerCallbackQuery(query.id);
    } catch (e) {}
    if (!chatId) return;
    const channel = data === 'order_contact_signal' ? 'Signal' : 'Threema';
    contactState[chatId] = { type: 'order', awaitingContactId: true, channel };
    const lang = getChatLang(chatId) || 'fr';
    const L = BOT_STRINGS[lang];
    await bot.sendMessage(chatId, L.order_ask_contact_id.replace('{channel}', channel));
    return;
  }

  if (data === 'menu_contact') {
    await bot.answerCallbackQuery(query.id);
    if (!chatId) return;
    const lang = getChatLang(chatId) || 'fr';
    const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
    await bot.sendMessage(chatId, L.menu_contact_reply);
    return;
  }
  if (data === 'menu_infos') {
    await bot.answerCallbackQuery(query.id);
    if (!chatId) return;
    const lang = getChatLang(chatId) || 'fr';
    const L = BOT_STRINGS[lang] || BOT_STRINGS.fr;
    await bot.sendMessage(chatId, L.menu_infos_reply);
    return;
  }
  if (!isOwner) return;
  if (data === 'admin_open') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(chatId, 'Admin — Gerer :', ADMIN_INLINE);
    return;
  }
  if (data === 'admin_products') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(chatId, 'Ouvre l’admin pour modifier les produits (prix, noms, ajout, suppression) :', {
      reply_markup: {
        inline_keyboard: [[{ text: '🛠 Ouvrir l’admin produits', web_app: { url: CATALOG_URL + '/admin.html' } }]]
      }
    });
    return;
  }
});

}

if (IS_BOT) setInterval(drainOrderQueueOnce, 1500);

// ---- Products store (products.json) ----
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

function loadProductsData() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { categories: [], products: [] };
  }
}

function sanitizeBadges(input) {
  const allowed = new Set(['new', 'promotion', 'promo']);
  if (!Array.isArray(input)) return [];
  const out = [];
  for (const x of input) {
    const k = String(x || '').toLowerCase().trim();
    if (!allowed.has(k)) continue;
    if (!out.includes(k)) out.push(k);
  }
  // Normalize promo -> promotion
  return out.map((k) => (k === 'promo' ? 'promotion' : k));
}

function saveProductsData(data) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save products.json:', err.message);
  }
}

// ---- Media proxy (hide CDN origin in catalog) — opt-in: PROXY_MEDIA_URLS=1 ----
const PROXY_MEDIA_URLS = process.env.PROXY_MEDIA_URLS === '1' || process.env.PROXY_MEDIA_URLS === 'true';
const MEDIA_PROXY_MAX_BYTES = 55 * 1024 * 1024;

function getMediaAllowedHosts() {
  const raw = process.env.MEDIA_ALLOWED_HOSTS || 'res.cloudinary.com';
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function canProxyMediaUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const u = new URL(urlString);
    if (u.protocol !== 'https:') return false;
    return getMediaAllowedHosts().includes(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function getPublicCatalogBase(req) {
  const fromEnv = (CATALOG_URL || '').replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0].trim();
  const host = req.get('host');
  if (!host) return '';
  const p = proto === 'http' && host.includes('localhost') ? 'http' : proto.replace(/^http$/i, 'https');
  return `${p}://${host}`;
}

function rewriteMediaUrlForCatalog(u, basePublic) {
  if (!u || !canProxyMediaUrl(u)) return u;
  const b = basePublic.replace(/\/+$/, '');
  return `${b}/api/media?u=${encodeURIComponent(u)}`;
}

function rewriteProductMediaForCatalog(product, basePublic) {
  const p = { ...product };
  if (p.image_url) p.image_url = rewriteMediaUrlForCatalog(p.image_url, basePublic);
  if (p.video_url) p.video_url = rewriteMediaUrlForCatalog(p.video_url, basePublic);
  if (Array.isArray(p.media)) {
    p.media = p.media.map((m) => {
      if (!m || typeof m !== 'object' || !m.url) return m;
      return { ...m, url: rewriteMediaUrlForCatalog(m.url, basePublic) };
    });
  }
  return p;
}

function ensureOwner(req, res) {
  const initData = req.body?.initData || req.query?.initData;
  const userId = validateInitData(initData);
  if (!userId || String(userId) !== String(OWNER_CHAT_ID)) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return userId;
}

function requireTelegramInitForPublicApi(req, res, next) {
  if (!TELEGRAM_WEBAPP_ONLY) return next();
  const initData = req.get('X-Telegram-Init-Data') || req.query?.initData;
  if (!validateInitData(initData)) {
    return res.status(401).json({ error: 'telegram_required' });
  }
  next();
}

// ---- Uploads (photos / vidéos admin) ----
const UPLOAD_DIR = path.join(__dirname, 'uploads');
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (e) {}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = (file.originalname && path.extname(file.originalname)) || (file.mimetype && file.mimetype.startsWith('video/') ? '.mp4' : '.jpg');
    cb(null, `upload_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const uploadMw = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50 MB

// ---- Express API ----
const app = express();
app.set('trust proxy', 1);
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Telegram-Init-Data']
  })
);
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, role: PROCESS_ROLE, t: Date.now() });
});

// Fichiers uploadés accessibles en /uploads/...
app.use('/uploads', express.static(UPLOAD_DIR));

// ---- Upload API (owner only) ----
app.post('/api/upload', uploadMw.single('file'), (req, res) => {
  if (!ensureOwner(req, res)) return;
  if (!req.file || !req.file.filename) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Always use CATALOG_URL (https) to avoid mixed-content issues in Telegram WebApp
  const baseUrl = (CATALOG_URL || '').replace(/\/+$/, '');
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ ok: true, url });
});

// ---- Public config (Signal / Threema links for catalog) ----
app.get('/api/config', requireTelegramInitForPublicApi, (req, res) => {
  res.json({
    signalUrl: process.env.SIGNAL_CONTACT_URL || null,
    threemaUrl: process.env.THREEMA_CONTACT_URL || null
  });
});

app.get('/api/my-cashback', requireTelegramInitForPublicApi, (req, res) => {
  const initData = req.get('X-Telegram-Init-Data') || req.query?.initData;
  const user = getInitDataUser(initData);
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  const id = String(user.id);
  const data = loadCashbackWallets();
  const w = data.users[id];
  const balance_chf = w && typeof w.balance_chf === 'number' ? roundMoneyChf(w.balance_chf) : 0;
  res.json({ ok: true, balance_chf, currency: 'CHF' });
});

// Public media proxy: browser only sees your domain (blocks SSRF via host allowlist)
app.get('/api/media', async (req, res) => {
  const raw = req.query.u;
  if (!raw || typeof raw !== 'string') {
    return res.status(400).send('Bad request');
  }
  let target;
  try {
    target = decodeURIComponent(raw);
  } catch {
    return res.status(400).send('Bad request');
  }
  if (!canProxyMediaUrl(target)) {
    return res.status(403).send('Forbidden');
  }
  try {
    const upstream = await fetch(target, {
      redirect: 'follow',
      headers: { 'User-Agent': 'AlpineCatalogMedia/1.0' }
    });
    if (!upstream.ok) return res.status(502).send('Bad gateway');
    const len = upstream.headers.get('content-length');
    if (len && Number(len) > MEDIA_PROXY_MAX_BYTES) return res.status(413).send('Too large');
    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    if (!upstream.body) return res.status(502).send('Bad gateway');
    Readable.fromWeb(upstream.body).on('error', () => {
      if (!res.headersSent) res.status(502).end();
    }).pipe(res);
  } catch (e) {
    if (!res.headersSent) res.status(502).send('Bad gateway');
  }
});

// ---- Admin: list bot users (for dashboard) ----
app.get('/api/admin/bot-users', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const users = loadBotUsers();
  res.json({ ok: true, users });
});

app.get('/api/admin/cart-activity', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const users = loadBotUsers().map((u) => (u && typeof u === 'object'
    ? u
    : { chat_id: u, username: null, first_name: null, last_name: null, first_seen: null, last_seen: null }));
  const activity = loadCartActivity();
  const byChat = new Map();

  users.forEach((u) => {
    byChat.set(String(u.chat_id), {
      chat_id: u.chat_id,
      username: u.username || null,
      first_name: u.first_name || null,
      last_name: u.last_name || null,
      cart_non_empty: false,
      items_count: 0,
      updated_at: null
    });
  });

  activity.forEach((a) => {
    const key = String(a.chat_id);
    const prev = byChat.get(key) || {
      chat_id: a.chat_id,
      username: null,
      first_name: null,
      last_name: null,
      cart_non_empty: false,
      items_count: 0,
      updated_at: null
    };
    byChat.set(key, {
      ...prev,
      username: a.username || prev.username,
      first_name: a.first_name || prev.first_name,
      last_name: a.last_name || prev.last_name,
      cart_non_empty: !!a.cart_non_empty,
      items_count: Number(a.items_count) || 0,
      updated_at: a.updated_at || prev.updated_at || null
    });
  });

  const rows = [...byChat.values()].sort((a, b) => {
    const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return tb - ta;
  });
  res.json({ ok: true, users: rows });
});

app.get('/api/admin/cashback-wallets', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const botUsers = loadBotUsers();
  const data = loadCashbackWallets();
  const byId = new Map();

  botUsers.forEach((u) => {
    if (!u || u.chat_id == null) return;
    const id = String(u.chat_id);
    const w = data.users[id];
    const balance_chf = w && typeof w.balance_chf === 'number' ? roundMoneyChf(w.balance_chf) : 0;
    const transactions = w && Array.isArray(w.transactions) ? w.transactions.slice(0, 15) : [];
    byId.set(id, {
      chat_id: u.chat_id,
      username: u.username || null,
      first_name: u.first_name || null,
      last_name: u.last_name || null,
      balance_chf,
      transactions
    });
  });

  Object.keys(data.users || {}).forEach((kid) => {
    if (byId.has(kid)) return;
    const w = data.users[kid];
    byId.set(kid, {
      chat_id: kid,
      username: null,
      first_name: null,
      last_name: null,
      balance_chf: w && typeof w.balance_chf === 'number' ? roundMoneyChf(w.balance_chf) : 0,
      transactions: w && Array.isArray(w.transactions) ? w.transactions.slice(0, 15) : []
    });
  });

  const wallets = [...byId.values()].sort((a, b) => b.balance_chf - a.balance_chf);
  res.json({ ok: true, wallets });
});

app.post('/api/admin/cashback-credit', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const chat_id = req.body?.chat_id;
  const amount = Number(req.body?.amount_chf);
  const payment_method = String(req.body?.payment_method || '').toLowerCase().trim();
  const note = req.body?.note;
  if (chat_id == null || String(chat_id) === '' || String(chat_id) === String(OWNER_CHAT_ID)) {
    return res.status(400).json({ error: 'Invalid chat_id' });
  }
  if (payment_method !== 'crypto') {
    return res.status(400).json({
      error: 'cashback_crypto_only',
      message:
        'Le cashback en CHF ne s’applique qu’aux commandes payées en crypto. Pour un paiement cash, ne crédite pas de cashback.'
    });
  }
  if (!amount || amount <= 0 || !Number.isFinite(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (amount > 100000) return res.status(400).json({ error: 'Amount too large' });
  try {
    const { wallet, tx } = appendCashbackTransaction(chat_id, {
      delta_chf: amount,
      kind: 'crypto_cashback',
      note,
      payment_method: 'crypto'
    });
    res.json({ ok: true, balance_chf: wallet.balance_chf, transaction: tx });
  } catch (e) {
    if (e.code === 'INSUFFICIENT_BALANCE') return res.status(400).json({ error: 'insufficient_balance' });
    console.error('cashback-credit:', e.message);
    res.status(500).json({ error: 'save_failed' });
  }
});

app.post('/api/admin/cashback-debit', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const chat_id = req.body?.chat_id;
  const amount = Number(req.body?.amount_chf);
  const note = req.body?.note;
  if (chat_id == null || String(chat_id) === '' || String(chat_id) === String(OWNER_CHAT_ID)) {
    return res.status(400).json({ error: 'Invalid chat_id' });
  }
  if (!amount || amount <= 0 || !Number.isFinite(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (amount > 100000) return res.status(400).json({ error: 'Amount too large' });
  try {
    const { wallet, tx } = appendCashbackTransaction(chat_id, {
      delta_chf: -amount,
      kind: 'redeemed_on_order',
      note
    });
    res.json({ ok: true, balance_chf: wallet.balance_chf, transaction: tx });
  } catch (e) {
    if (e.code === 'INSUFFICIENT_BALANCE') return res.status(400).json({ error: 'insufficient_balance' });
    console.error('cashback-debit:', e.message);
    res.status(500).json({ error: 'save_failed' });
  }
});

// ---- Admin: enable/disable Telegram bot ----
app.get('/api/admin/bot-enabled', (req, res) => {
  if (!ensureOwner(req, res)) return;
  res.json({ ok: true, enabled: isBotEnabled() });
});

app.post('/api/admin/bot-toggle', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const enabled = !!req.body?.enabled;
  const val = setBotEnabled(enabled);
  res.json({ ok: true, enabled: val });
});

// ---- Products API (public read) ----
app.get('/api/products', requireTelegramInitForPublicApi, (req, res) => {
  const data = loadProductsData();
  let products = (data.products || []).slice().sort((a, b) => {
    const sa = Number(a.sort ?? a.id ?? 0);
    const sb = Number(b.sort ?? b.id ?? 0);
    return sa - sb;
  });
  const base = getPublicCatalogBase(req);
  if (PROXY_MEDIA_URLS && base) {
    products = products.map((p) => rewriteProductMediaForCatalog(p, base));
  }
  res.json({ categories: data.categories || [], products });
});

// ---- Products API (owner only: add, update, delete, import) ----
app.post('/api/products', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const product = req.body?.product;
  if (!product || !product.name) {
    return res.status(400).json({ error: 'Product name required' });
  }
  const data = loadProductsData();
  const products = data.products || [];
  const maxId = products.length ? Math.max(...products.map((p) => Number(p.id) || 0)) : 0;
  const maxSort = products.length ? Math.max(...products.map((p) => Number(p.sort) || 0)) : 0;
  const newProduct = {
    id: maxId + 1,
    name: String(product.name).trim(),
    description: String(product.description || '').trim(),
    image_url: product.image_url || null,
    video_url: product.video_url || null,
    media_type: product.media_type || 'image',
    media: Array.isArray(product.media) ? product.media : [],
    gallery_link: product.gallery_link || null,
    sort: Number(product.sort) || (maxSort || maxId * 10 || 10),
    category_id: Number(product.category_id) || 1,
    unit_type: product.unit_type || 'gram',
    pricing: Array.isArray(product.pricing) && product.pricing.length
      ? product.pricing.map((x) => ({ qty: Number(x.qty) || 0, price: Number(x.price) || 0 }))
      : [{ qty: 1, price: 0 }],
    variants: Array.isArray(product.variants) ? product.variants : [],
    badges: sanitizeBadges(product.badges)
  };
  products.push(newProduct);
  data.products = products;
  saveProductsData(data);
  res.json({ ok: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const id = Number(req.params.id);
  const product = req.body?.product;
  if (!product) return res.status(400).json({ error: 'Product data required' });
  const data = loadProductsData();
  const products = data.products || [];
  const idx = products.findIndex((p) => Number(p.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx] = {
    id,
    name: String(product.name ?? products[idx].name).trim(),
    description: String((product.description ?? products[idx].description) || '').trim(),
    image_url: product.image_url !== undefined ? product.image_url : products[idx].image_url,
    video_url: product.video_url !== undefined ? product.video_url : products[idx].video_url,
    media_type: (product.media_type ?? products[idx].media_type) || 'image',
    media: Array.isArray(product.media) ? product.media : (products[idx].media || []),
    gallery_link: product.gallery_link !== undefined ? product.gallery_link : products[idx].gallery_link,
    sort: product.sort !== undefined ? Number(product.sort) || 0 : (products[idx].sort || 0),
    category_id: Number(product.category_id ?? products[idx].category_id) || 1,
    unit_type: (product.unit_type ?? products[idx].unit_type) || 'gram',
    pricing: Array.isArray(product.pricing) && product.pricing.length
      ? product.pricing.map((x) => ({ qty: Number(x.qty) || 0, price: Number(x.price) || 0 }))
      : (products[idx].pricing || [{ qty: 1, price: 0 }]),
    variants: Array.isArray(product.variants) ? product.variants : (products[idx].variants || []),
    badges: product.badges !== undefined ? sanitizeBadges(product.badges) : (products[idx].badges || [])
  };
  data.products = products;
  saveProductsData(data);
  res.json({ ok: true, product: products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const id = Number(req.params.id);
  const data = loadProductsData();
  const products = (data.products || []).filter((p) => Number(p.id) !== id);
  if (products.length === (data.products || []).length) return res.status(404).json({ error: 'Product not found' });
  data.products = products;
  saveProductsData(data);
  res.json({ ok: true });
});

app.post('/api/products/import', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const { products: importedProducts, categories: importedCategories } = req.body || {};
  const data = loadProductsData();
  if (Array.isArray(importedProducts)) data.products = importedProducts;
  if (Array.isArray(importedCategories) && importedCategories.length) data.categories = importedCategories;
  saveProductsData(data);
  res.json({ ok: true, count: (data.products || []).length });
});

// ---- Categories API (owner only) ----
app.post('/api/categories', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const cat = req.body?.category;
  if (!cat || !String(cat.name || '').trim()) {
    return res.status(400).json({ error: 'Category name required' });
  }
  const data = loadProductsData();
  const categories = data.categories || [];
  const maxId = categories.length ? Math.max(...categories.map((c) => Number(c.id) || 0)) : 0;
  const newCat = { id: maxId + 1, name: String(cat.name).trim() };
  categories.push(newCat);
  data.categories = categories;
  saveProductsData(data);
  res.json({ ok: true, category: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const id = Number(req.params.id);
  const cat = req.body?.category;
  if (!cat || !String(cat.name || '').trim()) {
    return res.status(400).json({ error: 'Category name required' });
  }
  const data = loadProductsData();
  const categories = data.categories || [];
  const idx = categories.findIndex((c) => Number(c.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });
  categories[idx] = { ...categories[idx], name: String(cat.name).trim() };
  data.categories = categories;
  saveProductsData(data);
  res.json({ ok: true, category: categories[idx] });
});

app.delete('/api/categories/:id', (req, res) => {
  if (!ensureOwner(req, res)) return;
  const id = Number(req.params.id);
  const data = loadProductsData();
  const categories = (data.categories || []).filter((c) => Number(c.id) !== id);
  if (categories.length === (data.categories || []).length) return res.status(404).json({ error: 'Category not found' });
  data.categories = categories;
  const products = (data.products || []).map((p) => {
    if (Number(p.category_id) === id) return { ...p, category_id: 1 };
    return p;
  });
  data.products = products;
  saveProductsData(data);
  res.json({ ok: true });
});

app.get('/api/admin/check', (req, res) => {
  const initData = req.query.initData || req.body?.initData;
  const userId = validateInitData(initData);
  const isOwner = userId && String(userId) === String(OWNER_CHAT_ID);
  res.json({ ok: isOwner });
});

// ---- Order via API (envoi direct par le bot, sans ouvrir t.me) ----
app.post('/api/order', (req, res) => {
  if (!isBotEnabled()) {
    return res.status(503).json({ error: 'bot_disabled' });
  }
  const initData = req.body?.initData;
  const orderText = req.body?.orderText;
  const cashbackUseRaw = req.body?.cashback_use_chf;
  const user = getInitDataUser(initData);
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  if (!orderText || !looksLikeOrder(orderText)) {
    return res.status(400).json({ error: 'Invalid order' });
  }
  const userId = user.id;
  addOrUpdateBotUserFromWebAppUser(user);
  const cashbackUseChf = roundMoneyChf(Number(cashbackUseRaw) || 0);
  let cashbackDebited = false;
  if (cashbackUseChf < 0) {
    return res.status(400).json({ error: 'invalid_cashback' });
  }
  if (cashbackUseChf > 0) {
    try {
      appendCashbackTransaction(userId, {
        delta_chf: -cashbackUseChf,
        kind: 'auto_used_on_order',
        note: `Order checkout API at ${new Date().toISOString()}`
      });
      cashbackDebited = true;
    } catch (e) {
      if (e.code === 'INSUFFICIENT_BALANCE') {
        return res.status(400).json({ error: 'insufficient_cashback' });
      }
      console.error('❌ cashback-on-order:', e.message);
      return res.status(500).json({ error: 'cashback_save_failed' });
    }
  }

  if (PROCESS_ROLE === 'web') {
    try {
      enqueueWebOrderSync(user, orderText);
    } catch (e) {
      if (cashbackDebited) {
        try {
          appendCashbackTransaction(userId, {
            delta_chf: cashbackUseChf,
            kind: 'rollback_on_queue_error',
            note: 'Rollback cashback after queue_failed'
          });
        } catch (_) {}
      }
      console.error('❌ order_queue:', e.message);
      return res.status(500).json({ error: 'queue_failed' });
    }
    return res.json({ ok: true, queued: true, cashback_balance_chf: getCashbackBalance(userId) });
  }

  const fromLabel = user.username ? `@${user.username}` : [user.first_name, user.last_name].filter(Boolean).join(' ') || `ID ${userId}`;

  if (OWNER_CHAT_ID) {
    bot.sendMessage(OWNER_CHAT_ID, `📥 Nouvelle commande reçue :\n\n${orderText}\n\n👤 Client : ${fromLabel}`).catch((err) => {
      console.error('❌ Error sending order to owner:', err.message);
    });
  }

  lastOrderByChat[userId] = orderText;
  delete contactState[userId];

  const langOrd = getChatLang(userId) || 'fr';
  const L = BOT_STRINGS[langOrd];
  bot.sendMessage(userId, getOrderReceivedText(langOrd), getOrderContactKeyboard(langOrd)).catch((err) => {
    console.error('❌ Error sending confirmation to user:', err.message);
  });

  res.json({ ok: true, cashback_balance_chf: getCashbackBalance(userId) });
});

app.post('/api/cart-activity', (req, res) => {
  const initData = req.body?.initData;
  const user = getInitDataUser(initData);
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  addOrUpdateBotUserFromWebAppUser(user);
  upsertCartActivity(user, req.body || {});
  res.json({ ok: true });
});

// Servir le frontend (catalogue + admin) depuis la racine du projet pour test en local
const staticRoot = path.join(__dirname, '..');

function isCatalogGateHtmlPath(reqPath) {
  const n = String(reqPath || '/')
    .replace(/\\/g, '/')
    .toLowerCase();
  if (n === '/' || n === '') return true;
  return n === '/index.html' || n === '/admin.html';
}

function requestHasTelegramWebAppQuery(req) {
  const q = req.query || {};
  return Object.keys(q).some((k) => k.toLowerCase().startsWith('tgwebapp'));
}

function requestLooksLikeTelegramWebView(req) {
  if (requestHasTelegramWebAppQuery(req)) return true;
  const ua = (req.get('user-agent') || '').toLowerCase();
  if (TELEGRAM_HTML_UA_ONLY) {
    return ua.includes('telegram') || ua.includes('; wv)');
  }
  if (ua.includes('telegram')) return true;
  if (ua.includes('; wv)')) return true;
  const ref = (req.get('referer') || '').toLowerCase();
  if (ref.includes('t.me') || ref.includes('telegram.org') || ref.includes('web.telegram.org')) return true;
  const dest = (req.get('sec-fetch-dest') || '').toLowerCase();
  if (dest === 'iframe') return true;
  return false;
}

function replyCatalogHtmlForbidden(_req, res) {
  res.status(403);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.send(
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Accès restreint</title></head><body style="font-family:system-ui,sans-serif;padding:2rem;max-width:28rem;margin:0 auto;line-height:1.5;"><p>Le catalogue est ouvert uniquement depuis le bot Telegram (Mini App).</p></body></html>'
  );
}

function catalogHtmlSecurityGate(req, res, next) {
  if (!TELEGRAM_HTML_BLOCK) return next();
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (!isCatalogGateHtmlPath(req.path)) return next();
  if (requestLooksLikeTelegramWebView(req)) return next();
  return replyCatalogHtmlForbidden(req, res);
}

function sendPublicHtml(relName) {
  const abs = path.join(staticRoot, relName);
  return (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, private');
    res.sendFile(abs, (err) => (err ? next(err) : undefined));
  };
}

app.use(catalogHtmlSecurityGate);

['get', 'head'].forEach((method) => {
  app[method]('/', sendPublicHtml('index.html'));
  app[method]('/index.html', sendPublicHtml('index.html'));
  app[method]('/admin.html', sendPublicHtml('admin.html'));
});

app.use(express.static(staticRoot, { index: false }));

if (TELEGRAM_WEBAPP_ONLY) {
  console.log('🔐 TELEGRAM_WEBAPP_ONLY : catalogue réservé au bot (API signée + filtre HTML). Local sans Telegram : TELEGRAM_WEBAPP_ONLY=0 dans server/.env');
}

const listenPort = Number(PORT);
const nodeSslCert = process.env.NODE_SSL_CERT;
const nodeSslKey = process.env.NODE_SSL_KEY;
// 0 = désactiver la redirection http→https (ex. tout en 3000 en local)
const httpRedirectPort = Number(process.env.HTTP_REDIRECT_PORT ?? 80);
// Sur certains VPS, sans hôte explicite Node peut n’écouter que sur :: alors que le comportement IPv4/443 (TLS) reste capricieux ; 0.0.0.0 force l’IPv4. Surcharge : LISTEN_HOST=:: ou 127.0.0.1
const listenHostRaw = process.env.LISTEN_HOST;
const listenHost =
  listenHostRaw !== undefined && String(listenHostRaw).trim() !== ''
    ? String(listenHostRaw).trim()
    : nodeSslCert && nodeSslKey
      ? '0.0.0.0'
      : undefined;

function listenOptions(port) {
  return listenHost ? { port, host: listenHost } : { port };
}

function logListenBanner(proto, port) {
  const base = proto === 'https' ? `https://localhost:${port}` : `http://localhost:${port}`;
  console.log(`✅ API + catalogue (${proto}) sur le port ${port}`);
  if (listenHost) console.log(`   bind : ${listenHost}`);
  console.log(`   Catalogue : ${base}/`);
  console.log(`   Admin    : ${base}/admin.html`);
}

if (!IS_WEB) {
  console.log(`🤖 PROCESS_ROLE=${PROCESS_ROLE} : pas d’écoute HTTP sur ce processus (santé : queue commandes web → Telegram).`);
} else if (nodeSslCert && nodeSslKey) {
  let creds;
  try {
    creds = {
      cert: fs.readFileSync(nodeSslCert),
      key: fs.readFileSync(nodeSslKey)
    };
  } catch (e) {
    console.error('❌ Lecture NODE_SSL_CERT / NODE_SSL_KEY impossible :', e.message);
    process.exit(1);
  }
  https.createServer(creds, app).listen(listenOptions(listenPort), () => logListenBanner('https', listenPort));
  if (httpRedirectPort > 0) {
    http
      .createServer((req, res) => {
        const host = req.headers.host || '';
        res.writeHead(301, { Location: `https://${host}${req.url || '/'}` });
        res.end();
      })
      .listen(listenOptions(httpRedirectPort), () => {
        console.log(`✅ HTTP → HTTPS (redirection) sur le port ${httpRedirectPort}${listenHost ? ` (bind ${listenHost})` : ''}`);
      })
      .on('error', (err) => {
        console.warn(`⚠️ Redirection HTTP non démarrée (port ${httpRedirectPort}) :`, err.message);
      });
  }
} else {
  app.listen(listenOptions(listenPort), () => logListenBanner('http', listenPort));
}
