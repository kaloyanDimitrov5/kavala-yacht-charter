"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Asterisk, Check } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { InViewVideo } from "./InViewVideo";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";

type Props = {
  title: string;
  body: string;
  points: string[];
  banner: string[];
  media: { image: string | null; video: string | null; alt: string; file: string };
  labels: { play: string; pause: string };
  whatsapp: { href: string | null; labels: WhatsAppLabels };
};

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/*
 * "After dark". Motion, per the animate skill:
 * - Banner: rows move only while the visitor scrolls (scroll linked, so no autoplay and no
 *   WCAG 2.2.2 pause control needed). Opposite directions read as a crowd passing.
 * - Frame: settles once from a slight tilt, a rare marketing moment, 900ms fluid curve.
 * Reduced motion: banner static, frame fades in.
 */
export function Bachelor({ title, body, points, banner, media, labels, whatsapp }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // Full transform strings keep the work on the compositor
  const rowA = useTransform(scrollYProgress, [0, 1], ["translateX(0%)", "translateX(-25%)"]);
  const rowB = useTransform(scrollYProgress, [0, 1], ["translateX(-25%)", "translateX(0%)"]);

  // Repeat the words so each row stays filled across its whole travel
  const words = [...banner, ...banner, ...banner, ...banner];
  const row = (offset: number, tone: string) => (
    <div className={`flex w-max items-center gap-6 whitespace-nowrap text-6xl font-semibold tracking-tight lg:gap-8 lg:text-8xl ${tone}`}>
      {[...words.slice(offset), ...words.slice(0, offset)].map((word, i) => (
        <Fragment key={i}>
          <span>{word}</span>
          <Asterisk size={40} weight="bold" className="shrink-0 text-teak" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="bachelor"
      aria-labelledby="bachelor-title"
      data-surface="night"
      className="overflow-hidden bg-night py-24 text-white"
    >
      {/* Decorative banner: the same words are in the copy below */}
      <div aria-hidden className="flex flex-col gap-2 lg:gap-4">
        <motion.div style={reduce ? undefined : { transform: rowA }}>{row(0, "text-white")}</motion.div>
        <motion.div style={reduce ? undefined : { transform: rowB }}>{row(2, "text-white/30")}</motion.div>
      </div>

      <div className="mt-16 px-4 sm:px-6 lg:mt-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 id="bachelor-title" className="max-w-measure text-5xl font-semibold tracking-tight text-white lg:text-7xl">
              {title}
            </h2>
            <p className="mt-6 max-w-measure text-lg text-driftwood lg:text-xl">{body}</p>
            <ul className="mt-8 flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-base font-medium text-white">
                  <Check size={20} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-teak" />
                  {point}
                </li>
              ))}
            </ul>
            <WhatsAppButton className="mt-10" tone="night" href={whatsapp.href} labels={whatsapp.labels} />
          </div>

          <motion.div
            initial={{ opacity: 0, transform: "translateY(32px) rotate(-3deg) scale(0.96)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg) scale(1)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={
              reduce
                ? { duration: 0.3, transform: { duration: 0 } }
                : { duration: 0.9, ease: EASE_FLUID }
            }
            className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:col-span-4 lg:col-start-9 lg:aspect-[3/4]"
          >
            <InViewVideo
              image={media.image}
              video={media.video}
              alt={media.alt}
              file={media.file}
              sizes="(min-width: 1024px) 33vw, 100vw"
              placeholder="bg-teak/30"
              labels={labels}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
