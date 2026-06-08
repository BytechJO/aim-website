# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AIM is a book printing and publishing service website. The repo is a monorepo with three packages:

| Package | Tech | Purpose |
|---|---|---|
| `frontend/` | Next.js 16, React 19, Tailwind v4, next-intl | Public website (EN/AR) |
| `backend/` | Express 5, PostgreSQL, JWT | Staff management API |
| `desktop/` | Electron 42 | Desktop wrapper (loads production URL) |

## Commands

### Frontend (`cd frontend`)
```
npm run dev      # Dev server on :3000
npm run build    # Production build
npm run lint     # ESLint
```

### Backend (`cd backend`)
```
npm run dev      # ts-node-dev with auto-reload on :3000
npm run build    # tsc → dist/
npm run start    # node dist/server.js
```

### Desktop (`cd desktop`)
```
npm start        # Launch Electron window
npm run build    # Build Windows NSIS installer
```

## Architecture

### Frontend routing
All routes live under `app/[locale]/` — the `[locale]` segment is either `en` or `ar`, handled by `middleware.ts` via next-intl. RTL is applied via the HTML `dir` attribute in `layout.tsx`. Translation strings are in `languages/en.json` and `languages/ar.json`.

Current pages: `/` (home), `/about`, `/self-publishing`. Each page folder contains the page component plus section sub-components.

⚠️ **Next.js 16 has breaking changes** from earlier versions. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

### Backend auth model
The backend has **no public user accounts** — only internal staff. Two roles:
- `super_admin` — full access, approves/rejects admins, promotes/demotes roles
- `admin` (approved) — full management access
- `admin` (pending) — can log in, gets 403 on all protected routes

Role/approval status is checked live from the DB on every request, so changes take immediate effect even for valid tokens. The last `super_admin` cannot be demoted or deleted.

All routes are prefixed `/api`. Public-only endpoints: `POST /api/contact` and `POST /api/newsletter/subscribe`.

Full endpoint reference: `backend/API.md`. Database schema: `backend/tabels.md`.

### Known backend gaps (not yet implemented)
- No public GET for products, reviews, or instagram posts (frontend cannot fetch them yet)
- No CORS middleware
- No pagination or `is_active` filtering on list endpoints
- Tables exist in schema but have no routes yet: `news_articles`, `faqs`, `benefits`, `order_steps`, `page_sections`, `navigation_links`, `social_links`

### Desktop
`desktop/main.js` loads a hardcoded production URL (`https://YOUR-APP.netlify.app`). Update this before any release build.

## Frontend conventions
- TypeScript strict mode throughout
- Prefer server components and server actions over API routes
- Reusable components over one-off implementations
- Never rewrite entire files unless necessary
- Multiple font families are loaded — use the existing CSS variables (`--font-inter`, `--font-cairo`, etc.) rather than adding new ones
