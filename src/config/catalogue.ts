/**
 * Cruises and courses offered (owner's list). Text lives in src/content/catalogue.{en,bg}.ts;
 * photo filenames are derived here so each page has the same five gallery slots.
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

/** Five gallery slots per page. Drop files with these names into public/media/. */
const slots = (prefix: string) => [1, 2, 3, 4, 5].map((n) => `${prefix}-${n}.jpg`);
export const cruiseGallery = (slug: CruiseSlug) => slots(`cruise-${slug}`);
export const courseGallery = (slug: CourseSlug) => slots(`course-${slug}`);

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
