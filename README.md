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

Live site: https://rialclark.github.io/venture-hq/

## Boss webhook (Next-step actions)

Each venture card has an action button (for example "Ask RWH bot") that POSTs JSON to a Boss webhook so Boss can ping the matching Grok Bot.

1. In Boss, open the routine named **Venture HQ Actions**.
2. Copy the webhook URL from the routine panel.
3. On the Venture HQ site, open **Settings** (gear in the header), paste the URL, and Save.
4. Optional: click **Test ping** to confirm the webhook receives a request.
5. Use a venture action button. The payload includes `ventureId`, `botId`, `botName`, `nextStep`, and blocker summaries.

The webhook URL is stored only in this browser via `localStorage` key `venture-hq-webhook-url`.

If no webhook is set, action buttons show "Set webhook in Settings". You can still use **Copy prompt** to copy a text summary to the clipboard.

## Edit venture data

All seed data lives in `src/data/ventures.ts`.

Update `ventures` for status, blockers, activity, next steps, notes, and bot fields (`botName`, `botId`, `actionLabel`). Bump `LAST_UPDATED` when you change anything.

### Status values

- `active` : moving
- `blocked` : waiting on a critical or hard blocker
- `parked` : intentionally on hold

### Metrics policy

Prefer omitting fake KPIs. If you must show illustrative numbers, add them under `metrics` with `isExample: true`. The UI shows an **Example** badge on those values.

## Stack

Vite, React, TypeScript, Tailwind CSS v4.
