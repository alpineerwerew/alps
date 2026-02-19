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

// ⭐ API points / récompenses (backend bot) — mets l'URL de ton API (ex: https://ton-bot.onrender.com)
const POINTS_API_URL = "https://alpine710.art";  // API points / récompenses (même domaine que le site)

// =============================================
// 🌐 LANGUES / I18Nvu
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
        points_label: 'pts',
        rewards_title: 'Récompenses',
        rewards_intro: 'Échange tes points contre des avantages.',
        redeem_btn: 'Échanger',
        redeem_success: 'Échangé ! On l\'appliquera à ta prochaine commande.',
        redeem_error: 'Pas assez de points.',
        open_in_telegram: 'Ouvre depuis Telegram pour gagner des points',
        checkout_hint: 'Envoie le message dans Telegram pour confirmer ta commande.',
        referral_title: 'Parrainage',
        referral_link_title: 'Ton lien de parrainage',
        referral_intro: 'Partage ce lien (il ouvre le bot Telegram). Quand quelqu\'un passe sa première commande après avoir cliqué, tu reçois des points.',
        referral_link_label: 'Ton lien',
        copy_link: 'Copier',
        copy_link_long: 'Copier le lien',
        points_progress_title: 'Tes points',
        nav_catalog: 'Catalogue',
        nav_reviews: 'Avis',
        reviews_title: 'Avis clients',
        reviews_intro: 'Découvrez ce que disent nos clients. Tu peux aussi laisser ton avis (depuis Telegram).',
        review_placeholder: 'Écris ton avis ici…',
        submit_review: 'Publier mon avis',
        review_success: 'Merci ! Ton avis a été envoyé. Il sera publié après validation.',
        review_pending: 'Avis en attente de validation.',
        review_error_telegram: 'Ouvre le site depuis Telegram pour laisser un avis.',
        no_reviews_yet: 'Aucun avis pour le moment. Sois le premier !',
        review_form_title: 'Laisser un avis',
        review_media_label: 'Photo ou vidéo (optionnel, 1 à 5)',
        order_sent: 'Commande envoyée ! On te répond sur Telegram.'
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
        points_label: 'pts',
        rewards_title: 'Rewards',
        rewards_intro: 'Exchange your points for perks.',
        redeem_btn: 'Redeem',
        redeem_success: 'Redeemed! We\'ll apply it to your next order.',
        redeem_error: 'Not enough points.',
        open_in_telegram: 'Open from Telegram to earn points',
        checkout_hint: 'Send the message in Telegram to confirm your order.',
        referral_title: 'Referral',
        referral_link_title: 'Your referral link',
        referral_intro: 'Share this link (it opens the Telegram bot). When someone places their first order after clicking, you get points.',
        referral_link_label: 'Your link',
        copy_link: 'Copy',
        copy_link_long: 'Copy link',
        points_progress_title: 'Your points',
        nav_catalog: 'Catalog',
        nav_reviews: 'Reviews',
        reviews_title: 'Customer reviews',
        reviews_intro: 'See what our customers say. You can leave a review too (from Telegram).',
        review_placeholder: 'Write your review here…',
        submit_review: 'Submit my review',
        review_success: 'Thank you! Your review has been sent. It will be published after approval.',
        review_pending: 'Review pending approval.',
        review_error_telegram: 'Open the site from Telegram to leave a review.',
        no_reviews_yet: 'No reviews yet. Be the first!',
        review_form_title: 'Leave a review',
        review_media_label: 'Photo or video (optional, 1 to 5)',
        order_sent: 'Order sent! We\'ll reply on Telegram.'
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
        points_label: 'Pkt',
        rewards_title: 'Belohnungen',
        rewards_intro: 'Tausche Punkte gegen Vorteile.',
        redeem_btn: 'Einlösen',
        redeem_success: 'Eingelöst! Wir wenden es bei deiner nächsten Bestellung an.',
        redeem_error: 'Nicht genug Punkte.',
        open_in_telegram: 'Öffne über Telegram, um Punkte zu sammeln',
        checkout_hint: 'Sende die Nachricht in Telegram, um deine Bestellung zu bestätigen.',
        referral_title: 'Empfehlung',
        referral_link_title: 'Dein Empfehlungslink',
        referral_intro: 'Teile diesen Link (er öffnet den Telegram-Bot). Wenn jemand nach dem Klick die erste Bestellung aufgibt, erhältst du Punkte.',
        referral_link_label: 'Dein Link',
        copy_link: 'Kopieren',
        copy_link_long: 'Link kopieren',
        points_progress_title: 'Deine Punkte',
        nav_catalog: 'Katalog',
        nav_reviews: 'Bewertungen',
        reviews_title: 'Kundenbewertungen',
        reviews_intro: 'Sieh, was unsere Kunden sagen. Du kannst auch eine Bewertung schreiben (über Telegram).',
        review_placeholder: 'Schreib hier deine Bewertung…',
        submit_review: 'Bewertung senden',
        review_success: 'Danke! Deine Bewertung wurde gesendet. Sie wird nach Prüfung veröffentlicht.',
        review_pending: 'Bewertung wartet auf Freigabe.',
        review_error_telegram: 'Öffne die Seite über Telegram, um eine Bewertung zu hinterlassen.',
        no_reviews_yet: 'Noch keine Bewertungen. Sei der Erste!',
        review_form_title: 'Bewertung schreiben',
        review_media_label: 'Foto oder Video (optional, 1 bis 5)',
        order_sent: 'Bestellung gesendet! Wir antworten dir auf Telegram.'
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
let userPoints = null;       // null = inconnu, number = solde
let rewardsList = [];
let reviewsData = [];
let selectedReviewRating = null;
let selectedReviewFiles = [];

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

