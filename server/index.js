// Alpine Connexion — Bot + API points / récompenses
// - Reçoit les commandes Telegram, les transfère au owner, envoie une confirmation
// - Attribue des points à chaque commande (1 pt par 10 CHF)
// - API pour consulter les points et échanger des récompenses (via initData Telegram)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const crypto = require('crypto');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;
const CATALOG_URL = (process.env.CATALOG_URL || 'https://alpine710.art').replace(/^http:\/\//i, 'https://'); // Doit être HTTPS pour le bouton Web App
const PORT = process.env.PORT || 3000;
const POINTS_PER_10_CURRENCY = Number(process.env.POINTS_PER_10_CURRENCY) || 1; // 1 point per 10 CHF
const REFERRAL_BONUS = Number(process.env.REFERRAL_BONUS) || 15; // points when someone you referred places first order
const IG_REVIEW_POINTS = Number(process.env.IG_REVIEW_POINTS) || 50; // points for sharing review on IG (after owner approval)

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing. Set it in server/.env');
  process.exit(1);
}

// ---- Points store (JSON file) ----
const POINTS_FILE = path.join(__dirname, 'points.json');
const REFS_FILE = path.join(__dirname, 'refs.json');

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

// ---- Referrals & IG claims (refs.json) ----
function loadRefs() {
  try {
    const data = fs.readFileSync(REFS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { referredBy: {}, igClaimed: {} };
  }
}

function saveRefs(obj) {
  try {
    fs.writeFileSync(REFS_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save refs.json:', err.message);
  }
}

function getReferrer(referredUserId) {
  const refs = loadRefs();
  return refs.referredBy && refs.referredBy[String(referredUserId)] || null;
}

function setReferral(referredUserId, referrerUserId) {
  const refs = loadRefs();
  if (!refs.referredBy) refs.referredBy = {};
  if (refs.referredBy[String(referredUserId)]) return false; // already referred
  refs.referredBy[String(referredUserId)] = String(referrerUserId);
  saveRefs(refs);
  return true;
}

function claimReferralBonus(referredUserId) {
  const refs = loadRefs();
  if (refs.referredBy && refs.referredBy[String(referredUserId)]) {
    delete refs.referredBy[String(referredUserId)];
    saveRefs(refs);
    return true;
  }
  return false;
}

function hasClaimedIg(userId) {
  const refs = loadRefs();
  return !!(refs.igClaimed && refs.igClaimed[String(userId)]);
}

function setIgClaimed(userId) {
  const refs = loadRefs();
  if (!refs.igClaimed) refs.igClaimed = {};
  refs.igClaimed[String(userId)] = true;
  saveRefs(refs);
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

// ---- Reviews (reviews.json) ----
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

function loadReviews() {
  try {
    const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveReviews(arr) {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Could not save reviews.json:', err.message);
  }
}

function addReview(userId, userName, text, rating) {
  const reviews = loadReviews();
  const id = String(Date.now()) + '_' + Math.random().toString(36).slice(2, 9);
  reviews.unshift({
    id,
    userId: String(userId),
    userName: (userName || 'Client').trim().slice(0, 80),
    text: (text || '').trim().slice(0, 2000),
    rating: rating != null ? Math.min(5, Math.max(1, Number(rating))) : null,
    createdAt: new Date().toISOString()
  });
  saveReviews(reviews);
  return reviews[0];
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

// Image de bienvenue (logo Alpine Connexion — tu peux remplacer par ton image dans .env WELCOME_IMAGE_URL)
const WELCOME_IMAGE_URL = process.env.WELCOME_IMAGE_URL || 'https://res.cloudinary.com/divcybeds/image/upload/v1771239856/Alpine_Connection_Wonka_LETTERING-V01_Logo_2022_o7rhyc.png';

// Bouton "Accès boutique" ouvre le catalogue en Web App (pas d'URL envoyée)
const START_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '🌱 Accès boutique', web_app: { url: CATALOG_URL } }],
      ['📞 Contactez-nous'],
      ['📸 Partager avis IG'],
      ['ℹ️ Infos']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const OPEN_CATALOG_INLINE = {
  reply_markup: {
    inline_keyboard: [[{ text: '🛒 Ouvrir le catalogue', web_app: { url: CATALOG_URL } }]]
  }
};

const PAYMENT_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '💵 Cash', callback_data: 'pay_cash' }, { text: '🪙 Crypto', callback_data: 'pay_crypto' }]
    ]
  }
};

