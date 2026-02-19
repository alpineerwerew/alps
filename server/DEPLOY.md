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
```

Optionnel : `CATALOG_URL=https://alpine710.art`, `REFERRAL_BONUS=15` (points pour un filleul qui commande), `IG_REVIEW_POINTS=15` (points pour un avis IG validé) (lien du bouton « Accès boutique »), `WELCOME_IMAGE_URL=https://https://res.cloudinary.com/divcybeds/image/upload/v1771239856/Alpine_Connection_Wonka_LETTERING-V01_Logo_2022_o7rhyc.png` (image personnalisée au /start).

Ou avec un éditeur si installé : `nano .env` ou `vi .env`.

---

## 5. Lancer le bot en continu (pm2)

```bash
npm install -g pm2
pm2 start index.js --name alps-bot
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
- **3000** : API du bot (points / récompenses)  
- **80** : pour HTTPS plus tard si tu mets un domaine

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

Résultat : **https://alpine710.art** affiche le catalogue, et les appels à `/api/points`, `/api/rewards`, etc. partent vers le bot. Dans `app.js` tu as déjà `POINTS_API_URL = "https://alpine710.art"` (même domaine = pas de souci CORS).

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
pm2 restart alps-bot
```

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pm2 status` | Voir si le bot tourne |
| `pm2 logs alps-bot` | Voir les logs en direct |
| `pm2 restart alps-bot` | Redémarrer après une modif |
| `pm2 stop alps-bot` | Arrêter le bot |