async function fetchPoints() {
    if (!POINTS_API_URL || !getInitData()) return;
    try {
        const res = await fetch(`${POINTS_API_URL}/api/points?initData=${encodeURIComponent(getInitData())}`);
        if (res.ok) {
            const data = await res.json();
            userPoints = data.points;
            updatePointsUI();
        }
    } catch (e) {
        userPoints = null;
        updatePointsUI();
    }
}

async function fetchRewards() {
    if (!POINTS_API_URL) return;
    try {
        const res = await fetch(`${POINTS_API_URL}/api/rewards`);
        if (res.ok) rewardsList = await res.json();
    } catch (e) {
        rewardsList = [];
    }
}

const POINTS_BAR_MAX = 200;

function updatePointsUI() {
    const el = document.getElementById('points-badge');
    const wrap = document.getElementById('points-badge-wrap');
    const miniFill = document.getElementById('points-bar-mini-fill');
    if (el) {
        if (userPoints === null) {
            el.textContent = '⭐ —';
            if (wrap) wrap.title = t('open_in_telegram');
        } else {
            el.textContent = `⭐ ${userPoints} ${t('points_label')}`;
            if (wrap) wrap.title = t('rewards_title');
        }
    }
    if (miniFill) {
        const pct = userPoints != null ? Math.min(100, (userPoints / POINTS_BAR_MAX) * 100) : 0;
        miniFill.style.width = pct + '%';
    }
    const modalFill = document.getElementById('points-bar-fill');
    const modalVal = document.getElementById('points-progress-value');
    if (modalFill) {
        const pct = userPoints != null ? Math.min(100, (userPoints / POINTS_BAR_MAX) * 100) : 0;
        modalFill.style.width = pct + '%';
    }
    if (modalVal) modalVal.textContent = userPoints != null ? userPoints + ' ' + t('points_label') : '—';
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
    updatePointsUI();
    const rewardsTitle = document.getElementById('rewards-title');
    if (rewardsTitle) rewardsTitle.textContent = t('rewards_title');
    const rewardsIntro = document.getElementById('rewards-intro');
    if (rewardsIntro) rewardsIntro.textContent = t('rewards_intro');
    const navCatalogLabel = document.getElementById('nav-catalog-label');
    if (navCatalogLabel) navCatalogLabel.textContent = t('nav_catalog');
    const navReviewsLabel = document.getElementById('nav-reviews-label');
    if (navReviewsLabel) navReviewsLabel.textContent = t('nav_reviews');
    const reviewsPageTitle = document.getElementById('reviews-page-title');
    if (reviewsPageTitle) reviewsPageTitle.textContent = t('reviews_title');
    const reviewsPageIntro = document.getElementById('reviews-page-intro');
    if (reviewsPageIntro) reviewsPageIntro.textContent = t('reviews_intro');
    const reviewFormTitle = document.getElementById('review-form-title');
    if (reviewFormTitle) reviewFormTitle.textContent = t('review_form_title');
    const reviewInput = document.getElementById('review-input');
    if (reviewInput) reviewInput.placeholder = t('review_placeholder');
    const btnSubmitReview = document.getElementById('btn-submit-review');
    if (btnSubmitReview) btnSubmitReview.textContent = t('submit_review');
    const reviewFormHint = document.getElementById('review-form-hint');
    if (reviewFormHint) reviewFormHint.textContent = getInitData() ? '' : t('review_error_telegram');
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
    { id: 4, name: "Water Hash 🧊" }
];

