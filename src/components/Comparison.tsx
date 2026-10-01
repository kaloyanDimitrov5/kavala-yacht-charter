"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Compass, Repeat } from "@phosphor-icons/react";

/** position: CSS object-position focus point for the crop */
type Moment = { id: string; chip: string; alt: string; src: string | null; file: string; position?: string };

type Props = {
  labels: { beach: string; yacht: string; beachChip: string; progress: string };
  beach: { src: string | null; alt: string; file: string };
  moments: Moment[];
  beachPoints: string[];
  yachtPoints: string[];
};

/** Flat placeholder tints so the yacht panel visibly changes when a photo is missing. */
const tints = ["bg-shoal", "bg-aegean/70", "bg-shoal/75", "bg-aegean/85", "bg-shoal/60", "bg-aegean/60"];

// Chips sit at the top, over sky, so they never cover the subject (the swimmer sits low in frame).
// Nested radius: 16px panel − 12px gap = 4px (rounded); 24px panel − 16px gap = 8px (rounded-lg)
const chip =
  "absolute left-3 right-3 top-3 w-fit rounded bg-white/80 px-2 py-1 text-xs font-medium text-aegean backdrop-blur-xl sm:text-sm lg:left-4 lg:top-4 lg:rounded-lg";

/**
 * The memorable moment. A tall scroll track pins the stage; scroll progress picks the moment.
 * The beach panel never changes. The yacht panel crossfades through a day on board.
 * useScroll is rAF batched. Reduced motion keeps the step change but drops blur and scale.
 */
export function Comparison({ labels, beach, moments, beachPoints, yachtPoints }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(moments.length - 1, Math.max(0, Math.floor(p * moments.length)));
    setIndex((prev) => (prev === next ? prev : next));
  });

  const current = moments[index];

  return (
    // Track height: one viewport for the stage plus roughly half a viewport per moment
    <div ref={trackRef} className="relative" style={{ height: `${100 + moments.length * 45}vh` }}>
      <div className="sticky top-0 flex h-screen items-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            {/* Beach: frozen on purpose */}
            <figure>
              <figcaption className="text-sm font-semibold text-aegean-soft sm:text-base">{labels.beach}</figcaption>
              <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-[5/4] lg:rounded-3xl">
                {beach.src ? (
                  <Image src={beach.src} alt={beach.alt} fill sizes="(min-width: 1024px) 40vw, 50vw" className="object-cover" />
                ) : (
                  <div role="img" aria-label={beach.alt} className="absolute inset-0 bg-teak">
                    {process.env.NODE_ENV === "development" && (
                      <span className="absolute bottom-3 left-3 rounded-lg bg-white px-2 py-1 text-xs font-medium text-aegean">
                        {beach.file}
                      </span>
                    )}
                  </div>
                )}
                <p className={chip}>{labels.beachChip}</p>
              </div>
            </figure>

            {/* Yacht: a new view per step */}
            <figure>
              <figcaption className="text-sm font-semibold text-aegean sm:text-base">{labels.yacht}</figcaption>
              <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-[5/4] lg:rounded-3xl">
                {moments.map((moment, i) => {
                  const active = i === index;
                  return (
                    <div
                      key={moment.id}
                      aria-hidden={!active}
                      className={`absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-fluid motion-reduce:transition-opacity ${
                        active
                          ? "scale-100 opacity-100 blur-0"
                          : "scale-105 opacity-0 blur-sm motion-reduce:scale-100 motion-reduce:blur-0"
                      }`}
                    >
                      {moment.src ? (
                        <Image
                          src={moment.src}
                          alt={active ? moment.alt : ""}
                          fill
                          sizes="(min-width: 1024px) 40vw, 50vw"
                          className="object-cover"
                          style={{ objectPosition: moment.position }}
                        />
                      ) : (
                        <div role={active ? "img" : undefined} aria-label={active ? moment.alt : undefined} className={`absolute inset-0 ${tints[i % tints.length]}`}>
                          {process.env.NODE_ENV === "development" && (
                            <span className="absolute bottom-3 left-3 rounded-lg bg-white px-2 py-1 text-xs font-medium text-aegean">
                              {moment.file}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <p className={chip}>
                  {current.chip}
                </p>
              </div>
            </figure>

            <ul className="flex flex-col gap-3 text-sm text-aegean-soft sm:text-base">
              {beachPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Repeat size={20} aria-hidden className="mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-3 text-sm font-medium text-aegean sm:text-base">
              {yachtPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Compass size={20} aria-hidden className="mt-0.5 shrink-0 text-shoal-deep" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-4 lg:mt-12" aria-hidden>
            <p className="shrink-0 text-sm font-medium text-aegean-soft">{labels.progress}</p>
            <ol className="flex flex-1 gap-1">
              {moments.map((moment, i) => (
                <li
                  key={moment.id}
                  className={`h-1 flex-1 rounded-full transition-colors duration-700 ease-fluid ${
                    i <= index ? "bg-shoal-deep" : "bg-aegean/10"
                  }`}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
