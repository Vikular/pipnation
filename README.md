[![Deploy Status](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml/badge.svg)](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml)

# Forex Mentorship Platform Flow (pipnation)

This repository is the frontend SPA for Pip Nation / Forex Mentorship Platform Flow.

The app is a Vite + React (SWC) single-page application that uses Supabase for
authentication and Edge Functions for server-side flows.

## Deployment Status

[![Deploy Status](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml/badge.svg)](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml)

The app is automatically deployed to GitHub Pages at: https://vikular.github.io/pipnation

### Important: Set Up Deployment

Before the app can build and deploy, you must add these secrets to GitHub:

1. Open [Repository Settings → Secrets → Actions](https://github.com/Vikular/pipnation/settings/secrets/actions)
2. Click "New repository secret" and add both:
   - Name: `VITE_SUPABASE_PROJECT_ID`
   - Name: `VITE_SUPABASE_ANON_KEY`

### Troubleshooting Deployment

1. Check deployment status:
   - Open [Actions → Deploy to GitHub Pages](https://github.com/Vikular/pipnation/actions/workflows/deploy.yml)
   - Look for the latest workflow run
   - The workflow has three key jobs:
     - typecheck: Runs TypeScript checks
     - build: Builds the app with Vite
     - smoke_test: Verifies the deployed site responds

2. Common issues:
   - Error "Required secret not found": Add the secrets listed above
   - Build fails: Check the build job logs
   - Site unreachable: Check [Pages settings](https://github.com/Vikular/pipnation/settings/pages)
     and verify it uses "GitHub Actions" as the source

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

