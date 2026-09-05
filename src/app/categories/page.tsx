import { Suspense } from "react";
import Link from "next/link";
import { listCategories } from "@/application/dashboard/queries";
import { CardGridSkeleton } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">Categories</h1>
      <p className="mt-2 text-muted">Coverage across the technology landscape — not only AI.</p>
      <Suspense
        fallback={
          <div className="mt-8">
            <CardGridSkeleton cards={9} />
          </div>
        }
      >
        <CategoryGrid />
      </Suspense>
    </div>
  );
}

async function CategoryGrid() {
  const categories = await listCategories();
  return (
    <div className="content-fade-in mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="border border-line bg-elev p-4 hover:border-accent"
        >
          <h2 className="display text-xl sm:text-2xl">{category.name}</h2>
          <p className="mt-2 line-clamp-3 text-sm text-muted">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
