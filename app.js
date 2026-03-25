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
        choose_variant: '🎨 Choisissez votre variante',
        choose_qty: '📦 Choisissez votre quantité',
        price_from_prefix: 'dès ',
        no_products: 'Aucun produit trouvé',
        open_in_telegram: 'Ouvre depuis Telegram',
        error_catalog_access: 'Impossible d’accéder au catalogue. Ouvre l’application depuis le bot Telegram.',
        checkout_hint: 'Envoie le message dans Telegram pour confirmer ta commande.',
        nav_catalog: 'Catalogue',
        order_sent: 'Commande envoyée ! Va sur le chat du bot : Signal ou Threema, puis ton identifiant.',
        or_contact_signal_threema: 'Liens directs (optionnel) :',
        copy_paste_order: 'Copie la commande ci-dessous et colle-la dans le chat.',
        cart_how_to_send: 'Pour valider ta commande :',
        cart_step_submit: '1. Envoie la commande au bot Telegram',
        cart_btn_submit: '📩 Envoyer la commande au bot',
        cart_bot_followup: 'Le bot te demandera sur quel canal te recontacter (Signal ou Threema), puis ton identifiant pour confirmer.',
        cart_step_copy: 'Optionnel — copie du texte',
        cart_btn_copy: 'Copier la commande',
        cart_need_telegram: 'Ouvre le catalogue depuis Telegram pour envoyer la commande.',
        order_send_failed: 'Envoi impossible. Réessaie dans un instant.',
        open_signal: 'Signal',
        open_threema: 'Threema'
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
        choose_variant: '🎨 Choose your variant',
        choose_qty: '📦 Choose your quantity',
        price_from_prefix: 'from ',
        no_products: 'No products found',
        open_in_telegram: 'Open from Telegram',
        error_catalog_access: 'Cannot load the catalog. Open the app from the Telegram bot.',
        checkout_hint: 'Send the message in Telegram to confirm your order.',
        nav_catalog: 'Catalog',
        order_sent: 'Order sent! Open the bot chat: choose Signal or Threema, then your contact ID.',
        or_contact_signal_threema: 'Direct links (optional):',
        copy_paste_order: 'Copy the order below and paste it in the chat.',
        cart_how_to_send: 'To place your order:',
        cart_step_submit: '1. Send the order to the Telegram bot',
        cart_btn_submit: '📩 Send order to bot',
        cart_bot_followup: 'The bot will ask where to reach you (Signal or Threema), then your ID to confirm.',
        cart_step_copy: 'Optional — copy text',
        cart_btn_copy: 'Copy order',
        cart_need_telegram: 'Open the catalog from Telegram to send your order.',
        order_send_failed: 'Could not send. Please try again.',
        open_signal: 'Signal',
        open_threema: 'Threema'
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
        choose_variant: '🎨 Variante wählen',
        choose_qty: '📦 Menge wählen',
        price_from_prefix: 'ab ',
        no_products: 'Keine Produkte gefunden',
        open_in_telegram: 'Öffne über Telegram',
        error_catalog_access: 'Katalog nicht erreichbar. Öffne die App über den Telegram-Bot.',
        checkout_hint: 'Sende die Nachricht in Telegram, um deine Bestellung zu bestätigen.',
        nav_catalog: 'Katalog',
        order_sent: 'Bestellung gesendet! Öffne den Bot-Chat: Signal oder Threema, dann deine Kennung.',
        or_contact_signal_threema: 'Direktlinks (optional):',
        copy_paste_order: 'Kopiere die Bestellung unten und füge sie im Chat ein.',
        cart_how_to_send: 'So bestellst du:',
        cart_step_submit: '1. Bestellung an den Telegram-Bot senden',
        cart_btn_submit: '📩 Bestellung an Bot senden',
        cart_bot_followup: 'Der Bot fragt, wie wir dich erreichen (Signal oder Threema), dann deine Kennung zur Bestätigung.',
        cart_step_copy: 'Optional — Text kopieren',
        cart_btn_copy: 'Bestellung kopieren',
        cart_need_telegram: 'Öffne den Katalog über Telegram, um die Bestellung zu senden.',
        order_send_failed: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
        open_signal: 'Signal',
        open_threema: 'Threema'
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
}

