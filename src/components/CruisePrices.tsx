"use client";

import { motion } from "framer-motion";
import { Check, Minus, Sparkle } from "@phosphor-icons/react";
import type { Season } from "@/config/pricing";
import type { PriceView } from "@/lib/price";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";

export type CruisePricesLabels = {
  title: string;
  lead: string;
  from: string;
  seasonsLabel: string;
  seasons: Record<Season, string>;
  includedTitle: string;
  included: string[];
  excludedTitle: string;
  excluded: string[];
  cleaning: string;
};

type Props = {
  view: PriceView;
  labels: CruisePricesLabels;
  whatsapp: { href: string | null; labels: WhatsAppLabels };
};

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/** One colour per season, used by the bar and by the matching dot in the list */
const swatch: Record<Season, string> = {
  pre: "bg-shoal-light",
  low: "bg-shoal-deep",
  high: "bg-teak",
};

/*
 * Cruise detail: prices by season. Left, a white card with the starting price, a bar of the
 * sailing year (May to October, each season to scale) and the season list. Right, an aegean card
 * with what the price includes and the WhatsApp action.
 * Motion: the bar segments grow in from the left once, 50ms apart. Reduced motion: drawn at once.
 * The bar is decoration (aria-hidden); the list below carries the same facts for everyone.
 */
export function CruisePrices({ view, labels, whatsapp }: Props) {
  const reduce = useReducedMotionSafe();

  return (
    <section id="prices" aria-labelledby="prices-title" className="scroll-mt-24 px-4 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
        <div className="rounded-3xl bg-white p-6 sm:p-10 lg:col-span-7">
          <h2 id="prices-title" className="text-3xl font-medium tracking-tight text-aegean lg:text-5xl">
            {labels.title}
          </h2>
          <p className="mt-4 max-w-measure text-lg text-aegean-soft">{labels.lead}</p>

          <p className="mt-10 flex items-baseline gap-3 text-aegean">
            <span className="text-lg font-medium text-aegean-soft">{labels.from}</span>
            <span className="text-5xl font-semibold tabular-nums tracking-tight lg:text-6xl">{view.from}</span>
          </p>

          {/* The sailing year, each season to scale */}
          <div aria-hidden className="mt-10">
            <motion.div
              className="flex h-3 gap-0.5 overflow-hidden rounded-full"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.6 }}
            >
              {view.bands.map((b, i) => (
                <motion.span
                  key={i}
                  className={`block h-full origin-left ${swatch[b.season]}`}
                  style={{ flexGrow: b.days, flexBasis: 0 }}
                  variants={{
                    hidden: { transform: reduce ? "scaleX(1)" : "scaleX(0)" },
                    shown: {
                      transform: "scaleX(1)",
                      transition: reduce ? { duration: 0 } : { duration: 0.6, delay: 0.1 + i * 0.05, ease: EASE_FLUID },
                    },
                  }}
                />
              ))}
            </motion.div>
            <div className="relative mt-2 h-6 text-sm text-aegean-soft">
              {view.ticks.map((t) => (
                <span key={t.label} className="absolute top-0" style={{ left: `${t.at * 100}%` }}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          <ul aria-label={labels.seasonsLabel} className="mt-8 flex flex-col">
            {view.rows.map((r) => (
              <li
                key={r.season}
                className="flex items-start justify-between gap-4 border-t border-aegean/10 py-4 first:border-t-0 first:pt-0 last:pb-0"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span aria-hidden className={`mt-1 h-3 w-3 shrink-0 rounded-full ${swatch[r.season]}`} />
                  <span className="min-w-0">
                    <span className="block text-base font-semibold text-aegean lg:text-lg">{labels.seasons[r.season]}</span>
                    <span className="mt-1 block text-sm text-aegean-soft">{r.ranges.join(" · ")}</span>
                  </span>
                </span>
                <span className="shrink-0 text-xl font-semibold tabular-nums text-aegean lg:text-2xl">{r.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-surface="night"
          className="flex flex-col rounded-3xl bg-aegean p-6 text-white sm:p-10 lg:col-span-5"
        >
          <h3 className="text-xl font-medium tracking-tight lg:text-2xl">{labels.includedTitle}</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {labels.included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base font-medium">
                <Check size={20} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-shoal-light" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-xl font-medium tracking-tight lg:text-2xl">{labels.excludedTitle}</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {labels.excluded.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-mist">
                <Minus size={20} weight="bold" aria-hidden className="mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium">
            <Sparkle size={20} aria-hidden className="shrink-0 text-shoal-light" />
            {labels.cleaning}
          </p>

          <div className="mt-auto pt-10">
            <WhatsAppButton href={whatsapp.href} labels={whatsapp.labels} tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
