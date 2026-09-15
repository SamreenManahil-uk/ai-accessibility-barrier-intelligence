#!/usr/bin/env bash

set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo ""
echo "PathSense AI — Smoke Test"
echo "=========================="
echo ""

echo "1. Checking frontend..."
curl -fsS "$BASE_URL" > /dev/null
echo "Frontend reachable ✅"

echo ""
echo "2. Checking backend health..."
HEALTH=$(curl -fsS "$BASE_URL/api/v1/health")
echo "$HEALTH"

if ! echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "Backend health check failed ❌"
  exit 1
fi

echo "Backend healthy ✅"

echo ""
echo "3. Checking analysis history..."
HISTORY=$(curl -fsS "$BASE_URL/api/v1/analyses")

if ! echo "$HISTORY" | grep -q '^\['; then
  echo "Analysis history endpoint failed ❌"
  exit 1
fi

echo "History endpoint reachable ✅"

echo ""
echo "4. Checking containers..."

docker compose \
  -f infrastructure/docker/docker-compose.yml \
  ps

echo ""
echo "Smoke test complete ✅"
echo ""
