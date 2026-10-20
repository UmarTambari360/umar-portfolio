#!/usr/bin/env bash
# Dumps the production database to backups/portfolio-YYYY-MM-DD-HHMM.sql.gz and
# deletes dumps older than 14 days. Run it by hand, or from cron (see
# docs/deployment.md). Restore with:
#   gunzip -c backups/<file>.sql.gz | docker compose --env-file .env.production \
#     -f docker-compose.prod.yml exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p backups

docker compose --env-file .env.production -f docker-compose.prod.yml \
  exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gzip > "backups/portfolio-$(date +%F-%H%M).sql.gz"

find backups -name 'portfolio-*.sql.gz' -mtime +14 -delete
echo "Backup written to backups/"

