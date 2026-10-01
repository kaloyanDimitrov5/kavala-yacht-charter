import { site } from "@/config/site";

/** Builds a wa.me link, or null when no number is configured. */
export function whatsappHref(message: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
