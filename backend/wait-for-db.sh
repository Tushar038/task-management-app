#!/bin/sh

echo "⏳ Waiting for PostgreSQL..."

# Extract host and port correctly
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:]+):.*|\1|')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')

echo "Host: $DB_HOST"
echo "Port: $DB_PORT"

until pg_isready -h "$DB_HOST" -p "$DB_PORT"; do
  sleep 2
done

echo "✅ PostgreSQL is ready!"
