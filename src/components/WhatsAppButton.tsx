"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WarningCircle, WhatsappLogo } from "@phosphor-icons/react";

export type WhatsAppLabels = {
  cta: string;
  opening: string;
  opensInNewTab: string;
  unavailable: string;
};

type Props = {
  /** wa.me link, or null when NEXT_PUBLIC_WHATSAPP_NUMBER is missing */
  href: string | null;
  labels: WhatsAppLabels;
  className?: string;
  /** "night": bachelor section (teak fill, night label 5.60:1). "light": aegean footer (white fill, aegean label 14.86:1) */
  tone?: "default" | "night" | "light";
};

const base =
  "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold " +
  // Invisible 2px hit area extension so the 40px button meets the 44px touch target
  "before:absolute before:-inset-0.5 before:content-['']";

const tones = {
  default: {
    idle: "bg-aegean text-white hover:bg-aegean/90 data-[state=opening]:bg-aegean/80",
    disabled: "bg-aegean/40 text-white",
    note: "text-aegean-soft",
  },
  night: {
    idle: "bg-teak text-night hover:bg-teak/90 data-[state=opening]:bg-teak/80",
    disabled: "bg-white/10 text-driftwood",
    note: "text-driftwood",
  },
  light: {
    idle: "bg-white text-aegean hover:bg-limestone data-[state=opening]:bg-limestone",
    disabled: "bg-white/10 text-mist",
    note: "text-mist",
  },
};

/**
 * The one primary action. States:
 * default, hover (colour shift, hover capable pointers only), active (scale 0.98),
 * focus (global shoal-deep ring), opening (after click, until the tab regains focus),
 * unavailable (no number configured: disabled with an inline explanation).
 */
export function WhatsAppButton({ href, labels, className = "", tone = "default" }: Props) {
  const t = tones[tone];
  const [opening, setOpening] = useState(false);
  const timer = useRef<number>();
  const noteId = useId();

  useEffect(() => {
    if (!opening) return;
    const reset = () => setOpening(false);
    // Returning to this tab means WhatsApp opened (or the visitor came back).
    window.addEventListener("focus", reset);
    timer.current = window.setTimeout(reset, 4000);
    return () => {
      window.removeEventListener("focus", reset);
      window.clearTimeout(timer.current);
    };
  }, [opening]);

  if (!href) {
    return (
      <div className={className}>
        <button
          type="button"
          disabled
          aria-describedby={noteId}
          className={`${base} cursor-not-allowed ${t.disabled}`}
        >
          <WhatsappLogo size={24} aria-hidden />
          {labels.cta}
        </button>
        <p id={noteId} className={`mt-3 flex items-start gap-2 text-sm ${t.note}`}>
          <WarningCircle size={20} aria-hidden className="shrink-0" />
          {labels.unavailable}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={noteId}
        aria-busy={opening || undefined}
        onClick={() => setOpening(true)}
        data-state={opening ? "opening" : "idle"}
        className={`${base} ${t.idle} transition-[background-color,transform] duration-160 ease-press active:scale-[0.98]`}
      >
        <WhatsappLogo size={24} aria-hidden weight={opening ? "fill" : "regular"} />
        {/* Both labels share one grid cell so the button keeps its width when the label swaps */}
        <span className="grid">
          <span className={`[grid-area:1/1] ${opening ? "invisible" : ""}`}>{labels.cta}</span>
          <span className={`[grid-area:1/1] ${opening ? "" : "invisible"}`}>{labels.opening}</span>
        </span>
      </a>
      <span id={noteId} className="sr-only">
        {labels.opensInNewTab}
      </span>
      <span className="sr-only" aria-live="polite">
        {opening ? labels.opening : ""}
      </span>
    </div>
  );
}
