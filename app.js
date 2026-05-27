// Alpine Connexion — App
// Extracted from index.html to keep sections clean.

// =============================================
// 🔧 CONFIGURATION
// =============================================

// 🤖 OPTION 1 : Envoyer à un BOT Telegram (recommandé)
// Créez votre bot avec @BotFather, puis mettez le @username CI-DESSOUS (sans espace)
// Exemple : si BotFather te donne @MonShopBot, mets "MonShopBot"
const TELEGRAM_BOT = "Alpine710_bot";  // ← Remplacez par le @username de VOTRE bot (sans @)
const USE_BOT = true;                  // ← true = utilise le bot | false = utilise username perso

// 👤 OPTION 2 : Envoyer à votre compte Telegram personnel
const TELEGRAM_USERNAME = "alpine710"; // ← Votre @username (si USE_BOT = false)

// 💰 Devise affichée
const CURRENCY = "CHF";

// 🌐 API — en local on utilise l’origine courante, sinon l’URL de prod
const POINTS_API_URL = (typeof window !== "undefined" && window.location.origin)
  ? window.location.origin
  : "https://alpine710.art";

// =============================================
// 🌐 LANGUES / I18N
// =============================================

const SUPPORTED_LANGS = ['fr', 'en', 'de'];
const DEFAULT_LANG = 'fr';

