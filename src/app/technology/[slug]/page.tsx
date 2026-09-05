import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechnologyBySlug } from "@/application/dashboard/queries";
import { ArticleList } from "@/components/articles/article-list";
import {
  ArticleListSkeleton,
  PageHeadingSkeleton,
  PanelSkeleton,
} from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";

export default async function TechnologyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PageHeadingSkeleton />
            <div className="mt-8">
              <ArticleListSkeleton rows={7} />
            </div>
          </div>
          <aside className="space-y-6">
            <PanelSkeleton rows={2} />
            <PanelSkeleton rows={4} />
            <PanelSkeleton rows={4} />
          </aside>
        </div>
      }
    >
      <TechnologyContent slug={slug} />
    </Suspense>
  );
}

async function TechnologyContent({ slug }: { slug: string }) {
  const technology = await getTechnologyBySlug(slug);
  if (!technology) notFound();

  const articles = technology.articles
    .map((rel) => rel.article)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const rank = technology.trends[0]?.rank;

  return (
    <div className="content-fade-in grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Technology</p>
        <h1 className="display break-words text-3xl sm:text-4xl">{technology.name}</h1>
        <p className="mt-3 text-muted">{technology.description}</p>
        <div className="mt-8">
          <ArticleList articles={articles} />
        </div>
      </div>
      <aside className="space-y-6">
        <div className="border border-line bg-elev p-4">
          <div className="text-xs text-muted">Latest rank</div>
          <div className="display text-4xl">{rank ?? "—"}</div>
        </div>
        <div className="border border-line bg-elev p-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {technology.categories.map((rel) => (
              <li key={rel.category.slug}>
                <Link href={`/categories/${rel.category.slug}`} className="hover:text-accent">
                  {rel.category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-elev p-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Related vendors</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {technology.relatedCompanies.length ? (
              technology.relatedCompanies.map((company) => (
                <li key={company.id}>
                  <Link href={`/companies/${company.slug}`} className="hover:text-accent">
                    {company.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-muted">No vendor overlap yet</li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}
