import { Suspense } from "react";
import Link from "next/link";
import { searchAll } from "@/application/search";
import { SearchForm } from "@/components/search/search-form";
import { PanelSkeleton } from "@/components/layout/loading-ui";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">Search</h1>
      <p className="mt-2 text-muted">Articles, technologies, companies, categories, and events.</p>
      <div className="mt-6">
        <SearchForm q={q} />
      </div>
      {q ? (
        <Suspense
          key={q}
          fallback={
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <PanelSkeleton rows={8} title={false} />
              <PanelSkeleton rows={5} title={false} />
              <PanelSkeleton rows={5} title={false} />
              <PanelSkeleton rows={5} title={false} />
            </div>
          }
        >
          <SearchResults q={q} />
        </Suspense>
      ) : null}
    </div>
  );
}

async function SearchResults({ q }: { q: string }) {
  const results = await searchAll(q);
  return (
    <div className="content-fade-in mt-10 grid gap-8 md:grid-cols-2">
      <ResultGroup
        title="Articles"
        items={results.articles.map((row) => ({
          href: row.url,
          label: row.title,
          meta: `${row.source} · ${formatRelativeTime(new Date(row.publishedAt))} · ${formatDate(new Date(row.publishedAt))}`,
          external: true,
        }))}
      />
      <ResultGroup
        title="Technologies"
        items={results.technologies.map((row) => ({ href: `/technology/${row.slug}`, label: row.name }))}
      />
      <ResultGroup
        title="Companies"
        items={results.companies.map((row) => ({ href: `/companies/${row.slug}`, label: row.name }))}
      />
      <ResultGroup
        title="Categories"
        items={results.categories.map((row) => ({ href: `/categories/${row.slug}`, label: row.name }))}
      />
      <ResultGroup
        title="Events"
        items={results.events.map((row) => ({
          href: `/events/${row.slug}`,
          label: row.name,
          meta: formatDate(new Date(row.startsAt)),
        }))}
      />
    </div>
  );
}

function ResultGroup({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string; meta?: string; external?: boolean }[];
}) {
  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.2em] text-accent">{title}</h2>
      <ul className="mt-3 space-y-3 text-sm">
        {items.length ? (
          items.map((item) => (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="break-words hover:text-accent">
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} className="break-words hover:text-accent">
                  {item.label}
                </Link>
              )}
              {item.meta ? <div className="mt-0.5 break-words text-xs text-muted">{item.meta}</div> : null}
            </li>
          ))
        ) : (
          <li className="text-muted">No matches</li>
        )}
      </ul>
    </section>
  );
}
