/**
 * Page sections in order, used by the nav overlay.
 * `ready: true` renders the link visually disabled (no dead anchors).
 * Flip to true when the section with that id ships.
 */
export const sections = [
  { id: "compare", key: "compare" },
  { id: "guests", key: "guests" },
  { id: "routes", key: "routes" },
  { id: "boat", key: "boat" },
  { id: "bachelor", key: "bachelor" },
  { id: "pilates", key: "pilates" },
  { id: "how", key: "how" },
  { id: "faq", key: "faq" },
] as const;

export type SectionKey = (typeof sections)[number]["key"];