function getInitData() {
    const tg = window.Telegram?.WebApp;
    return (tg && tg.initData) ? tg.initData : '';
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

    // Texte "Toutes les catégories"
    const filterAll = document.getElementById('filter-all-option');
    if (filterAll) {
        filterAll.textContent = t('filter_all');
    }

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

const PRODUCTS = [
    
    // ============ PRODUIT 1 - Exemple avec IMAGE ============
        // ===== FLOWER – Strainz Worldwide Jars 7g =====
    {
        id: 1,
        name: "Strainz Worldwide 7G jars ",
        description: "Top Shelf Exotic Flower – Jars 7g",
        // Image principale utilisée comme fallback si le carousel n'est pas défini
        image_url: "/images/lemon-up-1.jpg",
        video_url: null,
        media_type: "image",
        // Nouveau : tableau de médias pour le carousel (images + vidéos)
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771229215/IMG_0542_q30mvc.jpg",
                alt: "Lemon Up - Vue principale"
            },
       
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771229216/IMG_0537_wd7aji.jpg",
                alt: "Untruly OG - Vue principale"
            },

            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771243903/IMG_6071_c6psmh.mp4",
                alt: "Untruly OG - Combustion"
            },
           
        ],
        gallery_link: null,
        category_id: 1,
        unit_type: "gram",
        pricing: [
            { qty: 7, price: 160 },
            { qty: 28, price: 600 },
            { qty: 56, price: 1100 }
        ],
        variants: ["Lemon up","Untruly OG"]
    },

    // ===== Strainz Worldwide Bags 3.5g =====
    {
        id: 3,
        name: "Strainz Worldwide 3.5G bags",
        description: "Top Shelf Exotic Flower – Bags 3.5g",
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771245550/photo_2026-02-16_19-39-00_em4zrk.jpg",
                alt: "Strainz vu principal"
            },
            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771244860/IMG_6537_1_xsoo91.mov",
                alt: "Permanent Paradise - Vue principale"
            },
       
            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771244837/IMG_6536_1_mqv093.mov",
                alt: "Crunch Berries - Vue principale"
            },

            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771244837/IMG_6535_1_aniznq.mov",
                alt: "PearlZ - Vue principale"
            },

            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771244838/IMG_6534_1_oxm7j3.mov",
                alt: "Glacier - Vue principale"
            },
        ],
        gallery_link: null,
        category_id: 1,
        unit_type: "gram",
        pricing: [
            { qty: 3.5, price: 70 },
            { qty: 14, price: 240 },
            { qty: 28, price: 400 },
            { qty: 56, price: 750 },
            { qty: 112, price: 1400 }
        ],
        variants: [ "Glacier", "PearlZ", "Crunch Berries","Permanent Paradise"]
    },

    

    // ===== GREENDawg =====
    {
        id: 7,
        name: "RX (RS11 × Gelato X) – Greendawg",
        description: "Top Shelf Exotic Flower – Bags 3.5g",
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771245991/photo_2026-02-16_19-46-15_iukenz.jpg",
                alt: "RX (RS11 × Gelato X) - Vue principale"
            },
            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771246248/IMG_6645_ry1h5p.mov",
                alt: "RX (RS11 × Gelato X) - Vue principale"
            },
        ],
        gallery_link: null,
        category_id: 1,
        unit_type: "gram",
        pricing: [
            { qty: 3.5, price: 90 },
            { qty: 14, price: 340 },
            { qty: 28, price: 640 },
        ],
        variants: []
    },

    // ===== LIVE ROSIN =====
    {
        id: 8,
        name: "Live Rosin – Bored Rosin",
        description: "Live Hash Rosin USA 120-70u 1-3 washes",          
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771231081/A459A9EA-82AB-4B06-98EF-3A0100DA673D_vhtlyk.jpg",
                alt: "Bored Rosin - Vue principale"
            },
        ],
        gallery_link: null,
        category_id: 2,
        unit_type: "gram",
        pricing: [
            { qty: 2, price: 180 },
            { qty: 6, price: 450 },
            { qty: 14, price: 900 },
            { qty: 28, price: 1700 }
        ],
        variants: ["Candy Fumez", "Black Maple", "Moroccan Peaches", "Strawguava"]
    },

    // ===== WATER HASH PREMIUM =====
    {
        id: 9,
        name: "Premium Grade WPFF ICE 707",
        description: "Single Source Premium Water Hash WPFF USA ",
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771246304/photo_2026-02-16_19-48-12_t2q48y.jpg",
                alt: "Static Hash - Vue principale"
            },
        
        {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771246032/IMG_6639_o2q1nb.mp4",
                alt: "Static Hash - Combustion"
            },
        ],
        gallery_link: null,
        category_id: 4,
        unit_type: "gram",
        pricing: [
            { qty: 5, price: 200 },
            { qty: 10, price: 350 },
            { qty: 20, price: 650 },
            { qty: 50, price: 1200 },
            { qty: 100, price: 2200 }
        ],
        variants: [
            "Oreoz Blizzard",
            "ZOAP",
            "Moroccan Peaches",
            "Grape Cream",
            "Orange Cream",
            "Ice Cream Cake",
            "GMO",
            "Garlic Nightmare"
        ]
    },

    // ===== WATER HASH COMMERCIAL =====
    {
        id: 10,
        name: "Water Hash – Commercial  WPFF ICE",
        description: "Commercial Grade Water Hash",
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771246304/photo_2026-02-16_19-48-12_t2q48y.jpg",
                alt: "Static Hash - Vue principale"
            },
            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771246032/IMG_6639_o2q1nb.mp4",
                alt: "Static Hash - Combustion"
            },
        ],
        gallery_link: null,
        category_id: 4,
        unit_type: "gram",
        pricing: [
            { qty: 5, price: 150 },
            { qty: 10, price: 260 },
            { qty: 20, price: 450 },
            { qty: 50, price: 1000 }
        ],
        variants: ["Sour Diesel", "White Runtz"]
    },

    // ===== STATIC HASH =====
    {
        id: 11,
        name: "Static Hash – Single Source Premium",
        description: "Premium Static Hash",
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771246304/photo_2026-02-16_19-48-12_t2q48y.jpg",
                alt: "Static Hash - Vue principale"
            },
            {
                type: "video",
                url: "https://res.cloudinary.com/divcybeds/video/upload/v1771246032/IMG_6639_o2q1nb.mp4",
                alt: "Static Hash - Combustion"
            },
        ],
        gallery_link: null,
        category_id: 3,
        unit_type: "gram",
        pricing: [
            { qty: 5, price: 200 },
            { qty: 10, price: 350 },
            { qty: 20, price: 650 },
            { qty: 50, price: 1500 }
        ],
        variants: [
            "Gov. Oasis (Meltalien)",
            "Mendo Punch (Meltalien)",
            "Tropicana Cherry (707melts)",
            "Grape Gas (707melts)"
        ]
    },

    // ===== VAPES =====
    {
        id: 12,
        name: "Whole Melt Vape – 100% Official",
        description: "Lab Tested + QR Code – 20+ Flavors Available",
        image_url: null,
        video_url: null,
        media_type: "image",
        media: [
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771246562/photo_2026-02-16_19-55-49_p0acwv.jpg",
                alt: "Vapes Visual 1"
            },
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771246562/photo_2026-02-16_19-55-45_z9rluj.jpg",
                alt: "Vapes Visual 2"
            },
            {
                type: "image",
                url: "https://res.cloudinary.com/divcybeds/image/upload/v1771246562/photo_2026-02-16_19-55-51_lhfbfb.jpg",
                alt: "Vapes Visual 3"
            },
        ],
        gallery_link: null,
        category_id: 5,
        unit_type: "unit",
        pricing: [
            { qty: 1, price: 80 },
            { qty: 5, price: 350 },
            { qty: 10, price: 600 },
            { qty: 25, price: 1375 },
            { qty: 50, price: 2300 },
            { qty: 100, price: 3500 },
            { qty: 200, price: 6800 },
            { qty: 300, price: 9000 }
        ],
        variants: []
    }

    // 👇 Pour AJOUTER un nouveau produit, ajoutez une VIRGULE ci-dessus et copiez ceci :
    /*
    ,
    {
        id: 4,                              // Nouveau numéro unique
        name: "Votre nouveau produit",
        description: "Description de votre produit",
        image_url: "https://votreimage.com/photo.jpg",
        video_url: null,
        media_type: "image",
        gallery_link: null,
        category_id: 1,
        unit_type: "gram",
        pricing: [
            { qty: 1, price: 15 }
        ],
        variants: null
    }
    */
];

