/**
 * Background line drawings for the experiences: a crescent moon with stars (the party),
 * a lotus (yoga) and long swells. Thin strokes in the palette at low opacity, still,
 * behind the content and hidden from assistive tech. Placed in the outer margins only.
 */
const stroke = { fill: "none", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  return <path d={`M${x} ${y - r} V${y + r} M${x - r} ${y} H${x + r}`} />;
}

export function ExperienceDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Moon and stars, top right */}
      <svg viewBox="0 0 200 160" className="absolute -right-8 top-8 w-decor-sm text-teak/40 sm:w-decor lg:right-8">
        <g {...stroke} stroke="currentColor">
          <path d="M120 30 a44 44 0 1 0 40 62 a36 36 0 1 1 -40 -62 Z" />
          <Star x={60} y={40} r={8} />
          <Star x={40} y={100} r={5} />
          <Star x={180} y={30} r={6} />
        </g>
      </svg>

      {/* Lotus, in the open space right of the heading (desktop only, never behind buttons) */}
      <svg viewBox="0 0 220 140" className="absolute right-1/3 top-24 hidden w-decor text-shoal/40 lg:block">
        <g {...stroke} stroke="currentColor">
          <path d="M110 30 C126 56 126 86 110 112 C94 86 94 56 110 30 Z" />
          <path d="M110 112 C86 108 66 88 60 60 C82 64 100 82 110 112 Z" />
          <path d="M110 112 C134 108 154 88 160 60 C138 64 120 82 110 112 Z" />
          <path d="M110 112 C78 116 44 106 24 86 C56 82 88 92 110 112 Z" />
          <path d="M110 112 C142 116 176 106 196 86 C164 82 132 92 110 112 Z" />
        </g>
      </svg>

      {/* Long swells along the bottom */}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-12 w-full text-shoal/25">
        <path d="M0 30 q50 -18 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0" {...stroke} stroke="currentColor" />
      </svg>
    </div>
  );
}
