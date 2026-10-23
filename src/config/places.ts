import type { CruiseSlug } from "./catalogue";

/*
 * Places on Thasos (owner's list). Positions come from approximate real coordinates, projected
 * as x = (lon − 24.48) × 1250, y = (40.82 − lat) × 1650 (latitude stretched so the island keeps
 * its proportions). The coastline is a simplified outline from the same projection: schematic,
 * not for navigation, and labelled as such on the page.
 */

export type PlaceType = "beach" | "village" | "monastery";
export type PlaceKey =
  | "marble-beach"
  | "golden-beach"
  | "paradise-beach"
  | "aliki-beach"
  | "archangel-michael"
  | "tripiti-beach"
  | "limenaria"
  | "skala-marion";

const project = (lon: number, lat: number) => ({
  x: Math.round((lon - 24.48) * 1250),
  y: Math.round((40.82 - lat) * 1650),
});

export const THASOS_VIEW = { w: 420, h: 460 };

/** Numbered clockwise round the island from Limenas, so the pins read in order */
export const thasosPlaces: { key: PlaceKey; type: PlaceType; x: number; y: number; query: string }[] = [
  { key: "marble-beach", type: "beach", query: "Marble Beach Thasos", ...project(24.768, 40.766) },
  { key: "golden-beach", type: "beach", query: "Golden Beach Thasos", ...project(24.768, 40.722) },
  { key: "paradise-beach", type: "beach", query: "Paradise Beach Thasos", ...project(24.776, 40.645) },
  { key: "aliki-beach", type: "beach", query: "Aliki Beach Thasos", ...project(24.742, 40.604) },
  { key: "archangel-michael", type: "monastery", query: "Archangel Michael Monastery Thasos", ...project(24.7, 40.58) },
  { key: "tripiti-beach", type: "beach", query: "Tripiti Beach Thasos", ...project(24.636, 40.584) },
  { key: "limenaria", type: "village", query: "Limenaria Thasos", ...project(24.578, 40.626) },
  { key: "skala-marion", type: "village", query: "Skala Marion Thasos", ...project(24.524, 40.66) },
];

/** Google Images results for a place, so visitors can see it before they choose. English
 *  names on purpose: they return the most photos in either language. */
export const imagesSearchUrl = (query: string) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

/** Limenas, the island's main harbour, where the crossing from Kavala lands */
export const limenas = project(24.71, 40.778);

export const thasosCoast = [
  [24.712, 40.782], [24.745, 40.786], [24.776, 40.772], [24.792, 40.745], [24.772, 40.725],
  [24.79, 40.7], [24.782, 40.66], [24.786, 40.64], [24.765, 40.614], [24.745, 40.6],
  [24.718, 40.584], [24.69, 40.568], [24.655, 40.574], [24.605, 40.598], [24.575, 40.622],
  [24.54, 40.63], [24.515, 40.648], [24.518, 40.668], [24.54, 40.705], [24.555, 40.735],
  [24.6, 40.765], [24.64, 40.776], [24.68, 40.786],
].map(([lon, lat]) => project(lon, lat));

/** Which cruises show the places section */
export const cruisePlaces: Partial<Record<CruiseSlug, PlaceKey[]>> = {
  "thasos-weekend-cruise": thasosPlaces.map((p) => p.key),
  "thasos-cruise": thasosPlaces.map((p) => p.key),
};
