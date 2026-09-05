import { ArticleListSkeleton, PageHeadingSkeleton, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <div className="mt-8">
        <ArticleListSkeleton rows={8} />
      </div>
    </div>
  );
}
