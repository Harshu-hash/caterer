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

## 5. Production deployment (summary)

See `premium_indian_catering_website_plan.md` section 14 for full detail. In short:
1. Build the frontend: `cd frontend && npm run build` → serve `frontend/dist` via Nginx.
2. Run the backend with `pm2 start src/server.js --name caterer-api` (or similar) behind Nginx.
3. Proxy `/api/*` and `/uploads/*` from Nginx to the Node process; serve the SPA for everything else.
4. Use MongoDB Atlas with network restrictions and a least-privilege database user.
5. Set `NODE_ENV=production`, real secrets, and HTTPS via Let's Encrypt/Certbot.

## Notes on image uploads

Images are uploaded through `src/services/storage/index.js`, which picks an adapter based on
`STORAGE_PROVIDER`:

- `cloudinary` (default) — uploads go straight to your Cloudinary account under the `caterer` folder;
  no local disk usage, images are served from Cloudinary's CDN. Requires `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.
- `local` — stores images on disk under `backend/uploads/` (served at `/uploads/...`). Useful for
  local development without a Cloudinary account. `backend/uploads/` is excluded from source control
  and would need its own backup strategy in production.

Every upload is validated server-side by file type, actual image content (magic bytes), and size
(5MB max, JPEG/PNG/WebP only) before it reaches either adapter. Each `Media` record stores which
provider it was uploaded through, so deletes always use the matching adapter even if you change
`STORAGE_PROVIDER` later.
