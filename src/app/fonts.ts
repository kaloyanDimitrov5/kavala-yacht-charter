import { Manrope } from "next/font/google";

/** The only typeface on the site. No italics; semibold is the heaviest weight. */
export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-manrope",
});