const I18N = {
    fr: {
        filter_all: '📂 Toutes les catégories',
        cart_title: '🛒 Panier',
        btn_add_cart: 'Ajouter au panier',
        toast_added: '✓ Ajouté au panier',
        cart_empty: 'Ton panier est vide',
        total_label: 'Total',
        btn_checkout: '📩 Commander via Telegram',
        order_header: '🛒 Nouvelle Commande',
        order_total: '💰 Total',
        choose_variant: 'Choisis ta variante',
        choose_qty: 'Choisis ta quantité',
        price_from_prefix: 'dès ',
        filter_all_short: 'Tout',
        hint_choose_qty: 'Sélectionne une quantité pour continuer',
        hint_choose_variant: 'Sélectionne au moins une variante',
        empty_show_all: 'Voir tout le catalogue',
        no_products: 'Aucun produit trouvé',
        open_in_telegram: 'Ouvre depuis Telegram',
        error_catalog_access: 'Impossible d’accéder au catalogue. Ouvre l’application depuis le bot Telegram.',
        checkout_hint: 'Envoie le message dans Telegram pour confirmer ta commande.',
        nav_catalog: 'Catalogue',
        order_sent: 'Commande envoyée ! Un message de confirmation t’attend dans le chat du bot.',
        or_contact_signal_threema: 'Liens directs (optionnel) :',
        copy_paste_order: 'Copie la commande ci-dessous et colle-la dans le chat.',
        cart_how_to_send: 'Pour valider ta commande :',
        cart_step_submit: '1. Envoie la commande au bot Telegram',
        cart_btn_submit: '📩 Envoyer la commande au bot',
        cart_bot_followup: 'Tu recevras une confirmation dans Telegram. Nous te recontacterons sur ton contact enregistré (Signal ou Threema).',
        cart_step_copy: 'Optionnel — copie du texte',
        cart_btn_copy: 'Copier la commande',
        cart_btn_clear_saved: 'Vider le panier sauvegardé',
        cart_need_telegram: 'Ouvre le catalogue depuis Telegram pour envoyer la commande.',
        order_send_failed: 'Envoi impossible. Réessaie dans un instant.',
        open_signal: 'Signal',
        open_threema: 'Threema',
        age_gate_title: '🔞 Accès réservé aux 18 ans et +',
        age_gate_text: 'En entrant, tu confirmes avoir 18 ans ou plus et accepter du contenu pour adultes.',
        age_gate_accept: 'J’ai 18 ans ou plus',
        age_gate_decline: 'Quitter',
        cashback_chip_short: 'Cashback',
        cashback_modal_title: 'Cashback crypto & crédit perso',
        cashback_modal_body: `Comment ça marche :

1) Cashback uniquement si tu paies en crypto (ex: BTC).
2) Nous validons le paiement, puis nous ajoutons le crédit manuellement.
3) Le crédit est lié à ton compte Telegram et s’utilise sur une prochaine commande.

Taux cashback :
• Commande < 1 000 CHF → 5 %
• Commande >= 1 000 CHF → 10 %

Important :
• Paiement cash = 0 cashback`,
        cashback_modal_ok: 'Compris',
        cashback_auto_apply: 'Utiliser automatiquement mon crédit cashback',
        cashback_discount_label: 'Cashback appliqué',
        loyalty_discount_label: 'Réduction fidélité',
        cashback_subtotal_label: 'Sous-total',
        cashback_payable_label: 'Total à payer',
        rounded_total_note: 'Total final arrondi au CHF le plus proche',
        cashback_insufficient: 'Solde cashback insuffisant.',
        cashback_applied_to_order: 'Cashback appliqué',
        contact_edit_btn: 'Contact',
        onboarding_progress_step_1: 'Étape 1 sur 3',
        onboarding_progress_step_2: 'Étape 2 sur 3',
        onboarding_progress_step_3: 'Étape 3 sur 3',
        contact_method_title: 'Choisis ton canal de contact',
        contact_method_text: 'Sélectionne le moyen de contact préféré pour la confirmation de commande.',
        contact_method_next: 'Continuer',
        contact_method_back: 'Retour',
        contact_input_title: 'Ajoute ton contact',
        contact_input_text: 'Ce contact sera ajouté automatiquement à chaque commande.',
        contact_input_label_signal: 'Numéro Signal',
        contact_input_label_threema: 'ID Threema',
        contact_input_placeholder_signal: 'Enter your Signal number',
        contact_input_placeholder_threema: 'Enter your Threema ID',
        contact_input_save: 'Valider l’accès',
        contact_input_error_required: 'Champ requis (3 caractères minimum).',
        contact_input_error_method: 'Choisis d’abord Signal ou Threema.',
        order_id_label: '🧾 Référence',
        order_customer_contact: '📞 Contact client',
        order_contact_missing: 'non fourni',
        order_payment_label: 'Paiement',
        order_fulfillment_label: 'Récupération',
        checkout_payment_title: 'Moyen de paiement',
        checkout_fulfillment_title: 'Moyen de récupération',
        order_payment_cash: 'Cash',
        order_payment_btc: 'BTC',
        order_fulfillment_envoi: 'Envoi',
        order_fulfillment_meetup: 'Meetup',
        checkout_options_required: 'Choisis un moyen de paiement et un moyen de récupération avant d’envoyer.',
        checkout_sending: 'Envoi en cours…',
        cart_checkout_prep_title: 'Après avoir validé',
        order_success_title: 'Commande bien reçue',
        order_success_ref: 'Référence : {ref}',
        order_success_step1: 'Ouvre Telegram pour voir la confirmation (bouton ci-dessous).',
        order_success_step2: 'Nous te recontactons sur ton Signal ou Threema enregistré pour confirmer.',
        order_success_bot_note: 'Un message de confirmation t’a aussi été envoyé dans Telegram.',
        order_success_btn: 'Ouvrir le chat Telegram',
        order_success_close: 'Rester sur le catalogue'
    },
    en: {
        filter_all: '📂 All categories',
        cart_title: '🛒 Cart',
        btn_add_cart: 'Add to cart',
        toast_added: '✓ Added to cart',
        cart_empty: 'Your cart is empty',
        total_label: 'Total',
        btn_checkout: '📩 Order via Telegram',
        order_header: '🛒 New Order',
        order_total: '💰 Total',
        choose_variant: 'Choose your variant',
        choose_qty: 'Choose your quantity',
        price_from_prefix: 'from ',
        filter_all_short: 'All',
        hint_choose_qty: 'Select a quantity to continue',
        hint_choose_variant: 'Select at least one variant',
        empty_show_all: 'Show full catalog',
        no_products: 'No products found',
        open_in_telegram: 'Open from Telegram',
        error_catalog_access: 'Cannot load the catalog. Open the app from the Telegram bot.',
        checkout_hint: 'Send the message in Telegram to confirm your order.',
        nav_catalog: 'Catalog',
        order_sent: 'Order sent! A confirmation message is waiting in the bot chat.',
        or_contact_signal_threema: 'Direct links (optional):',
        copy_paste_order: 'Copy the order below and paste it in the chat.',
        cart_how_to_send: 'To place your order:',
        cart_step_submit: '1. Send the order to the Telegram bot',
        cart_btn_submit: '📩 Send order to bot',
        cart_bot_followup: 'You’ll get a confirmation in Telegram. We’ll reach you on your saved contact (Signal or Threema).',
        cart_step_copy: 'Optional — copy text',
        cart_btn_copy: 'Copy order',
        cart_btn_clear_saved: 'Clear saved cart',
        cart_need_telegram: 'Open the catalog from Telegram to send your order.',
        order_send_failed: 'Could not send. Please try again.',
        open_signal: 'Signal',
        open_threema: 'Threema',
        age_gate_title: '🔞 Access is restricted to 18+',
        age_gate_text: 'By entering, you confirm that you are 18 years old or above and accept adult content.',
        age_gate_accept: 'I am 18+',
        age_gate_decline: 'Leave',
        cashback_chip_short: 'Cashback',
        cashback_modal_title: 'Crypto cashback & your balance',
        cashback_modal_body: `How it works:

1) Cashback applies only to crypto payments (e.g. BTC).
2) After payment is confirmed, we add the credit manually.
3) Credit is linked to your Telegram account and used on a future order.

Cashback rates:
• Order < 1,000 CHF -> 5%
• Order >= 1,000 CHF -> 10%

Important:
• Cash payment = 0 cashback`,
        cashback_modal_ok: 'Got it',
        cashback_auto_apply: 'Automatically use my cashback credit',
        cashback_discount_label: 'Cashback applied',
        loyalty_discount_label: 'Loyalty discount',
        cashback_subtotal_label: 'Subtotal',
        cashback_payable_label: 'Total to pay',
        rounded_total_note: 'Final total rounded to nearest CHF',
        cashback_insufficient: 'Cashback balance is insufficient.',
        cashback_applied_to_order: 'Cashback used',
        contact_edit_btn: 'Contact',
        onboarding_progress_step_1: 'Step 1 of 3',
        onboarding_progress_step_2: 'Step 2 of 3',
        onboarding_progress_step_3: 'Step 3 of 3',
        contact_method_title: 'Choose your contact method',
        contact_method_text: 'Select your preferred channel for order confirmation.',
        contact_method_next: 'Continue',
        contact_method_back: 'Back',
        contact_input_title: 'Add your contact',
        contact_input_text: 'This contact is automatically attached to each order.',
        contact_input_label_signal: 'Signal number',
        contact_input_label_threema: 'Threema ID',
        contact_input_placeholder_signal: 'Enter your Signal number',
        contact_input_placeholder_threema: 'Enter your Threema ID',
        contact_input_save: 'Unlock catalog',
        contact_input_error_required: 'Required field (minimum 3 characters).',
        contact_input_error_method: 'Please choose Signal or Threema first.',
        order_id_label: '🧾 Order ID',
        order_customer_contact: '📞 Customer contact',
        order_contact_missing: 'not provided',
        order_payment_label: 'Payment',
        order_fulfillment_label: 'Fulfillment',
        checkout_payment_title: 'Payment method',
        checkout_fulfillment_title: 'Delivery / pickup',
        order_payment_cash: 'Cash',
        order_payment_btc: 'BTC',
        order_fulfillment_envoi: 'Shipping',
        order_fulfillment_meetup: 'Meetup',
        checkout_options_required: 'Select a payment method and fulfillment option before sending.',
        checkout_sending: 'Sending…',
        cart_checkout_prep_title: 'After you confirm',
        order_success_title: 'Order received',
        order_success_ref: 'Reference: {ref}',
        order_success_step1: 'Open Telegram to see the confirmation (button below).',
        order_success_step2: 'We’ll contact you on your saved Signal or Threema to confirm.',
        order_success_bot_note: 'A confirmation message was also sent in Telegram.',
        order_success_btn: 'Open Telegram chat',
        order_success_close: 'Stay on catalog'
    },
    de: {
        filter_all: '📂 Alle Kategorien',
        cart_title: '🛒 Warenkorb',
        btn_add_cart: 'In den Warenkorb',
        toast_added: '✓ Zum Warenkorb hinzugefügt',
        cart_empty: 'Dein Warenkorb ist leer',
        total_label: 'Gesamt',
        btn_checkout: '📩 Über Telegram bestellen',
        order_header: '🛒 Neue Bestellung',
        order_total: '💰 Gesamt',
        choose_variant: 'Variante wählen',
        choose_qty: 'Menge wählen',
        price_from_prefix: 'ab ',
        filter_all_short: 'Alle',
        hint_choose_qty: 'Wähle eine Menge, um fortzufahren',
        hint_choose_variant: 'Wähle mindestens eine Variante',
        empty_show_all: 'Gesamten Katalog anzeigen',
        no_products: 'Keine Produkte gefunden',
        open_in_telegram: 'Öffne über Telegram',
        error_catalog_access: 'Katalog nicht erreichbar. Öffne die App über den Telegram-Bot.',
        checkout_hint: 'Sende die Nachricht in Telegram, um deine Bestellung zu bestätigen.',
        nav_catalog: 'Katalog',
        order_sent: 'Bestellung gesendet! Eine Bestätigung wartet im Bot-Chat.',
        or_contact_signal_threema: 'Direktlinks (optional):',
        copy_paste_order: 'Kopiere die Bestellung unten und füge sie im Chat ein.',
        cart_how_to_send: 'So bestellst du:',
        cart_step_submit: '1. Bestellung an den Telegram-Bot senden',
        cart_btn_submit: '📩 Bestellung an Bot senden',
        cart_bot_followup: 'Du erhältst eine Bestätigung in Telegram. Wir melden uns über deinen gespeicherten Kontakt (Signal oder Threema).',
        cart_step_copy: 'Optional — Text kopieren',
        cart_btn_copy: 'Bestellung kopieren',
        cart_btn_clear_saved: 'Gespeicherten Warenkorb leeren',
        cart_need_telegram: 'Öffne den Katalog über Telegram, um die Bestellung zu senden.',
        order_send_failed: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
        open_signal: 'Signal',
        open_threema: 'Threema',
        age_gate_title: '🔞 Zugang nur für Personen ab 18',
        age_gate_text: 'Mit dem Eintritt bestätigst du, dass du mindestens 18 Jahre alt bist und Inhalte für Erwachsene akzeptierst.',
        age_gate_accept: 'Ich bin 18+',
        age_gate_decline: 'Verlassen',
        cashback_chip_short: 'Cashback',
        cashback_modal_title: 'Krypto-Cashback & Guthaben',
        cashback_modal_body: `So funktioniert es:

1) Cashback gilt nur bei Krypto-Zahlung (z. B. BTC).
2) Nach bestätigtem Zahlungseingang schreiben wir das Guthaben manuell gut.
3) Das Guthaben ist an dein Telegram-Konto gebunden und gilt für eine spätere Bestellung.

Cashback-Saetze:
• Bestellung < 1.000 CHF -> 5%
• Bestellung >= 1.000 CHF -> 10%

Wichtig:
• Barzahlung = 0 Cashback`,
        cashback_modal_ok: 'Alles klar',
        cashback_auto_apply: 'Mein Cashback-Guthaben automatisch nutzen',
        cashback_discount_label: 'Cashback verwendet',
        loyalty_discount_label: 'Treuerabatt',
        cashback_subtotal_label: 'Zwischensumme',
        cashback_payable_label: 'Zu zahlen',
        rounded_total_note: 'Endbetrag auf den naechsten CHF gerundet',
        cashback_insufficient: 'Cashback-Guthaben ist nicht ausreichend.',
        cashback_applied_to_order: 'Cashback genutzt',
        contact_edit_btn: 'Kontakt',
        onboarding_progress_step_1: 'Schritt 1 von 3',
        onboarding_progress_step_2: 'Schritt 2 von 3',
        onboarding_progress_step_3: 'Schritt 3 von 3',
        contact_method_title: 'Kontaktmethode waehlen',
        contact_method_text: 'Waehle deinen bevorzugten Kanal fuer die Bestellbestaetigung.',
        contact_method_next: 'Weiter',
        contact_method_back: 'Zurueck',
        contact_input_title: 'Kontakt eingeben',
        contact_input_text: 'Dieser Kontakt wird automatisch zu jeder Bestellung hinzugefuegt.',
        contact_input_label_signal: 'Signal-Nummer',
        contact_input_label_threema: 'Threema-ID',
        contact_input_placeholder_signal: 'Enter your Signal number',
        contact_input_placeholder_threema: 'Enter your Threema ID',
        contact_input_save: 'Katalog freischalten',
        contact_input_error_required: 'Pflichtfeld (mindestens 3 Zeichen).',
        contact_input_error_method: 'Bitte zuerst Signal oder Threema waehlen.',
        order_id_label: '🧾 Bestell-ID',
        order_customer_contact: '📞 Kundenkontakt',
        order_contact_missing: 'nicht angegeben',
        order_payment_label: 'Zahlung',
        order_fulfillment_label: 'Abholung / Versand',
        checkout_payment_title: 'Zahlungsart',
        checkout_fulfillment_title: 'Lieferung / Meetup',
        order_payment_cash: 'Bar',
        order_payment_btc: 'BTC',
        order_fulfillment_envoi: 'Versand',
        order_fulfillment_meetup: 'Meetup',
        checkout_options_required: 'Waehle Zahlungsart und Lieferoption vor dem Senden.',
        checkout_sending: 'Wird gesendet…',
        cart_checkout_prep_title: 'Nach der Bestaetigung',
        order_success_title: 'Bestellung erhalten',
        order_success_ref: 'Referenz: {ref}',
        order_success_step1: 'Oeffne Telegram fuer die Bestaetigung (Button unten).',
        order_success_step2: 'Wir melden uns ueber deinen gespeicherten Signal- oder Threema-Kontakt.',
        order_success_bot_note: 'Eine Bestaetigung wurde dir auch in Telegram gesendet.',
        order_success_btn: 'Telegram-Chat oeffnen',
        order_success_close: 'Im Katalog bleiben'
    }
};

