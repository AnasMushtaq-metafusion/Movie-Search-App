# 🚀 Deployment Guide - MovieFlix

## Environment Variables

MovieFlix requires an OMDB API key at build/run time.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Get a free API key at http://www.omdbapi.com/apikey.aspx
3. Set `VITE_OMDB_API_KEY` in `.env` to your key.

`.env` is git-ignored and must never be committed.

## Run Locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

The production build is emitted to `dist/`.

## Deploy to Vercel / Netlify / any static host

1. Import the repository into your hosting provider.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Add `VITE_OMDB_API_KEY` as an environment variable in the hosting provider's dashboard.
4. Deploy — most providers will auto-deploy on every push to the default branch.

## Continuous Integration

`.github/workflows/ci.yml` runs lint, tests, and a production build on every push and pull request targeting `main`.
