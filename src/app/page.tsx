import { Suspense } from "react";
import Link from "next/link";
import { getDashboardData } from "@/application/dashboard/queries";
import { ArticleList, BreakingBanner } from "@/components/articles/article-list";
import { HotTechRail } from "@/components/technologies/hot-rail";
import {
  ArticleListSkeleton,
  BreakingSkeleton,
  PanelSkeleton,
} from "@/components/layout/loading-ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Technology intelligence</p>
      <h1 className="display mt-2 text-3xl sm:text-4xl md:text-5xl">The stack, vendors, and events — in one desk.</h1>
      <p className="mt-3 max-w-2xl text-muted">
        AI is one category. Browse Kubernetes, cloud, security, research, and conferences without opening twenty tabs.
      </p>

      <div className="mt-8">
        <Suspense fallback={<BreakingSkeleton />}>
          <HomeBreaking />
        </Suspense>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Top headlines</h2>
          <Suspense fallback={<ArticleListSkeleton rows={8} />}>
            <HomeHeadlines />
          </Suspense>
        </section>
        <div className="space-y-8">
          <Suspense fallback={<PanelSkeleton rows={6} />}>
            <HomeHotTech />
          </Suspense>
          <Suspense fallback={<PanelSkeleton rows={4} />}>
            <HomeEvents />
          </Suspense>
          <Suspense fallback={<PanelSkeleton rows={4} />}>
            <HomeCompanyUpdates />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function HomeBreaking() {
  const data = await getDashboardData();
  return (
    <div className="content-fade-in">
      <BreakingBanner articles={data.breaking.length ? data.breaking : data.headlines} />
    </div>
  );
}

async function HomeHeadlines() {
  const data = await getDashboardData();
  return (
    <div className="content-fade-in">
      <ArticleList articles={data.headlines} />
    </div>
  );
}

async function HomeHotTech() {
  const data = await getDashboardData();
  return (
    <div className="content-fade-in">
      <HotTechRail items={data.hotTech} />
    </div>
  );
}

async function HomeEvents() {
  const data = await getDashboardData();
  return (
    <section className="content-fade-in border border-line bg-elev p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Upcoming events</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {data.events.map((event) => (
          <li key={event.id}>
            <Link href={`/events/${event.slug}`} className="hover:text-accent">
              {event.name}
            </Link>
            <div className="text-xs text-muted">{formatDate(event.startsAt)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function HomeCompanyUpdates() {
  const data = await getDashboardData();
  return (
    <section className="content-fade-in border border-line bg-elev p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Company updates</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {data.companyUpdates.map((article) => (
          <li key={article.id}>
            <a href={article.url} target="_blank" rel="noreferrer" className="break-words hover:text-accent">
              {article.title}
            </a>
            <div className="text-xs text-muted">{article.source.name}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
