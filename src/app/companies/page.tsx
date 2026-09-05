import { Suspense } from "react";
import Link from "next/link";
import { listCompanies } from "@/application/dashboard/queries";
import { CardGridSkeleton } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Companies" };

export default function CompaniesPage() {
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">Vendors</h1>
      <p className="mt-2 text-muted">Profiles for cloud, data, and infrastructure companies.</p>
      <Suspense
        fallback={
          <div className="mt-8">
            <CardGridSkeleton cards={9} />
          </div>
        }
      >
        <CompanyGrid />
      </Suspense>
    </div>
  );
}

async function CompanyGrid() {
  const companies = await listCompanies();
  return (
    <div className="content-fade-in mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Link
          key={company.id}
          href={`/companies/${company.slug}`}
          className="border border-line bg-elev p-4 hover:border-accent"
        >
          <h2 className="display text-xl sm:text-2xl">{company.name}</h2>
          <p className="mt-2 line-clamp-3 text-sm text-muted">{company.description}</p>
        </Link>
      ))}
    </div>
  );
}
