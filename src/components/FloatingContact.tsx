"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAnimate } from "framer-motion";
import { CalendarCheck, WhatsappLogo } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

type Props = {
  locale: string;
  /** wa.me link, or null when no number is configured (then the button opens the booking form) */
  whatsapp: string | null;
  labels: { label: string; fallback: string };
};

/*
 * Contact button fixed in the bottom right corner of every page.
 * - Home: hidden while the hero CTA ([data-sticky-source]) is on screen. When the hero CTA
 *   scrolls away, the button flies from where the CTA left the screen into the corner
 *   (spring, FLIP), as if the hero button followed you down the page.
 * - Other pages: rises into the corner shortly after load (spring, small tilt).
 * - On arrival and on hover, two ripples spread from it like a drop in calm water.
 * - It shows its label for a moment after arriving, then folds to a round icon; hover or
 *   keyboard focus unfolds it again.
 * - It steps aside while the footer (which has its own WhatsApp button) is on screen.
 * Reduced motion: fades in and out in place, no ripples.
 */
export function FloatingContact({ locale, whatsapp, labels }: Props) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const reduce = useReducedMotionSafe();
  const [scope, animate] = useAnimate<HTMLAnchorElement>();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [ripple, setRipple] = useState(0);
  const from = useRef<DOMRect | null>(null);
  const shownOnce = useRef(false);

  // When should it show?
  useEffect(() => {
    setVisible(false);
    shownOnce.current = false;
    const footer = document.querySelector("footer");
    const source = isHome ? document.querySelector<HTMLElement>("[data-sticky-source]") : null;
    let heroGone = !source;
    let footerOn = false;
    const update = () => setVisible(heroGone && !footerOn);

    const observers: IntersectionObserver[] = [];
    if (source) {
      const io = new IntersectionObserver(([e]) => {
        heroGone = !e.isIntersecting && e.boundingClientRect.bottom < 0;
        if (heroGone) from.current = e.boundingClientRect;
        update();
      });
      io.observe(source);
      observers.push(io);
    }
    if (footer) {
      const io = new IntersectionObserver(([e]) => {
        footerOn = e.isIntersecting;
        update();
      }, { rootMargin: "0px 0px -15% 0px" });
      io.observe(footer);
      observers.push(io);
    }
    const timer = window.setTimeout(update, source ? 0 : 700);
    return () => {
      window.clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, [isHome, pathname]);

  // Arrive / leave
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (!visible) {
      animate(el, { opacity: 0, transform: reduce ? "none" : "translateY(16px) scale(0.96)" }, { duration: 0.2, ease: [0.23, 1, 0.32, 1] });
      return;
    }
    setOpen(true);
    const end = el.getBoundingClientRect();
    const src = isHome && !shownOnce.current ? from.current : null;
    if (reduce) {
      animate(el, { opacity: [0, 1], transform: "none" }, { duration: 0.25 });
    } else if (src) {
      // Start where the hero button left the screen (clamped into view), then spring to the corner
      const dx = src.left - end.left;
      const dy = Math.max(16, src.top) - end.top;
      animate(
        el,
        { opacity: [1, 1], transform: [`translate(${dx}px, ${dy}px) scale(1)`, "translate(0px, 0px) scale(1)"] },
        { type: "spring", duration: 0.9, bounce: 0.22 },
      );
    } else {
      animate(
        el,
        { opacity: [0, 1], transform: ["translateY(32px) rotate(-8deg)", "translateY(0px) rotate(0deg)"] },
        { type: "spring", duration: 0.7, bounce: 0.3 },
      );
    }
    shownOnce.current = true;
    const splash = window.setTimeout(() => setRipple((r) => r + 1), reduce ? 0 : 450);
    const fold = window.setTimeout(() => setOpen(false), 2800);
    return () => {
      window.clearTimeout(splash);
      window.clearTimeout(fold);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const href = whatsapp ?? `/${locale}/book#request`;
  const label = whatsapp ? labels.label : labels.fallback;
  const Icon = whatsapp ? WhatsappLogo : CalendarCheck;

  return (
    <a
      ref={scope}
      href={href}
      {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onMouseEnter={() => {
        setOpen(true);
        setRipple((r) => r + 1);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      style={{ opacity: 0 }}
      className={`group fixed bottom-6 right-4 z-30 flex items-center rounded-full bg-aegean text-white ring-4 ring-white/70 transition-[background-color] duration-200 ease-press hover:bg-shoal-deep active:scale-[0.97] sm:right-6 ${
        visible ? "" : "pointer-events-none"
      }`}
    >
      {/* Ripples: re-keyed to restart */}
      <span key={ripple} aria-hidden className="pointer-events-none absolute inset-0">
        {ripple > 0 && (
          <>
            <span className="ripple-ring absolute inset-0 rounded-full border-2 border-shoal" />
            <span className="ripple-ring absolute inset-0 rounded-full border-2 border-shoal" />
          </>
        )}
      </span>

      <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center">
        <Icon size={24} weight="fill" aria-hidden />
      </span>
      {/* Label folds with a grid column trick so the pill width animates smoothly */}
      <span
        className={`relative grid transition-[grid-template-columns] duration-300 ease-fluid ${open ? "grid-cols-[1fr]" : "grid-cols-[0fr]"}`}
      >
        <span className="overflow-hidden whitespace-nowrap">
          <span className="block pr-4 text-base font-semibold">{label}</span>
        </span>
      </span>
    </a>
  );
}
