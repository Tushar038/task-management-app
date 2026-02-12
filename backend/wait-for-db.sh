#!/bin/sh

echo "⏳ Waiting for PostgreSQL..."

# Extract host
DB_HOST=$(echo $DATABASE_URL | awk -F[@:/] '{print $4}')

# Extract port
DB_PORT=$(echo $DATABASE_URL | awk -F[@:/] '{print $5}')

echo "Host: $DB_HOST"
echo "Port: $DB_PORT"

until pg_isready -h "$DB_HOST" -p "$DB_PORT"; do
  sleep 2
done

echo "✅ PostgreSQL is ready!"
