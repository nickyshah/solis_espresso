# Solis Espresso — Next.js (src/app) + Prisma (Postgres) + NextAuth + Vercel Blob

Public site with a private admin backend to manage the cafe menu. Uses **Postgres** (local dev & Vercel Postgres) and **Vercel Blob** for image uploads.

## Stack
- Next.js 14 (App Router, TypeScript, Tailwind)
- Prisma + **Postgres** (Category enum + JSON ingredients)
- NextAuth (Credentials) — admin-only access
- REST API routes for Menu CRUD, Contact form
- **Vercel Blob** image uploads via `/api/upload`
- Framer Motion animations aligned with your Base44 UI

## Local Dev
```bash
npm i          # or pnpm i / yarn
cp .env.example .env
# set DATABASE_URL to your local Postgres (default provided)

npx prisma generate
npx prisma migrate dev --name init
npm run seed   # optional
npm run dev
```

## Vercel (Dev/Prod)
1. Add **Vercel Postgres** to your project and copy envs.
2. In Vercel envs, set:
   - `DATABASE_URL=${POSTGRES_PRISMA_URL}`
   - `NEXTAUTH_SECRET` (random string), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_URL`
3. Deploy. Run `npx prisma migrate deploy` from a job/CI step if needed.

## API
- `GET /api/menu?featured=1` — list menu (optionally featured)
- `POST /api/menu` — create (**admin only**, protected by middleware)
- `GET /api/menu/:id` — read
- `PUT /api/menu/:id` — update (**admin only**)
- `DELETE /api/menu/:id` — delete (**admin only**)
- `POST /api/contact` — save inquiry (+ optional emails)
- `POST /api/upload` — upload image to Vercel Blob (returns `{ url }`)

## Notes
- Admin UI lets you upload an image (stored in Blob) or paste a URL.
- Ingredients are **string[]** via Prisma JSON.
- Category is a Prisma **enum**.

## Scripts
- `npm run migrate:dev` — create a local migration
- `npm run migrate:deploy` — apply migrations in prod
- `npm run seed` — seed sample data
# Solis_espresso
# solis_espresso
# solis_espresso
# solis_espresso
# solis_espresso