// =============================================
// 📦 PRODUITS — AJOUTE TES PRODUITS ICI
// =============================================
// 👇 REMPLACEZ CES PRODUITS PAR LES VÔTRES !
// Chaque produit suit cette structure. Copiez-collez pour ajouter plus de produits.
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
let selectedVariantIdx = null;
let currentProduct = null;
let selectedCategory = null;

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function init() {
    document.title = "Alpine Connexion";
    buildFilters();
    applyTranslations();
    renderProducts();
    if (POINTS_API_URL) {
        fetchRewards();
        fetchPoints();
    } else {
        updatePointsUI();
    }
    registerReferralIfPresent();
    initReviewsSection();
    if (POINTS_API_URL) fetchReviews();
    try {
        const tg = window.Telegram?.WebApp;
        if (tg) { tg.expand(); tg.ready(); }
    } catch(e) {}
}

function registerReferralIfPresent() {
    if (!POINTS_API_URL || !getInitData()) return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref) return;
    fetch(`${POINTS_API_URL}/api/referral/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: getInitData(), referrerId: ref })
    }).then(() => {}).catch(() => {});
}

function showView(viewName) {
    const catalogView = document.getElementById('view-catalog');
    const reviewsView = document.getElementById('view-reviews');
    const navCatalog = document.getElementById('nav-catalog');
    const navReviews = document.getElementById('nav-reviews');
    if (viewName === 'reviews') {
        if (catalogView) catalogView.classList.add('hidden');
        if (reviewsView) reviewsView.classList.remove('hidden');
        if (navCatalog) navCatalog.classList.remove('active');
        if (navReviews) navReviews.classList.add('active');
        navReviews?.setAttribute('aria-current', 'page');
        navCatalog?.removeAttribute('aria-current');
        fetchReviews();
    } else {
        if (catalogView) catalogView.classList.remove('hidden');
        if (reviewsView) reviewsView.classList.add('hidden');
        if (navCatalog) navCatalog.classList.add('active');
        if (navReviews) navReviews.classList.remove('active');
        navCatalog?.setAttribute('aria-current', 'page');
        navReviews?.removeAttribute('aria-current');
    }
}

async function fetchReviews() {
    if (!POINTS_API_URL) return;
    try {
        const res = await fetch(`${POINTS_API_URL}/api/reviews`);
        if (res.ok) {
            reviewsData = await res.json();
            renderReviews();
        }
    } catch (e) {
        reviewsData = [];
        renderReviews();
    }
}

function renderReviews() {
    const listEl = document.getElementById('reviews-list');
    if (!listEl) return;
    if (!reviewsData.length) {
        listEl.innerHTML = `<p class="reviews-empty">${escapeHtml(t('no_reviews_yet'))}</p>`;
        return;
    }
    listEl.innerHTML = reviewsData.map((r) => {
        const stars = r.rating != null ? '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) : '';
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : currentLang === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        const isVideo = (url) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || '');
        const mediaHtml = (r.media && r.media.length) ? r.media.map((m) => {
            if (!m.url) return '';
            if (isVideo(m.url)) return `<video src="${escapeHtml(m.url)}" class="review-card-media review-card-video" controls playsinline preload="metadata"></video>`;
            return `<img src="${escapeHtml(m.url)}" alt="" class="review-card-media" loading="lazy" />`;
        }).join('') : '';
        return `<article class="review-card">
            <div class="review-card-header">
                <span class="review-card-name">${escapeHtml(r.userName)}</span>
                ${r.rating != null ? `<span class="review-card-stars" aria-label="${r.rating}/5">${stars}</span>` : ''}
            </div>
            ${mediaHtml ? `<div class="review-card-media-wrap">${mediaHtml}</div>` : ''}
            ${r.text && r.text !== '—' ? `<p class="review-card-text">${escapeHtml(r.text)}</p>` : ''}
            ${dateStr ? `<time class="review-card-date">${escapeHtml(dateStr)}</time>` : ''}
        </article>`;
    }).join('');
}

function renderReviewPreview() {
    const mediaPreview = document.getElementById('review-media-preview');
    if (!mediaPreview) return;
    mediaPreview.querySelectorAll('.review-preview-item-wrap').forEach((w) => {
        const src = w.querySelector('.review-preview-item')?.src;
        if (src && src.startsWith('blob:')) URL.revokeObjectURL(src);
    });
    mediaPreview.innerHTML = '';
    selectedReviewFiles.forEach((file, index) => {
        const isV = file.type.startsWith('video/');
        const wrap = document.createElement('div');
        wrap.className = 'review-preview-item-wrap';
        const el = isV ? document.createElement('video') : document.createElement('img');
        el.className = 'review-preview-item';
        el.src = URL.createObjectURL(file);
        if (isV) { el.controls = true; el.playsInline = true; }
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'review-preview-remove';
        removeBtn.setAttribute('aria-label', 'Remove');
        removeBtn.textContent = '×';
        removeBtn.onclick = function () {
            selectedReviewFiles.splice(index, 1);
            renderReviewPreview();
        };
        wrap.appendChild(el);
        wrap.appendChild(removeBtn);
        mediaPreview.appendChild(wrap);
    });
}

function initReviewsSection() {
    const reviewInput = document.getElementById('review-input');
    const btnSubmit = document.getElementById('btn-submit-review');
    const starsWrap = document.getElementById('review-stars');
    const hint = document.getElementById('review-form-hint');
    const mediaLabel = document.getElementById('review-media-label');
    const mediaInput = document.getElementById('review-media-input');
    const mediaPreview = document.getElementById('review-media-preview');
    if (mediaLabel) mediaLabel.textContent = t('review_media_label');
    if (hint) hint.textContent = getInitData() ? '' : t('review_error_telegram');
    if (mediaInput && mediaPreview) {
        mediaInput.addEventListener('change', function () {
            const files = Array.from(this.files || []).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/')).slice(0, 5);
            selectedReviewFiles = selectedReviewFiles.concat(files).slice(0, 5);
            this.value = '';
            renderReviewPreview();
        });
    }
    if (starsWrap) {
        starsWrap.querySelectorAll('.star').forEach((btn) => {
            btn.addEventListener('click', () => {
                selectedReviewRating = parseInt(btn.getAttribute('data-rating'), 10);
                starsWrap.querySelectorAll('.star').forEach((b) => {
                    const r = parseInt(b.getAttribute('data-rating'), 10);
                    b.classList.toggle('active', r <= selectedReviewRating);
                });
            });
        });
    }
    if (btnSubmit) {
        btnSubmit.onclick = submitReview;
    }
}

async function submitReview() {
    const reviewInput = document.getElementById('review-input');
    const text = reviewInput && reviewInput.value ? reviewInput.value.trim() : '';
    const files = selectedReviewFiles.slice(0, 5);
    const hasMedia = files.length > 0;
    if (!hasMedia && text.length < 2) {
        showToast(t('review_placeholder'));
        return;
    }
    if (!getInitData()) {
        showToast(t('review_error_telegram'));
        return;
    }
    if (!POINTS_API_URL) return;
    const btn = document.getElementById('btn-submit-review');
    if (btn) btn.disabled = true;
    try {
        let res;
        if (hasMedia) {
            const form = new FormData();
            form.append('initData', getInitData());
            form.append('text', text || '—');
            if (selectedReviewRating != null) form.append('rating', String(selectedReviewRating));
            files.forEach((f) => form.append('media', f));
            res = await fetch(`${POINTS_API_URL}/api/reviews/upload`, { method: 'POST', body: form });
        } else {
            res = await fetch(`${POINTS_API_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: getInitData(), text, rating: selectedReviewRating || undefined })
            });
        }
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
            reviewInput.value = '';
            selectedReviewRating = null;
            selectedReviewFiles = [];
            renderReviewPreview();
            document.getElementById('review-media-input').value = '';
            document.getElementById('review-stars')?.querySelectorAll('.star').forEach((b) => b.classList.remove('active'));
            if (data.pending) {
                showToast(t('review_success'));
            } else if (data.review) {
                reviewsData.unshift(data.review);
                renderReviews();
                showToast(t('review_success'));
            } else {
                showToast(t('review_success'));
            }
        } else {
            showToast(data.error || 'Error');
        }
    } catch (e) {
        showToast('Error');
    }
    if (btn) btn.disabled = false;
}

