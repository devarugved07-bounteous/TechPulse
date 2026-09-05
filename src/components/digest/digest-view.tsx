import { formatDate } from "@/lib/utils";

type DigestSection =
  | "AI"
  | "CLOUD"
  | "DEVELOPMENT"
  | "CYBERSECURITY"
  | "STARTUPS"
  | "RESEARCH"
  | "BIG_TECH";

const labels: Record<DigestSection, string> = {
  AI: "AI",
  CLOUD: "Cloud",
  DEVELOPMENT: "Development",
  CYBERSECURITY: "Cybersecurity",
  STARTUPS: "Startups",
  RESEARCH: "Research",
  BIG_TECH: "Big Tech",
};

const order: DigestSection[] = [
  "AI",
  "CLOUD",
  "DEVELOPMENT",
  "CYBERSECURITY",
  "STARTUPS",
  "RESEARCH",
  "BIG_TECH",
];

type Digest = {
  weekStart: Date;
  items: {
    section: DigestSection;
    rank: number;
    article: { id: string; title: string; url: string; publishedAt: Date; source: { name: string } };
  }[];
};

export function DigestView({ digest }: { digest: Digest }) {
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">This Week in Technology</h1>
      <p className="mt-2 text-muted">Rule-based picks from the week’s aggregated coverage.</p>
      <div className="mt-10 space-y-10">
        {order.map((section) => {
          const items = digest.items.filter((item) => item.section === section).sort((a, b) => a.rank - b.rank);
          if (!items.length) return null;
          return (
            <section key={section}>
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-accent">{labels[section]}</h2>
              <ol className="mt-3 divide-y divide-line">
                {items.map((item) => (
                  <li key={item.article.id} className="min-w-0 py-3">
                    <a href={item.article.url} className="display break-words text-lg hover:text-accent sm:text-xl">
                      {item.article.title}
                    </a>
                    <div className="text-xs text-muted">
                      {item.article.source.name} · {formatDate(item.article.publishedAt)}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
