"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Certificate,
  Check,
  FishSimple,
} from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Photo = { src: string | null; alt: string };

export type AccentPanel = {
  badge: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  href: string;
  photoLabel: string;
  photos: Photo[];
};

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;
/** Final fan: back left, back right, front centre */
const FAN = [
  { rotate: -8, x: "-28%", y: "4%" },
  { rotate: 7, x: "28%", y: "6%" },
  { rotate: 0, x: "0%", y: "0%" },
];

/** Three prints that start stacked and fan out once when they come into view. */
function PhotoFan({
  photos,
  label,
  reduce,
}: {
  photos: Photo[];
  label: string;
  reduce: boolean;
}) {
  return (
    <motion.ul
      aria-label={label}
      className="relative mx-auto aspect-[4/3] w-full max-w-md"
      initial="stacked"
      whileInView="fanned"
      viewport={{ once: true, amount: 0.4 }}
    >
      {photos.slice(0, 3).map((p, i) => {
        const f = FAN[i];
        return (
          <motion.li
            key={i}
            className="absolute inset-x-12 inset-y-4 rounded-2xl bg-white p-2"
            style={{ zIndex: i }}
            variants={{
              stacked: { transform: "translate(0%, 0%) rotate(0deg)" },
              fanned: {
                transform: `translate(${f.x}, ${f.y}) rotate(${f.rotate}deg)`,
                transition: reduce
                  ? { duration: 0 }
                  : { duration: 0.9, delay: 0.1 + i * 0.08, ease: EASE_FLUID },
              },
            }}
          >
            {/* 16px frame − 8px border = 8px photo radius */}
            <span className="relative block h-full overflow-hidden rounded-lg bg-shoal/20">
              {p.src && (
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              )}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

/*
 * Home: the two accents, captain courses (dark) and fishing cruises (light), side by side.
 * Motion: one fan of photos per panel on first view. Buttons: colour shift and press scale.
 */
export function Accents({
  captain,
  fishing,
}: {
  captain: AccentPanel;
  fishing: AccentPanel;
}) {
  const reduce = useReducedMotionSafe();

  const panel = (p: AccentPanel, dark: boolean) => (
    <article
      aria-labelledby={dark ? "accent-captain" : "accent-fishing"}
      data-surface={dark ? "night" : undefined}
      className={`flex flex-col gap-10 overflow-hidden rounded-3xl p-6 sm:p-10 ${dark ? "bg-aegean text-white" : "bg-white text-aegean"}`}
    >
      <PhotoFan photos={p.photos} label={p.photoLabel} reduce={reduce} />
      <div className="flex flex-1 flex-col">
        <p
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
            dark
              ? "bg-white/10 text-shoal-light"
              : "bg-limestone text-shoal-deep"
          }`}
        >
          {dark ? (
            <Certificate size={20} aria-hidden />
          ) : (
            <FishSimple size={20} aria-hidden />
          )}
          {p.badge}
        </p>
        <h3
          id={dark ? "accent-captain" : "accent-fishing"}
          className={`mt-4 text-3xl font-semibold tracking-tight lg:text-4xl ${dark ? "text-white" : "text-aegean"}`}
        >
          {p.title}
        </h3>
        <p
          className={`mt-4 text-lg ${dark ? "text-mist" : "text-aegean-soft"}`}
        >
          {p.body}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {p.points.map((pt) => (
            <li
              key={pt}
              className="flex items-start gap-3 text-base font-medium"
            >
              <Check
                size={20}
                weight="bold"
                aria-hidden
                className={`mt-0.5 shrink-0 ${dark ? "text-shoal-light" : "text-shoal-deep"}`}
              />
              {pt}
            </li>
          ))}
        </ul>
        {/* mt-auto keeps both panels' buttons on one line on desktop; pt-8 keeps them off the list */}
        <div className="mt-auto pt-8">
          <Link
            href={p.href}
            className={`inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold transition-[background-color,transform] duration-160 ease-press active:scale-[0.98] ${
              dark
                ? "bg-white text-aegean hover:bg-limestone"
                : "bg-aegean text-white hover:bg-aegean/90"
            }`}
          >
            {p.cta}
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <section
      aria-label={`${captain.title}, ${fishing.title}`}
      className="px-4 pb-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        {panel(captain, true)}
        {panel(fishing, false)}
      </div>
    </section>
  );
}