function getInitialLang() {
    try {
        const saved = localStorage.getItem('ac_lang');
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch (e) {}
    const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.startsWith('en')) return 'en';
    if (nav.startsWith('de')) return 'de';
    return DEFAULT_LANG;
}

let currentLang = getInitialLang();

function t(key) {
    const currentPack = I18N[currentLang] || I18N[DEFAULT_LANG] || {};
    if (currentPack[key]) return currentPack[key];
    const defaultPack = I18N[DEFAULT_LANG] || {};
    return defaultPack[key] || key;
}

function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    try {
        localStorage.setItem('ac_lang', lang);
    } catch (e) {}
    applyTranslations();
    renderProducts();
}

function getInitData() {
    const tg = window.Telegram?.WebApp;
    return (tg && tg.initData) ? tg.initData : '';
}

function hapticLight() {
    try {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch (e) {}
}

function hapticSuccess() {
    try {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (e) {}
}

function getTelegramUserIdFromInitData() {
    try {
        const initData = getInitData();
        if (!initData) return null;
        const params = new URLSearchParams(initData);
        const userRaw = params.get('user');
        if (!userRaw) return null;
        const user = JSON.parse(decodeURIComponent(userRaw));
        return user && user.id != null ? String(user.id) : null;
    } catch (e) {
        return null;
    }
}

function getCartStorageKey() {
    const userId = getTelegramUserIdFromInitData();
    return `ac_cart_${userId || 'guest'}`;
}

function saveCartToStorage() {
    try {
        localStorage.setItem(getCartStorageKey(), JSON.stringify(Array.isArray(cart) ? cart : []));
    } catch (e) {}
}

function formatUnitDisplay(item) {
    const label = item?.unit_label && String(item.unit_label).trim();
    if (label) return label;
    if (item?.unit_type === 'gram') return 'g';
    if (item?.unit_type === 'unit') {
        return currentLang === 'en' ? 'unit(s)' : currentLang === 'de' ? 'Einheit(en)' : 'unité(s)';
    }
    return 'g';
}

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(getCartStorageKey());
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        cart = parsed
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
                const unitLabel = item.unit_label ? String(item.unit_label).trim().slice(0, 20) : null;
                let unitType = item.unit_type === 'unit' ? 'unit' : (item.unit_type === 'custom' ? 'custom' : 'gram');
                if (unitLabel) unitType = 'custom';
                return {
                    name: String(item.name || ''),
                    unit_type: unitType,
                    unit_label: unitLabel || null,
                    qty: Number(item.qty) || 0,
                    price: Number(item.price) || 0,
                    variant: item.variant ? String(item.variant) : null
                };
            })
            .filter((item) => item.name && item.qty > 0 && item.price >= 0);
    } catch (e) {}
}

function isTelegramWebApp() {
    return !!(window.Telegram && window.Telegram.WebApp);
}

function catalogApiHeaders() {
    const init = getInitData();
    const h = {};
    if (init) h['X-Telegram-Init-Data'] = init;
    return h;
}

async function waitForInitData(maxMs = 2800) {
    const step = 80;
    let t = 0;
    while (t < maxMs) {
        if (getInitData()) return true;
        await new Promise((r) => setTimeout(r, step));
        t += step;
    }
    return !!getInitData();
}

function showCatalogAccessError(messageKey) {
    const appEl = document.getElementById('app');
    const fab = document.getElementById('cart-fab');
    const err = document.getElementById('catalog-access-error');
    const msgEl = document.getElementById('catalog-access-error-msg');
    if (appEl) appEl.classList.add('hidden');
    if (fab) fab.classList.add('hidden');
    if (err) err.classList.remove('hidden');
    if (msgEl) msgEl.textContent = t(messageKey || 'error_catalog_access');
}

function applyTranslations() {
    // Attribut lang sur <html>
    if (document.documentElement) {
        document.documentElement.lang = currentLang;
    }

    refreshCategoryChips();

    // Titre du panier
    const cartTitle = document.getElementById('cart-title');
    if (cartTitle) {
        cartTitle.textContent = t('cart_title');
    }

    // Bouton langue
    const langSelect = document.getElementById('lang-switch');
    if (langSelect) {
        langSelect.value = currentLang;
    }

    // Bouton d'ajout au panier si la modal est ouverte
    const addBtn = document.getElementById('btn-add');
    if (addBtn) {
        addBtn.textContent = t('btn_add_cart');
    }
    const navCatalogLabel = document.getElementById('nav-catalog-label');
    if (navCatalogLabel) navCatalogLabel.textContent = t('nav_catalog');

    const editContactBtn = document.getElementById('btn-edit-contact');
    if (editContactBtn) editContactBtn.textContent = t('contact_edit_btn');

    const gate = document.getElementById('age-gate');
    if (gate && !gate.classList.contains('hidden')) {
        const stored = getStoredOnboarding();
        refreshOnboardingTexts(stored?.contactMethod || 'signal');
        setOnboardingStepUi(currentOnboardingStep || 1);
    }

    const osTitle = document.getElementById('order-success-title');
    if (osTitle) osTitle.textContent = t('order_success_title');
    const osNote = document.getElementById('order-success-note');
    if (osNote) osNote.textContent = t('order_success_bot_note');
    const osBtn = document.getElementById('order-success-btn');
    if (osBtn) osBtn.textContent = t('order_success_btn');
    const osClose = document.getElementById('order-success-close');
    if (osClose) osClose.textContent = t('order_success_close');

    const cartOverlay = document.getElementById('cart-overlay');
    if (cart.length && cartOverlay?.classList.contains('active')) renderCart();
}

function getTelegramDestination() {
    const raw = USE_BOT ? TELEGRAM_BOT : TELEGRAM_USERNAME;
    // Si jamais tu as mis "@MonBot" par erreur, on enlève le @ pour construire l'URL
    return String(raw || '').replace(/^@+/, '');
}

const CATEGORIES = [
    { id: 1, name: "Flower 🌸" },
    { id: 2, name: "Live Rosin 🍯" },
    { id: 3, name: "Static Hash ⚡" },
    { id: 4, name: "Water Hash 🧊" },
    { id: 5, name: "Vapes 💨" }
];

// =============================================
// 📦 PRODUITS — Fallback si l'API ne renvoie rien (sinon chargés depuis l'API)
// =============================================
let catalogProducts = [];
let catalogCategories = [];
let catalogLoading = false;

const PRODUCTS = [];

// =============================================
// 🔒 CODE APP — NE PAS MODIFIER
// =============================================
let cart = [];
let checkoutInFlight = false;
let checkoutPayment = '';
let checkoutFulfillment = '';
const CHECKOUT_PREFS_KEY = 'alps_checkout_prefs';

function loadCheckoutPrefs() {
    try {
        const o = JSON.parse(sessionStorage.getItem(CHECKOUT_PREFS_KEY) || '{}');
        if (o.payment === 'cash' || o.payment === 'btc') checkoutPayment = o.payment;
        if (o.fulfillment === 'envoi' || o.fulfillment === 'meetup') checkoutFulfillment = o.fulfillment;
    } catch (e) { /* ignore */ }
}

function saveCheckoutPrefs() {
    try {
        sessionStorage.setItem(CHECKOUT_PREFS_KEY, JSON.stringify({
            payment: checkoutPayment,
            fulfillment: checkoutFulfillment
        }));
    } catch (e) { /* ignore */ }
}

function readCheckoutOptionsFromDom() {
    const p = document.querySelector('input[name="checkout-payment"]:checked');
    const f = document.querySelector('input[name="checkout-fulfillment"]:checked');
    checkoutPayment = p?.value === 'cash' || p?.value === 'btc' ? p.value : '';
    checkoutFulfillment = f?.value === 'envoi' || f?.value === 'meetup' ? f.value : '';
    saveCheckoutPrefs();
}

function onCheckoutOptionChange() {
    readCheckoutOptionsFromDom();
    hideCheckoutError();
    document.getElementById('cart-checkout-options')?.classList.remove('is-invalid');
}

