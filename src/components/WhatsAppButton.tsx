"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Phone, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import { phones, viberHref } from "@/lib/whatsapp";
import { ViberLogo } from "./ViberLogo";

export type WhatsAppLabels = {
  cta: string;
  opening: string;
  opensInNewTab: string;
  unavailable: string;
  /** "Call": the phone link beside the button, for visitors without WhatsApp */
  call: string;
  /** Visible "Viber" and its accessible name */
  viber: string;
  viberLabel: string;
};

type Props = {
  /** wa.me link, or null when NEXT_PUBLIC_WHATSAPP_NUMBER is missing */
  href: string | null;
  labels: WhatsAppLabels;
  className?: string;
  /** Which surface the button sits on. Every tone uses the WhatsApp green with an aegean label (7.3:1);
   *  the tone sets the call link and the disabled state: "default" and "outline" on light grounds,
   *  "light" on aegean (hero, footer, prices), "night" on the night section. */
  tone?: "default" | "night" | "light" | "outline";
};

const base =
  "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold " +
  // Invisible 2px hit area extension so the 40px button meets the 44px touch target
  "before:absolute before:-inset-0.5 before:content-['']";

const green = "bg-whatsapp text-aegean hover:bg-whatsapp-deep data-[state=opening]:bg-whatsapp-deep";
const callOnLight = "bg-white text-aegean ring-1 ring-inset ring-aegean/15 hover:bg-limestone";
const callOnDark = "text-white ring-1 ring-inset ring-white/30 hover:bg-white/10";

const tones = {
  default: { idle: green, call: callOnLight, disabled: "bg-aegean/40 text-white", note: "text-aegean-soft" },
  night: { idle: green, call: callOnDark, disabled: "bg-white/10 text-driftwood", note: "text-driftwood" },
  outline: {
    idle: green,
    call: callOnLight,
    disabled: "bg-white text-aegean-soft ring-1 ring-inset ring-aegean/10",
    note: "text-aegean-soft",
  },
  light: { idle: green, call: callOnDark, disabled: "bg-white/10 text-mist", note: "text-mist" },
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

  const calls = phones();
  const viber = viberHref();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
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
      {/* Same number on Viber, in Viber's purple */}
      {viber && (
        <a
          href={viber}
          aria-label={labels.viberLabel}
          className={`${base} bg-viber text-white transition-[background-color,transform] duration-160 ease-press hover:bg-viber-deep active:scale-[0.98]`}
        >
          <ViberLogo size={24} />
          {labels.viber}
        </a>
      )}
      {/* Direct calls, for visitors without WhatsApp: the main number, then the second phone */}
      {calls.map((c) => (
        <a
          key={c.href}
          href={c.href}
          aria-label={`${labels.call} ${c.display}`}
          className={`${base} ${t.call} tabular-nums transition-[background-color,transform] duration-160 ease-press active:scale-[0.98]`}
        >
          <Phone size={24} aria-hidden />
          {c.display}
        </a>
      ))}
      <span id={noteId} className="sr-only">
        {labels.opensInNewTab}
      </span>
      <span className="sr-only" aria-live="polite">
        {opening ? labels.opening : ""}
      </span>
    </div>
  );
}
