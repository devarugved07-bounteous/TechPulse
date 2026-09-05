import { PageHeadingSkeleton, PanelSkeleton, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <PanelSkeleton rows={8} />
        <PanelSkeleton rows={8} />
        <PanelSkeleton rows={8} />
        <PanelSkeleton rows={8} />
      </div>
    </div>
  );
}