// =============================================
// 🔒 CODE APP — NE PAS MODIFIER
// =============================================
let cart = [];
let selectedPricingIdx = null;
let selectedVariantIdxs = [];
let currentProduct = null;
let selectedCategory = null;
let contactUrls = { signalUrl: null, threemaUrl: null };
let cartSyncTimer = null;

function getLocalCartKey() {
  // Cart persisté par utilisateur Telegram (via `user.id` dans initData)
  const init = getInitData();
  if (!init) return 'ac_cart_guest';
  try {
    const params = new URLSearchParams(init);
    const userStr = params.get('user');
    if (!userStr) return 'ac_cart_guest';
    const user = JSON.parse(decodeURIComponent(userStr));
    if (!user?.id) return 'ac_cart_guest';
    return `ac_cart_${user.id}`;
  } catch {
    return 'ac_cart_guest';
  }
}

function persistCart() {
  try {
    const key = getLocalCartKey();
    localStorage.setItem(key, JSON.stringify({ cart }));
  } catch {
    // localStorage peut être bloqué dans certains WebViews : on ignore
  }
}

function restoreCart() {
  try {
    const key = getLocalCartKey();
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.cart)) return false;
    cart = parsed.cart;
    return true;
  } catch {
    return false;
  }
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
    try {
        const r = await fetch(POINTS_API_URL + '/api/products?t=' + Date.now(), {
            cache: 'no-store',
            headers: catalogApiHeaders()
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
}

async function loadContactUrls() {
    if (!POINTS_API_URL) return;
    try {
        const r = await fetch(POINTS_API_URL + '/api/config', {
            cache: 'no-store',
            headers: catalogApiHeaders()
        });
        if (r.status === 401) return;
        const d = await r.json();
        if (d && (d.signalUrl || d.threemaUrl)) contactUrls = { signalUrl: d.signalUrl || null, threemaUrl: d.threemaUrl || null };
    } catch (e) {}
}

function init() {
    document.title = "Alpine Connexion";
    const tg = window.Telegram?.WebApp;
    if (tg) {
        try {
            tg.ready();
            tg.expand();
        } catch (e) {}
    }
    (async () => {
        if (isTelegramWebApp()) await waitForInitData();
        // Restaurer le panier avant le rendu UI (pour que le badge + contenu soient cohérents).
        restoreCart();
        await loadCatalog();
        const appEl = document.getElementById('app');
        if (appEl && appEl.classList.contains('hidden')) return;
        await loadContactUrls();
        buildFilters();
        applyTranslations();
        renderProducts();
        updateCartBadge();
        if (cart.length) scheduleCartActivitySync();
    })();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') refreshCatalog();
    });
}

