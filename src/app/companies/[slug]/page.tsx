import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyBySlug } from "@/application/dashboard/queries";
import { ArticleList } from "@/components/articles/article-list";
import {
  ArticleListSkeleton,
  PageHeadingSkeleton,
  PanelSkeleton,
} from "@/components/layout/loading-ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div>
          <PageHeadingSkeleton />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <ArticleListSkeleton rows={7} />
            </section>
            <aside className="space-y-6">
              <PanelSkeleton rows={4} />
              <PanelSkeleton rows={4} />
            </aside>
          </div>
        </div>
      }
    >
      <CompanyContent slug={slug} />
    </Suspense>
  );
}

async function CompanyContent({ slug }: { slug: string }) {
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const articles = company.articles
    .map((rel) => rel.article)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return (
    <div className="content-fade-in">
      <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Vendor</p>
      <h1 className="display text-4xl">{company.name}</h1>
      <p className="mt-3 max-w-2xl text-muted">{company.description}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">News and announcements</h2>
          <ArticleList articles={articles} />
        </section>
        <aside className="space-y-6">
          <div className="border border-line bg-elev p-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Events</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {company.events.length ? (
                company.events.map((event) => (
                  <li key={event.id}>
                    <Link href={`/events/${event.slug}`} className="hover:text-accent">
                      {event.name}
                    </Link>
                    <div className="text-xs text-muted">{formatDate(event.startsAt)}</div>
                  </li>
                ))
              ) : (
                <li className="text-muted">No events tracked</li>
              )}
            </ul>
          </div>
          <div className="border border-line bg-elev p-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Related technologies</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {company.relatedTech.length ? (
                company.relatedTech.map((tech) => (
                  <li key={tech.id}>
                    <Link href={`/technology/${tech.slug}`} className="hover:text-accent">
                      {tech.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted">No overlap yet</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
