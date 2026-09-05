import { PageHeadingSkeleton, PanelSkeleton, SkeletonLine, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <div className="mt-6">
        <SkeletonLine className="h-10 w-full" />
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <PanelSkeleton rows={8} title={false} />
        <PanelSkeleton rows={5} title={false} />
      </div>
    </div>
  );
}
