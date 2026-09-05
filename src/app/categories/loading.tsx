import { CardGridSkeleton, PageHeadingSkeleton, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <div className="mt-8">
        <CardGridSkeleton cards={9} />
      </div>
    </div>
  );
}
