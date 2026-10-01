"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { InViewVideo } from "./InViewVideo";

export type GuestItem = {
  id: string;
  caption: string;
  alt: string;
  image: string | null;
  video: string | null;
  file: string;
};

type Props = {
  title: string;
  lead: string;
  items: GuestItem[];
  labels: { region: string; prev: string; next: string; play: string; pause: string };
};

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;
/** Snapshot tilt, alternating, like prints laid on a table */
const tilt = (i: number) => (i % 2 === 0 ? -2 : 2);

/*
 * The accent section. Guest snapshots in white print frames on a shoal-deep band.
 * Motion: the prints fan in once when the row enters (stagger 70ms, 800ms fluid curve),
 * then stay still. Clips play muted only while visible. Reduced motion: fade only.
 * The row scrolls natively (swipe, trackpad, arrow keys); the buttons step one card.
 */
export function GuestGallery({ title, lead, items, labels }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const [edges, setEdges] = useState({ start: true, end: false });

  // Element scroll listener, batched through requestAnimationFrame (never a window listener)
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const list = el?.querySelector("ul");
    const card = list?.querySelector("li");
    if (!el || !list || !card) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: reduce ? "auto" : "smooth" });
  };

  const navButton =
    "inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-aegean transition-[background-color,transform,opacity] duration-160 ease-press hover:bg-limestone active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section
      id="guests"
      aria-labelledby="guests-title"
      data-surface="accent"
      className="overflow-hidden bg-shoal-deep py-24 text-white"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8">
          <div className="max-w-measure">
            <h2 id="guests-title" className="text-4xl font-semibold tracking-tight text-white lg:text-6xl">
              {title}
            </h2>
            <p className="mt-6 text-lg text-white">{lead}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => step(-1)} disabled={edges.start} aria-label={labels.prev} aria-controls="guest-track" className={navButton}>
              <ArrowLeft size={20} weight="bold" aria-hidden />
            </button>
            <button type="button" onClick={() => step(1)} disabled={edges.end} aria-label={labels.next} aria-controls="guest-track" className={navButton}>
              <ArrowRight size={20} weight="bold" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Full bleed row; py-8 leaves room for the tilted prints */}
      {/*
        The scroller is a focusable region so keyboard users can scroll it with the arrow keys.
        The entrance triggers on the scroller (the visible window), not on the list: on a phone
        the list is about six screens wide, so 25% of it is never in view at once.
      */}
      <motion.div
        ref={trackRef}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        id="guest-track"
        role="region"
        aria-label={labels.region}
        tabIndex={0}
        className="track-gutter mt-8 snap-x snap-mandatory overflow-x-auto py-8 lg:mt-12"
      >
        <ul className="flex w-max gap-6">
        {items.map((item, i) => (
          <li key={item.id} className="w-story shrink-0 snap-start lg:w-story-lg">
            <motion.figure
              className="rounded-2xl bg-white p-2"
              variants={{
                hidden: { opacity: 0, transform: `translateY(48px) rotate(0deg)` },
                shown: {
                  opacity: 1,
                  transform: `translateY(0px) rotate(${tilt(i)}deg)`,
                  transition: reduce
                    ? { duration: 0.3, transform: { duration: 0 } }
                    : { duration: 0.8, delay: i * 0.07, ease: EASE_FLUID },
                },
              }}
            >
              {/* Print frame: 16px outer radius, 8px border → 8px inner radius */}
              <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-aegean/10">
                <InViewVideo
                  image={item.image}
                  video={item.video}
                  alt={item.alt}
                  file={item.file}
                  sizes="288px"
                  placeholder="bg-shoal/30"
                  labels={{ play: labels.play, pause: labels.pause }}
                />
              </div>
              <figcaption className="px-2 pb-1 pt-3 text-sm font-medium text-aegean">{item.caption}</figcaption>
            </motion.figure>
          </li>
        ))}
        </ul>
      </motion.div>
    </section>
  );
}
