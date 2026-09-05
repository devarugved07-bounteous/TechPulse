import { Suspense } from "react";
import Link from "next/link";
import { listTechnologies } from "@/application/dashboard/queries";
import { SkeletonLine } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Technologies" };

export default function TechnologiesPage() {
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">Technologies</h1>
      <p className="mt-2 text-muted">Browse the stack: Kubernetes, Postgres, Rust, Azure, and more.</p>
      <Suspense
        fallback={
          <ul className="mt-8 divide-y divide-line">
            {Array.from({ length: 12 }).map((_, index) => (
              <li key={index} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <SkeletonLine className="h-6 w-40" />
                <SkeletonLine className="h-3 w-48 max-w-full" />
              </li>
            ))}
          </ul>
        }
      >
        <TechnologyList />
      </Suspense>
    </div>
  );
}

async function TechnologyList() {
  const technologies = await listTechnologies();
  return (
    <ul className="content-fade-in mt-8 divide-y divide-line">
      {technologies.map((tech) => (
        <li
          key={tech.id}
          className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
        >
          <Link
            href={`/technology/${tech.slug}`}
            className="display min-w-0 break-words text-xl hover:text-accent sm:text-2xl"
          >
            {tech.name}
          </Link>
          <span className="min-w-0 text-left text-xs text-muted sm:max-w-[50%] sm:text-right">
            {tech.categories.map((c) => c.category.name).join(" · ")}
          </span>
        </li>
      ))}
    </ul>
  );
}
