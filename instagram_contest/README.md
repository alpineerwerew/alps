# Concours Instagram — mentions + bot Telegram

Application **Python 3.11+** asynchrone : **FastAPI** reçoit les webhooks Meta (Instagram), enregistre les participants en **SQLite** (SQLAlchemy async), et un bot **python-telegram-bot** notifie l’admin et gère les commandes du concours.

## Architecture (fichiers)

| Fichier | Rôle |
|--------|------|
| `app/main.py` | Application FastAPI, **lifespan** : init DB + démarrage du polling Telegram. |
| `app/webhook.py` | `GET /webhook` (challenge Meta), `POST /webhook` — **uniquement** mentions en Story (`messages` + pièce jointe `story_mention`), vérif signature, rate limit. |
| `app/telegram_bot.py` | Commandes `/participants`, `/tirage`, `/clear`, `/stats`, optionnellement `/export`. |
| `app/notifications.py` | Envoi des messages privés admin (découplé des handlers). |
| `app/database.py` | Moteur async SQLAlchemy + factory de sessions. |
| `app/models.py` | Tables `participants` (unicité du **username**) et `mention_events` (journal). |
| `app/participants.py` | Requêtes métier (upsert, tirage avec **seed**, CSV). |
| `app/instagram_enrichment.py` | **Graph API** : résolution du `@username` à partir de l’**IGSID** expéditeur (Messagerie). |
| `app/config.py` | **Pydantic Settings v2** (variables d’environnement). |
| `app/rate_limit.py` | Rate limiting mémoire par IP sur le webhook. |
| `app/state.py` | Référence au `Bot` Telegram initialisé au démarrage. |

## Prérequis côté Meta (résumé)

1. **Compte développeur Meta** et **application** avec **Messagerie Instagram** (Messenger Platform).
2. **Compte Instagram professionnel / créateur** relié à une **Page Facebook**.
3. **Webhooks Messagerie** : selon la doc Meta, il faut notamment `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata`, et souvent **Advanced Access** pour recevoir des événements d’utilisateurs hors rôles sur l’app.
4. **Token d’accès** (Page / IG) permettant d’appeler le Graph pour résoudre le **username** à partir de l’**IGSID** de l’expéditeur.

> **Comportement du code :** seuls les webhooks **`messages`** avec une pièce jointe **`type: story_mention`** (URL CDN dans `payload.url`) déclenchent une inscription au concours. Tout le reste (texte seul, partage de post, `reply_to` sur ta story sans `story_mention`, webhooks Graph **`mentions`** commentaire/légende, etc.) est **ignoré**. Référence Meta : [Webhooks Messagerie Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook/).

## Étapes — Meta Developer

1. Va sur [Meta for Developers](https://developers.facebook.com/) → **My Apps** → **Create App**.
2. Choisis un type d’app compatible avec **Instagram** / utilisation professionnelle (suivant l’assistant actuel).
3. Dans le produit **Instagram** (Graph API), configure l’**Instagram Basic Display** si besoin, ou surtout l’**Instagram Graph API** avec la Page et le compte IG connectés.
4. Récupère **App ID**, **App Secret** (`META_APP_SECRET`), et génère un **User/Page access token** avec les permissions adéquates → place-le dans `INSTAGRAM_ACCESS_TOKEN`.

## Souscription aux webhooks (field `messages`)

1. Dans l’app Meta : configure les **webhooks pour la Messagerie Instagram** (objet `instagram`, format documenté côté [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook/)).
2. URL de callback : `https://<ton-domaine>/webhook` (HTTPS public ; en local : **ngrok**, **Cloudflare Tunnel**, etc.).
3. **Verify Token** : identique à `VERIFY_TOKEN` dans ton `.env`.
4. Abonne-toi au champ **`messages`** (pas le champ Graph `mentions` pour les commentaires — celui-ci ne sert plus ce flux « Story mention » dans ce projet).
5. Le **GET** de vérification Meta est géré par `GET /webhook`.

Quand quelqu’un te **mentionne dans sa Story**, Meta envoie un événement `messages` avec `entry[].messaging[]` et une pièce jointe `"type":"story_mention"`.

## Lier un compte Instagram professionnel

1. L’IG doit être **professionnel** (entreprise ou créateur).
2. Il doit être **connecté à une Page Facebook** dont tu es admin.
3. Dans Meta Developer, associe l’app, la Page et le compte Instagram selon le flux **Instagram Graph API**.
4. Utilise un token qui correspond à cette configuration (souvent lié à la Page).

## Configuration locale

```bash
cd instagram_contest
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env   # puis édite .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expose le port 8000 avec **ngrok** (exemple) :

```bash
ngrok http 8000
```

Utilise l’URL HTTPS ngrok + `/webhook` dans la console Meta.

## Variables d’environnement (sécurité)

- Ne commite **jamais** `.env`. Utilise `.env.example` comme modèle.
- **`META_APP_SECRET`** : obligatoire en production pour vérifier `X-Hub-Signature-256`. Sans secret, une alerte est loguée si un en-tête de signature est présent.
- **`INSTAGRAM_ACCESS_TOKEN`** : secret — rotation régulière, scopes minimaux.
- **`TELEGRAM_TOKEN`** : secret — révoque-le s’il fuit.
- **`TELEGRAM_ADMIN_ID`** : seul cet utilisateur reçoit les notifications et peut utiliser les commandes.

## Déploiement (Render, Railway, VPS, etc.)

1. Build : Python 3.11+, `pip install -r requirements.txt`.
2. Commande : `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (adapte `$PORT` selon la plateforme).
3. Configure les variables d’environnement sur l’hébergeur (pas de `.env` en clair dans l’image).
4. URL publique HTTPS vers `/webhook`.
5. **SQLite sur disque éphémère** : sur certaines PaaS, le filesystem est volatile — pour la prod à long terme, envisage Postgres (changement de `DATABASE_URL` + driver async). Ce dépôt reste volontairement SQLite comme demandé.

## Commandes Telegram (admin)

- **`/participants`** — nombre + liste paginée (boutons ◀ ▶).
- **`/tirage [seed]`** — tirage pseudo-aléatoire ; même **seed** → même gagnant pour reproductibilité. Sans argument, utilise `CONTEST_DEFAULT_RANDOM_SEED` si défini, sinon tirage non déterministe.
- **`/clear`** — demande confirmation (boutons).
- **`/stats`** — total + derniers ajouts (par première mention).
- **`/export`** — si `ENABLE_CSV_EXPORT_COMMAND=true`, envoie un CSV.

## Fonctionnalités bonus (flags / commentaires)

- **`INSTAGRAM_AUTO_FOLLOW_ENABLED`** : réservé à des essais documentés — **risque élevé de restriction de compte**. Code volontairement non implémenté ; voir commentaires dans `instagram_enrichment.py`.
- **`KEYWORD_DM_FILTER_ENABLED`** : filtre DM supplémentaire ; non implémenté (le webhook `messages` est déjà utilisé pour `story_mention` uniquement).
- **Export CSV** : activer `ENABLE_CSV_EXPORT_COMMAND=true`.

## Limites connues

- Rate limiting **en mémoire** : une seule instance ou acceptation du fait que chaque instance a son propre compteur.
- L’URL Story est une **URL CDN éphémère** : respecte les conditions Meta (ne pas stocker le média hors cadre autorisé).
- Si le Graph ne retourne pas le `username` pour l’IGSID, l’admin est notifié mais le participant n’est pas ajouté tant que la résolution échoue.

## Licence

Projet exemple — adapte les mentions légales, la politique Instagram, et le RGPD à ton concours.
