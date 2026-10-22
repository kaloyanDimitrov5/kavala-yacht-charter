import type { PhotoKey } from "./photos";

/**
 * Cruises and courses offered (owner's list). Text lives in src/content/catalogue.{en,bg}.ts.
 * Galleries are lists of photo library keys; the first photo is the cover (page gallery lead
 * and list thumbnail). Photos are reused across pages on purpose: this is all we have for now.
 */

export const cruises = [
  { slug: "thasos-bays-day-cruise", kind: "day" },
  { slug: "kavala-day-cruise", kind: "day" },
  { slug: "thasos-cruise", kind: "multi" },
  { slug: "sporades-cruise", kind: "multi" },
  { slug: "halkidiki-cruise", kind: "multi" },
  { slug: "tuna-fishing-trip", kind: "fishing" },
] as const;

export const courses = [{ slug: "captain-course" }, { slug: "yachting-course" }] as const;

export type CruiseSlug = (typeof cruises)[number]["slug"];
export type CruiseKind = (typeof cruises)[number]["kind"];
export type CourseSlug = (typeof courses)[number]["slug"];

export const cruiseKinds: CruiseKind[] = ["day", "multi", "fishing"];

/** Gallery sizes the photo grid lays out cleanly: 5, 9 or 13 (one large, then rows of four). */
export const cruiseGalleries: Record<CruiseSlug, PhotoKey[]> = {
  "thasos-bays-day-cruise": ["cover-thasos-bays", "pic-thasos-bay", "pic-giola", "pic-turquoise-deck", "pic-sup-paddle"],
  "kavala-day-cruise": ["cover-kavala", "pic-beach-harbour", "pic-open-sea-deck", "pic-green-cove", "yacht-sunset"],
  "thasos-cruise": [
    "cover-thasos",
    "pic-giola-2",
    "pic-turquoise-bay",
    "pic-green-bay",
    "pic-thasos-bay",
    "pic-giola",
    "guest-sunset-anchor",
    "yacht-swim",
    "gallery-cove",
  ],
  "sporades-cruise": [
    "cover-sporades",
    "pic-kyra-panagia",
    "pic-alonissos-view",
    "pic-skopelos-harbour",
    "pic-skopelos-church",
    "pic-alonissos-bougainvillea",
    "pic-alonissos-alley",
    "pic-alonissos-sunset-alley",
    "pic-alonissos-steps",
    "pic-alonissos-church-lane",
    "pic-island-white-house",
    "pic-island-lane",
    "pic-island-taverna",
  ],
  "halkidiki-cruise": ["cover-halkidiki", "pic-athos", "pic-bay-flag", "pic-green-cove", "yacht-anchorage"],
  // Owner: the fish photo is the cover
  "tuna-fishing-trip": ["pic-tuna-catch", "pic-tuna-deck", "guest-dolphins", "pic-open-sea-deck", "guest-sunset-sea"],
};

export const courseGalleries: Record<CourseSlug, PhotoKey[]> = {
  "captain-course": ["guest-helm", "gallery-helm", "yacht-sail", "hero", "pic-bay-flag"],
  "yachting-course": ["gallery-cockpit", "pic-cockpit-life", "guest-sup", "yacht-swim", "yacht-cove"],
};

/** Which cruise each island on the map belongs to (the map links to it). */
export const islandCruise = {
  thasos: "thasos-cruise",
  samothraki: "tuna-fishing-trip",
  "kyra-panagia": "sporades-cruise",
  alonissos: "sporades-cruise",
  skopelos: "sporades-cruise",
  skiathos: "sporades-cruise",
} as const satisfies Record<string, CruiseSlug>;

export const isCruise = (s: string): s is CruiseSlug => cruises.some((c) => c.slug === s);
export const isCourse = (s: string): s is CourseSlug => courses.some((c) => c.slug === s);
