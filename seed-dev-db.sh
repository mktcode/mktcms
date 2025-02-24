#!/bin/bash
set -e

. .env

sqlite3 ${SQLITE_DB_PATH:-./development.sqlite} < seed.sql
echo "✅ Development database seeded!"