function getCheckoutPaymentLabel() {
    if (checkoutPayment === 'btc') return t('order_payment_btc');
    if (checkoutPayment === 'cash') return t('order_payment_cash');
    return '';
}

function getCheckoutFulfillmentLabel() {
    if (checkoutFulfillment === 'envoi') return t('order_fulfillment_envoi');
    if (checkoutFulfillment === 'meetup') return t('order_fulfillment_meetup');
    return '';
}

function validateCheckoutOptions() {
    readCheckoutOptionsFromDom();
    if (checkoutPayment && checkoutFulfillment) return true;
    document.getElementById('cart-checkout-options')?.classList.add('is-invalid');
    showCheckoutError(t('checkout_options_required'));
    return false;
}

function renderCheckoutOptionsHtml() {
    const payCash = checkoutPayment === 'cash' ? ' checked' : '';
    const payBtc = checkoutPayment === 'btc' ? ' checked' : '';
    const fulEnvoi = checkoutFulfillment === 'envoi' ? ' checked' : '';
    const fulMeet = checkoutFulfillment === 'meetup' ? ' checked' : '';
    return `<div class="cart-checkout-options" id="cart-checkout-options">
        <fieldset class="checkout-option-group">
            <legend>${escapeHtml(t('checkout_payment_title'))}</legend>
            <label class="checkout-option"><input type="radio" name="checkout-payment" value="cash"${payCash} onchange="onCheckoutOptionChange()"> ${escapeHtml(t('order_payment_cash'))}</label>
            <label class="checkout-option"><input type="radio" name="checkout-payment" value="btc"${payBtc} onchange="onCheckoutOptionChange()"> ${escapeHtml(t('order_payment_btc'))}</label>
        </fieldset>
        <fieldset class="checkout-option-group">
            <legend>${escapeHtml(t('checkout_fulfillment_title'))}</legend>
            <label class="checkout-option"><input type="radio" name="checkout-fulfillment" value="envoi"${fulEnvoi} onchange="onCheckoutOptionChange()"> ${escapeHtml(t('order_fulfillment_envoi'))}</label>
            <label class="checkout-option"><input type="radio" name="checkout-fulfillment" value="meetup"${fulMeet} onchange="onCheckoutOptionChange()"> ${escapeHtml(t('order_fulfillment_meetup'))}</label>
        </fieldset>
    </div>`;
}
let selectedPricingIdx = null;
let selectedVariantIdxs = [];
let currentProduct = null;
let selectedCategory = null;
let contactUrls = { signalUrl: null, threemaUrl: null };
let cartSyncTimer = null;
let catalogLoadInFlight = null;
let contactUrlsLoadInFlight = null;
let ageGateInFlight = null;
const ONBOARDING_STORAGE_KEY = 'ac_onboarding_v1';
let currentOnboardingStep = 1;

function closeAgeGate() {
    const gate = document.getElementById('age-gate');
    if (gate) gate.classList.add('hidden');
}

function getStoredOnboarding() {
    try {
        const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        const method = parsed.contactMethod === 'signal' || parsed.contactMethod === 'threema' ? parsed.contactMethod : null;
        const value = String(parsed.contactValue || '').trim();
        return {
            isAdult: !!parsed.isAdult,
            contactMethod: method,
            contactValue: value
        };
    } catch (e) {
        return null;
    }
}

function saveStoredOnboarding(data) {
    const payload = {
        isAdult: !!data?.isAdult,
        contactMethod: data?.contactMethod === 'signal' || data?.contactMethod === 'threema' ? data.contactMethod : null,
        contactValue: String(data?.contactValue || '').trim()
    };
    try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
}

