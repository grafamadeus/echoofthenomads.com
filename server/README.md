# echo-vote-api

Self-hosted voting backend for echoofthenomads.com — replaces the Firebase/Firestore
setup that caused a runaway-reads incident (clients subscribed to the whole `votes`
collection → surprise bill → account lock → DB loss).

## Design

- **Model:** one contest, ~20 participants, **one public vote per Google identity**.
  No nominations. Jury scoring (1–10 per juror) is phase 2.
- **Cost safety:** clients **poll** `GET /api/results` every ~4s. That response is a
  process-memory snapshot rebuilt from Redis once per second, and nginx caches it
  for 2s — so a crowd of any size costs ~1 Redis read/sec at the origin. No
  websockets, no per-client subscriptions.
- **Redis** `HASH votes:counts` = hot counter (`HINCRBY` per vote).
- **Postgres** = source of truth. `vote.voter_hash` unique index = dedup. On boot
  the Redis counter is rebuilt from Postgres, so Redis is disposable.
- **Identity:** Google Identity Services ID token, verified server-side with
  `google-auth-library`. `voter_hash = sha256(google_sub + ':' + VOTE_PEPPER)`.

## API

| Method | Path | Notes |
|---|---|---|
| GET  | `/api/state`   | `{open, opensAt, closesAt, serverTime, frozen}` — countdown gate |
| GET  | `/api/results` | poll target; `{open, total, participants:[{slug,name,country,code,number,votes}]}` |
| POST | `/api/vote`    | `{participant: slug|id, credential: <google id token>}` → `{ok, votes}` / `409 already_voted` |
| POST | `/api/admin/window` | `{opensAt?, closesAt?, frozen?}` (Bearer + nginx basic-auth) |
| POST | `/api/admin/freeze` \| `/unfreeze` | emergency stop, ~1s propagation |
| POST | `/api/admin/participant/:id/number` | `{number}` set draw order |
| POST | `/api/admin/reconcile` | rebuild Redis counter from Postgres |
| GET  | `/api/admin/export` | raw votes CSV |

## Local dev

```bash
cp .env.example .env      # fill DATABASE_URL, REDIS_URL, VOTE_PEPPER, GOOGLE_CLIENT_ID, ADMIN_TOKEN
npm install
npm run migrate
npm run seed
npm run dev
curl -s localhost:3000/api/results | jq
```

## Deploy

See `deploy/PROVISION.md` (one-time VPS setup) then `deploy/deploy.sh`.
`deploy/GOOGLE_OAUTH.md` — how to obtain `GOOGLE_CLIENT_ID`.

## Not done yet

- Frontend rewrite: `assets/voting.js` still has the static array + a dead
  `signInWithGoogle()`. Needs GIS button + `fetch('/api/results')` polling +
  `POST /api/vote`.
- Jury endpoints + repointing `jury.html` / `live-*.html` off Firebase.
- Roster is 20 here; site copy says 21 — confirm.
