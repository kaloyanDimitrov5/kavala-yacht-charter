import type { Locale } from "@/i18n";
import { en, type Dictionary } from "./en";
import { bg } from "./bg";

const dictionaries: Record<Locale, Dictionary> = { en, bg };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