function getOrderConfirmText(pointsEarned, balance) {
  let t = '✅ Merci, nous avons bien reçu ta commande.\n';
  if (pointsEarned > 0) t += `⭐ Tu as gagné ${pointsEarned} point(s). Solde : ${balance} pts.\n\n`;
  t += 'Comment souhaites-tu payer ?';
  return t;
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcomeText = '🌱 Bienvenue sur notre bot Alpine Connexion ! 🌿\n\nOuvre le catalogue en cliquant sur le bouton ci-dessous 👇✨';
  try {
    await bot.sendPhoto(chatId, WELCOME_IMAGE_URL, { caption: welcomeText });
  } catch (err) {
    await bot.sendMessage(chatId, welcomeText);
  }
  await bot.sendMessage(chatId, 'Choisis une option :', START_KEYBOARD);
  await bot.sendMessage(chatId, 'Ou ouvre le catalogue ici :', OPEN_CATALOG_INLINE);
});

// Réponses aux boutons du menu (bouton Accès boutique ouvre le Web App directement)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  if (text === '🌱 Accès boutique') {
    await bot.sendMessage(chatId, '🛒 Ouvre le catalogue :', OPEN_CATALOG_INLINE);
    return;
  }
  if (text === '📞 Contactez-nous') {
    bot.sendMessage(chatId, '📞 Pour nous contacter, répondez à ce message ou envoyez-nous un message ici. Nous vous répondrons au plus vite !');
    return;
  }
  if (text === '📸 Partager avis IG') {
    bot.sendMessage(chatId, `📸 Gagne ${IG_REVIEW_POINTS} points !\n\n1) Poste un avis / une review sur Instagram (story ou post)\n2) Envoie-nous le lien de ton post ici.\n\nOn vérifiera et te créditera les points. Une seule fois par personne.`);
    return;
  }
  if (text === 'ℹ️ Infos') {
    bot.sendMessage(chatId, 'ℹ️ Alpine Connexion — Catalogue et commande via Telegram.\n\n• Ajoute des produits au panier sur le catalogue\n• Clique sur « Commander via Telegram » et envoie le message\n• Tu gagnes des points à chaque commande pour les échanger contre des avantages.');
    return;
  }
  // IG review claim: message contains Instagram link (and is not an order)
  if (text.includes('instagram.com') && !looksLikeOrder(text)) {
    const userId = msg.from?.id;
    const username = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || '') + ' ' + (msg.from?.last_name || '');
    if (hasClaimedIg(userId)) {
      bot.sendMessage(chatId, `Tu as déjà reçu les points pour un avis IG. Merci ! 🙏`);
      return;
    }
    if (OWNER_CHAT_ID) {
      try {
        await bot.sendMessage(OWNER_CHAT_ID, `📸 Réclamation avis IG\n\nDe: ${username} (ID: ${userId})\nLien: ${text}\n\nPour approuver et créditer ${IG_REVIEW_POINTS} pts: /approve_ig ${userId}`);
      } catch (err) {
        console.error('Error forwarding IG claim to owner:', err.message);
      }
    }
    bot.sendMessage(chatId, '✅ On a bien reçu ton lien. On vérifie et on te crédite les points dès que c’est validé !');
    return;
  }
});

// Owner only: approve IG review and credit points
bot.onText(/\/approve_ig\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (String(chatId) !== String(OWNER_CHAT_ID)) return;
  const targetUserId = match[1];
  if (hasClaimedIg(targetUserId)) {
    await bot.sendMessage(chatId, 'Cet utilisateur a déjà reçu les points IG.');
    return;
  }
  addPoints(targetUserId, IG_REVIEW_POINTS);
  setIgClaimed(targetUserId);
  await bot.sendMessage(chatId, `✅ ${IG_REVIEW_POINTS} points crédités à l'utilisateur ${targetUserId}.`);
  try {
    await bot.sendMessage(targetUserId, `✅ Ton avis IG a été validé ! Tu as reçu ${IG_REVIEW_POINTS} points. Merci ! 🙏`);
  } catch (e) {
    await bot.sendMessage(chatId, '(Impossible d’envoyer la confirmation à l’utilisateur.)');
  }
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
    // Referral bonus: if this user was referred, credit the referrer once
    const referrerId = getReferrer(String(userId));
    if (referrerId) {
      addPoints(referrerId, REFERRAL_BONUS);
      claimReferralBonus(String(userId));
      console.log(`Referral: credited ${REFERRAL_BONUS} pts to referrer ${referrerId}`);
      try {
        await bot.sendMessage(referrerId, `🎉 Quelqu’un a passé commande avec ton lien de parrainage ! Tu reçois ${REFERRAL_BONUS} points.`);
      } catch (e) { /* user may have blocked bot */ }
    }
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

  const balance = userId ? getPoints(String(userId)) : 0;
  const confirm = getOrderConfirmText(pointsEarned, balance);
  try {
    await bot.sendMessage(chatId, confirm, PAYMENT_KEYBOARD);
  } catch (err) {
    console.error('❌ Error sending confirmation:', err.message);
  }
});

