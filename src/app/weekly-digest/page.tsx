import { Suspense } from "react";
import Link from "next/link";
import { getLatestDigest } from "@/application/dashboard/queries";
import { DigestView } from "@/components/digest/digest-view";
import { ArticleListSkeleton, PageHeadingSkeleton } from "@/components/layout/loading-ui";
import { isoDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Weekly digest" };

export default function DigestPage() {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeadingSkeleton />
          <div className="mt-10 space-y-10">
            <ArticleListSkeleton rows={5} />
            <ArticleListSkeleton rows={5} />
          </div>
        </div>
      }
    >
      <DigestContent />
    </Suspense>
  );
}

async function DigestContent() {
  const digest = await getLatestDigest();

  if (!digest) {
    return (
      <div>
        <h1 className="display text-3xl sm:text-4xl">This Week in Technology</h1>
        <p className="mt-3 text-muted">No digest yet. Open the site after feeds load to build one from live articles.</p>
      </div>
    );
  }

  return (
    <div className="content-fade-in">
      <p className="text-sm text-muted">
        Week of {isoDate(digest.weekStart)} ·{" "}
        <Link href={`/weekly-digest/${isoDate(digest.weekStart)}`} className="text-accent">
          Permalink
        </Link>
      </p>
      <DigestView digest={digest} />
    </div>
  );
}