async function syncContactProfileToServer(profile) {
    if (!POINTS_API_URL || !getInitData()) return;
    const p = profile || getStoredOnboarding();
    if (!p || !p.contactMethod || !p.contactValue) return;
    try {
        await fetch(`${POINTS_API_URL}/api/contact-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...catalogApiHeaders() },
            body: JSON.stringify({
                initData: getInitData(),
                is_adult: !!p.isAdult,
                contact_method: p.contactMethod,
                contact_value: p.contactValue
            })
        });
    } catch (e) {}
}

async function loadContactProfileFromServer() {
    if (!POINTS_API_URL || !getInitData()) return null;
    try {
        const r = await fetch(`${POINTS_API_URL}/api/contact-profile/me`, {
            headers: catalogApiHeaders(),
            cache: 'no-store'
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d?.ok || !d.profile) return null;
        const profile = {
            isAdult: !!d.profile.is_adult,
            contactMethod: d.profile.contact_method === 'signal' || d.profile.contact_method === 'threema' ? d.profile.contact_method : null,
            contactValue: String(d.profile.contact_value || '').trim()
        };
        if (isOnboardingComplete(profile)) {
            saveStoredOnboarding(profile);
            return profile;
        }
        return null;
    } catch (e) {
        return null;
    }
}

function isOnboardingComplete(data) {
    const d = data || getStoredOnboarding();
    return !!(d && d.isAdult && d.contactMethod && d.contactValue && d.contactValue.length >= 3);
}

function getContactMethodLabel(method) {
    if (method === 'signal') return 'Signal';
    if (method === 'threema') return 'Threema';
    return '';
}

function getCustomerContactSummary() {
    const d = getStoredOnboarding();
    if (!d || !d.contactMethod || !d.contactValue) return null;
    return `${getContactMethodLabel(d.contactMethod)}: ${d.contactValue}`;
}

function setOnboardingStepUi(step) {
    currentOnboardingStep = step;
    const step1 = document.getElementById('onboarding-step-1');
    const step2 = document.getElementById('onboarding-step-2');
    const step3 = document.getElementById('onboarding-step-3');
    step1?.classList.toggle('hidden', step !== 1);
    step2?.classList.toggle('hidden', step !== 2);
    step3?.classList.toggle('hidden', step !== 3);

    [1, 2, 3].forEach((i) => {
        const pill = document.getElementById(`onboarding-step-pill-${i}`);
        if (!pill) return;
        pill.classList.toggle('active', i === step);
        pill.classList.toggle('done', i < step);
    });

    const progress = document.getElementById('onboarding-progress-label');
    if (progress) progress.textContent = t(`onboarding_progress_step_${step}`);
}

function updateContactMethodCards(method) {
    const signalBtn = document.getElementById('contact-method-signal');
    const threemaBtn = document.getElementById('contact-method-threema');
    signalBtn?.classList.toggle('active', method === 'signal');
    threemaBtn?.classList.toggle('active', method === 'threema');
}

function refreshOnboardingTexts(selectedMethod) {
    const title = document.getElementById('age-gate-title');
    const text = document.getElementById('age-gate-text');
    const ok = document.getElementById('age-gate-accept');
    const no = document.getElementById('age-gate-decline');
    if (title) title.textContent = t('age_gate_title');
    if (text) text.textContent = t('age_gate_text');
    if (ok) ok.textContent = t('age_gate_accept');
    if (no) no.textContent = t('age_gate_decline');

    const methodTitle = document.getElementById('contact-method-title');
    const methodText = document.getElementById('contact-method-text');
    const methodBack = document.getElementById('contact-method-back');
    const methodNext = document.getElementById('contact-method-next');
    if (methodTitle) methodTitle.textContent = t('contact_method_title');
    if (methodText) methodText.textContent = t('contact_method_text');
    if (methodBack) methodBack.textContent = t('contact_method_back');
    if (methodNext) methodNext.textContent = t('contact_method_next');

    const inputTitle = document.getElementById('contact-input-title');
    const inputText = document.getElementById('contact-input-text');
    const inputLabel = document.getElementById('contact-input-label');
    const inputEl = document.getElementById('contact-input-value');
    const inputSave = document.getElementById('contact-input-save');
    const inputBack = document.getElementById('contact-input-back');
    if (inputTitle) inputTitle.textContent = t('contact_input_title');
    if (inputText) inputText.textContent = t('contact_input_text');
    if (inputSave) inputSave.textContent = t('contact_input_save');
    if (inputBack) inputBack.textContent = t('contact_method_back');
    if (inputLabel) inputLabel.textContent = selectedMethod === 'threema' ? t('contact_input_label_threema') : t('contact_input_label_signal');
    if (inputEl) inputEl.placeholder = selectedMethod === 'threema' ? t('contact_input_placeholder_threema') : t('contact_input_placeholder_signal');
}

function showAgeGate(forceEdit = false) {
    const gate = document.getElementById('age-gate');
    if (!gate) return Promise.resolve(true);
    const stored = getStoredOnboarding();
    if (!forceEdit && isOnboardingComplete(stored)) return Promise.resolve(true);

    const ok = document.getElementById('age-gate-accept');
    const no = document.getElementById('age-gate-decline');
    const signalBtn = document.getElementById('contact-method-signal');
    const threemaBtn = document.getElementById('contact-method-threema');
    const methodBack = document.getElementById('contact-method-back');
    const methodNext = document.getElementById('contact-method-next');
    const inputEl = document.getElementById('contact-input-value');
    const inputBack = document.getElementById('contact-input-back');
    const inputSave = document.getElementById('contact-input-save');
    const inputError = document.getElementById('contact-input-error');

    let selectedMethod = stored?.contactMethod || null;
    let ageAccepted = !!stored?.isAdult;
    if (forceEdit && !ageAccepted) ageAccepted = true;
    refreshOnboardingTexts(selectedMethod || 'signal');
    setOnboardingStepUi(forceEdit || ageAccepted ? 2 : 1);
    updateContactMethodCards(selectedMethod);
    if (inputEl) inputEl.value = String(stored?.contactValue || '');
    if (inputError) {
        inputError.textContent = '';
        inputError.classList.add('hidden');
    }
    gate.classList.remove('hidden');

    return new Promise((resolve) => {
        const onAccept = () => {
            ageAccepted = true;
            setOnboardingStepUi(2);
        };
        const onDecline = () => {
            cleanup();
            closeAgeGate();
            showCatalogAccessError('open_in_telegram');
            resolve(false);
        };
        const onSelectSignal = () => {
            selectedMethod = 'signal';
            updateContactMethodCards(selectedMethod);
            refreshOnboardingTexts(selectedMethod);
        };
        const onSelectThreema = () => {
            selectedMethod = 'threema';
            updateContactMethodCards(selectedMethod);
            refreshOnboardingTexts(selectedMethod);
        };
        const onMethodBack = () => {
            if (forceEdit) {
                cleanup();
                closeAgeGate();
                resolve(true);
                return;
            }
            setOnboardingStepUi(1);
        };
        const onMethodNext = () => {
            if (!selectedMethod) {
                showToast(t('contact_input_error_method'));
                return;
            }
            setOnboardingStepUi(3);
            if (inputEl) inputEl.focus();
        };
        const onInputBack = () => {
            setOnboardingStepUi(2);
        };
        const onInputSave = () => {
            const v = String(inputEl?.value || '').trim();
            if (!selectedMethod) {
                if (inputError) {
                    inputError.textContent = t('contact_input_error_method');
                    inputError.classList.remove('hidden');
                }
                return;
            }
            if (v.length < 3) {
                if (inputError) {
                    inputError.textContent = t('contact_input_error_required');
                    inputError.classList.remove('hidden');
                }
                return;
            }
            saveStoredOnboarding({
                isAdult: true,
                contactMethod: selectedMethod,
                contactValue: v
            });
            syncContactProfileToServer({
                isAdult: true,
                contactMethod: selectedMethod,
                contactValue: v
            });
            cleanup();
            closeAgeGate();
            resolve(true);
        };
        const cleanup = () => {
            ok?.removeEventListener('click', onAccept);
            no?.removeEventListener('click', onDecline);
            signalBtn?.removeEventListener('click', onSelectSignal);
            threemaBtn?.removeEventListener('click', onSelectThreema);
            methodBack?.removeEventListener('click', onMethodBack);
            methodNext?.removeEventListener('click', onMethodNext);
            inputBack?.removeEventListener('click', onInputBack);
            inputSave?.removeEventListener('click', onInputSave);
        };
        ok?.addEventListener('click', onAccept);
        no?.addEventListener('click', onDecline);
        signalBtn?.addEventListener('click', onSelectSignal);
        threemaBtn?.addEventListener('click', onSelectThreema);
        methodBack?.addEventListener('click', onMethodBack);
        methodNext?.addEventListener('click', onMethodNext);
        inputBack?.addEventListener('click', onInputBack);
        inputSave?.addEventListener('click', onInputSave);
    });
}

async function ensureAgeConfirmed() {
    if (ageGateInFlight) return ageGateInFlight;
    ageGateInFlight = showAgeGate().finally(() => { ageGateInFlight = null; });
    return ageGateInFlight;
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function getCartItemsCount() {
    return cart.reduce((sum, item) => sum + (Number(item && item.count) || 1), 0);
}

function syncCartActivity() {
    const initData = getInitData();
    if (!POINTS_API_URL || !initData) return;
    const payload = {
        initData,
        cart_non_empty: cart.length > 0,
        items_count: getCartItemsCount()
    };
    fetch(`${POINTS_API_URL}/api/cart-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(() => {});
}

function scheduleCartActivitySync() {
    if (cartSyncTimer) clearTimeout(cartSyncTimer);
    cartSyncTimer = setTimeout(() => {
        cartSyncTimer = null;
        syncCartActivity();
    }, 200);
}

async function loadCatalog() {
    if (!POINTS_API_URL) {
        catalogProducts = PRODUCTS;
        catalogCategories = CATEGORIES;
        return;
    }
    if (catalogLoadInFlight) return catalogLoadInFlight;

    const controller = new AbortController();
    const timeoutMs = 9000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    catalogLoadInFlight = (async () => {
    try {
        const r = await fetch(POINTS_API_URL + '/api/products?t=' + Date.now(), {
            cache: 'no-store',
            headers: catalogApiHeaders(),
            signal: controller.signal
        });
        if (r.status === 401) {
            showCatalogAccessError(isTelegramWebApp() ? 'error_catalog_access' : 'open_in_telegram');
            return;
        }
        const d = await r.json();
        // Toujours prendre la réponse API si OK (même liste vide) — sinon on retombe sur PRODUCTS embarqués = vieux catalogue.
        if (r.ok && d && Array.isArray(d.products)) {
            catalogProducts = d.products;
            catalogCategories = (d.categories && d.categories.length) ? d.categories : CATEGORIES;
            return;
        }
    } catch (e) {}
    catalogProducts = PRODUCTS;
    catalogCategories = CATEGORIES;
    })().finally(() => {
        clearTimeout(timeout);
        catalogLoadInFlight = null;
    });

    return catalogLoadInFlight;
}

async function loadContactUrls() {
    if (!POINTS_API_URL) return;
    if (contactUrlsLoadInFlight) return contactUrlsLoadInFlight;

    const controller = new AbortController();
    const timeoutMs = 7000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    contactUrlsLoadInFlight = (async () => {
    try {
        const r = await fetch(POINTS_API_URL + '/api/config', {
            cache: 'no-store',
            headers: catalogApiHeaders(),
            signal: controller.signal
        });
        if (r.status === 401) return;
        const d = await r.json();
        if (d && (d.signalUrl || d.threemaUrl)) contactUrls = { signalUrl: d.signalUrl || null, threemaUrl: d.threemaUrl || null };
    } catch (e) {}
    })().finally(() => {
        clearTimeout(timeout);
        contactUrlsLoadInFlight = null;
    });

    return contactUrlsLoadInFlight;
}

function formatChfAmount(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return '—';
    return `${x.toFixed(2)} ${CURRENCY}`;
}

function computeCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
    const payableRounded = Math.max(0, Math.round(subtotal));
    return { subtotal, payableRounded };
}

function init() {
    loadCheckoutPrefs();
    window.onCheckoutOptionChange = onCheckoutOptionChange;
    document.title = "Alpine Connexion";
    const editContactBtn = document.getElementById('btn-edit-contact');
    editContactBtn?.addEventListener('click', async () => {
        await showAgeGate(true);
        applyTranslations();
    });
    const tg = window.Telegram?.WebApp;
    if (tg) {
        try {
            tg.ready();
            tg.expand();
        } catch (e) {}
    }
    (async () => {
        if (isTelegramWebApp()) await waitForInitData();
        await loadContactProfileFromServer();
        loadCartFromStorage();
        updateCartBadge();
        scheduleCartActivitySync();
        const ageOk = await ensureAgeConfirmed();
        if (!ageOk) return;
        catalogLoading = true;
        renderProducts();
        await loadCatalog();
        const appEl = document.getElementById('app');
        if (appEl && appEl.classList.contains('hidden')) return;
        await loadContactUrls();
        buildCategoryChips();
        catalogLoading = false;
        applyTranslations();
        renderProducts();
    })();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') refreshCatalog();
    });
    document.getElementById('order-success-btn')?.addEventListener('click', () => closeOrderSuccess(true));
    document.getElementById('order-success-close')?.addEventListener('click', () => closeOrderSuccess(false));
}

function showView(viewName) {
    const catalogView = document.getElementById('view-catalog');
    const navCatalog = document.getElementById('nav-catalog');
    if (catalogView) catalogView.classList.remove('hidden');
    if (navCatalog) navCatalog.classList.add('active');
    navCatalog?.setAttribute('aria-current', 'page');
}

