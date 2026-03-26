#!/usr/bin/env bash
# Surveillance légère : si /healthz ne répond pas, redémarre alps-web (PM2).
# La séparation web/bot évite déjà que Telegram bloque le catalogue ; ce script
# couvre les cas où le seul processus HTTP plante quand même.
#
# Crontab (root, exemple toutes les 5 minutes) :
#   */5 * * * * /opt/alps/server/health-watch.sh >>/var/log/alps-health.log 2>&1
#
# Adapte le chemin si ton dépôt n’est pas sous /opt/alps.

set -euo pipefail

HEALTH_URL="${HEALTH_URL:-https://127.0.0.1/healthz}"
MAX_TIME="${MAX_TIME:-8}"
PM2_APP="${PM2_APP:-alps-web}"

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

if ! command -v curl >/dev/null 2>&1; then
  echo "$(date -Iseconds) curl absent, abandon" >&2
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "$(date -Iseconds) pm2 absent, abandon" >&2
  exit 1
fi

if curl -k -fsS --max-time "$MAX_TIME" "$HEALTH_URL" >/dev/null 2>&1; then
  exit 0
fi

echo "$(date -Iseconds) healthcheck KO → pm2 restart $PM2_APP"
pm2 restart "$PM2_APP" --update-env
