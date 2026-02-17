# Déployer le bot sur ton VPS

Guide pour n’importe quel VPS (Bit.Hosting, OVH, ton hébergeur, etc.). Tu as besoin : d’un accès SSH (IP + mot de passe ou clé), et d’un serveur Linux (Ubuntu/Debian recommandé).

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

## 8. (Optionnel) Domaine + HTTPS pour l’API

Si tu as un domaine (ex. `api.mondomaine.com` → IP du VPS) :

1. Dans la gestion DNS du domaine : enregistrement **A** vers l’IP du VPS.
2. Sur le VPS :

```bash
apt install -y nginx certbot python3-certbot-nginx
nano /etc/nginx/sites-available/alps-api
```

Contenu (remplace `api.mondomaine.com` par ton sous-domaine) :

```nginx
server {
    listen 80;
    server_name api.mondomaine.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Puis :

```bash
ln -s /etc/nginx/sites-available/alps-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
certbot --nginx -d api.mondomaine.com
```

Dans `app.js` : `POINTS_API_URL = "https://api.mondomaine.com"`

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
