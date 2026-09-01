# Provisioning the Hetzner VPS (5.223.49.10)

One-time setup. Run as `deploy` (sudo where noted). Ubuntu 24.04.

## 1. System packages

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install nginx postgresql redis-server git ufw
# Node 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs
node -v   # expect v22.x
```

`ufw` should already allow 2222/80/443 (matches the Hetzner Cloud Firewall).

## 2. PostgreSQL

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE echovote LOGIN PASSWORD 'PICK_A_STRONG_ONE';
CREATE DATABASE echovote OWNER echovote;
SQL
```

Default config listens on localhost only — leave it. `DATABASE_URL` in the env
uses `127.0.0.1:5432`.

## 3. Redis

```bash
sudo sed -i "s/^# requirepass .*/requirepass PICK_A_STRONG_ONE/" /etc/redis/redis.conf
sudo sed -i "s/^# maxmemory .*/maxmemory 256mb/"                /etc/redis/redis.conf
sudo sed -i "s/^# maxmemory-policy .*/maxmemory-policy allkeys-lru/" /etc/redis/redis.conf
# bind 127.0.0.1 ::1  is already the default
sudo systemctl restart redis-server
```

(LRU is fine: Postgres is the source of truth; counters are rebuilt on boot and
via `POST /api/admin/reconcile`.)

## 4. Code + env

```bash
sudo mkdir -p /srv/echo-vote && sudo chown deploy:deploy /srv/echo-vote
git clone https://github.com/grafamadeus/echoofthenomads.com.git /srv/echo-vote
cd /srv/echo-vote && git checkout thrd-stage

sudo mkdir -p /etc/echo-vote
sudo cp server/.env.example /etc/echo-vote/env
sudo nano /etc/echo-vote/env      # fill every CHANGE_ME (see below)
sudo chmod 640 /etc/echo-vote/env && sudo chown root:deploy /etc/echo-vote/env

cd server && npm ci --omit=dev
node scripts/migrate.mjs
node scripts/seed.mjs
```

Env values to set:
- `DATABASE_URL` — `postgres://echovote:THE_PASSWORD@127.0.0.1:5432/echovote`
- `REDIS_URL` — `redis://:THE_PASSWORD@127.0.0.1:6379`
- `VOTE_PEPPER` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_TOKEN` — another random 32+ char string
- `GOOGLE_CLIENT_ID` — from Google Cloud (see repo message / GOOGLE_OAUTH.md)
- `ALLOWED_ORIGINS` — `https://echoofthenomads.com,https://www.echoofthenomads.com`

## 5. systemd service

```bash
sudo cp server/deploy/echo-vote.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now echo-vote
curl -fsS http://127.0.0.1:3000/health
# allow deploy to restart it without a password prompt (for deploy.sh):
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart echo-vote' | sudo tee /etc/sudoers.d/echo-vote
```

## 6. nginx + TLS

Requires the DNS A record `api.echoofthenomads.com -> 5.223.49.10` to exist first.

```bash
# put the proxy_cache_path / limit_req_zone lines from nginx-api.conf into
# /etc/nginx/conf.d/echo-zones.conf, and the server{} block into sites-available:
sudo cp server/deploy/nginx-api.conf /etc/nginx/sites-available/api.echoofthenomads.com
sudo ln -s /etc/nginx/sites-available/api.echoofthenomads.com /etc/nginx/sites-enabled/
sudo mkdir -p /var/cache/nginx/echo_results
sudo nginx -t && sudo systemctl reload nginx

sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d api.echoofthenomads.com --redirect -m you@example.com --agree-tos

# admin basic-auth
sudo apt -y install apache2-utils
sudo htpasswd -c /etc/nginx/echo-admin.htpasswd admin
sudo systemctl reload nginx
```

## 7. Nightly backup (the incident lost the DB — don't skip)

```bash
sudo mkdir -p /var/backups/echovote && sudo chown deploy:deploy /var/backups/echovote
crontab -e
# 03:17 daily, keep 14 days
17 3 * * * pg_dump "postgres://echovote:PW@127.0.0.1/echovote" | gzip > /var/backups/echovote/$(date +\%F).sql.gz && find /var/backups/echovote -name '*.sql.gz' -mtime +14 -delete
```

Consider an offsite copy too (`rclone` to any object store).

## 8. Deploys after this

```bash
/srv/echo-vote/server/deploy/deploy.sh thrd-stage
```

Smoke test from your laptop:
```bash
curl -s https://api.echoofthenomads.com/api/state | jq
curl -s https://api.echoofthenomads.com/api/results | jq '.total, .participants[0]'
```
