import { PageHeadingSkeleton, SkeletonLine, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <ul className="mt-8 divide-y divide-line">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <SkeletonLine className="h-6 w-56" />
            <SkeletonLine className="h-3 w-40" />
          </li>
        ))}
      </ul>
    </div>
  );
}
