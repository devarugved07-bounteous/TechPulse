export function TopProgressBar() {
  return <div className="progress-track fixed inset-x-0 top-0 z-30" role="status" aria-label="Loading" />;
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function ArticleListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-line">
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index} className="space-y-2 py-4">
          <SkeletonLine className="w-3/4" />
          <SkeletonLine className="h-3 w-1/3" />
        </li>
      ))}
    </ul>
  );
}

export function PanelSkeleton({ rows = 5, title = true }: { rows?: number; title?: boolean }) {
  return (
    <div className="space-y-3 border border-line bg-elev p-4">
      {title ? <SkeletonLine className="h-3 w-24" /> : null}
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonLine key={index} className="w-full" />
      ))}
    </div>
  );
}

export function PageHeadingSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonLine className="h-3 w-32" />
      <SkeletonLine className="h-9 w-2/3" />
      <SkeletonLine className="h-3 w-1/2" />
    </div>
  );
}

export function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="space-y-3 border border-line bg-elev p-4">
          <SkeletonLine className="h-6 w-1/2" />
          <SkeletonLine className="h-3 w-full" />
          <SkeletonLine className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function BreakingSkeleton() {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-3 border border-line bg-elev px-4 py-3">
      <SkeletonLine className="h-3 w-16" />
      <SkeletonLine className="h-6 w-2/3" />
    </div>
  );
}

export function DefaultPageSkeleton() {
  return (
    <div className="space-y-8">
      <PageHeadingSkeleton />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ArticleListSkeleton rows={8} />
        </div>
        <div className="space-y-8">
          <PanelSkeleton rows={6} />
          <PanelSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}
