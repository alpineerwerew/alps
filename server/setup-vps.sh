#!/bin/bash
# Setup complet : site + bot + API sur le VPS (alpine710.art)
# À lancer sur le VPS en root : bash setup-vps.sh
# Avant : avoir BOT_TOKEN et OWNER_CHAT_ID (optionnel : les mettre dans .env à la main après)

set -e
REPO_URL="https://github.com/alpineerwerew/alps.git"
INSTALL_DIR="/opt/alps"
SERVER_DIR="$INSTALL_DIR/server"

echo "=== Mise à jour des paquets ==="
apt update && apt install -y curl git nginx

echo "=== Node.js (si pas déjà installé) ==="
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
node -v
npm -v

echo "=== Projet Alpine ==="
if [ ! -d "$INSTALL_DIR" ]; then
  mkdir -p /opt
  git clone "$REPO_URL" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
else
  cd "$INSTALL_DIR"
  git pull
fi

cd "$SERVER_DIR"
npm install --production

if [ ! -f "$SERVER_DIR/.env" ]; then
  echo "Création de .env (à éditer avec tes vrais BOT_TOKEN et OWNER_CHAT_ID)"
  echo "BOT_TOKEN=REMPLACER_PAR_TOKEN_BOTFATHER" > "$SERVER_DIR/.env"
  echo "OWNER_CHAT_ID=REMPLACER_PAR_CHAT_ID" >> "$SERVER_DIR/.env"
  echo "CATALOG_URL=https://alpine710.art" >> "$SERVER_DIR/.env"
  echo ""
  echo ">>> IMPORTANT : édite le fichier .env avec tes vraies valeurs :"
  echo "    nano $SERVER_DIR/.env"
  echo "    puis : pm2 restart alps-bot"
  echo ""
else
  echo ".env existe déjà, on ne le modifie pas."
fi

echo "=== Bot (pm2) ==="
npm install -g pm2 2>/dev/null || true
if pm2 describe alps-bot &>/dev/null; then
  pm2 restart alps-bot
else
  pm2 start index.js --name alps-bot
  pm2 save
  pm2 startup 2>/dev/null || true
fi

echo "=== Nginx (alpine710.art) ==="
cat > /etc/nginx/sites-available/alpine710.art << 'NGINXEOF'
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
NGINXEOF

ln -sf /etc/nginx/sites-available/alpine710.art /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "=== Firewall (ports 22, 80, 443) ==="
ufw allow 22
ufw allow 80
ufw allow 443
echo "y" | ufw enable 2>/dev/null || true

echo ""
echo "=== Terminé ==="
echo "Site + API : http://alpine710.art (et bientôt https après certbot)"
echo ""
echo "Si .env vient d’être créé, édite-le puis redémarre le bot :"
echo "  nano $SERVER_DIR/.env"
echo "  pm2 restart alps-bot"
echo ""
echo "Pour activer le HTTPS (Let’s Encrypt) :"
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d alpine710.art -d www.alpine710.art"
echo ""