function buildCategoryChips() {
    const chipsEl = document.getElementById('category-chips');
    if (!chipsEl) return;
    const list = catalogCategories.length ? catalogCategories : CATEGORIES;
    chipsEl.innerHTML = [
        `<button type="button" class="category-chip${selectedCategory === null ? ' active' : ''}" data-cat="" role="tab" aria-selected="${selectedCategory === null}">${escapeHtml(t('filter_all_short'))}</button>`,
        ...list.map((c) => {
            const active = selectedCategory === c.id;
            return `<button type="button" class="category-chip${active ? ' active' : ''}" data-cat="${c.id}" role="tab" aria-selected="${active}">${escapeHtml(c.name)}</button>`;
        })
    ].join('');
    if (chipsEl.dataset.bound === '1') return;
    chipsEl.dataset.bound = '1';
    chipsEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (!chip) return;
        hapticLight();
        selectedCategory = chip.dataset.cat ? parseInt(chip.dataset.cat, 10) : null;
        chipsEl.querySelectorAll('.category-chip').forEach((el) => {
            const on = el === chip;
            el.classList.toggle('active', on);
            el.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        renderProducts();
    });
}

function refreshCategoryChips() {
    const chipsEl = document.getElementById('category-chips');
    if (!chipsEl || !chipsEl.dataset.bound) return;
    buildCategoryChips();
}

function clearCategoryFilter() {
    selectedCategory = null;
    refreshCategoryChips();
    renderProducts();
}

async function refreshCatalog() {
    catalogLoading = true;
    renderProducts();
    await loadCatalog();
    refreshCategoryChips();
    catalogLoading = false;
    renderProducts();
}

function renderProductSkeletons() {
    return Array.from({ length: 6 }, () => `
        <div class="product-card product-card-skeleton" aria-hidden="true">
            <div class="skeleton-block skeleton-media"></div>
            <div class="product-card-body">
                <div class="skeleton-block skeleton-line mid"></div>
                <div class="skeleton-block skeleton-line short"></div>
            </div>
        </div>`).join('');
}

/** Médias catalogue : chemins relatifs du site → URL absolue (uploads, images statiques, etc.). */
function resolveMediaUrl(url) {
    const s = String(url || '').trim();
    if (!s) return null;
    if (s.startsWith('/') && !s.startsWith('//')) {
        const base = String(POINTS_API_URL || window.location.origin || '').replace(/\/+$/, '');
        return base ? `${base}${s}` : s;
    }
    return s;
}

function handleCatalogMediaError(el) {
    if (!el) return;
    const wrap = el.closest('.product-media-wrap') || el.closest('.carousel-slide') || el.closest('.thumbnail');
    if (wrap && !wrap.querySelector('.product-media-placeholder')) {
        el.remove();
        const ph = document.createElement('div');
        ph.className = 'product-media-placeholder';
        ph.textContent = '🌿';
        wrap.appendChild(ph);
    }
}

function catalogImgTag(url, alt, extraClass) {
    const src = resolveMediaUrl(url);
    if (!src) return '<div class="product-media-placeholder">🌿</div>';
    const cls = extraClass ? ` class="${extraClass}"` : '';
    return `<img src="${escapeHtml(src)}"${cls} alt="${escapeHtml(alt || '')}" loading="lazy" decoding="async" onerror="handleCatalogMediaError(this)">`;
}

function getPrimaryMedia(product) {
    if (Array.isArray(product.media) && product.media.length > 0) {
        return product.media[0];
    }
    return null;
}

function enforceManualPlayOnly(scope) {
    const root = scope || document;
    const videos = Array.from(root.querySelectorAll('video'));
    videos.forEach((v) => {
        if (!v || v.dataset.manualPlayBound === '1') return;
        v.dataset.manualPlayBound = '1';
        v.dataset.userInteracted = '0';
        const markInteracted = () => { v.dataset.userInteracted = '1'; };
        v.addEventListener('pointerdown', markInteracted, { passive: true });
        v.addEventListener('touchstart', markInteracted, { passive: true });
        v.addEventListener('click', markInteracted);
        v.addEventListener('keydown', markInteracted);
        v.addEventListener('play', () => {
            if (v.dataset.userInteracted === '1') return;
            try { v.pause(); } catch (e) {}
        });
    });
}

function isGifMediaUrl(url) {
    return /\.gif(?:\?|#|$)/i.test(String(url || '').trim());
}

function normalizeBadgeKey(key) {
    const k = String(key || '').toLowerCase().trim();
    if (k === 'promo') return 'promotion';
    return k;
}

function getProductBadges(product) {
    const raw = Array.isArray(product?.badges) ? product.badges : [];
    const allowed = new Set(['new', 'promotion']);
    const out = [];
    for (const x of raw) {
        const k = normalizeBadgeKey(x);
        if (!allowed.has(k)) continue;
        if (!out.includes(k)) out.push(k);
    }
    return out;
}

function badgeLabel(key) {
    if (key === 'new') return 'NEW';
    if (key === 'promotion') return 'PROMO';
    return String(key || '');
}

function compareProductsForCatalog(a, b) {
    const aNew = getProductBadges(a).includes('new') ? 0 : 1;
    const bNew = getProductBadges(b).includes('new') ? 0 : 1;
    if (aNew !== bNew) return aNew - bNew;
    const sa = Number(a.sort ?? a.id ?? 0);
    const sb = Number(b.sort ?? b.id ?? 0);
    return sa - sb;
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (catalogLoading) {
        grid.innerHTML = renderProductSkeletons();
        return;
    }

    const list = catalogProducts.length ? catalogProducts : PRODUCTS;
    let filtered = selectedCategory !== null
        ? list.filter(p => p.category_id === selectedCategory)
        : [...list];
    filtered = filtered.slice().sort(compareProductsForCatalog);

    if (!filtered.length) {
        const showAllBtn = selectedCategory !== null
            ? `<button type="button" class="empty-state-btn" onclick="clearCategoryFilter()">${escapeHtml(t('empty_show_all'))}</button>`
            : '';
        grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📦</div><p>${t('no_products')}</p>${showAllBtn}</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        let media = '';
        const badges = getProductBadges(p).slice(0, 2);
        const isNew = badges.includes('new');
        const badgeHtml = badges.length
            ? `<div class="product-badge-wrap">${badges.map((b) => {
                const cls = b === 'new' ? 'product-badge-new' : 'product-badge-promotion';
                return `<span class="product-badge ${cls}">${escapeHtml(badgeLabel(b))}</span>`;
              }).join('')}</div>`
            : '';

        // Si un tableau de médias est défini, on prend le premier comme visuel de carte
        const primary = getPrimaryMedia(p);
        if (primary) {
            if (primary.type === 'video') {
                const thumb = primary.thumbnail ? ` poster="${escapeHtml(resolveMediaUrl(primary.thumbnail))}"` : '';
                media = `<video src="${escapeHtml(resolveMediaUrl(primary.url) || '')}"${thumb} playsinline muted preload="none"></video>`;
            } else {
                media = catalogImgTag(primary.url, primary.alt || p.name);
            }
        } else if (p.media_type === 'video' && p.video_url) {
            media = `<video src="${escapeHtml(resolveMediaUrl(p.video_url) || '')}" playsinline muted preload="none"></video>`;
        } else if (p.image_url) {
            media = catalogImgTag(p.image_url, p.name);
        } else {
            media = '<div class="product-media-placeholder">🌿</div>';
        }

        const fp = p.pricing?.[0];
        const price = fp ? `<span class="price-from">${t('price_from_prefix')}</span>${fp.price} ${CURRENCY}` : '';
        return `
            <div class="product-card${isNew ? ' is-new' : ''}" onclick="openProduct(${p.id})">
                <div class="product-media-wrap">${badgeHtml}${media}</div>
                <div class="product-card-body">
                    <div class="product-card-name">${escapeHtml(p.name)}</div>
                    <div class="product-card-desc">${escapeHtml((p.description||'').split('\n')[0])}</div>
                    <div class="product-card-price">${price}</div>
                </div>
            </div>`;
    }).join('');
    enforceManualPlayOnly(grid);
}

