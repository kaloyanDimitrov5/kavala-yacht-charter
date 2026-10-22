/**
 * Background line drawings for the cruises showcase: sun, yacht, beach umbrella and swells.
 * Thin strokes in the palette at low opacity, behind the content and hidden from assistive tech.
 * The sun turns slowly and the yacht bobs (globals.css); both stop for reduced motion.
 */
const stroke = { fill: "none", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function SeaDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sun, top right */}
      <svg viewBox="0 0 200 200" className="absolute -right-10 -top-10 w-decor-sm text-teak/40 sm:w-decor-lg lg:right-8 lg:top-8">
        <g className="sun-turn" {...stroke} stroke="currentColor">
          <circle cx={100} cy={100} r={34} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={100 + Math.cos(a) * 48}
                y1={100 + Math.sin(a) * 48}
                x2={100 + Math.cos(a) * (i % 2 ? 62 : 70)}
                y2={100 + Math.sin(a) * (i % 2 ? 62 : 70)}
              />
            );
          })}
        </g>
      </svg>

      {/* Yacht on swells, in the open space right of the heading (desktop) */}
      <svg viewBox="0 0 240 160" className="absolute right-1/4 top-24 hidden w-decor text-shoal/40 lg:block">
        <g className="yacht-bob" {...stroke} stroke="currentColor">
          <path d="M120 20 V112" />
          <path d="M116 26 Q94 64 70 104 H116 Z" />
          <path d="M124 30 Q150 70 176 108 H124 Z" />
          <path d="M56 116 H190 Q178 136 150 140 H86 Q64 136 56 116 Z" />
        </g>
        <path d="M20 150 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" {...stroke} stroke="currentColor" />
      </svg>

      {/* Beach umbrella in the bottom padding, clear of the content */}
      <svg viewBox="0 0 220 180" className="absolute -bottom-10 right-1/4 w-decor-sm text-teak/30">
        <g {...stroke} stroke="currentColor">
          <path d="M40 80 Q110 10 180 80 Z" />
          <path d="M75 80 Q110 40 145 80" />
          <path d="M110 30 V160" />
          <path d="M10 160 Q110 140 210 160" />
        </g>
      </svg>

      {/* Long swell lines along the bottom */}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-12 w-full text-shoal/25">
        <path d="M0 30 q50 -18 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0" {...stroke} stroke="currentColor" />
        <path d="M0 48 q60 -14 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" {...stroke} stroke="currentColor" />
      </svg>
    </div>
  );
}