let referralLinkValue = '';

async function openRewardsModal() {
    const modal = document.getElementById('rewards-modal');
    if (!modal) return;
    if (POINTS_API_URL && getInitData()) await fetchPoints();
    document.getElementById('rewards-title').textContent = t('rewards_title');
    document.getElementById('rewards-intro').textContent = t('rewards_intro');
    const refTitle = document.getElementById('referral-title');
    const refIntro = document.getElementById('referral-intro');
    const refInput = document.getElementById('referral-link-input');
    const refCopyBtn = document.getElementById('referral-copy-btn');
    const refBlock = document.getElementById('referral-block');
    if (refTitle) refTitle.textContent = t('referral_link_title');
    if (refIntro) refIntro.textContent = t('referral_intro');
    if (refCopyBtn) refCopyBtn.textContent = t('copy_link_long');
    const progressLabel = document.getElementById('points-progress-label');
    if (progressLabel) progressLabel.textContent = t('points_progress_title');
    const paliersEl = document.getElementById('points-paliers');
    if (paliersEl && rewardsList.length) {
        const labelKey = currentLang === 'en' ? 'label_en' : currentLang === 'de' ? 'label_de' : 'label_fr';
        paliersEl.innerHTML = rewardsList.map((r) => {
            const label = r[labelKey] || r.label_fr || r.label_en || r.id;
            return `<span class="palier-item">${r.points} ${t('points_label')} = ${escapeHtml(label)}</span>`;
        }).join('');
    }
    updatePointsUI();
    referralLinkValue = '';
    if (POINTS_API_URL && getInitData()) {
        try {
            const res = await fetch(`${POINTS_API_URL}/api/referral/me?initData=${encodeURIComponent(getInitData())}`);
            if (res.ok) {
                const data = await res.json();
                referralLinkValue = data.referralLink || '';
            }
        } catch (e) {}
    }
    if (refInput) refInput.value = referralLinkValue || '';
    if (refBlock) refBlock.style.display = referralLinkValue ? 'block' : 'none';
    if (refCopyBtn) {
        refCopyBtn.onclick = function() {
            if (referralLinkValue && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(referralLinkValue).then(() => showToast(t('copy_link') + ' ✓'));
            } else if (referralLinkValue) {
                refInput.select();
                document.execCommand('copy');
                showToast(t('copy_link') + ' ✓');
            }
        };
    }
    const listEl = document.getElementById('rewards-list');
    const labelKey = currentLang === 'en' ? 'label_en' : currentLang === 'de' ? 'label_de' : 'label_fr';
    listEl.innerHTML = rewardsList.map((r) => {
        const label = r[labelKey] || r.label_fr || r.label_en || r.id;
        const canRedeem = userPoints !== null && userPoints >= r.points;
        return `<div class="rewards-item">
            <span class="rewards-item-label">${escapeHtml(label)}</span>
            <span class="rewards-item-points">${r.points} ${t('points_label')}</span>
            <button class="btn-redeem" ${canRedeem ? '' : 'disabled'} onclick="redeemReward('${escapeHtml(r.id)}')">${t('redeem_btn')}</button>
        </div>`;
    }).join('') || '<p class="rewards-empty">Aucune récompense configurée.</p>';
    modal.classList.add('active');
}

