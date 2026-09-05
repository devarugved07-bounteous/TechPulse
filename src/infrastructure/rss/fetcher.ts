import { normalizeArticleUrl, stripHtml } from "@/lib/utils";

export type ParsedFeedItem = {
  externalId?: string;
  url: string;
  title: string;
  summary?: string;
  contentHtml?: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
};

export type ParsedFeed = {
  etag?: string;
  lastModified?: string;
  notModified: boolean;
  items: ParsedFeedItem[];
};

/**
 * Local Windows/corporate networks often MITM HTTPS or lack a CA that Node trusts.
 * Production (Vercel) keeps strict TLS. Opt out of the local bypass with TECHPULSE_STRICT_SSL=1.
 */
function relaxTlsForLocalDev() {
  if (process.env.NODE_ENV === "production") return;
  if (process.env.TECHPULSE_STRICT_SSL === "1") return;
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") return;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function fetchFeed(
  url: string,
  opts: { etag?: string | null; lastModified?: string | null },
): Promise<ParsedFeed> {
  relaxTlsForLocalDev();

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (compatible; TechPulse/0.1; +https://techpulse.local; RSS aggregator)",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
  };
  if (opts.etag) headers["If-None-Match"] = opts.etag;
  if (opts.lastModified) headers["If-Modified-Since"] = opts.lastModified;

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers,
        // Avoid Next Data Cache storing empty/error-adjacent responses for long.
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      });
      if (response.status === 304) {
        return {
          notModified: true,
          items: [],
          etag: opts.etag ?? undefined,
          lastModified: opts.lastModified ?? undefined,
        };
      }
      if (!response.ok) {
        throw new Error(`Feed HTTP ${response.status} for ${url}`);
      }

      const xml = await response.text();
      return {
        notModified: false,
        etag: response.headers.get("etag") ?? undefined,
        lastModified: response.headers.get("last-modified") ?? undefined,
        items: parseFeedXml(xml),
      };
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Feed failed for ${url}`);
}

export function parseFeedXml(xml: string): ParsedFeedItem[] {
  const items: ParsedFeedItem[] = [];
  const rssItems = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const atomItems = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
  const blocks = rssItems.length ? rssItems : atomItems;

  for (const block of blocks) {
    const title = stripHtml(tag(block, "title") ?? "");
    const link =
      attr(block, "link", "href") ??
      tag(block, "link") ??
      tag(block, "guid") ??
      tag(block, "id");
    if (!title || !link) continue;
    const url = normalizeArticleUrl(link.trim());
    if (!/^https?:\/\//i.test(url)) continue;
    const summary = stripHtml(tag(block, "description") ?? tag(block, "summary") ?? tag(block, "content") ?? "");
    const contentHtml = tag(block, "content:encoded") ?? tag(block, "content");
    const publishedRaw =
      tag(block, "pubDate") ?? tag(block, "published") ?? tag(block, "updated") ?? tag(block, "dc:date");
    const publishedAt = publishedRaw ? new Date(publishedRaw) : new Date();
    items.push({
      externalId: stripHtml(tag(block, "guid") ?? tag(block, "id") ?? url),
      url,
      title,
      summary: summary.slice(0, 1200) || undefined,
      contentHtml: contentHtml?.slice(0, 20_000),
      imageUrl: extractImage(block, contentHtml),
      author: stripHtml(tag(block, "dc:creator") ?? tag(block, "author") ?? "") || undefined,
      publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    });
  }
  return items;
}

function tag(block: string, name: string) {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
  return block.match(re)?.[1];
}

function attr(block: string, name: string, attribute: string) {
  const re = new RegExp(`<${name}[^>]*${attribute}=["']([^"']+)["'][^>]*/?>`, "i");
  return block.match(re)?.[1];
}

function extractImage(block: string, content?: string) {
  return (
    attr(block, "enclosure", "url") ??
    attr(block, "media:content", "url") ??
    attr(block, "media:thumbnail", "url") ??
    (content ?? block).match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
  );
}