bot.on('callback_query', async (query) => {
  const data = query.data;
  const chatId = query.message?.chat?.id;
  const userId = query.from?.id;
  const userName = query.from?.username ? `@${query.from.username}` : [query.from?.first_name, query.from?.last_name].filter(Boolean).join(' ') || `ID ${userId}`;
  if (data === 'pay_cash' || data === 'pay_crypto') {
    const method = data === 'pay_cash' ? 'Cash' : 'Crypto';
    try {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, `💵 Paiement par ${method} noté. Nous te recontactons ici pour finaliser.`);
    } catch (e) {}
    if (OWNER_CHAT_ID) {
      bot.sendMessage(OWNER_CHAT_ID, `💰 Paiement choisi par ${userName} : ${method}`).catch(() => {});
    }
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

// ---- Referral API ----
app.get('/api/referral/me', (req, res) => {
  const initData = req.query.initData || req.body?.initData;
  const userId = validateInitData(initData);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  const baseUrl = (req.get('x-forwarded-proto') === 'https' ? 'https' : req.protocol) + '://' + (req.get('host') || 'alpine710.art');
  const referralLink = `${baseUrl}?ref=${userId}`;
  res.json({ userId: String(userId), referralLink });
});

app.post('/api/referral/register', (req, res) => {
  const initData = req.body?.initData;
  const referrerId = req.body?.referrerId;
  const userId = validateInitData(initData);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  if (!referrerId || String(referrerId) === String(userId)) {
    return res.status(400).json({ error: 'Invalid referrer' });
  }
  const set = setReferral(String(userId), String(referrerId));
  res.json({ ok: set, message: set ? 'Referral registered' : 'Already referred' });
});

// ---- Reviews API ----
app.get('/api/reviews', (req, res) => {
  const reviews = loadReviews();
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const initData = req.body?.initData;
  const text = req.body?.text;
  const rating = req.body?.rating;
  const user = getInitDataUser(initData);
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  if (!text || String(text).trim().length < 2) {
    return res.status(400).json({ error: 'Text too short' });
  }
  const userName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Client';
  const review = addReview(user.id, userName, text, rating);
  res.json({ ok: true, review });
});

// ---- Order via API (envoi direct par le bot, sans ouvrir t.me) ----
app.post('/api/order', (req, res) => {
  const initData = req.body?.initData;
  const orderText = req.body?.orderText;
  const user = getInitDataUser(initData);
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  if (!orderText || !looksLikeOrder(orderText)) {
    return res.status(400).json({ error: 'Invalid order' });
  }
  const userId = user.id;
  const fromLabel = user.username ? `@${user.username}` : [user.first_name, user.last_name].filter(Boolean).join(' ') || `ID ${userId}`;

  const total = parseOrderTotal(orderText);
  const pointsFromTotal = Math.floor(total / 10) * POINTS_PER_10_CURRENCY;
  const pointsEarned = Math.max(1, pointsFromTotal);
  addPoints(String(userId), pointsEarned);
  const referrerId = getReferrer(String(userId));
  if (referrerId) {
    addPoints(referrerId, REFERRAL_BONUS);
    claimReferralBonus(String(userId));
    bot.sendMessage(referrerId, `🎉 Quelqu'un a passé commande avec ton lien de parrainage ! Tu reçois ${REFERRAL_BONUS} points.`).catch(() => {});
  }

  if (OWNER_CHAT_ID) {
    bot.sendMessage(OWNER_CHAT_ID, `📥 Nouvelle commande reçue :\n\n${orderText}\n\n👤 Client : ${fromLabel}`).catch((err) => {
      console.error('❌ Error sending order to owner:', err.message);
    });
  }

  const balance = getPoints(String(userId));
  const confirm = getOrderConfirmText(pointsEarned, balance);
  bot.sendMessage(userId, confirm, PAYMENT_KEYBOARD).catch((err) => {
    console.error('❌ Error sending confirmation to user:', err.message);
  });

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
