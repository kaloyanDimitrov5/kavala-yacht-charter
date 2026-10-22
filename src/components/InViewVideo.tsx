"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Pause, Play } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Props = {
  image: string | null;
  video: string | null;
  alt: string;
  sizes: string;
  /** Filename, shown on the flat placeholder in development only */
  file: string;
  /** Placeholder background class */
  placeholder?: string;
  labels: { play: string; pause: string };
  /** Extra classes for media layers, e.g. an object-position */
  mediaClassName?: string;
  /** Load the still with high priority (only for the largest image on first screen) */
  priority?: boolean;
};

/**
 * Fills its positioned parent with a muted loop that plays only while in view,
 * the still image, or a flat placeholder. Reduced motion shows the still.
 * The still is an optimised image underneath; the loop downloads only once in view and
 * fades in over it when playing (no raw poster file).
 * Visitors can pause the loop (WCAG 2.2.2).
 */
export function InViewVideo({ image, video, alt, sizes, file, placeholder = "bg-shoal", labels, mediaClassName = "", priority }: Props) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const inView = useInView(ref, { amount: 0.25 });
  const showVideo = !!video && !reduce;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView && !paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.play().catch(() => setPaused(true));
    } else el.pause();
  }, [inView, paused, showVideo]);

  if (!image && !showVideo) {
    return (
      <div role="img" aria-label={alt} className={`absolute inset-0 ${placeholder}`}>
        {process.env.NODE_ENV === "development" && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white px-2 py-1 text-xs font-medium text-aegean">
            {file}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {image && (
        <Image src={image} alt={showVideo ? "" : alt} fill sizes={sizes} priority={priority} className={`object-cover ${mediaClassName}`} />
      )}
      {showVideo && (
        <>
          <video
            ref={ref}
            src={video}
            aria-label={alt}
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-fluid ${playing ? "opacity-100" : "opacity-0"} ${mediaClassName}`}
          />
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? labels.play : labels.pause}
            aria-pressed={paused}
            className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-aegean backdrop-blur-xl transition-[background-color,transform] duration-160 ease-press hover:bg-white active:scale-[0.98]"
          >
            {paused ? <Play size={20} weight="fill" aria-hidden /> : <Pause size={20} weight="fill" aria-hidden />}
          </button>
        </>
      )}
    </>
  );
}
