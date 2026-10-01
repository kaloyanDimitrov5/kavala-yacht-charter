"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Umbrella } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export type TaglineChip =
  | { kind: "icon"; label: string }
  /** position: CSS object-position, to keep the subject inside the wide pill */
  | { kind: "image"; src: string | null; label: string; alt: string; position?: string };

type Props = {
  /** Lines of copy; `{key}` marks an inline chip from `chips` */
  lines: string[];
  chips: Record<string, TaglineChip>;
};

type Token = { type: "word"; text: string } | { type: "chip"; key: string };

const CHIP = /^\{(\w+)\}$/;

/**
 * B11 tagline reveal, with the evidence inside the sentence.
 * Words and chips light up one at a time in reading order as scroll progress crosses them
 * (useScroll is rAF batched; no raw scroll listener). A chip wakes up by scaling to full size
 * while its photo settles from a slight zoom. On desktop a frame beside the sentence shows the
 * last chip reached, so the sentence drives the picture (crossfade, 700ms fluid curve).
 * Below lg the inline chips are hidden (at phone sizes they shrink to unreadable blobs and break
 * the line rhythm); the same frame sits under the sentence at 4:3 instead.
 * Reduced motion and pre hydration: all lit, frame on the last photo.
 */
export function TaglineReveal({ lines, chips }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotionSafe();
  const tokens: Token[][] = lines.map((line) =>
    line.split(" ").map((part): Token => {
      const m = part.match(CHIP);
      return m && chips[m[1]] ? { type: "chip", key: m[1] } : { type: "word", text: part };
    }),
  );
  const total = tokens.reduce((n, line) => n + line.length, 0);
  // Reading order position of every chip, for the desktop frame
  const chipOrder = tokens.flat().flatMap((t, i) => (t.type === "chip" ? [{ key: t.key, at: i }] : []));
  const [active, setActive] = useState(total);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts when the paragraph top reaches 80% of the viewport, completes when its bottom reaches 45%
    offset: ["start 0.8", "end 0.45"],
  });

  const toCount = (p: number) => Math.max(0, Math.min(total, Math.floor(p * (total + 1))));

  useEffect(() => {
    setActive(reduce ? total : toCount(scrollYProgress.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, total]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const next = toCount(p);
    setActive((prev) => (prev === next ? prev : next));
  });

  // Plain sentence for screen readers: chips removed
  const spoken = lines.map((line) => line.replace(/\s*\{\w+\}/g, "")).join(" ");
  // The frame shows the last chip the reveal has reached (the first chip before any is reached)
  const shown = [...chipOrder].reverse().find((c) => c.at < active)?.key ?? chipOrder[0]?.key;
  let index = 0;

  return (
    <section className="flex min-h-screen items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
        <p className="sr-only">{spoken}</p>
        <p
          ref={ref}
          aria-hidden
          className="max-w-measure text-3xl font-semibold tracking-tight text-aegean sm:text-4xl lg:col-span-7 lg:text-5xl"
        >
          {tokens.map((line, li) => (
            <span key={li} className="block [&+&]:mt-4">
              {line.map((token, ti) => {
                const lit = index++ < active;
                const space = ti < line.length - 1 ? " " : "";
                if (token.type === "word") {
                  return (
                    <span key={ti}>
                      <span className={`transition-opacity duration-700 ease-fluid ${lit ? "opacity-100" : "opacity-30"}`}>
                        {token.text}
                      </span>
                      {space}
                    </span>
                  );
                }
                return (
                  <span key={ti}>
                    <Chip chip={chips[token.key]} lit={lit} />
                    {space}
                  </span>
                );
              })}
            </span>
          ))}
        </p>

        {/* The picture follows the sentence: beside it on desktop, under it below lg.
            Decorative; the words carry the meaning. */}
        <div
          aria-hidden
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-aegean/5 lg:col-span-4 lg:col-start-9 lg:aspect-[4/5]"
        >
          {chipOrder.map(({ key }) => {
            const chip = chips[key];
            const on = key === shown;
            return (
              <div
                key={key}
                className={`absolute inset-0 transition-opacity duration-700 ease-fluid ${on ? "opacity-100" : "opacity-0"}`}
              >
                {chip.kind === "icon" ? (
                  <div className="flex h-full items-center justify-center text-aegean-soft/50">
                    <Umbrella size={96} weight="thin" />
                  </div>
                ) : (
                  chip.src && (
                    <Image
                      src={chip.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className={`object-cover transition-transform duration-700 ease-fluid ${on ? "scale-100" : "scale-105"}`}
                    />
                  )
                )}
                {/* Frame radius 24px, label 16px in → 8px label radius */}
                <p className="absolute left-4 top-4 rounded-lg bg-white/80 px-2 py-1 text-sm font-medium text-aegean backdrop-blur-xl">
                  {chip.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** An inline pill sized in em, so it scales with the type. Desktop only (see the component note). */
function Chip({ chip, lit }: { chip: TaglineChip; lit: boolean }) {
  const state = lit ? "scale-100 opacity-100" : "scale-[0.85] opacity-30";
  const base = `relative hidden h-[0.85em] lg:inline-flex w-[2em] overflow-hidden rounded-full align-[-0.12em] transition-[opacity,transform] duration-700 ease-fluid ${state}`;

  if (chip.kind === "icon") {
    return (
      <span className={`${base} items-center justify-center bg-aegean/10 text-aegean-soft`}>
        <Umbrella className="h-[0.55em] w-[0.55em]" weight="regular" />
      </span>
    );
  }

  return (
    <span className={`${base} bg-shoal`}>
      {chip.src && (
        <Image
          src={chip.src}
          alt=""
          fill
          sizes="96px"
          className={`object-cover transition-transform duration-700 ease-fluid ${lit ? "scale-100" : "scale-[1.15]"}`}
          style={{ objectPosition: chip.position }}
        />
      )}
    </span>
  );
}
