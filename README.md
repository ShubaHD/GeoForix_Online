# GeoForix Online

Web app for field borehole logs (fișe de foraj): projects → boreholes → lithology, samples, in-situ tests, map, PDF + CSV export.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind 4
- Prisma + **PostgreSQL** (Docker locally / Neon or Vercel Postgres in production)
- Auth: JWT cookie (`jose` + `bcryptjs`)
- Photos / company logo: local `./storage` or **Vercel Blob**
- PDF: `pdfkit` (RO / EN / DE, independent of UI language)

## Quick start (local)

```bash
# 1) Postgres
docker compose up -d

# 2) Env
cp .env.example .env
# set AUTH_SECRET to a long random string

# 3) App
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Demo accounts

| Email | Password | Role |
|-------|----------|------|
| admin@geoforix.local | admin123 | ADMIN |
| field@geoforix.local | field123 | FIELD |

Demo project **DEMO-GF** — boreholes BH01 / BH30 / BH50 / BH100 (after optional seeds).

Extra demos:

```bash
npx tsx prisma/seed-bh50.ts
npx tsx prisma/seed-bh30-bh100.ts
```

## Deploy: GitHub + Vercel

1. Push this repo to GitHub.
2. Import the project in [vercel.com](https://vercel.com) → **Add New Project**.
3. **Storage**
   - Postgres: Storage → create **Neon** / **Prisma Postgres** / **Vercel Postgres** and **Connect** (sets `DATABASE_URL`).
   - Blob: Storage → **Blob** → create store (sets `BLOB_READ_WRITE_TOKEN`).
4. **Environment variables** (Project → Settings → Environment Variables)
   - `DATABASE_URL` (from Storage, if not auto-set)
   - `AUTH_SECRET` — long random string (required)
   - `BLOB_READ_WRITE_TOKEN` — from Blob store
5. Deploy. Build runs `prisma migrate deploy && next build`.
6. Seed production once (from your machine, with production `DATABASE_URL`):

```bash
npx vercel env pull .env.production.local
# or paste DATABASE_URL into a temporary .env
npx prisma migrate deploy
npm run db:seed
```

## Features

- Login + admin users + company logo/details for PDF header
- Explorer: Project → Borehole
- Editor: data, GPS map, lithology, samples, water, equipment, PMT/OTV/PP/VST/RQD, photos (gallery + camera)
- Multi-page PDF log, CSV export for import elsewhere
- PDF warnings (depth checks, missing photos, etc.)
- UI languages: RO / EN / DE

## Offline

Not in this cloud MVP — use GeoForix Android for offline field work.
