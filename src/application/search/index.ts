import { getLiveArticles } from "@/application/live/feed";
import { categories, companies, events, technologies } from "@/data/catalog";

export type SearchResults = {
  articles: { id: string; title: string; slug?: string; url: string; publishedAt: Date; source: string }[];
  technologies: { id: string; name: string; slug: string }[];
  companies: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
  events: { id: string; name: string; slug: string; startsAt: Date }[];
};

export async function searchAll(query: string): Promise<SearchResults> {
  const q = query.trim().slice(0, 120);
  if (!q) {
    return { articles: [], technologies: [], companies: [], categories: [], events: [] };
  }
  const needle = q.toLowerCase();
  const liveArticles = await getLiveArticles();
  const articleMatches = liveArticles
    .filter((article) => `${article.title} ${article.summary ?? ""}`.toLowerCase().includes(needle))
    .slice(0, 20);
  const technologyMatches = technologies
    .filter((item) => `${item.name} ${item.slug} ${item.aliases.join(" ")}`.toLowerCase().includes(needle))
    .slice(0, 8);
  const companyMatches = companies
    .filter((item) => `${item.name} ${item.aliases.join(" ")}`.toLowerCase().includes(needle))
    .slice(0, 8);
  const categoryMatches = categories
    .filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(needle))
    .slice(0, 8);
  const eventMatches = events
    .filter((item) => `${item.name} ${item.location}`.toLowerCase().includes(needle))
    .slice(0, 8);

  return {
    articles: articleMatches.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      publishedAt: row.publishedAt,
      source: row.source.name,
    })),
    technologies: technologyMatches.map((row) => ({ id: row.id, name: row.name, slug: row.slug })),
    companies: companyMatches.map((row) => ({ id: row.id, name: row.name, slug: row.slug })),
    categories: categoryMatches.map((row) => ({ id: row.id, name: row.name, slug: row.slug })),
    events: eventMatches.map((row) => ({ id: row.id, name: row.name, slug: row.slug, startsAt: row.startsAt })),
  };
}
