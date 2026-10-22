import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export type LinkRow = {
  href: string;
  label: string;
  detail: string;
  /** Small line above the label, e.g. a duration */
  meta?: string;
  image: string | null;
  alt: string;
};

/**
 * Editorial link rows (home "Plan your trip", cruise and course lists). Rows, not a card grid.
 * Hover shifts the background and nudges the arrow; press scales slightly. No entrance motion.
 */
export function LinkRows({ rows, size = "lg" }: { rows: LinkRow[]; size?: "lg" | "md" }) {
  const label = size === "lg" ? "text-3xl lg:text-5xl" : "text-2xl lg:text-4xl";
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((row) => (
        <li key={row.href}>
          <Link
            href={row.href}
            className="group flex items-center gap-4 rounded-3xl p-4 sm:gap-6 transition-[background-color,transform] duration-200 ease-press hover:bg-white active:scale-[0.99] sm:p-6"
          >
            {/* 24px row radius − 16px gap = 8px thumbnail radius. Smaller on phones, never hidden. */}
            <span className="relative block aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-shoal/20 sm:w-thumb">
              {row.image && <Image src={row.image} alt={row.alt} fill sizes="(min-width: 640px) 192px, 96px" className="object-cover" />}
            </span>
            <span className="min-w-0 flex-1">
              {row.meta && <span className="mb-1 block text-sm font-semibold text-shoal-deep">{row.meta}</span>}
              <span className={`block font-semibold tracking-tight text-aegean ${label}`}>{row.label}</span>
              <span className="mt-2 block text-base text-aegean-soft lg:text-lg">{row.detail}</span>
            </span>
            <span
              aria-hidden
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-aegean text-white transition-transform duration-200 ease-press group-hover:translate-x-1"
            >
              <ArrowRight size={20} weight="bold" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