function showView(viewName) {
    const catalogView = document.getElementById('view-catalog');
    const navCatalog = document.getElementById('nav-catalog');
    if (catalogView) catalogView.classList.remove('hidden');
    if (navCatalog) navCatalog.classList.add('active');
    navCatalog?.setAttribute('aria-current', 'page');
}

function buildFilters() {
    const sel = document.getElementById('filter-category');
    const list = catalogCategories.length ? catalogCategories : CATEGORIES;
    list.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', e => {
        selectedCategory = e.target.value ? parseInt(e.target.value) : null;
        renderProducts();
    });
}

function refreshCategoryFilter() {
    const sel = document.getElementById('filter-category');
    if (!sel) return;
    while (sel.options.length > 1) sel.remove(1);
    const list = catalogCategories.length ? catalogCategories : CATEGORIES;
    list.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

async function refreshCatalog() {
    await loadCatalog();
    refreshCategoryFilter();
    renderProducts();
}

function getPrimaryMedia(product) {
    if (Array.isArray(product.media) && product.media.length > 0) {
        return product.media[0];
    }
    return null;
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

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const list = catalogProducts.length ? catalogProducts : PRODUCTS;
    let filtered = selectedCategory !== null
        ? list.filter(p => p.category_id === selectedCategory)
        : [...list];

    if (!filtered.length) {
        grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📦</div><p>${t('no_products')}</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        let media = '';
        const badges = getProductBadges(p).slice(0, 2);
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
                const thumb = primary.thumbnail ? ` poster="${escapeHtml(primary.thumbnail)}"` : '';
                media = `<video src="${escapeHtml(primary.url)}#t=0.1"${thumb} playsinline muted preload="metadata"></video>`;
            } else {
                media = `<img src="${escapeHtml(primary.url)}" alt="${escapeHtml(primary.alt || p.name)}" loading="lazy">`;
            }
        } else if (p.media_type === 'video' && p.video_url) {
            media = `<video src="${escapeHtml(p.video_url)}#t=0.1" playsinline muted preload="metadata"></video>`;
        } else if (p.image_url) {
            media = `<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy">`;
        } else {
            media = '<div class="product-media-placeholder">🌿</div>';
        }

        const fp = p.pricing?.[0];
        const price = fp ? `<span class="price-from">${t('price_from_prefix')}</span>${fp.price} ${CURRENCY}` : '';

        return `
            <div class="product-card" onclick="openProduct(${p.id})">
                <div class="product-media-wrap">${badgeHtml}${media}</div>
                <div class="product-card-body">
                    <div class="product-card-name">${escapeHtml(p.name)}</div>
                    <div class="product-card-desc">${escapeHtml((p.description||'').split('\n')[0])}</div>
                    <div class="product-card-price">${price}</div>
                </div>
            </div>`;
    }).join('');
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
        media = `<video src="${escapeHtml(p.video_url)}" class="modal-media" controls playsinline preload="metadata"></video>`;
    } else if (p.image_url) {
        media = `<img src="${escapeHtml(p.image_url)}" class="modal-media" alt="${escapeHtml(p.name)}">`;
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

    const unit = p.unit_type === 'gram'
        ? 'g'
        : (currentLang === 'en' ? 'unit(s)' : currentLang === 'de' ? 'Einheit(en)' : 'unité(s)');
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
            <button class="btn-add-cart" id="btn-add" onclick="addToCart()" disabled>${t('btn_add_cart')}</button>
        </div>`;

    if (Array.isArray(p.media) && p.media.length > 0) {
        initModalCarousel();
    }

    document.getElementById('product-modal').classList.add('active');
}

// =========================
// 🎞️ Carousel dans la modal
// =========================
function buildModalCarouselHtml(product) {
    const mediaItems = Array.isArray(product.media) ? product.media : [];
    const slides = mediaItems.map((m, index) => {
        const isActive = index === 0 ? ' active' : '';
        if (m.type === 'video') {
            const thumb = m.thumbnail ? ` poster="${escapeHtml(m.thumbnail)}"` : '';
            return `
                <div class="carousel-slide${isActive}" data-index="${index}">
                    <video src="${escapeHtml(m.url)}"${thumb} controls playsinline preload="metadata" class="carousel-video"></video>
                </div>`;
        }
        return `
            <div class="carousel-slide${isActive}" data-index="${index}">
                <img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.alt || product.name)}" class="carousel-image">
            </div>`;
    }).join('');

    const indicators = mediaItems.map((_, index) => {
        const isActive = index === 0 ? ' active' : '';
        return `<button class="indicator${isActive}" data-target-index="${index}" aria-label="Aller au média ${index + 1}"></button>`;
    }).join('');

    const thumbs = mediaItems.map((m, index) => {
        const isActive = index === 0 ? ' active' : '';
        if (m.type === 'video') {
            // <img> ne peut pas afficher un .mp4 → on utilise <video> pour afficher la 1ère frame
            const poster = m.thumbnail ? ` poster="${escapeHtml(m.thumbnail)}"` : '';
            return `
                <div class="thumbnail${isActive}" data-target-index="${index}">
                    <div class="video-thumbnail">
                        <video src="${escapeHtml(m.url)}"${poster} muted playsinline preload="metadata" aria-label="${escapeHtml(m.alt || product.name)}"></video>
                        <div class="play-icon">▶</div>
                    </div>
                </div>`;
        }
        return `
            <div class="thumbnail${isActive}" data-target-index="${index}">
                <img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.alt || product.name)}">
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

        // Quand on affiche la slide vidéo, forcer le chargement pour qu'elle s'affiche (sinon reste noir)
        const activeSlide = slides[currentIndex];
        const video = activeSlide ? activeSlide.querySelector('video') : null;
        if (video) {
            video.load();
        }
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