function closeRewardsModal(e) {
    if (e && e.target.id !== 'rewards-modal') return;
    document.getElementById('rewards-modal').classList.remove('active');
}

async function redeemReward(rewardId) {
    if (!POINTS_API_URL || !getInitData()) {
        showToast(t('open_in_telegram'));
        return;
    }
    try {
        const res = await fetch(`${POINTS_API_URL}/api/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: getInitData(), rewardId })
        });
        const data = await res.json();
        if (res.ok) {
            userPoints = data.points;
            updatePointsUI();
            const modal = document.getElementById('rewards-modal');
            if (modal && modal.classList.contains('active')) {
                const listEl = document.getElementById('rewards-list');
                const labelKey = currentLang === 'en' ? 'label_en' : currentLang === 'de' ? 'label_de' : 'label_fr';
                listEl.innerHTML = rewardsList.map((r) => {
                    const label = r[labelKey] || r.label_fr || r.label_en || r.id;
                    const canRedeem = userPoints !== null && userPoints >= r.points;
                    return `<div class="rewards-item">
                        <span class="rewards-item-label">${escapeHtml(label)}</span>
                        <span class="rewards-item-points">${r.points} ${t('points_label')}</span>
                        <button class="btn-redeem" ${canRedeem ? '' : 'disabled'} onclick="redeemReward('${escapeHtml(r.id)}')">${t('redeem_btn')}</button>
                    </div>`;
                }).join('') || '<p class="rewards-empty">Aucune récompense configurée.</p>';
            }
            showToast(t('redeem_success'));
        } else {
            showToast(data.error === 'Not enough points' ? t('redeem_error') : (data.error || 'Error'));
        }
    } catch (e) {
        showToast('Error');
    }
}

function buildFilters() {
    const sel = document.getElementById('filter-category');
    CATEGORIES.forEach(c => {
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

function getPrimaryMedia(product) {
    if (Array.isArray(product.media) && product.media.length > 0) {
        return product.media[0];
    }
    return null;
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    let filtered = selectedCategory !== null
        ? PRODUCTS.filter(p => p.category_id === selectedCategory)
        : [...PRODUCTS];

    if (!filtered.length) {
        grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📦</div><p>${t('no_products')}</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        let media = '';

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
                <div class="product-media-wrap">${media}</div>
                <div class="product-card-body">
                    <div class="product-card-name">${escapeHtml(p.name)}</div>
                    <div class="product-card-desc">${escapeHtml((p.description||'').split('\n')[0])}</div>
                    <div class="product-card-price">${price}</div>
                </div>
            </div>`;
    }).join('');
}

