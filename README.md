# TechPulse

Free technology intelligence platform. Aggregates news, vendor blogs, research, government notices, newsletters, community feeds, open-source blogs, and conferences into one dashboard.

AI is one category among many. Browse `/technology/kubernetes`, vendor pages, events, trending, and a weekly digest.

For a full walkthrough of the architecture and request flow, see [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

## Stack

Next.js App Router, TypeScript, Tailwind, and public RSS feeds. No database and no billing.

## Setup

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

No database setup, migration, seed, or cron is required. TechPulse reads public RSS
feeds directly and caches successful responses for 15 minutes. Technology, category,
vendor, and event catalogs are versioned in `src/data/catalog.ts`.

On some local Windows networks Node cannot verify RSS HTTPS certificates
(`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`). Local `dev` relaxes TLS for feed fetching
only; production on Vercel stays strict.

## Deploy (free)

- Vercel Hobby is the only service required.
- `NEXT_PUBLIC_SITE_URL` is optional and should be your Vercel URL in production.
- No database or GitHub Actions secrets are needed.

The first uncached request fetches sources in parallel. Later requests use Next.js's
15-minute Data Cache. If one source is unavailable it is skipped without taking down
the page.
