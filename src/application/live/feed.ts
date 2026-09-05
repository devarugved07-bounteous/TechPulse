import { companies, sources, technologies, type Category, type Company, type Source, type Technology } from "@/data/catalog";
import { categories } from "@/data/catalog";
import { fetchFeed } from "@/infrastructure/rss/fetcher";
import { hashUrl } from "@/lib/utils";
import { recencyWeight, trendScore } from "@/domain/scoring";

export type LiveArticle = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  imageUrl: string | null;
  author: string | null;
  publishedAt: Date;
  fetchedAt: Date;
  source: Source;
  categories: { category: Category }[];
  companies: { company: Company }[];
  technologies: { technology: Technology }[];
};

const TOPIC_ALIASES = [
  { id: "funding-round", name: "Funding rounds", aliases: ["series a", "series b", "funding", "raises"] },
  { id: "product-launch", name: "Product launches", aliases: ["launches", "announces", "generally available"] },
  { id: "open-source-release", name: "Open source releases", aliases: ["open source", "released under"] },
  { id: "outage", name: "Outages", aliases: ["outage", "downtime"] },
] as const;

const CACHE_TTL_MS = 15 * 60_000;
const EMPTY_CACHE_TTL_MS = 30_000;

const globalForFeeds = globalThis as unknown as {
  techPulseFeedPromise?: Promise<LiveArticle[]>;
  techPulseFeedExpiresAt?: number;
  techPulseFeedCount?: number;
};

export async function getLiveArticles(): Promise<LiveArticle[]> {
  if (
    globalForFeeds.techPulseFeedPromise &&
    (globalForFeeds.techPulseFeedExpiresAt ?? 0) > Date.now()
  ) {
    return globalForFeeds.techPulseFeedPromise;
  }

  const promise = loadLiveArticles();
  globalForFeeds.techPulseFeedPromise = promise;

  try {
    const articles = await promise;
    // Never pin an empty failure for the full 15 minutes — retry soon.
    globalForFeeds.techPulseFeedExpiresAt =
      Date.now() + (articles.length ? CACHE_TTL_MS : EMPTY_CACHE_TTL_MS);
    globalForFeeds.techPulseFeedCount = articles.length;
    return articles;
  } catch (error) {
    globalForFeeds.techPulseFeedPromise = undefined;
    globalForFeeds.techPulseFeedExpiresAt = 0;
    globalForFeeds.techPulseFeedCount = 0;
    throw error;
  }
}

async function loadLiveArticles(): Promise<LiveArticle[]> {
  const settled = await Promise.allSettled(
    sources.map(async (source) => {
      const feed = await fetchFeed(source.feedUrl, {});
      return feed.items.slice(0, 35).map((item): LiveArticle => {
        const text = `${item.title} ${item.summary ?? ""}`.toLowerCase();
        const articleCategories = source.categories
          .map((slug) => categories.find((category) => category.slug === slug))
          .filter((category): category is Category => Boolean(category));
        const articleCompanies = companies.filter((company) => matchesAny(text, company.aliases));
        const articleTechnologies = technologies.filter((technology) =>
          matchesAny(text, technology.aliases),
        );
        return {
          id: hashUrl(item.url),
          title: item.title,
          url: item.url,
          summary: item.summary ?? null,
          imageUrl: item.imageUrl ?? null,
          author: item.author ?? null,
          publishedAt: item.publishedAt,
          fetchedAt: new Date(),
          source,
          categories: articleCategories.map((category) => ({ category })),
          companies: articleCompanies.map((company) => ({ company })),
          technologies: articleTechnologies.map((technology) => ({ technology })),
        };
      });
    }),
  );

  const unique = new Map<string, LiveArticle>();
  let failed = 0;
  for (const result of settled) {
    if (result.status !== "fulfilled") {
      failed += 1;
      continue;
    }
    for (const article of result.value) {
      if (!unique.has(article.url)) unique.set(article.url, article);
    }
  }

  const articles = [...unique.values()].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  );

  if (process.env.NODE_ENV === "development") {
    console.info(
      `[techpulse] feeds ok=${sources.length - failed}/${sources.length} articles=${articles.length}`,
    );
  }

  return articles;
}

export async function rankTechnologies(take = 25) {
  const articles = await getLiveArticles();
  return rankEntities(
    articles,
    technologies,
    (article, technology) => article.technologies.some((relation) => relation.technology.id === technology.id),
    take,
  ).map((row, index) => ({ ...row.entity, rank: index + 1, score: row.score, delta: 0 }));
}

export async function rankCompanies(take = 25) {
  const articles = await getLiveArticles();
  return rankEntities(
    articles,
    companies,
    (article, company) => article.companies.some((relation) => relation.company.id === company.id),
    take,
  ).map((row, index) => ({
    id: `${row.entity.id}:${index + 1}`,
    rank: index + 1,
    score: row.score,
    company: row.entity,
  }));
}

export async function rankCategories(take = 25) {
  const articles = await getLiveArticles();
  return rankEntities(
    articles,
    categories,
    (article, category) => article.categories.some((relation) => relation.category.id === category.id),
    take,
  ).map((row, index) => ({
    id: `${row.entity.id}:${index + 1}`,
    rank: index + 1,
    score: row.score,
    category: row.entity,
  }));
}

export async function rankTopics(take = 25) {
  const articles = await getLiveArticles();
  return rankEntities(
    articles,
    TOPIC_ALIASES,
    (article, topic) => matchesAny(`${article.title} ${article.summary ?? ""}`.toLowerCase(), [...topic.aliases]),
    take,
  ).map((row, index) => ({
    id: `${row.entity.id}:${index + 1}`,
    rank: index + 1,
    score: row.score,
    topic: { id: row.entity.id, slug: row.entity.id, name: row.entity.name },
  }));
}

function rankEntities<T extends { id: string }>(
  articles: LiveArticle[],
  entities: readonly T[],
  matches: (article: LiveArticle, entity: T) => boolean,
  take: number,
) {
  const now = new Date();
  const windowStart = now.getTime() - 72 * 3_600_000;
  return entities
    .map((entity) => {
      const hits = articles.filter(
        (article) => article.publishedAt.getTime() >= windowStart && matches(article, entity),
      );
      const uniqueSources = new Set(hits.map((article) => article.source.id)).size;
      const authoritySum = hits.reduce((sum, article) => sum + article.source.popularityWeight, 0);
      const recencyScore = hits.reduce((sum, article) => sum + recencyWeight(article.publishedAt, now), 0);
      const score = trendScore({
        mentionCount: hits.length,
        uniqueSources,
        authoritySum,
        recencyScore,
      });
      return { entity, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, take);
}

function matchesAny(text: string, aliases: string[]) {
  return aliases.some((alias) => {
    const escaped = alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9.+#])${escaped}([^a-z0-9.+#]|$)`, "i").test(text);
  });
}
