# Shree Sanware Sarkar Caters and Supervision — Website

A MERN (MongoDB, Express, React, Node) website for a premium Indian catering business, implemented
from `premium_indian_catering_website_plan.md`. It includes the full public marketing site, a menu
and gallery catalog, a quote-inquiry workflow, and an admin dashboard for managing content.

## Project structure

```
caterer/
├── backend/   Express API, MongoDB models, admin auth, inquiry workflow
├── frontend/  React + Vite public site and admin dashboard
└── premium_indian_catering_website_plan.md   Original specification
```

## Prerequisites

- Node.js 18+ (tested on Node 24)
- A MongoDB database — either:
  - **Local MongoDB**: install from mongodb.com/try/download/community, or
  - **MongoDB Atlas**: create a free cluster and copy its connection string

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string
- `CLIENT_ORIGIN` — `http://localhost:5173` for local dev
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary
  dashboard (cloudinary.com/console) — required because `STORAGE_PROVIDER=cloudinary` by default

Then:

```bash
npm run seed          # populates placeholder demo content (replace before launch)
npm run create-admin  # interactive prompt to create your admin login
npm run dev           # starts the API on http://localhost:5000
```

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL=/api/v1 (proxied to the backend in dev)
npm run dev             # starts the site on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so the browser only
ever talks to port 5173 and admin auth cookies work same-origin.

## 3. Using the site

- Public site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login (use the account from `npm run create-admin`)

All services, menu items, packages, gallery photos, testimonials, and site settings (business name,
contact info, hero image, etc.) are managed from the admin dashboard — nothing is hard-coded except
generic marketing copy that should be reviewed and replaced with the real business's content before
launch (see `About.jsx`, `WhyChooseUs.jsx`, and the legal pages).

## 4. What's placeholder and must be replaced before launch

- `npm run seed` content (services, dishes, packages, gallery photos, testimonials) is demo data with
  `picsum.photos` placeholder images.
- Homepage "Why Choose Us" copy and About page copy are generic — replace with confirmed, real
  business claims.
- Privacy Policy and Terms pages are starting templates, not legal advice — have them reviewed.
- `JWT_SECRET` in `.env` must be changed from the example value.

## 5. Deploying to Vercel

Backend and frontend deploy as **two separate Vercel projects** from this one repo (a standard
monorepo setup — each project points at a different "Root Directory").

### 5a. Backend project

1. In Vercel, "Add New Project" → import this repo → set **Root Directory** to `backend`.
2. Framework preset: "Other" (no build step needed — `backend/api/index.js` is a serverless function
   that wraps the Express app, routed to by `backend/vercel.json`).
3. Add environment variables (Project Settings → Environment Variables), same keys as `.env.example`:
   - `MONGODB_URI` — use MongoDB Atlas (a local Mongo instance isn't reachable from Vercel)
   - `JWT_SECRET`, `JWT_EXPIRES_IN`, `COOKIE_NAME`
   - `CLIENT_ORIGIN` — the frontend's deployed URL (set this *after* deploying the frontend; comma-
     separate multiple origins if you need to allow a preview URL too)
   - `STORAGE_PROVIDER=cloudinary` plus the three `CLOUDINARY_*` values (local disk storage doesn't
     work on Vercel's read-only filesystem — see "Notes on image uploads" below)
   - `EMAIL_*` / `NOTIFY_TO_EMAIL` if you want inquiry notification emails
4. Deploy. Your API is now live at `https://<backend-project>.vercel.app/api/v1/...`.
5. Run `npm run seed`, `npm run create-admin` etc. locally against the same `MONGODB_URI` (point your
   local `.env` at the Atlas connection string) — these scripts aren't meant to run on Vercel itself.

### 5b. Frontend project

1. "Add New Project" → import this repo again → set **Root Directory** to `frontend`.
2. Framework preset: "Vite" (auto-detected; build command `npm run build`, output `dist`).
3. Add environment variable `VITE_API_BASE_URL` = `https://<backend-project>.vercel.app/api/v1`
   (this is baked in at build time — set it before deploying, and redeploy if you change it).
4. Deploy. `frontend/vercel.json` adds the SPA fallback rewrite so client-side routes like `/menu` or
   `/admin` work on a hard refresh/direct link.

### 5c. Wire them together

Go back to the **backend** project's env vars and set `CLIENT_ORIGIN` to the frontend URL from step
5b, then redeploy the backend (env var changes require a redeploy to take effect).

### Known serverless caveats

- `express-rate-limit`'s default in-memory store is per-instance, not shared across concurrent
  serverless invocations — fine for small/medium traffic, but not a precise global rate limit.
- Each warm function instance reuses its MongoDB connection (see `src/config/db.js`); cold starts open
  a new one. This is normal for serverless and works fine with Atlas's connection limits at small scale.

## Notes on image uploads

Images are uploaded through `src/services/storage/index.js`, which picks an adapter based on
`STORAGE_PROVIDER`:

- `cloudinary` (default) — uploads go straight to your Cloudinary account under the `caterer` folder;
  no local disk usage, images are served from Cloudinary's CDN. Requires `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.
- `local` — stores images on disk under `backend/uploads/` (served at `/uploads/...`). Useful for
  local development without a Cloudinary account. `backend/uploads/` is excluded from source control
  and would need its own backup strategy in production. **Not usable on Vercel** — its filesystem is
  read-only outside `/tmp`, and writes there don't persist between invocations anyway. Always use
  `STORAGE_PROVIDER=cloudinary` when deploying to Vercel.

Every upload is validated server-side by file type, actual image content (magic bytes), and size
(5MB max, JPEG/PNG/WebP only) before it reaches either adapter. Each `Media` record stores which
provider it was uploaded through, so deletes always use the matching adapter even if you change
`STORAGE_PROVIDER` later.
