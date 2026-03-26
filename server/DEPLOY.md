# Déployer le bot sur ton VPS

Guide pour n’importe quel VPS (Bit.Hosting, OVH, ton hébergeur, etc.). Tu as besoin : d’un accès SSH (IP + mot de passe ou clé), et d’un serveur Linux (Ubuntu/Debian recommandé).

---

## 0. Tout en une commande (option simple)

Connecte-toi en SSH sur le VPS, puis exécute **cette seule ligne** (tout est installé et configuré automatiquement) :

```bash
curl -sL https://raw.githubusercontent.com/alpineerwerew/alps/main/server/setup-vps.sh | bash
```

Ensuite :
- Si un fichier `.env` a été créé, édite-le avec ton **BOT_TOKEN** et **OWNER_CHAT_ID** :  
  `nano /opt/alps/server/.env`  
  puis : `pm2 restart alps-bot`
- Pour le HTTPS :  
  `apt install -y certbot python3-certbot-nginx`  
  `certbot --nginx -d alpine710.art -d www.alpine710.art`

Le reste du guide ci-dessous détaille chaque étape si tu préfères faire à la main.

---

## 1. Connexion SSH

```bash
ssh root@TON_IP
```

(Remplace `TON_IP` par l’adresse IP de ton VPS.)

---

## 2. Installer Node.js

```bash
apt update && apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

---

## 3. Cloner le projet et installer les dépendances

```bash
cd /opt
git clone https://github.com/alpineerwerew/alps.git
cd alps/server
npm install --production
```

Si le repo est **privé** : utilise un token dans l’URL  
`git clone https://TON_USERNAME:TON_TOKEN@github.com/alpineerwerew/alps.git`

---

## 4. Fichier .env

Crée le fichier avec tes vraies valeurs (sans guillemets autour des valeurs) :

```bash
echo 'BOT_TOKEN=ton_token_botfather' > .env
echo 'OWNER_CHAT_ID=ton_chat_id_telegram' >> .env
echo 'CATALOG_URL=https://alpine710.art' >> .env
```

**`CATALOG_URL`** = URL **HTTPS** publique du catalogue (sans `/` à la fin). Sert au bouton **Web App** Telegram, aux liens admin, aux URLs d’upload. Si absent, le code utilise par défaut `https://alpine710.art` — mais il vaut mieux la fixer dans `.env` pour un autre domaine.

Optionnel : `WELCOME_IMAGE_URL=…` (image au /start), `WELCOME_PROMO_LINE=…` (une ligne sous l’accueil `/start`, avant choix de langue), `ORDER_RESPONSE_SLA_HOURS=12` (délai de réponse affiché après commande), `THANK_YOU_LINE_FR` / `THANK_YOU_LINE_EN` / `THANK_YOU_LINE_DE` (message court après identifiant Signal/Threema), rappels panier : `CART_REMINDER_ENABLED=1` (défaut répétition **24 h** via `CART_REMINDER_REPEAT_HOURS`).

> **Points / parrainage / avis Instagram** : pas implémentés dans ce dépôt (des fichiers `points.json` / `refs.json` dans `.gitignore` sont des vestiges). La section Nginx qui cite `/api/points` est un exemple générique ; le bot actuel n’expose pas ces routes.

Ou avec un éditeur si installé : `nano .env` ou `vi .env`.

**Catalogue réservé au bot Telegram (par défaut)** : avec `TELEGRAM_WEBAPP_ONLY` absent ou différent de `0`, le serveur exige une Mini App (pages `index.html` / `admin.html` filtrées + `initData` signé pour `GET /api/products` et `GET /api/config`). En local sans Telegram, ajoute dans `server/.env` :

```bash
TELEGRAM_WEBAPP_ONLY=0
```

Optionnel : `TELEGRAM_HTML_NO_BLOCK=1` pour ne pas bloquer l’accès HTML direct tout en gardant l’API protégée. `TELEGRAM_HTML_UA_ONLY=1` pour n’autoriser le HTML qu’avec un User-Agent type WebView / Telegram (plus strict).

Avant un `git pull` sur le VPS, sauvegarde `server/products.json` si tu as modifié le catalogue depuis l’admin (évite d’écraser tes données).

---

## 5. Lancer le bot en continu (pm2)

### Recommandé : **deux processus** (catalogue toujours joignable)

Le fichier `server/ecosystem.config.cjs` lance **`alps-web`** (HTTPS + API + fichiers statiques) et **`alps-bot`** (Telegram uniquement). Si le polling Telegram ralentit, le site continue de répondre. Les commandes passées depuis la Mini App vont dans `server/order_queue.jsonl` puis sont envoyées par le processus bot.

