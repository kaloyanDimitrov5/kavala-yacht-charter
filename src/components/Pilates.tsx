"use client";

import { motion } from "framer-motion";
import { Users } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { InViewVideo } from "./InViewVideo";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";

type Props = {
  title: string;
  body: string;
  stepsLabel: string;
  steps: string[];
  points: string[];
  media: { image: string | null; video: string | null; alt: string; file: string };
  labels: { play: string; pause: string };
  whatsapp: { href: string | null; labels: WhatsAppLabels };
};

/*
 * "Morning on deck". Motion explains the morning, once, slowly:
 * the line draws across the three steps (on screen movement → strong ease in out, 1.6s)
 * and each dot fills when the line reaches it. With a symmetric curve the line is halfway
 * at exactly half the duration, so the dot delays are 0, 0.8 and 1.6s.
 * Reduced motion: everything drawn and filled from the start.
 */
const DRAW = 1.6;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export function Pilates({ title, body, stepsLabel, steps, points, media, labels, whatsapp }: Props) {
  const reduce = useReducedMotionSafe();
  const lineTransition = reduce ? { duration: 0 } : { duration: DRAW, ease: EASE_IN_OUT };
  const dotDelay = (i: number) => (reduce ? 0 : (DRAW / (steps.length - 1)) * i);

  const line = (axis: "x" | "y", className: string) => (
    <div aria-hidden className={className}>
      <div className="absolute inset-0 bg-aegean/10" />
      <motion.div
        className={`absolute inset-0 bg-shoal-deep ${axis === "x" ? "origin-left" : "origin-top"}`}
        variants={{
          hidden: { transform: axis === "x" ? "scaleX(0)" : "scaleY(0)" },
          drawn: { transform: axis === "x" ? "scaleX(1)" : "scaleY(1)", transition: lineTransition },
        }}
      />
    </div>
  );

  return (
    <section id="pilates" aria-labelledby="pilates-title" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        {/* Porthole frame: round, calm, nautical */}
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full ring-8 ring-inset ring-limestone lg:col-span-5 lg:max-w-none">
          <InViewVideo
            image={media.image}
            video={media.video}
            alt={media.alt}
            file={media.file}
            sizes="(min-width: 1024px) 40vw, 384px"
            placeholder="bg-shoal/20"
            labels={labels}
          />
        </div>

        <div className="lg:col-span-7">
          <h2 id="pilates-title" className="max-w-measure text-4xl font-normal tracking-tight text-aegean lg:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-measure text-lg text-aegean-soft">{body}</p>

          {/* The morning: a real sequence, so numbering by position is honest */}
          {/* One trigger for the line and the dots, so the fills stay in step with the draw */}
          <motion.div className="relative mt-12" initial="hidden" whileInView="drawn" viewport={{ once: true, amount: 0.6 }}>
            {/* Lines run dot centre to dot centre. Horizontal: last centre sits at 2/3 of the width plus
                two 24px gaps minus the 8px start offset → 2/3 + 16px. Vertical: dots sit 4px down to centre
                on the 28px text line, so centres are 12px from the top and 16px from the bottom. */}
            {line("x", "absolute left-2 top-2 hidden h-0.5 w-[calc(66.667%+16px)] -translate-y-1/2 sm:block")}
            {line("y", "absolute bottom-4 left-2 top-3 w-0.5 -translate-x-1/2 sm:hidden")}
            <ol aria-label={stepsLabel} className="relative grid gap-8 sm:grid-cols-3 sm:gap-6">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4 sm:flex-col sm:gap-4">
                  <motion.span
                    aria-hidden
                    className="relative mt-1 h-4 w-4 shrink-0 rounded-full bg-white ring-2 ring-inset ring-shoal-deep sm:mt-0"
                    variants={{
                      hidden: { backgroundColor: "rgb(255 255 255)" },
                      drawn: {
                        backgroundColor: "rgb(31 117 128)",
                        transition: { duration: reduce ? 0 : 0.3, delay: dotDelay(i), ease: "easeOut" },
                      },
                    }}
                  />
                  <span className="text-lg font-medium text-aegean sm:pr-4">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
            <WhatsAppButton href={whatsapp.href} labels={whatsapp.labels} />
            {points.map((point) => (
              <p key={point} className="flex items-center gap-2 text-base text-aegean-soft">
                <Users size={20} aria-hidden className="shrink-0" />
                {point}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
