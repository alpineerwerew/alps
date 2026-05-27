#!/usr/bin/env bash
# Sauvegarde des données JSON du bot (catalogue, commandes, contacts).
# Usage (depuis server/) : ./scripts/backup-json.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/json-$STAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

FILES=(
  products.json
  orders_history.json
  contacts.json
  bot_users.json
  bot_chat_lang.json
  cart_activity.json
  cart_reminders.json
  bot_enabled.json
)

TO_PACK=()
for f in "${FILES[@]}"; do
  [[ -f "$ROOT/$f" ]] && TO_PACK+=("$f")
done

if [[ ${#TO_PACK[@]} -eq 0 ]]; then
  echo "Aucun fichier JSON à sauvegarder dans $ROOT"
  exit 1
fi

tar -czf "$OUT" -C "$ROOT" "${TO_PACK[@]}"
echo "✅ Backup: $OUT"

# Garder les 30 dernières archives
ls -1t "$BACKUP_DIR"/json-*.tar.gz 2>/dev/null | tail -n +31 | xargs -r rm -f
