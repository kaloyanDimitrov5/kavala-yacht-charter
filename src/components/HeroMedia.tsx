"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Props = {
  image: string | null;
  video: { mp4: string | null; webm: string | null };
  alt: string;
  caption: string;
  placeholderNote: string;
  labels: { pause: string; play: string };
};

/**
 * Photo, muted loop or flat placeholder.
 * - No files yet: flat shoal block at the configured aspect ratio, alt text via role="img".
 * - Photo: optimised priority image, painted at once (it is the page's largest content).
 * - Video: only when motion is allowed; fades in over the photo once playing.
 *   Reduced motion shows the photo as a still.
 *   Visitors can pause the loop (WCAG 2.2.2).
 */
export function HeroMedia({ image, video, alt, caption, placeholderNote, labels }: Props) {
  const reduce = useReducedMotionSafe();
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  // The loop starts downloading only after the page has loaded, so it never competes with the
  // still (the page's largest content) for bandwidth
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Safari has no requestIdleCallback; a short timeout after load does the same job there
    const go = () =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : setTimeout(() => setReady(true), 200);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = !!(video.mp4 || video.webm) && !reduce;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Played from here rather than autoPlay, so reduced motion visitors never see it start
    if (!ready) return;
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.pause();
    else el.play().catch(() => setPaused(true));
  }, [paused, hasVideo, ready]);

  const empty = !image && !hasVideo;

  return (
    <>
      {empty && (
        <div role="img" aria-label={alt} className="absolute inset-0 bg-shoal">
          {process.env.NODE_ENV === "development" && (
            <span className="absolute left-4 top-4 rounded-lg bg-white px-2 py-1 text-xs font-medium text-aegean">
              {placeholderNote}
            </span>
          )}
        </div>
      )}

      {!empty && <div aria-hidden className="absolute inset-0 bg-shoal" />}

      {/*
        The still is always an optimised, high priority image (AVIF/WebP, sized per screen):
        it is the largest thing on screen, so it must paint first. No fade, so it counts at once.
      */}
      {image && (
        <Image
          src={image}
          alt={hasVideo ? "" : alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {hasVideo && (
        <>
          {/* The loop fades in over the still once it is actually playing */}
          <video
            ref={videoRef}
            aria-label={alt}
            onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-fluid ${playing ? "opacity-100" : "opacity-0"}`}
            muted
            loop
            playsInline
            preload="none"
          >
            {ready && video.webm && <source src={video.webm} type="video/webm" />}
            {ready && video.mp4 && <source src={video.mp4} type="video/mp4" />}
          </video>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? labels.play : labels.pause}
            aria-pressed={paused}
            className="absolute bottom-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-aegean backdrop-blur-xl transition-[background-color,transform] duration-160 ease-press hover:bg-white active:scale-[0.98]"
          >
            {paused ? <Play size={20} weight="fill" aria-hidden /> : <Pause size={20} weight="fill" aria-hidden />}
          </button>
        </>
      )}

      {caption && (
        <p className="absolute bottom-4 left-4 rounded-lg bg-white/80 px-2 py-1 text-sm font-medium text-aegean backdrop-blur-xl">
          {caption}
        </p>
      )}
    </>
  );
}
