// Simple Telegram bot backend for Alpine Connexion
// - Forwards incoming orders to the shop owner
// - Sends a confirmation back to the customer

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing. Set it in server/.env');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('✅ Bot started with long polling…');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ? `@${msg.chat.username}` : `${msg.chat.first_name || ''} ${msg.chat.last_name || ''}`.trim();

  let text = '👋 Bienvenue sur le bot Alpine Connexion.\n\n';
  text += 'Ce bot reçoit les commandes envoyées depuis le catalogue.\n';
  text += `Ton chat ID est : \`${chatId}\`.\n\n`;
  text += '➡️ Copie/colle ce nombre dans `OWNER_CHAT_ID` dans `server/.env` pour recevoir les commandes ici.';

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// Helpers to detect if a message is an order coming from the WebApp
const ORDER_PREFIXES = [
  '🛒 Nouvelle Commande',
  '🛒 New Order',
  '🛒 Neue Bestellung'
];

function looksLikeOrder(text) {
  if (!text) return false;
  return ORDER_PREFIXES.some((p) => text.startsWith(p));
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';

  if (!looksLikeOrder(text)) {
    // Ignore non-order messages except /start (handled above)
    return;
  }

  const username = msg.chat.username ? `@${msg.chat.username}` : `${msg.chat.first_name || ''} ${msg.chat.last_name || ''}`.trim();
  const fromLabel = username || `ID ${chatId}`;

  // 1) Forward to shop owner (if configured)
  if (OWNER_CHAT_ID) {
    const header = '📥 Nouvelle commande reçue :\n\n';
    const footer = `\n\n👤 Client : ${fromLabel}`;
    try {
      await bot.sendMessage(OWNER_CHAT_ID, `${header}${text}${footer}`);
    } catch (err) {
      console.error('❌ Error sending order to owner:', err.message);
    }
  } else {
    console.warn('⚠️ OWNER_CHAT_ID is not set. Order will not be forwarded to owner.');
  }

  // 2) Confirmation back to customer
  let confirm = '✅ Merci, nous avons bien reçu ta commande.\n';
  confirm += 'Nous te répondrons directement ici sur Telegram.';

  try {
    await bot.sendMessage(chatId, confirm);
  } catch (err) {
    console.error('❌ Error sending confirmation to customer:', err.message);
  }
});

