import { Suspense } from "react";
import Link from "next/link";
import { listTechnologies } from "@/application/dashboard/queries";
import { SkeletonLine } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Technologies" };

export default function TechnologiesPage() {
  return (
    <div>
      <h1 className="display text-4xl">Technologies</h1>
      <p className="mt-2 text-muted">Browse the stack: Kubernetes, Postgres, Rust, Azure, and more.</p>
      <Suspense
        fallback={
          <ul className="mt-8 divide-y divide-line">
            {Array.from({ length: 12 }).map((_, index) => (
              <li key={index} className="flex items-baseline justify-between gap-4 py-3">
                <SkeletonLine className="h-6 w-40" />
                <SkeletonLine className="h-3 w-48" />
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
        <li key={tech.id} className="flex items-baseline justify-between gap-4 py-3">
          <Link href={`/technology/${tech.slug}`} className="display text-2xl hover:text-accent">
            {tech.name}
          </Link>
          <span className="text-right text-xs text-muted">
            {tech.categories.map((c) => c.category.name).join(" · ")}
          </span>
        </li>
      ))}
    </ul>
  );
}
