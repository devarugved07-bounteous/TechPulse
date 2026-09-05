import { categories, companies, events, technologies } from "@/data/catalog";
import {
  getLiveArticles,
  rankCategories,
  rankCompanies,
  rankTechnologies,
  rankTopics,
} from "@/application/live/feed";
import { mondayUtc } from "@/lib/utils";

export type DigestSection =
  | "AI"
  | "CLOUD"
  | "DEVELOPMENT"
  | "CYBERSECURITY"
  | "STARTUPS"
  | "RESEARCH"
  | "BIG_TECH";

export async function getDashboardData() {
  const [articles, hotTech] = await Promise.all([getLiveArticles(), getHotTechnologies(8)]);
  const now = new Date();
  return {
    headlines: articles.slice(0, 16),
    breaking: articles.filter((article) => article.publishedAt.getTime() >= Date.now() - 12 * 3_600_000).slice(0, 6),
    events: withCompanies(events)
      .filter((event) => event.startsAt >= now)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .slice(0, 8),
    companyUpdates: articles.filter((article) => article.source.type === "COMPANY_BLOG").slice(0, 8),
    hotTech,
  };
}

export async function getHotTechnologies(take = 12) {
  return rankTechnologies(take);
}

export async function listCategories() {
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const category = categories.find((item) => item.slug === slug);
  if (!category) return null;
  const articles = (await getLiveArticles())
    .filter((article) => article.categories.some((relation) => relation.category.slug === slug))
    .slice(0, 40);
  return { ...category, articles: articles.map((article) => ({ article })) };
}

export async function listTechnologies() {
  const ranks = await rankTechnologies(technologies.length);
  const score = new Map(ranks.map((item) => [item.id, item.score]));
  return technologies
    .map((technology) => ({
      ...technology,
      popularityScore: score.get(technology.id) ?? 0,
      categories: technology.categorySlugs
        .map((slug) => categories.find((category) => category.slug === slug))
        .filter(Boolean)
        .map((category) => ({ category: category! })),
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore || a.name.localeCompare(b.name));
}

export async function getTechnologyBySlug(slug: string) {
  const technology = technologies.find((item) => item.slug === slug);
  if (!technology) return null;
  const allArticles = await getLiveArticles();
  const articles = allArticles
    .filter((article) => article.technologies.some((relation) => relation.technology.slug === slug))
    .slice(0, 40);
  const ranked = await rankTechnologies(technologies.length);
  const current = ranked.find((item) => item.slug === slug);
  const relatedCompanies = uniqueBy(
    articles.flatMap((article) => article.companies.map((relation) => relation.company)),
    (company) => company.id,
  ).slice(0, 8);
  return {
    ...technology,
    categories: technology.categorySlugs
      .map((categorySlug) => categories.find((category) => category.slug === categorySlug))
      .filter(Boolean)
      .map((category) => ({ category: category! })),
    articles: articles.map((article) => ({ article })),
    trends: current ? [{ rank: current.rank, score: current.score }] : [],
    relatedCompanies,
  };
}

export async function listCompanies() {
  return [...companies].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCompanyBySlug(slug: string) {
  const company = companies.find((item) => item.slug === slug);
  if (!company) return null;
  const articles = (await getLiveArticles())
    .filter((article) => article.companies.some((relation) => relation.company.slug === slug))
    .slice(0, 40);
  const relatedTech = uniqueBy(
    articles.flatMap((article) => article.technologies.map((relation) => relation.technology)),
    (technology) => technology.id,
  ).slice(0, 8);
  return {
    ...company,
    events: withCompanies(events).filter((event) => event.companySlug === slug),
    articles: articles.map((article) => ({ article })),
    relatedTech,
  };
}

export async function listEvents() {
  return withCompanies(events).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export async function getEventBySlug(slug: string) {
  return withCompanies(events).find((event) => event.slug === slug) ?? null;
}

export async function getLatestDigest() {
  return buildDigest(mondayUtc());
}

export async function getDigestByWeek(weekStart: Date) {
  return buildDigest(weekStart);
}

export async function getTrendingBoard() {
  const [companies, categories, topics] = await Promise.all([
    rankCompanies(),
    rankCategories(),
    rankTopics(),
  ]);
  return { hotTech: await getHotTechnologies(25), companies, categories, topics };
}

const digestCategories: Record<DigestSection, string[]> = {
  AI: ["artificial-intelligence"],
  CLOUD: ["cloud-computing"],
  DEVELOPMENT: ["software-development", "devops", "open-source"],
  CYBERSECURITY: ["cybersecurity"],
  STARTUPS: ["startups-funding"],
  RESEARCH: ["research-innovation", "quantum-computing"],
  BIG_TECH: ["big-tech"],
};

async function buildDigest(weekStart: Date) {
  const weekEnd = new Date(weekStart.getTime() + 7 * 86_400_000 - 1);
  const all = await getLiveArticles();
  const inWindow = all.filter((article) => article.publishedAt >= weekStart && article.publishedAt <= weekEnd);
  const pool = inWindow.length ? inWindow : all.slice(0, 80);
  const used = new Set<string>();
  const items: {
    id: string;
    section: DigestSection;
    rank: number;
    article: (typeof pool)[number];
  }[] = [];
  for (const [section, slugs] of Object.entries(digestCategories) as [DigestSection, string[]][]) {
    const matches = pool.filter(
      (article) =>
        !used.has(article.id) &&
        article.categories.some((relation) => slugs.includes(relation.category.slug)),
    );
    matches.slice(0, 5).forEach((article, index) => {
      used.add(article.id);
      items.push({ id: `${section}:${article.id}`, section, rank: index + 1, article });
    });
  }
  return {
    id: weekStart.toISOString(),
    weekStart,
    weekEnd,
    generatedAt: new Date(),
    items,
  };
}

function withCompanies(input: typeof events) {
  return input.map((event) => ({
    ...event,
    company: companies.find((company) => company.slug === event.companySlug) ?? null,
    sourceId: null,
    companyId: event.companySlug ?? null,
  }));
}

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  return [...new Map(items.map((item) => [key(item), item])).values()];
}
