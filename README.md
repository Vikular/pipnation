[![Deploy Status](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml/badge.svg)](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml)

# Forex Mentorship Platform Flow (pipnation)

This repository is the frontend SPA for Pip Nation / Forex Mentorship Platform Flow.

The app is a Vite + React (SWC) single-page application that uses Supabase for
authentication and Edge Functions for server-side flows.

Quick start

1. Install dependencies:

```powershell
npm ci
```

2. Run development server:

```powershell
npm run dev
```

3. Build for production:

```powershell
npm run build
npm run preview
```

Deployment

- CI is set up to deploy to GitHub Pages via `.github/workflows/deploy.yml`.
- The repository exposes a workflow badge at the top of this README.

Environment

- Provide the following secrets to GitHub Actions (Settings → Secrets → Actions):
  - `VITE_SUPABASE_PROJECT_ID`
  - `VITE_SUPABASE_ANON_KEY`

If you want help with automatic smoke tests, custom domains, or Vercel deployment
instead of GitHub Pages, tell me which option you prefer and I will add it.

