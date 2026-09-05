# How TechPulse Works

TechPulse is a **technology intelligence dashboard**. It is not an AI-only news site. It aggregates public technology RSS feeds and organizes them by category, technology, company, events, trending signals, and a weekly digest.

There is **no database**. The app reads RSS feeds directly, classifies articles in memory, and serves pages with Next.js.

---

## One-sentence overview

When you open a page, the server fetches (or reuses a cached) set of RSS articles, tags them using a static catalog, ranks technologies and companies, then renders the UI.

---

## Architecture

```text
Browser
   |
   v
Next.js App Router (Server Components)
   |
   +--> src/application/dashboard/queries.ts
   |         |
   |         +--> getLiveArticles()          # live RSS snapshot
   |         +--> rankTechnologies()         # Hot Technologies
   |         +--> static events/companies    # from catalog
   |
   +--> src/application/live/feed.ts
             |
             +--> src/data/catalog.ts        # sources, tech, vendors, events
             +--> src/infrastructure/rss/fetcher.ts
                       |
                       v
                 Public RSS / Atom URLs
                 (TechCrunch, Azure Blog, HN, Kubernetes Blog, ...)
```

### Layer responsibilities

| Layer | Location | Role |
|---|---|---|
| Pages / UI | `src/app`, `src/components` | Routes, layout, loaders, search form |
| Application | `src/application` | Dashboard queries, live feed, search |
| Domain | `src/domain` | Scoring formula, category taxonomy |
| Data catalog | `src/data/catalog.ts` | Static sources, technologies, companies, events |
| Infrastructure | `src/infrastructure/rss` | HTTP fetch + RSS/Atom XML parse |

---

## What happens on a page request

Example: you open `/` (Home).

1. `src/app/page.tsx` calls `getDashboardData()`.
2. `getDashboardData()` asks `getLiveArticles()` for the current article snapshot.
3. If a fresh snapshot already exists in memory (last 15 minutes), that snapshot is reused.
4. Otherwise TechPulse:
   - loads every source from `src/data/catalog.ts`
   - fetches each feed URL in parallel (`Promise.allSettled`)
   - parses RSS/Atom XML
   - takes up to 35 items per feed
   - classifies each article
   - dedupes by URL
   - sorts by `publishedAt` descending
5. Home then slices that list into:
   - **Top headlines**
   - **Breaking** (last 12 hours)
   - **Company updates** (sources typed `COMPANY_BLOG`)
   - **Upcoming events** (static catalog)
   - **Hot technologies** (ranked from the live article set)

Failed feeds are skipped. One broken source does not take down the page.

---

## Catalog (static knowledge)

File: [`src/data/catalog.ts`](src/data/catalog.ts)

This file is the product’s “dictionary”. It is checked into git and does not need a database.

It contains:

- **Sources** — feed URL, source type, popularity weight, default categories  
  Examples: TechCrunch, Azure Blog, Hacker News, Kubernetes Blog
- **Categories** — Artificial Intelligence, Cloud Computing, DevOps, Cybersecurity, etc.
- **Technologies** — Kubernetes, Docker, Rust, Azure, PostgreSQL, … plus aliases like `k8s`, `gcp`
- **Companies / vendors** — Microsoft, AWS, Google Cloud, Nvidia, OpenAI, …
- **Events** — Build, Ignite, Google I/O, re:Invent, KubeCon, CES, …

To add a new RSS feed, edit the `sources` array in this file. No migration or seed step.

---

## Live RSS pipeline

File: [`src/application/live/feed.ts`](src/application/live/feed.ts)

### Fetch

[`src/infrastructure/rss/fetcher.ts`](src/infrastructure/rss/fetcher.ts):

- HTTP GET with a TechPulse user-agent
- 4-second timeout per feed
- Next.js fetch cache: `revalidate: 900` (15 minutes)
- Supports RSS `<item>` and Atom `<entry>`

### Classify

For each article title + summary:

