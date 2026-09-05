import { ArticleListSkeleton, PageHeadingSkeleton, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <div className="mt-10 space-y-10">
        <ArticleListSkeleton rows={5} />
        <ArticleListSkeleton rows={5} />
      </div>
    </div>
  );
}
