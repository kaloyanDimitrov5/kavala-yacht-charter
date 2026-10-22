import { site } from "@/config/site";

/**
 * Absolute base URL for canonical links, hreflang, the sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL to the production domain (no trailing slash) before going live;
 * the localhost fallback is only for development.
 */
export const siteUrl = (site.url || "http://localhost:3000").replace(/\/$/, "");

export const absolute = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
