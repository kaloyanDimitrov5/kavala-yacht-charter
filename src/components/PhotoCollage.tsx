"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { InViewVideo } from "./InViewVideo";

export type CollagePhoto = { src: string | null; alt: string; video?: string | null; file?: string };

type Props = {
  main: CollagePhoto;
  inset: CollagePhoto;
  /** Which corner the inset print sits on */
  side?: "left" | "right";
  /** Portrait (4:5) or landscape (4:3) main photo */
  shape?: "portrait" | "landscape";
  labels?: { play: string; pause: string };
};

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/*
 * A main photo (or muted loop) with a smaller print overlapping one bottom corner.
 * Motion, once on first view: the main photo rises 24px, the inset follows 120ms later and
 * settles into a slight tilt. Reduced motion: fade only.
 */
export function PhotoCollage({ main, inset, side = "right", shape = "landscape", labels }: Props) {
  const reduce = useReducedMotionSafe();
  const tilt = side === "right" ? 3 : -3;
  const show = (delay: number, rotate = 0) => ({
    hidden: { opacity: 0, transform: reduce ? `rotate(${rotate}deg)` : "translateY(24px) rotate(0deg)" },
    shown: {
      opacity: 1,
      transform: `translateY(0px) rotate(${rotate}deg)`,
      transition: { duration: reduce ? 0.2 : 0.8, delay: reduce ? 0 : delay, ease: EASE_FLUID },
    },
  });

  return (
    <motion.div
      className={`relative pb-12 ${side === "right" ? "pr-12 sm:pr-16" : "pl-12 sm:pl-16"}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        variants={show(0)}
        className={`relative overflow-hidden rounded-3xl bg-shoal/20 ${shape === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]"}`}
      >
        {main.video !== undefined ? (
          <InViewVideo
            image={main.src}
            video={main.video}
            alt={main.alt}
            file={main.file ?? ""}
            sizes="(min-width: 1024px) 40vw, 100vw"
            labels={labels ?? { play: "Play", pause: "Pause" }}
          />
        ) : (
          main.src && <Image src={main.src} alt={main.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        )}
      </motion.div>

      {/* Inset print: 16px frame, 8px border, 8px photo radius */}
      <motion.div
        variants={show(0.12, tilt)}
        className={`absolute bottom-0 w-1/2 rounded-2xl bg-white p-2 ${side === "right" ? "right-0" : "left-0"}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-shoal/20">
          {inset.src && <Image src={inset.src} alt={inset.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />}
        </div>
      </motion.div>
    </motion.div>
  );
}
