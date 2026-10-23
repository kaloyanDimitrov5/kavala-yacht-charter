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
 * Editorial link rows (home "Plan your trip", cruise and course lists). Rows, not a card grid:
 * hairline rules between them, no boxes. Hover zooms the photo a touch and fills the arrow;
 * press scales slightly. No entrance motion.
 */
export function LinkRows({ rows, size = "lg" }: { rows: LinkRow[]; size?: "lg" | "md" }) {
  const label = size === "lg" ? "text-3xl lg:text-5xl" : "text-2xl lg:text-4xl";
  return (
    <ul className="flex flex-col divide-y divide-aegean/10 border-y border-aegean/10">
      {rows.map((row) => (
        <li key={row.href}>
          <Link
            href={row.href}
            className="group flex items-center gap-4 py-6 transition-transform duration-200 ease-press active:scale-[0.99] sm:gap-8 sm:py-8"
          >
            {/* Smaller on phones, never hidden */}
            <span className="relative block aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl bg-shoal/20 sm:w-thumb">
              {row.image && (
                <Image
                  src={row.image}
                  alt={row.alt}
                  fill
                  sizes="(min-width: 640px) 192px, 96px"
                  className="object-cover transition-transform duration-1000 ease-fluid group-hover:scale-105"
                />
              )}
            </span>
            <span className="min-w-0 flex-1">
              {row.meta && <span className="mb-2 block text-sm text-aegean-soft">{row.meta}</span>}
              <span className={`block font-medium tracking-tight text-aegean ${label}`}>{row.label}</span>
              <span className="mt-2 block text-base text-aegean-soft lg:text-lg">{row.detail}</span>
            </span>
            <span
              aria-hidden
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-aegean ring-1 ring-inset ring-aegean/20 transition-[background-color,color,transform] duration-200 ease-press group-hover:translate-x-1 group-hover:bg-aegean group-hover:text-white"
            >
              <ArrowRight size={20} weight="bold" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
