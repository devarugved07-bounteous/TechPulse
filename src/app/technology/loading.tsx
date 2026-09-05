import { PageHeadingSkeleton, SkeletonLine, TopProgressBar } from "@/components/layout/loading-ui";

export default function Loading() {
  return (
    <div>
      <TopProgressBar />
      <PageHeadingSkeleton />
      <ul className="mt-8 divide-y divide-line">
        {Array.from({ length: 12 }).map((_, index) => (
          <li key={index} className="flex items-baseline justify-between gap-4 py-3">
            <SkeletonLine className="h-6 w-40" />
            <SkeletonLine className="h-3 w-48" />
          </li>
        ))}
      </ul>
    </div>
  );
}