function openProduct(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    currentProduct = p;
    selectedPricingIdx = null;
    selectedVariantIdx = null;

    const cat = CATEGORIES.find(c => c.id === p.category_id);

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
    selectedVariantIdx = i;
    document.querySelectorAll('.variant-chip').forEach((el,j) => el.classList.toggle('selected', j===i));
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
    btn.disabled = !(selectedPricingIdx !== null && (!hv || selectedVariantIdx !== null));
}

function addToCart() {
    if (!currentProduct || selectedPricingIdx === null) return;
    const t = currentProduct.pricing[selectedPricingIdx];
    const v = (currentProduct.variants && selectedVariantIdx !== null) ? currentProduct.variants[selectedVariantIdx] : null;

    cart.push({
        name: currentProduct.name,
        unit_type: currentProduct.unit_type,
        qty: t.qty,
        price: t.price,
        variant: v
    });

    updateCartBadge();
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
        <p class="checkout-hint">${t('checkout_hint')}</p>
        <button class="btn-checkout" onclick="checkout()">${t('btn_checkout')}</button>
    </div>`;
    c.innerHTML = h;
}

function removeFromCart(i) {
    cart.splice(i, 1);
    updateCartBadge();
    renderCart();
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
                closeCart();
                showToast(t('order_sent'));
                if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
                return;
            }
        } catch (e) {}
    }

    const destination = getTelegramDestination();
    const url = `https://t.me/${destination}?text=${encodeURIComponent(orderText)}`;
    const tg = window.Telegram?.WebApp;
    if (tg) {
        try {
            tg.openTelegramLink(url);
        } catch (e) {
            window.open(url, '_blank');
        }
    } else {
        window.open(url, '_blank');
    }
    showToast(t('checkout_hint'));
    cart = [];
    updateCartBadge();
    closeCart();
}

function showToast(text) {
    const t = document.getElementById('toast');
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', init);

// Rafraîchir les points quand l'utilisateur revient sur l'onglet (ex. après avoir envoyé la commande dans Telegram)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && POINTS_API_URL && getInitData()) {
        fetchPoints();
    }
});