1. **Categories** come from the source’s default category list.
2. **Companies** are matched by alias word boundaries (`microsoft`, `aws`, `openai`, …).
3. **Technologies** are matched the same way (`kubernetes`, `k8s`, `rust`, …).

Matching avoids naive substring false positives (for example short aliases).

### Cache (two layers)

1. **Next.js Data Cache** on each feed HTTP response (15 minutes).
2. **In-process memory cache** of the full classified article list (15 minutes).

So:

- First cold request may take a few seconds (many feeds in parallel).
- Later navigations reuse the same snapshot and stay faster.

There is no Neon wake-up delay because there is no database.

---

## Pages and what they show

| Route | What it does |
|---|---|
| `/` | Dashboard: headlines, breaking, hot tech, events, company blogs |
| `/categories` | Category index from catalog |
| `/categories/[slug]` | Live articles tagged with that category |
| `/technology` | Technology index ranked by live popularity |
| `/technology/[slug]` | Articles mentioning that technology + related vendors |
| `/companies` | Vendor directory |
| `/companies/[slug]` | Articles mentioning the vendor + related events/tech |
| `/events` | Curated conference list from catalog |
| `/events/[slug]` | Single event details |
| `/trending` | Live rankings for technologies, companies, categories, topics |
| `/weekly-digest` | Rule-based “This Week in Technology” sections |
| `/search` | In-memory search across articles, tech, companies, categories, events |

Each major route also has a `loading.tsx` skeleton and the header shows a pending indicator while navigating.

---

## Trending / Hot Technologies

File: [`src/domain/scoring.ts`](src/domain/scoring.ts)

Over the last ~72 hours of live articles, each technology (and company/category/topic) gets:

```text
score =
  mentionCount * 1.0
+ uniqueSources * 1.5
+ authoritySum * 1.0      # sum of source.popularityWeight
+ recencyScore * 2.0      # newer articles weigh more
```

The dashboard Hot Technologies rail and `/trending` both use this ranking. No LLM is involved.

---

## Weekly digest

Route: `/weekly-digest`

Built from the same live article snapshot:

- Sections: AI, Cloud, Development, Cybersecurity, Startups, Research, Big Tech
- Each section maps to category slugs
- Top articles per section are picked and deduped
- If the current ISO week has little data, the digest falls back to recent live articles

No email vendor. No LLM.

---

## Search

File: [`src/application/search/index.ts`](src/application/search/index.ts)

Search is case-insensitive text matching over the live article snapshot plus the static catalog.

Article results show:

- title
- source
- relative time (`2h ago`)
- calendar date

---

## UI behavior

- Server Components fetch data on the server (no separate JSON API required).
- Tailwind + CSS variables drive light/dark theme.
- Global overlay + top progress bar on any in-app navigation or search.
- `loading.tsx` and `Suspense` skeletons cover page and section loading.
- Nav links use Next.js `useLinkStatus` for a small pending indicator.
- Search submit button shows “Searching…” while pending.

---

## What is intentionally not included

- No PostgreSQL / Neon / Prisma at runtime
- No authentication or bookmarks (Phase 2 idea only)
- No reading lists or personalization
- No paid search engine
- No LLM summarization
- No billing or paywalls
- No cron jobs or REST API layer for the MVP UI

---
## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: copy `.env.example` to `.env` and set `NEXT_PUBLIC_SITE_URL` for production sitemap/OG URLs.

Deploy to Vercel Hobby. No database credentials are required.

---

## How to extend the product

1. **Add a feed** — append an entry to `sources` in `src/data/catalog.ts`.
2. **Add a technology** — append to `technologies` with aliases and category slugs.
3. **Add a vendor** — append to `companies` with aliases.
4. **Add an event** — append to `events`.
5. **Tune ranking** — edit weights in `src/domain/scoring.ts`.

After a code change, restart or wait for the 15-minute cache window to expire to see fresh classifications for new aliases.

---

## Mental model

Think of TechPulse as:

> A curated dictionary of tech entities + a live RSS reader that tags and ranks those entities on every request (with caching).

That keeps the MVP free, simple to run, and free of cold database wake-ups.
