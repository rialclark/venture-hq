# Venture HQ

Dark ops dashboard for Rial Clark. One place to see every venture, open blockers, and recent activity.

## Run locally

```bash
cd /workspace/venture-hq
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/venture-hq/`).

Production build:

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Repo name should be `venture-hq` so the site is `https://<github-user>.github.io/venture-hq/`.

`vite.config.ts` sets `base: '/venture-hq/'`. `dist/404.html` mirrors `index.html` for SPA deep links.

```bash
npm run build
# then push the repo and enable Pages from the gh-pages branch or GitHub Actions
```

## Edit venture data

All seed data lives in `src/data/ventures.ts`.

Update `ventures` for status, blockers, activity, next steps, and notes. Bump `LAST_UPDATED` when you change anything.

### Status values

- `active` : moving
- `blocked` : waiting on a critical or hard blocker
- `parked` : intentionally on hold

### Metrics policy

Prefer omitting fake KPIs. If you must show illustrative numbers, add them under `metrics` with `isExample: true`. The UI shows an **Example** badge on those values.

## Stack

Vite, React, TypeScript, Tailwind CSS v4.