function openProduct(id) {
    const list = catalogProducts.length ? catalogProducts : PRODUCTS;
    const p = list.find(x => x.id === id);
    if (!p) return;
    currentProduct = p;
    selectedPricingIdx = null;
    selectedVariantIdxs = [];

    const cats = catalogCategories.length ? catalogCategories : CATEGORIES;
    const cat = cats.find(c => c.id === p.category_id);

    let media = '';

    // Si un tableau de médias est défini, on affiche un carousel dans la modal
    if (Array.isArray(p.media) && p.media.length > 0) {
        media = buildModalCarouselHtml(p);
    } else if (p.media_type === 'video' && p.video_url) {
        media = `<video src="${escapeHtml(resolveMediaUrl(p.video_url) || '')}" class="modal-media" controls playsinline preload="none"></video>`;
    } else if (p.image_url) {
        media = catalogImgTag(p.image_url, p.name, 'modal-media');
    } else {
        media = '<div class="modal-media-placeholder">🌿</div>';
    }

    let variants = '';
    if (p.variants?.length) {
        variants = `<div class="selector-section">
            <div class="selector-title">${t('choose_variant')}</div>
            <div id="variant-count" class="selector-subtitle"></div>
            <div class="variant-grid">${p.variants.map((v,i) =>
                `<div class="variant-chip" onclick="pickVariant(${i})" id="var-${i}">${escapeHtml(v)}</div>`
            ).join('')}</div></div>`;
    }

    const unit = formatUnitDisplay(p);
    let pricing = '';
    if (p.pricing?.length) {
        pricing = `<div class="selector-section">
            <div class="selector-title">${t('choose_qty')}</div>
            <div class="pricing-options">${p.pricing.map((t,i) =>
                `<div class="pricing-row" onclick="pickPricing(${i})" id="price-${i}">
                    <span class="pricing-qty">${t.qty} ${unit}</span>
                    <span class="pricing-price">${t.price} ${CURRENCY}</span>
                </div>`
            ).join('')}</div></div>`;
    }

    let gallery = p.gallery_link
        ? `<a href="${escapeHtml(p.gallery_link)}" target="_blank" class="gallery-link">📸 Voir les photos</a>` : '';
    document.getElementById('modal-content').innerHTML = `
        ${media}
        <div class="modal-body">
            <div class="modal-title">${escapeHtml(p.name)}</div>
            <div class="modal-category-badge">${escapeHtml(cat?.name || '')}</div>
            <div class="modal-description">${escapeHtml(p.description || '')}</div>
            ${gallery}${variants}${pricing}
        </div>`;

    const addBtn = document.getElementById('btn-add');
    if (addBtn) addBtn.textContent = t('btn_add_cart');

    if (Array.isArray(p.media) && p.media.length > 0) {
        initModalCarousel();
    }
    const modalContent = document.getElementById('modal-content');
    enforceManualPlayOnly(modalContent || undefined);

    const modalScroll = document.getElementById('modal-scroll');
    if (modalScroll) modalScroll.scrollTop = 0;

    document.getElementById('product-modal').classList.add('active');
    hapticLight();
    updateBtn();
}

// =========================
// 🎞️ Carousel dans la modal
// =========================
function buildModalCarouselHtml(product) {
    const mediaItems = Array.isArray(product.media) ? product.media : [];
    const slides = mediaItems.map((m, index) => {
        const isActive = index === 0 ? ' active' : '';
        if (m.type === 'video') {
            const thumb = m.thumbnail ? ` poster="${escapeHtml(resolveMediaUrl(m.thumbnail))}"` : '';
            return `
                <div class="carousel-slide${isActive}" data-index="${index}">
                    <video src="${escapeHtml(resolveMediaUrl(m.url) || '')}"${thumb} controls playsinline preload="none" class="carousel-video"></video>
                </div>`;
        }
        return `
            <div class="carousel-slide${isActive}" data-index="${index}">
                ${catalogImgTag(m.url, m.alt || product.name, 'carousel-image')}
            </div>`;
    }).join('');

    const indicators = mediaItems.map((_, index) => {
        const isActive = index === 0 ? ' active' : '';
        return `<button class="indicator${isActive}" data-target-index="${index}" aria-label="Aller au média ${index + 1}"></button>`;
    }).join('');

    const thumbs = mediaItems.map((m, index) => {
        const isActive = index === 0 ? ' active' : '';
        if (m.type === 'video') {
            const thumbSrc = m.thumbnail ? resolveMediaUrl(m.thumbnail) : '';
            const safeThumbSrc = thumbSrc && !isGifMediaUrl(thumbSrc) ? thumbSrc : '';
            return `
                <div class="thumbnail${isActive}" data-target-index="${index}">
                    <div class="video-thumbnail">
                        ${safeThumbSrc
                            ? catalogImgTag(m.thumbnail, m.alt || product.name)
                            : `<div class="video-thumb-fallback" aria-label="${escapeHtml(m.alt || product.name)}"></div>`
                        }
                        <div class="play-icon">▶</div>
                    </div>
                </div>`;
        }
        return `
            <div class="thumbnail${isActive}" data-target-index="${index}">
                ${catalogImgTag(m.url, m.alt || product.name)}
            </div>`;
    }).join('');

    return `
        <div class="carousel-container" data-current-index="0">
            <div class="carousel-main">
                ${slides}
                ${mediaItems.length > 1 ? `
                    <button class="carousel-btn carousel-btn-prev" data-dir="prev" aria-label="Média précédent">‹</button>
                    <button class="carousel-btn carousel-btn-next" data-dir="next" aria-label="Média suivant">›</button>
                ` : ''}
                ${mediaItems.length > 1 ? `
                    <div class="carousel-indicators">
                        ${indicators}
                    </div>
                ` : ''}
            </div>
            ${mediaItems.length > 1 ? `
                <div class="carousel-thumbnails">
                    ${thumbs}
                </div>
            ` : ''}
        </div>`;
}

function initModalCarousel() {
    const container = document.querySelector('#modal-content .carousel-container');
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.carousel-slide'));
    const indicators = Array.from(container.querySelectorAll('.indicator'));
    const thumbnails = Array.from(container.querySelectorAll('.thumbnail'));
    let currentIndex = 0;

    function updateCarousel(newIndex) {
        if (!slides.length) return;
        if (newIndex < 0) newIndex = slides.length - 1;
        if (newIndex >= slides.length) newIndex = 0;
        currentIndex = newIndex;
        container.dataset.currentIndex = String(currentIndex);

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
            const v = slide.querySelector('video');
            if (v) v.pause();
        });
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
        thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === currentIndex));

        const activeSlide = slides[currentIndex];
        const video = activeSlide ? activeSlide.querySelector('video') : null;
        if (video) {
            video.autoplay = false;
            video.pause();
        }
        enforceManualPlayOnly(container);
    }

    container.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        if (target.closest('.carousel-btn-prev')) {
            e.stopPropagation();
            updateCarousel(currentIndex - 1);
        } else if (target.closest('.carousel-btn-next')) {
            e.stopPropagation();
            updateCarousel(currentIndex + 1);
        } else {
            const indicator = target.closest('.indicator');
            if (indicator && indicator.hasAttribute('data-target-index')) {
                e.stopPropagation();
                const idx = parseInt(indicator.getAttribute('data-target-index'), 10);
                if (!isNaN(idx)) updateCarousel(idx);
            }

            const thumb = target.closest('.thumbnail');
            if (thumb && thumb.hasAttribute('data-target-index')) {
                e.stopPropagation();
                const idx = parseInt(thumb.getAttribute('data-target-index'), 10);
                if (!isNaN(idx)) updateCarousel(idx);
            }
        }
    });

    updateCarousel(0);
}

function closeProductModal(e) {
    if (!e || e.target.id === 'product-modal')
        document.getElementById('product-modal').classList.remove('active');
}

function getAddToCartState() {
    if (!currentProduct) return { ready: false, reason: '' };
    if (selectedPricingIdx === null) {
        return { ready: false, reason: t('hint_choose_qty') };
    }
    if (currentProduct.variants?.length && (!Array.isArray(selectedVariantIdxs) || !selectedVariantIdxs.length)) {
        return { ready: false, reason: t('hint_choose_variant') };
    }
    return { ready: true, reason: '' };
}

function pickVariant(i) {
    hapticLight();
    if (!Array.isArray(selectedVariantIdxs)) selectedVariantIdxs = [];
    const idxPos = selectedVariantIdxs.indexOf(i);
    if (idxPos >= 0) {
        selectedVariantIdxs.splice(idxPos, 1);
    } else {
        selectedVariantIdxs.push(i);
    }
    document.querySelectorAll('.variant-chip').forEach((el, j) => {
        el.classList.toggle('selected', selectedVariantIdxs.includes(j));
    });
    const counter = document.getElementById('variant-count');
    if (counter) {
        const n = selectedVariantIdxs.length;
        counter.textContent = n > 0 ? `${n} variante${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}` : '';
    }
    updateBtn();
}

function pickPricing(i) {
    hapticLight();
    selectedPricingIdx = i;
    document.querySelectorAll('.pricing-row').forEach((el,j) => el.classList.toggle('selected', j===i));
    updateBtn();
}

function updateBtn() {
    const btn = document.getElementById('btn-add');
    const hint = document.getElementById('modal-sticky-hint');
    const priceEl = document.getElementById('modal-sticky-price');
    const state = getAddToCartState();
    if (btn) btn.disabled = !state.ready;
    if (hint) {
        hint.textContent = state.reason;
        hint.classList.toggle('hidden', state.ready || !state.reason);
    }
    if (priceEl) {
        if (state.ready && selectedPricingIdx !== null && currentProduct?.pricing?.[selectedPricingIdx]) {
            const tier = currentProduct.pricing[selectedPricingIdx];
            priceEl.textContent = `${tier.price} ${CURRENCY}`;
            priceEl.classList.remove('hidden');
        } else {
            priceEl.textContent = '';
            priceEl.classList.add('hidden');
        }
    }
}

