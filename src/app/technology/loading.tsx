import { PageHeadingSkeleton, SkeletonLine, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <ul className="mt-8 divide-y divide-line">
        {Array.from({ length: 12 }).map((_, index) => (
          <li key={index} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <SkeletonLine className="h-6 w-40" />
            <SkeletonLine className="h-3 w-48 max-w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
