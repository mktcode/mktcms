#!/bin/bash
set -e

. .env

sqlite3 ${SQLITE_DB_PATH:-./development.sqlite} < init.sql
echo "✅ Development database initialized!"