function addToCart() {
    if (!currentProduct || selectedPricingIdx === null) return;
    const tier = currentProduct.pricing[selectedPricingIdx];
    let v = null;
    if (currentProduct.variants && Array.isArray(selectedVariantIdxs) && selectedVariantIdxs.length) {
        v = selectedVariantIdxs
            .map((idx) => currentProduct.variants[idx])
            .filter(Boolean)
            .join(', ');
    }

    cart.push({
        name: currentProduct.name,
        unit_type: currentProduct.unit_type,
        unit_label: currentProduct.unit_label || null,
        qty: tier.qty,
        price: tier.price,
        variant: v
    });

    saveCartToStorage();
    updateCartBadge();
    scheduleCartActivitySync();
    hapticSuccess();
    closeProductModal();
    showToast(t('toast_added'));
    const fab = document.getElementById('cart-fab');
    if (fab) {
        fab.classList.remove('cart-fab-pulse');
        void fab.offsetWidth;
        fab.classList.add('cart-fab-pulse');
        setTimeout(() => fab.classList.remove('cart-fab-pulse'), 500);
    }
}

function updateCartBadge() {
    const b = document.getElementById('cart-badge');
    if (cart.length > 0) { b.textContent = cart.length; b.classList.add('visible'); }
    else b.classList.remove('visible');
}

function openCart() {
    renderCart();
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCart(e) {
    if (!e || e.target.id === 'cart-overlay')
        document.getElementById('cart-overlay').classList.remove('active');
}

function renderCart() {
    const c = document.getElementById('cart-items');
    if (!cart.length) {
        c.innerHTML = `<div class="cart-empty-msg"><span>🛒</span>${t('cart_empty')}</div>`;
        return;
    }

    const totals = computeCartTotals();
    let h = '';
    cart.forEach((item, i) => {
        const u = formatUnitDisplay(item);
        h += `<div class="cart-item">
            <div class="cart-item-top">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
            </div>
            ${item.variant ? `<div class="cart-item-detail cart-item-variant">🎨 ${escapeHtml(item.variant)}</div>` : ''}
            <div class="cart-item-detail">${item.qty} ${u}</div>
            <div class="cart-item-price">${item.price} ${CURRENCY}</div>
        </div>`;
    });

    h += `<div class="cart-footer">
        <div class="cart-total-row">
            <span class="cart-total-label">${t('cashback_subtotal_label')}</span>
            <span class="cart-total-amount cart-total-amount-small">${totals.subtotal.toFixed(2)} ${CURRENCY}</span>
        </div>
        <div class="cart-total-row cart-total-row-due">
            <span class="cart-total-label">${t('cashback_payable_label')}</span>
            <span class="cart-total-amount">${totals.payableRounded.toFixed(0)} ${CURRENCY}</span>
        </div>
        <div class="checkout-hint">${t('rounded_total_note')}</div>
        ${renderCheckoutOptionsHtml()}
        <div class="cart-checkout-prep">
            <div class="cart-checkout-prep-title">${t('cart_checkout_prep_title')}</div>
            <p class="cart-checkout-prep-text">${escapeHtml(t('cart_bot_followup'))}</p>
        </div>
        <div class="checkout-error hidden" id="checkout-error" role="alert"></div>
        <button type="button" class="btn-checkout" id="btn-checkout-submit" onclick="checkout()">${t('cart_btn_submit')}</button>
        <button type="button" class="btn-clear-cart" onclick="clearSavedCart()">${t('cart_btn_clear_saved')}</button>
    `;
    h += `</div>`;
    c.innerHTML = h;
}

function clearSavedCart() {
    cart = [];
    saveCartToStorage();
    updateCartBadge();
    scheduleCartActivitySync();
    renderCart();
}

function removeFromCart(i) {
    cart.splice(i, 1);
    saveCartToStorage();
    updateCartBadge();
    scheduleCartActivitySync();
    renderCart();
}

function generateOrderId() {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `AC-${datePart}-${rand}`;
}

function buildOrderText(totals, orderId) {
    const tvals = totals || computeCartTotals();
    const contactSummary = getCustomerContactSummary() || t('order_contact_missing');
    const paymentLabel = getCheckoutPaymentLabel();
    const fulfillmentLabel = getCheckoutFulfillmentLabel();
    let msg = `${t('order_header')}\n\n`;
    if (orderId) msg += `${t('order_id_label')} : ${orderId}\n`;
    msg += `${t('order_customer_contact')} : ${contactSummary}\n`;
    if (paymentLabel) msg += `💳 ${t('order_payment_label')} : ${paymentLabel}\n`;
    if (fulfillmentLabel) msg += `🚚 ${t('order_fulfillment_label')} : ${fulfillmentLabel}\n`;
    msg += '\n';
    cart.forEach((item, i) => {
        const u = formatUnitDisplay(item);
        msg += `${i+1}. ${item.name}`;
        if (item.variant) msg += ` (${item.variant})`;
        msg += `\n   📦 ${item.qty} ${u} — ${item.price} ${CURRENCY}\n\n`;
    });
    msg += `${t('order_total')} : ${tvals.payableRounded.toFixed(0)} ${CURRENCY}`;
    return msg;
}

function setCheckoutBusy(busy) {
    checkoutInFlight = !!busy;
    const btn = document.getElementById('btn-checkout-submit');
    if (!btn) return;
    btn.disabled = busy;
    btn.classList.toggle('is-loading', busy);
    btn.textContent = busy ? t('checkout_sending') : t('cart_btn_submit');
}

function hideCheckoutError() {
    const el = document.getElementById('checkout-error');
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
}

function showCheckoutError(message) {
    const el = document.getElementById('checkout-error');
    if (!el) {
        showToast(message);
        return;
    }
    el.textContent = message;
    el.classList.remove('hidden');
    try {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    } catch (e) {}
}

function showOrderSuccess(orderRef) {
    const ref = String(orderRef || '').trim() || '—';
    const overlay = document.getElementById('order-success-overlay');
    const refEl = document.getElementById('order-success-ref');
    const stepsEl = document.getElementById('order-success-steps');
    if (refEl) refEl.textContent = t('order_success_ref').replace('{ref}', ref);
    if (stepsEl) {
        stepsEl.innerHTML = [
            t('order_success_step1'),
            t('order_success_step2')
        ].map((s) => `<li>${escapeHtml(s)}</li>`).join('');
    }
    applyTranslations();
    if (overlay) {
        overlay.hidden = false;
        overlay.classList.add('active');
    }
    document.getElementById('cart-overlay')?.classList.remove('active');
    hapticSuccess();
}

function closeOrderSuccess(goToTelegram) {
    const overlay = document.getElementById('order-success-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.hidden = true;
    }
    if (goToTelegram && window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
    }
}

async function checkout() {
    if (!cart.length || checkoutInFlight) return;
    hideCheckoutError();
    if (!validateCheckoutOptions()) return;
    if (!isOnboardingComplete()) {
        const ok = await showAgeGate(false);
        if (!ok || !isOnboardingComplete()) return;
    }
    setCheckoutBusy(true);
    try {
        await syncContactProfileToServer();
        const totals = computeCartTotals();
        const orderId = generateOrderId();
        const orderText = buildOrderText(totals, orderId);

        if (POINTS_API_URL && getInitData()) {
            try {
                const res = await fetch(`${POINTS_API_URL}/api/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        initData: getInitData(),
                        orderText,
                        order_id: orderId,
                        customer_contact: getCustomerContactSummary(),
                        payment_method: checkoutPayment,
                        fulfillment_method: checkoutFulfillment
                    })
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok && data.ok) {
                    const ref = data.order_ref || orderId;
                    cart = [];
                    saveCartToStorage();
                    updateCartBadge();
                    scheduleCartActivitySync();
                    showOrderSuccess(ref);
                    return;
                }
                if (data.error === 'checkout_options_required') {
                    validateCheckoutOptions();
                    return;
                }
                if (getInitData()) {
                    showCheckoutError(t('order_send_failed'));
                    return;
                }
            } catch (e) {
                if (getInitData()) {
                    showCheckoutError(t('order_send_failed'));
                    return;
                }
            }
        }

        if (getInitData()) {
            showCheckoutError(t('order_send_failed'));
            return;
        }
        showCheckoutError(t('cart_need_telegram'));
    } finally {
        setCheckoutBusy(false);
    }
}

function showToast(text) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2400);
}

document.addEventListener('DOMContentLoaded', init);

