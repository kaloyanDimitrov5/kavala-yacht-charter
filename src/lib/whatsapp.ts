import { site } from "@/config/site";

/** Builds a wa.me link, or null when no number is configured. */
export function whatsappHref(message: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** A number as people read it: "+359 87 805 0450" for Bulgarian mobiles, otherwise "+" and the digits. */
function readable(n: string): string {
  const bg = n.match(/^(359)(\d{2})(\d{3})(\d{4})$/);
  return bg ? `+${bg[1]} ${bg[2]} ${bg[3]} ${bg[4]}` : `+${n}`;
}

/**
 * Phone numbers for direct calls, in order: the WhatsApp number first, then the second phone.
 * For visitors without WhatsApp. Empty when no numbers are set.
 */
export function phones(): { href: string; display: string }[] {
  return [site.whatsappNumber, site.secondPhone]
    .filter((n) => n)
    .map((n) => ({ href: `tel:+${n}`, display: readable(n) }));
}

/** Opens a Viber chat with the same number (Viber links cannot carry a prefilled message). */
export function viberHref(): string | null {
  return site.whatsappNumber ? `viber://chat?number=%2B${site.whatsappNumber}` : null;
}
