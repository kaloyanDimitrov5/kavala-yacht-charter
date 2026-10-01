/**
 * Footer mark: a sailing yacht on line drawn swells, in the palette.
 * A simple geometric mark (hull, cabin, mast, mainsail, jib), not a drawing of the real boat.
 * Decorative and still. `slice` keeps the yacht centred and crops the sea at the sides on phones.
 */
const W = 1200;

/** One swell line across the width: a gentle sine built from quadratic segments */
function swell(y: number, amp: number, len: number, shift: number) {
  let d = `M${-len + shift} ${y}`;
  for (let x = -len + shift; x < W + len; x += len) {
    d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
  }
  return d;
}

export function FooterYacht({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} 260`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      {/* Mainsail, aft of the mast, with a slightly curved leech */}
      <path d="M634 46 Q604 118 546 176 L634 176 Z" className="fill-limestone" />
      {/* Jib, masthead to bow */}
      <path d="M646 54 Q694 118 762 184 L646 180 Z" className="fill-white" />
      {/* Mast and boom */}
      <line x1={640} y1={40} x2={640} y2={186} className="stroke-mist" strokeWidth={4} strokeLinecap="round" />
      <line x1={548} y1={180} x2={640} y2={180} className="stroke-mist" strokeWidth={4} strokeLinecap="round" />
      {/* Cabin */}
      <path d="M590 192 L602 180 L690 180 L704 192 Z" className="fill-mist" />
      {/* Hull: deck line rising to the bow, rounded bottom */}
      <path d="M494 192 L796 186 Q772 220 712 228 L556 228 Q512 222 494 192 Z" className="fill-white" />
      {/* Waterline stripe */}
      <path d="M514 214 L776 210" className="stroke-shoal" strokeWidth={4} strokeLinecap="round" />

      {/* Swells, fading towards the horizon */}
      <path d={swell(232, 6, 120, 0)} fill="none" className="stroke-shoal-light" strokeWidth={3} strokeLinecap="round" />
      <path d={swell(246, 5, 150, 40)} fill="none" className="stroke-shoal-light/50" strokeWidth={2} strokeLinecap="round" />
      <path d={swell(256, 4, 180, 90)} fill="none" className="stroke-shoal-light/25" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
