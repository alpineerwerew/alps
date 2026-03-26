#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   SUPABASE_DB_URL="postgres://..." ./scripts/backup-supabase.sh
# Optional:
#   BACKUP_DIR=/opt/alps/backups

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "SUPABASE_DB_URL is required"
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-$(pwd)/backups}"
mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/supabase-$STAMP.sql.gz"

pg_dump "$SUPABASE_DB_URL" --no-owner --no-acl | gzip > "$OUT"
echo "Backup created: $OUT"

# Keep latest 30 backups
ls -1t "$BACKUP_DIR"/supabase-*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm -f

