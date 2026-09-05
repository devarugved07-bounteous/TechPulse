import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

export type ArticleCardData = {
  id: string;
  title: string;
  url: string;
  summary?: string | null;
  publishedAt: Date;
  source: { name: string; slug: string };
  categories?: { category: { slug: string; name: string } }[];
  technologies?: { technology: { slug: string; name: string } }[];
};

export function ArticleList({ articles }: { articles: ArticleCardData[] }) {
  if (!articles.length) {
    return <p className="text-sm text-muted">No articles yet. Run ingest after seeding the database.</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {articles.map((article, index) => (
        <li key={article.id} className="rise min-w-0 py-4" style={{ animationDelay: `${index * 40}ms` }}>
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="display break-words text-lg leading-snug hover:text-accent"
          >
            {article.title}
          </a>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
            <span>{article.source.name}</span>
            <span>·</span>
            <time>{formatRelativeTime(new Date(article.publishedAt))}</time>
            {article.technologies?.slice(0, 3).map((rel) => (
              <Link key={rel.technology.slug} href={`/technology/${rel.technology.slug}`} className="text-accent">
                {rel.technology.name}
              </Link>
            ))}
          </div>
          {article.summary ? <p className="mt-2 line-clamp-2 text-sm text-muted">{article.summary}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function BreakingBanner({ articles }: { articles: ArticleCardData[] }) {
  const item = articles[0];
  if (!item) return null;
  return (
    <div className="rise mb-8 flex flex-col gap-2 border border-line bg-elev px-4 py-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-2">Breaking</span>
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="display min-w-0 break-words text-xl sm:flex-1"
      >
        {item.title}
      </a>
      <span className="shrink-0 text-xs text-muted">{item.source.name}</span>
    </div>
  );
}
