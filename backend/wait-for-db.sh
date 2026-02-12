#!/bin/sh

echo "⏳ Waiting for PostgreSQL..."

until pg_isready -d "$DATABASE_URL"; do
  sleep 2
done

echo "✅ PostgreSQL is ready!"
