#!/usr/bin/env bash
# Run on the VPS as the `deploy` user. Pulls latest, installs, migrates, restarts.
set -euo pipefail

REPO_DIR=/srv/echo-vote
BRANCH="${1:-thrd-stage}"

cd "$REPO_DIR"
echo "==> git fetch/reset origin/$BRANCH"
git fetch --quiet origin "$BRANCH"
git reset --hard "origin/$BRANCH"

cd "$REPO_DIR/server"
echo "==> npm ci"
npm ci --omit=dev

echo "==> migrate + seed"
node scripts/migrate.mjs
node scripts/seed.mjs

echo "==> restart service"
sudo systemctl restart echo-vote
sleep 1
systemctl --no-pager --lines=0 status echo-vote
curl -fsS http://127.0.0.1:3000/health && echo " OK"
