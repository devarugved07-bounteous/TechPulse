import { PageHeadingSkeleton, SkeletonLine, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div className="max-w-2xl">
      <TopProgressBar />
      <PageHeadingSkeleton />
      <div className="mt-6 space-y-3">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-5/6" />
        <SkeletonLine className="h-3 w-32" />
      </div>
    </div>
  );
}
