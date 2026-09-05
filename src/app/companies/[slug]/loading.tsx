import {
  ArticleListSkeleton,
  PageHeadingSkeleton,
  PanelSkeleton,
  TopProgressBar,
} from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
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
  );
}
