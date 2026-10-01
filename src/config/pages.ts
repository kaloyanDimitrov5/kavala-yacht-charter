/**
 * Site pages in menu order. `path` is appended to /{locale}.
 * The menu marks the current page with aria-current="page".
 */
export const pages = [
  { key: "home", path: "" },
  { key: "cruises", path: "/cruises" },
  { key: "courses", path: "/courses" },
  { key: "boat", path: "/boat" },
  { key: "experiences", path: "/experiences" },
  { key: "book", path: "/book" },
  { key: "faq", path: "/faq" },
] as const;

export type PageKey = (typeof pages)[number]["key"];
