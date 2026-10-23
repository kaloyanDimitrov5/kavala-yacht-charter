import { site } from "@/config/site";

/** Builds a wa.me link, or null when no number is configured. */
export function whatsappHref(message: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** tel: link to the same number, for visitors without WhatsApp. Null when no number is set. */
export function phoneHref(): string | null {
  return site.whatsappNumber ? `tel:+${site.whatsappNumber}` : null;
}

/** The number as people read it: "+359 87 805 0450" for Bulgarian mobiles, otherwise "+" and the digits. */
export function phoneDisplay(): string {
  const n = site.whatsappNumber;
  const bg = n.match(/^(359)(\d{2})(\d{3})(\d{4})$/);
  return bg ? `+${bg[1]} ${bg[2]} ${bg[3]} ${bg[4]}` : `+${n}`;
}

/** Opens a Viber chat with the same number (Viber links cannot carry a prefilled message). */
export function viberHref(): string | null {
  return site.whatsappNumber ? `viber://chat?number=%2B${site.whatsappNumber}` : null;
}
