import { PageHeadingSkeleton, SkeletonLine, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <ul className="mt-8 divide-y divide-line">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="flex flex-col gap-1 py-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
            <SkeletonLine className="h-6 w-56 max-w-full" />
            <SkeletonLine className="h-3 w-40" />
          </li>
        ))}
      </ul>
    </div>
  );
}
