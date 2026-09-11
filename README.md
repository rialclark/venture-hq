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

## Boss webhook (Suggest then Send)

Each venture card has a **Suggest** action. Clicking it opens an inline panel: review the suggested action, edit the prefilled work-order message, then **Send to {bot}** (or Copy / Cancel). Suggest never auto-sends.

1. In Boss, open the routine named **Venture HQ Actions**.
2. Copy the webhook URL (and Authorization value if shown) from the routine panel.
3. On the Venture HQ site, open **Settings** (gear in the header), paste the URL and optional Authorization, then Save.
4. Optional: click **Test ping** to confirm the webhook receives a request.
5. Use **Suggest**, edit the message, then **Send**. The payload includes `ventureId`, `botId`, `botName`, `suggestedAction`, `message`, `nextStep`, and blocker summaries.

Stored only in this browser:
- `localStorage` key `venture-hq-webhook-url`
- `localStorage` key `venture-hq-webhook-auth` (Authorization header value)

If no webhook URL is set, a banner prompts you to open Settings. Send shows "Set webhook first". Authorization is included on every POST when saved.

## Edit venture data

All seed data lives in `src/data/ventures.ts`.

Update `ventures` for status, blockers, activity, next steps, notes, and bot fields (`botName`, `botId`, `actionLabel`, optional `suggestedAction`). Bump `LAST_UPDATED` when you change anything.

### Status values

- `active` : moving
- `blocked` : waiting on a critical or hard blocker
- `parked` : intentionally on hold

### Metrics policy

Prefer omitting fake KPIs. If you must show illustrative numbers, add them under `metrics` with `isExample: true`. The UI shows an **Example** badge on those values.

## Stack

Vite, React, TypeScript, Tailwind CSS v4.
