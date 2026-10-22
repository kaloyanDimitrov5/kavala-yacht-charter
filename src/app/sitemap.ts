import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { pages } from "@/config/pages";
import { cruises, courses } from "@/config/catalogue";
import { absolute } from "@/lib/siteUrl";

/**
 * /sitemap.xml: every page in every language, each entry listing its language alternates
 * (hreflang), so Google pairs the English and Bulgarian versions.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    ...pages.map((p) => ({ path: p.path, priority: p.path === "" ? 1 : 0.8, changeFrequency: "monthly" as const })),
    ...cruises.map((c) => ({ path: `/cruises/${c.slug}`, priority: 0.9, changeFrequency: "monthly" as const })),
    ...courses.map((c) => ({ path: `/courses/${c.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];
  const lastModified = new Date();

  return paths.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: absolute(`/${locale}${path}`),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absolute(`/${l}${path}`)])),
      },
    })),
  );
}
