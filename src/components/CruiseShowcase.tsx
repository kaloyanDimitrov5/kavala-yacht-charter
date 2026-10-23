"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Anchor,
  ArrowRight,
  PersonSimpleSwim,
  Sailboat,
  Waves,
} from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { SeaDecor } from "./SeaDecor";

type Kind = "day" | "multi" | "fishing";
type Filter = "all" | Kind;

export type ShowcaseCruise = {
  href: string;
  kind: Kind;
  title: string;
  duration: string;
  line: string;
  /** "From €1,580", only for cruises with an owner price */
  price?: string;
  image: string | null;
  alt: string;
};

type Props = {
  titleA: string;
  titleB: string;
  lead: string;
  filterLabel: string;
  filters: Record<Filter, string>;
  allHref: string;
  allLabel: string;
  experienceLabel: string;
  experience: { swim: string; sup: string; bay: string; skipper: string };
  cruises: ShowcaseCruise[];
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/*
 * Home: every cruise at a glance, plus what every cruise includes.
 * Motion (simple, owner request): cards fade up with a 60ms stagger the first time they enter,
 * and again when a filter changes. Photos zoom slightly on hover (pointer devices only).
 * Background drawings turn and bob slowly. Nothing is tied to scroll position.
 */
export function CruiseShowcase(props: Props) {
  const {
    titleA,
    titleB,
    lead,
    filterLabel,
    filters,
    allHref,
    allLabel,
    experienceLabel,
    experience,
    cruises,
  } = props;
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotionSafe();
  const shown = cruises.filter((c) => filter === "all" || c.kind === filter);

  const points = [
    { icon: PersonSimpleSwim, label: experience.swim },
    { icon: Waves, label: experience.sup },
    { icon: Anchor, label: experience.bay },
    { icon: Sailboat, label: experience.skipper },
  ];

  return (
    <section
      aria-labelledby="showcase-title"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      <SeaDecor />

      <div className="relative mx-auto max-w-7xl">
        <h2
          id="showcase-title"
          className="max-w-measure text-4xl font-semibold tracking-tight lg:text-6xl"
        >
          <span className="block text-aegean-soft">{titleA}</span>
          <span className="block text-aegean">{titleB}</span>
        </h2>
        <p className="mt-6 max-w-measure text-lg text-aegean-soft lg:text-xl">
          {lead}
        </p>

        {/* Filter: a set of toggle buttons (aria-pressed), so the cards below stay one list */}
        <div
          role="group"
          aria-label={filterLabel}
          className="mt-10 flex flex-wrap gap-2"
        >
          {(Object.keys(filters) as Filter[]).map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                aria-controls="showcase-list"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-160 ease-press active:scale-[0.98] sm:text-base ${
                  on
                    ? "bg-aegean text-white"
                    : "bg-white text-aegean-soft ring-1 ring-inset ring-aegean/10 hover:text-aegean"
                }`}
              >
                {filters[f]}
              </button>
            );
          })}
        </div>

        <motion.ul
          id="showcase-list"
          key={filter}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((c, i) => {
            // A card left alone on the last row spans the row and lays out side by side
            const last = i === shown.length - 1;
            const wideSm = last && shown.length % 2 === 1;
            const wideLg = last && shown.length % 3 === 1;
            const liSpan = `${wideSm ? "sm:col-span-2" : ""} ${wideLg ? "lg:col-span-3" : wideSm ? "lg:col-span-1" : ""}`;
            const linkGrid = `${wideSm ? "sm:grid sm:grid-cols-2" : ""} ${wideLg ? "lg:grid lg:grid-cols-3" : wideSm ? "lg:block" : ""}`;
            const textWide = `${wideSm ? "sm:self-center sm:p-10" : ""} ${wideLg ? "lg:col-span-2 lg:self-center lg:p-10" : wideSm ? "lg:p-6" : ""}`;
            return (
              // Each card triggers on its own, so a tall list on a phone still reveals card by card
              <motion.li
                key={c.href}
                className={liSpan}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: {
                    opacity: 0,
                    transform: reduce ? "none" : "translateY(16px)",
                  },
                  shown: {
                    opacity: 1,
                    transform: "translateY(0px)",
                    transition: {
                      duration: reduce ? 0.2 : 0.5,
                      delay: reduce ? 0 : (i % 3) * 0.06,
                      ease: EASE_OUT,
                    },
                  },
                }}
              >
                <Link
                  href={c.href}
                  className={`group block h-full overflow-hidden rounded-3xl bg-white transition-transform duration-200 ease-press active:scale-[0.99] ${linkGrid}`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-shoal/20">
                    {c.image && (
                      <Image
                        src={c.image}
                        alt={c.alt}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-fluid group-hover:scale-105"
                      />
                    )}
                    {/* 24px card radius − 16px inset = 8px chip radius */}
                    <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2 py-1 text-sm font-semibold text-aegean backdrop-blur-xl">
                      {c.duration}
                    </span>
                    {c.price && (
                      <span className="absolute right-4 top-4 rounded-lg bg-aegean px-2 py-1 text-sm font-semibold tabular-nums text-white">
                        {c.price}
                      </span>
                    )}
                  </span>
                  <span className={`flex items-end justify-between gap-4 p-6 ${textWide}`}>
                    <span className="min-w-0">
                      <span className="block text-xl font-semibold tracking-tight text-aegean lg:text-2xl">
                        {c.title}
                      </span>
                      <span className="mt-2 block text-base text-aegean-soft">
                        {c.line}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-limestone text-aegean transition-[background-color,color,transform] duration-200 ease-press group-hover:translate-x-1 group-hover:bg-aegean group-hover:text-white"
                    >
                      <ArrowRight size={20} weight="bold" />
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <ul
            aria-label={experienceLabel}
            className="grid grid-cols-2 gap-x-6 gap-y-4 lg:flex lg:gap-8"
          >
            {points.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-base font-medium text-aegean"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-shoal-deep">
                  <Icon size={20} aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <Link
            href={allHref}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-aegean px-3 py-2 text-base font-semibold text-white transition-[background-color,transform] duration-160 ease-press hover:bg-aegean/90 active:scale-[0.98]"
          >
            {allLabel}
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
