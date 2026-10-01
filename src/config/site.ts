/**
 * Single source for facts about the charter.
 *
 * Confirmed facts come from the owner's brief. Everything marked TODO is unknown:
 * leave it empty (`""`, `null`, `[]`) and the UI hides that element or falls back
 * to a neutral version. Never put a guessed value here.
 */

export type RouteId =
  | "thasos"
  | "samothraki"
  | "skopelos"
  | "skiathos"
  | "alonissos"
  | "kyra-panagia";

export type Review = {
  name: string;
  from: string;
  text: string;
  /** ISO date of the trip or review */
  date: string;
};

export const site = {
  /** TODO(owner): business or boat name. Empty shows the neutral name from the dictionary. */
  brandName: "",

  /** Production URL without trailing slash, from NEXT_PUBLIC_SITE_URL. Used for canonical and og tags. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",

  /** Digits only, from NEXT_PUBLIC_WHATSAPP_NUMBER. Never hardcode. */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),

  /** Confirmed facts from the brief. */
  facts: {
    cabins: 4,
    berthsPerCabin: 2,
    maxGuests: 8,
    bathrooms: 2,
    bathroomsHaveShowers: true,
    skipperIncluded: true,
    sup: true,
    homePort: "Kavala",
  },

  /** Standard routes from the brief. Other routes on request. */
  routes: ["thasos", "samothraki", "skopelos", "skiathos", "alonissos", "kyra-panagia"] as RouteId[],

  boat: {
    /** TODO(owner): boat name */
    name: "",
    /** TODO(owner): make and model */
    model: "",
    /** TODO(owner): "monohull" or "catamaran". The boat diagram is schematic either way. */
    type: "",
    /** TODO(owner): length in metres */
    lengthMeters: null as number | null,
    /** TODO(owner): build or refit year */
    year: null as number | null,
  },

  pricing: {
    /** TODO(owner): starting price. null hides every price element. */
    from: null as number | null,
    currency: "EUR",
    /** TODO(owner): what the price covers, e.g. per week or per day */
    unit: "",
  },

  /** TODO(owner): season dates, ISO month-day. Empty hides the season line. */
  season: { from: "", to: "" },

  /** TODO(owner): real reviews only. Empty array hides the reviews block. */
  reviews: [] as Review[],

  legal: {
    /** TODO(owner): registered company name for the footer */
    companyName: "",
    /** TODO(owner): cancellation and weather policy text is in the dictionaries (faq) */
  },

  contact: {
    /** TODO(owner): optional email shown in the footer */
    email: "",
    /** TODO(owner): optional Instagram handle without @ */
    instagram: "",
  },
} as const;

export const totalBerths = site.facts.cabins * site.facts.berthsPerCabin;
