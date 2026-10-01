"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";

type Props = {
  poster: string;
  src: string;
  alt: string;
  labels: { play: string; pause: string };
  sizes: string;
};

/**
 * Still until the visitor asks for motion: the poster shows first, the clip loads
 * and plays only after a tap (the gallery otherwise stays still, per DESIGN.md).
 */
export function GalleryVideo({ poster, src, alt, labels, sizes }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    setStarted(true);
    if (el.paused) el.play().catch(() => setPlaying(false));
    else el.pause();
  };

  return (
    <>
      <Image src={poster} alt={alt} fill sizes={sizes} className="object-cover" />
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 h-full w-full object-cover ${started ? "" : "invisible"}`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? labels.pause : labels.play}: ${alt}`}
        aria-pressed={playing}
        className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-aegean backdrop-blur-xl transition-[background-color,transform] duration-160 ease-press hover:bg-white active:scale-[0.98] lg:bottom-4 lg:right-4"
      >
        {playing ? <Pause size={20} weight="fill" aria-hidden /> : <Play size={20} weight="fill" aria-hidden />}
      </button>
    </>
  );
}
