#!/usr/bin/env bash
# ==============================================================================
# Digi Ventures - Production Automated Backup Script
# Performs PostgreSQL dump and archives pitch deck files to /var/backups/digiventures
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/digiventures}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=14

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}/db"
mkdir -p "${BACKUP_DIR}/storage"

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting Digi Ventures automated backup..."

load_env_safe() {
    local file="$1"
    if [ -f "$file" ]; then
        while IFS='=' read -r key val || [ -n "$key" ]; do
            [[ "$key" =~ ^[[:space:]]*# ]] && continue
            [[ -z "$key" ]] && continue
            key=$(echo "$key" | xargs)
            if [ -n "$key" ] && [ -z "${!key:-}" ]; then
                # Strip leading/trailing quotes
                val="${val%\"}"
                val="${val#\"}"
                val="${val%\'}"
                val="${val#\'}"
                export "$key=$val"
            fi
        done < "$file"
    fi
}

load_env_safe "/var/app/digiventures/.env"
load_env_safe "./.env.local"

DATABASE_URL="${DATABASE_URL:-postgres://localhost:5432/digiventures_dev}"
STORAGE_ROOT="${STORAGE_ROOT:-/var/app/storage/uploads/pitch-decks}"

DB_BACKUP_FILE="${BACKUP_DIR}/db/digiventures_${TIMESTAMP}.sql.gz"
STORAGE_BACKUP_FILE="${BACKUP_DIR}/storage/pitch_decks_${TIMESTAMP}.tar.gz"

# 1. Database backup via pg_dump
echo "Dumping PostgreSQL database..."
if pg_dump "${DATABASE_URL}" --no-owner --no-acl --clean | gzip > "${DB_BACKUP_FILE}"; then
    BACKUP_SIZE=$(du -h "${DB_BACKUP_FILE}" | cut -f1)
    echo "✓ Database backup created: ${DB_BACKUP_FILE} (${BACKUP_SIZE})"
else
    echo "✗ Failed to dump database!" >&2
    exit 1
fi

# 2. Pitch decks storage backup
if [ -d "${STORAGE_ROOT}" ]; then
    echo "Archiving pitch deck files from ${STORAGE_ROOT}..."
    if tar -czf "${STORAGE_BACKUP_FILE}" -C "$(dirname "${STORAGE_ROOT}")" "$(basename "${STORAGE_ROOT}")"; then
        STORAGE_SIZE=$(du -h "${STORAGE_BACKUP_FILE}" | cut -f1)
        echo "✓ Storage archive created: ${STORAGE_BACKUP_FILE} (${STORAGE_SIZE})"
    else
        echo "⚠ Warning: Could not archive pitch deck storage" >&2
    fi
else
    echo "Notice: Storage root ${STORAGE_ROOT} not found, skipping file archive."
fi

# 3. Retention rotation (remove backups older than 14 days)
echo "Rotating backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}/db" -type f -name "digiventures_*.sql.gz" -mtime +${RETENTION_DAYS} -delete || true
find "${BACKUP_DIR}/storage" -type f -name "pitch_decks_*.tar.gz" -mtime +${RETENTION_DAYS} -delete || true

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup process completed successfully."