function pickVariant(i) {
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
    selectedPricingIdx = i;
    document.querySelectorAll('.pricing-row').forEach((el,j) => el.classList.toggle('selected', j===i));
    updateBtn();
}

function updateBtn() {
    const btn = document.getElementById('btn-add');
    if (!btn) return;
    const hv = currentProduct?.variants?.length > 0;
    btn.disabled = !(selectedPricingIdx !== null && (!hv || (Array.isArray(selectedVariantIdxs) && selectedVariantIdxs.length > 0)));
}

function addToCart() {
    if (!currentProduct || selectedPricingIdx === null) return;
    const t = currentProduct.pricing[selectedPricingIdx];
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
        qty: t.qty,
        price: t.price,
        variant: v
    });

    updateCartBadge();
    persistCart();
    scheduleCartActivitySync();
    closeProductModal();
    showToast(t('toast_added'));
    const fab = document.getElementById('cart-fab');
    fab.style.transform = 'scale(1.25)';
    setTimeout(() => fab.style.transform = '', 300);
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

    let total = 0;
    let h = '';
    cart.forEach((item, i) => {
        total += item.price;
        const u = item.unit_type === 'gram' ? 'g' : 'unité(s)';
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
            <span class="cart-total-label">${t('total_label')}</span>
            <span class="cart-total-amount">${total.toFixed(2)} ${CURRENCY}</span>
        </div>
        <button type="button" class="btn-checkout" onclick="checkout()">${t('cart_btn_submit')}</button>
    `;
    h += `</div>`;
    c.innerHTML = h;
}

function removeFromCart(i) {
    cart.splice(i, 1);
    updateCartBadge();
    persistCart();
    scheduleCartActivitySync();
    renderCart();
}

function openContactUrl(btn) {
    const url = btn && btn.getAttribute && btn.getAttribute('data-contact-url');
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

function copyOrderToClipboard() {
    const text = buildOrderText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast('✓ Copié')).catch(() => {});
    } else {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('✓ Copié');
    }
}

function buildOrderText() {
    let total = 0;
    let msg = `${t('order_header')}\n\n`;
    cart.forEach((item, i) => {
        const u = item.unit_type === 'gram'
            ? 'g'
            : (currentLang === 'en' ? 'unit(s)' : currentLang === 'de' ? 'Einheit(en)' : 'unité(s)');
        msg += `${i+1}. ${item.name}`;
        if (item.variant) msg += ` (${item.variant})`;
        msg += `\n   📦 ${item.qty} ${u} — ${item.price} ${CURRENCY}\n\n`;
        total += item.price;
    });
    msg += `${t('order_total')} : ${total.toFixed(2)} ${CURRENCY}`;
    return msg;
}

async function checkout() {
    if (!cart.length) return;
    const orderText = buildOrderText();

    if (POINTS_API_URL && getInitData()) {
        try {
            const res = await fetch(`${POINTS_API_URL}/api/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: getInitData(), orderText })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.ok) {
                cart = [];
                updateCartBadge();
                persistCart();
                scheduleCartActivitySync();
                closeCart();
                showToast(t('order_sent'));
                if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
                return;
            }
        } catch (e) {}
    }

    if (getInitData()) {
        showToast(t('order_send_failed'));
        return;
    }
    showToast(t('cart_need_telegram'));
}

function showToast(text) {
    const t = document.getElementById('toast');
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', init);

