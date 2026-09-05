import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = ["", "/technology", "/categories", "/companies", "/events", "/trending", "/weekly-digest", "/search"];
  return staticRoutes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
