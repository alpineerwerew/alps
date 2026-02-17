// Alpine Connexion — Bot + API points / récompenses
// - Reçoit les commandes Telegram, les transfère au owner, envoie une confirmation
// - Attribue des points à chaque commande (1 pt par 10 CHF)
// - API pour consulter les points et échanger des récompenses (via initData Telegram)

require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;
const PORT = process.env.PORT || 3000;
const POINTS_PER_10_CURRENCY = Number(process.env.POINTS_PER_10_CURRENCY) || 1; // 1 point per 10 CHF

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing. Set it in server/.env');
  process.exit(1);
}

// ---- Points store (JSON file) ----
const POINTS_FILE = path.join(__dirname, 'points.json');

function loadPoints() {
  try {
    const data = fs.readFileSync(POINTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function savePoints(obj) {
  try {
    fs.writeFileSync(POINTS_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save points.json:', err.message);
  }
}

function addPoints(userId, pointsToAdd) {
  const points = loadPoints();
  const current = Number(points[userId]) || 0;
  points[userId] = current + pointsToAdd;
  savePoints(points);
  return points[userId];
}

function getPoints(userId) {
  const points = loadPoints();
  return Number(points[userId]) || 0;
}

function setPoints(userId, newPoints) {
  const points = loadPoints();
  points[userId] = Math.max(0, Math.floor(newPoints));
  savePoints(points);
  return points[userId];
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

// ---- Rewards (prizes) ----
const REWARDS = [
  { id: 'free_shipping', points: 50, label_fr: 'Livraison offerte', label_en: 'Free shipping', label_de: 'Kostenloser Versand' },
  { id: 'free_product_small', points: 100, label_fr: 'Petit produit offert', label_en: 'Free small product', label_de: 'Kleines Produkt gratis' },
  { id: 'free_product_medium', points: 200, label_fr: 'Produit moyen offert', label_en: 'Free medium product', label_de: 'Mittelgroßes Produkt gratis' }
];

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

// ---- Telegram Bot ----
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('✅ Bot started (long polling)');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  let text = '👋 Bienvenue sur le bot Alpine Connexion.\n\n';
  text += 'Ce bot reçoit les commandes envoyées depuis le catalogue.\n';
  text += `Ton chat ID : \`${chatId}\`. Copie-le dans \`OWNER_CHAT_ID\` dans server/.env pour recevoir les commandes ici.`;
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

const ORDER_PREFIXES = ['🛒 Nouvelle Commande', '🛒 New Order', '🛒 Neue Bestellung'];
function looksLikeOrder(text) {
  if (!text || text.length < 10) return false;
  // Exact start (from catalog)
  if (ORDER_PREFIXES.some((p) => text.startsWith(p))) return true;
  // Fallback: message contains order total line (in case URL was truncated on mobile)
  if (/(?:Total|Gesamt)\s*:\s*[\d.,]+(?:\s*CHF)?/i.test(text) || /[\d.,]+\s*CHF\s*$/m.test(text)) return true;
  return false;
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  if (!looksLikeOrder(text)) return;

  const userId = msg.from?.id;
  const total = parseOrderTotal(text);
  const pointsFromTotal = Math.floor(total / 10) * POINTS_PER_10_CURRENCY;
  const pointsEarned = Math.max(1, pointsFromTotal); // au moins 1 point par commande
  if (userId) {
    const newTotal = addPoints(String(userId), pointsEarned);
    console.log(`Points: user ${userId} total=${total} +${pointsEarned} → ${newTotal}`);
  } else {
    console.warn('Order received but msg.from.id missing, points not attributed');
  }

  const fromLabel = msg.chat.username ? `@${msg.chat.username}` : [msg.chat.first_name, msg.chat.last_name].filter(Boolean).join(' ') || `ID ${chatId}`;

  if (OWNER_CHAT_ID) {
    try {
      await bot.sendMessage(OWNER_CHAT_ID, `📥 Nouvelle commande reçue :\n\n${text}\n\n👤 Client : ${fromLabel}`);
    } catch (err) {
      console.error('❌ Error sending to owner:', err.message);
    }
  }

  let confirm = '✅ Merci, nous avons bien reçu ta commande.\n';
  if (userId && pointsEarned > 0) {
    const balance = getPoints(String(userId));
    confirm += `⭐ Tu as gagné ${pointsEarned} point(s). Solde : ${balance} pts. Ouvre le catalogue pour les échanger !\n\n`;
  }
  confirm += 'Nous te répondrons ici sur Telegram.';
  try {
    await bot.sendMessage(chatId, confirm);
  } catch (err) {
    console.error('❌ Error sending confirmation:', err.message);
  }
});

// ---- Express API ----
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/rewards', (req, res) => {
  res.json(REWARDS);
});

app.get('/api/points', (req, res) => {
  const initData = req.query.initData || req.body?.initData;
  const userId = validateInitData(initData);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  const points = getPoints(String(userId));
  res.json({ points });
});

app.post('/api/points', (req, res) => {
  const initData = req.body?.initData || req.query.initData;
  const userId = validateInitData(initData);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  const points = getPoints(String(userId));
  res.json({ points });
});

app.post('/api/redeem', (req, res) => {
  const initData = req.body?.initData;
  const rewardId = req.body?.rewardId;
  const userId = validateInitData(initData);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  const reward = REWARDS.find((r) => r.id === rewardId);
  if (!reward) {
    return res.status(400).json({ error: 'Unknown reward', points: getPoints(String(userId)) });
  }
  const current = getPoints(String(userId));
  if (current < reward.points) {
    return res.status(400).json({
      error: 'Not enough points',
      points: current,
      required: reward.points
    });
  }
  const newPoints = setPoints(String(userId), current - reward.points);
  res.json({
    points: newPoints,
    message: `Redeemed: ${reward.label_en}. We will apply it to your next order.`
  });
});

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