```bash
cd /chemin/vers/alps/server
npm install -g pm2
pm2 delete alps-bot 2>/dev/null   # si tu avais l’ancien nom unique
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Vérifier :

```bash
pm2 status
pm2 logs alps-web
pm2 logs alps-bot
curl -k -sS https://127.0.0.1/healthz   # doit renvoyer {"ok":true,...}
```

**Watchdog (optionnel mais utile)** : la séparation `alps-web` / `alps-bot` enlève le gros risque « Telegram bloque tout ». Un cron sur `/healthz` reste une **sécurité de secours** si le processus web seul plante (TLS, mémoire, bug rare). Script fourni : `server/health-watch.sh`.

```bash
chmod +x /opt/alps/server/health-watch.sh
# test manuel
/opt/alps/server/health-watch.sh
```

Crontab root (ex. toutes les **5** minutes — 2 min est plus agressif si tu veux réagir plus vite) :

```cron
*/5 * * * * /opt/alps/server/health-watch.sh >>/var/log/alps-health.log 2>&1
```

Variables optionnelles : `HEALTH_URL`, `MAX_TIME`, `PM2_APP` (défaut `alps-web`).

### Ancien mode : un seul processus

```bash
npm install -g pm2
PROCESS_ROLE=all pm2 start index.js --name alps-bot
pm2 save
pm2 startup
```

Exécute la commande que `pm2 startup` affiche (souvent une ligne avec `sudo env PATH=...`).

Vérifier :
```bash
pm2 status
pm2 logs alps-bot
```

---

## 6. Ouvrir les ports (firewall)

```bash
ufw allow 22
ufw allow 80
ufw allow 3000
ufw enable
```

- **22** : SSH  
- **3000** : utile seulement si tu proxies l’API derrière Nginx (sinon Node écoute souvent **80/443** directement)  
- **80** / **443** : HTTP / HTTPS du catalogue + `/api`

---

## 7. Front : URL de l’API

Dans ton projet (fichier `app.js` à la racine), mets l’URL de ton serveur :

- **Sans domaine** : `const POINTS_API_URL = "http://TON_IP:3000";`
- **Avec domaine** (après avoir configuré Nginx + SSL) : `const POINTS_API_URL = "https://api.tondomaine.com";`

(Sans slash à la fin.)

---

## 8. Option simple : site + API sur le même VPS (alpine710.art)

Tout (catalogue + bot + API) sur un seul serveur, un seul domaine. Pas besoin de Netlify.

1. **DNS** : un enregistrement **A** pour `@` et `www` → IP du VPS (déjà fait si alpine710.art pointe vers ton VPS).

2. **Sur le VPS** : installer Nginx, puis créer la config (une seule commande, pas besoin de nano) :

```bash
apt install -y nginx
```

```bash
cat > /etc/nginx/sites-available/alpine710.art << 'EOF'
server {
    listen 80;
    server_name alpine710.art www.alpine710.art;
    root /opt/alps;
    index index.html;
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
```

3. **Activer le site et recharger Nginx** :

```bash
ln -sf /etc/nginx/sites-available/alpine710.art /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

4. **HTTPS (recommandé)** :

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d alpine710.art -d www.alpine710.art
```

Résultat : **https://alpine710.art** sert le catalogue et les routes **`/api/*`** (produits, commande, etc.) via le proxy. Dans `app.js`, `POINTS_API_URL` pointe en pratique sur la même origine (`window.location.origin` en prod) — ce n’est pas un système de « points » séparé dans le code actuel.

---

## 9. (Optionnel) API sur un sous-domaine uniquement

Si tu préfères séparer (ex. site ailleurs, API sur `api.alpine710.art`) :

1. DNS : enregistrement **A** pour `api` → IP du VPS.
2. Sur le VPS, config Nginx pour `api.alpine710.art` qui proxy tout vers `http://127.0.0.1:3000` (comme l’exemple ci‑dessous avec `server_name api.mondomaine.com`).
3. Dans `app.js` : `POINTS_API_URL = "https://api.alpine710.art"`

---

## Mettre à jour le bot

```bash
cd /opt/alps
git pull
cd server
npm install --production
pm2 restart alps-web alps-bot
# ou si tu es encore en un seul processus : pm2 restart alps-bot
```

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pm2 status` | Voir si le bot tourne |
| `pm2 logs alps-bot` | Voir les logs en direct |
| `pm2 restart alps-web alps-bot` | Redémarrer web + bot (mode 2 processus) |
| `pm2 restart alps-bot` | Redémarrer l’ancien processus unique |
| `pm2 stop alps-bot` | Arrêter le bot |
