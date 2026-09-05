import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/application/dashboard/queries";
import { ArticleList } from "@/components/articles/article-list";
import { ArticleListSkeleton, PageHeadingSkeleton } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div>
          <PageHeadingSkeleton />
          <div className="mt-8">
            <ArticleListSkeleton rows={8} />
          </div>
        </div>
      }
    >
      <CategoryContent slug={slug} />
    </Suspense>
  );
}

async function CategoryContent({ slug }: { slug: string }) {
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = category.articles
    .map((rel) => rel.article)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return (
    <div className="content-fade-in">
      <h1 className="display text-4xl">{category.name}</h1>
      <p className="mt-2 text-muted">{category.description}</p>
      <div className="mt-8">
        <ArticleList articles={articles} />
      </div>
    </div>
  );
}
