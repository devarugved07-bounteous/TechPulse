import { Suspense } from "react";
import Link from "next/link";
import { getTrendingBoard } from "@/application/dashboard/queries";
import { PanelSkeleton } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Trending" };

export default function TrendingPage() {
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">Trending</h1>
      <p className="mt-2 text-muted">72-hour mention frequency, source diversity, recency, and authority.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Suspense fallback={<PanelSkeleton rows={8} />}>
          <TrendTechnologies />
        </Suspense>
        <Suspense fallback={<PanelSkeleton rows={8} />}>
          <TrendCompanies />
        </Suspense>
        <Suspense fallback={<PanelSkeleton rows={8} />}>
          <TrendCategories />
        </Suspense>
        <Suspense fallback={<PanelSkeleton rows={8} />}>
          <TrendTopics />
        </Suspense>
      </div>
    </div>
  );
}

async function TrendTechnologies() {
  const board = await getTrendingBoard();
  return (
    <TrendColumn
      title="Technologies"
      items={board.hotTech.map((row) => ({
        href: `/technology/${row.slug}`,
        name: row.name,
        rank: row.rank,
        delta: row.delta,
      }))}
    />
  );
}

async function TrendCompanies() {
  const board = await getTrendingBoard();
  return (
    <TrendColumn
      title="Companies"
      items={board.companies.map((row) => ({
        href: `/companies/${row.company.slug}`,
        name: row.company.name,
        rank: row.rank,
      }))}
    />
  );
}

async function TrendCategories() {
  const board = await getTrendingBoard();
  return (
    <TrendColumn
      title="Categories"
      items={board.categories.map((row) => ({
        href: `/categories/${row.category.slug}`,
        name: row.category.name,
        rank: row.rank,
      }))}
    />
  );
}

async function TrendTopics() {
  const board = await getTrendingBoard();
  return (
    <TrendColumn
      title="Topics"
      items={board.topics.map((row) => ({
        href: `/search?q=${encodeURIComponent(row.topic.name)}`,
        name: row.topic.name,
        rank: row.rank,
      }))}
    />
  );
}

function TrendColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; name: string; rank: number; delta?: number }[];
}) {
  return (
    <section className="content-fade-in border border-line bg-elev p-4">
      <h2 className="text-[11px] uppercase tracking-[0.2em] text-accent">{title}</h2>
      <ol className="mt-4 space-y-2 text-sm">
        {items.length ? (
          items.map((item) => (
            <li key={item.href} className="flex justify-between gap-3">
              <Link href={item.href} className="min-w-0 truncate hover:text-accent">
                <span className="mr-2 font-mono text-xs text-muted">{item.rank}</span>
                {item.name}
              </Link>
              {item.delta ? (
                <span className="shrink-0 text-xs text-muted">
                  {item.delta > 0 ? `↑${item.delta}` : `↓${Math.abs(item.delta)}`}
                </span>
              ) : null}
            </li>
          ))
        ) : (
          <li className="text-muted">No live signals yet for this window.</li>
        )}
      </ol>
    </section>
  );
}
