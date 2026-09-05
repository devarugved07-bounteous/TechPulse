import {
  ArticleListSkeleton,
  PageHeadingSkeleton,
  PanelSkeleton,
  TopProgressBar,
} from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <TopProgressBar />
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
  );
}
