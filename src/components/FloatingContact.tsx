"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { ArrowUp, CalendarCheck, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { phones, viberHref } from "@/lib/whatsapp";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { ViberLogo } from "./ViberLogo";

type Props = {
  locale: string;
  /** wa.me link in the page language, or null when no number is configured */
  whatsapp: string | null;
  labels: {
    label: string;
    close: string;
    menu: string;
    whatsapp: string;
    fallback: string;
    viber: string;
    viberLabel: string;
    call: string;
  };
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/*
 * Contact launcher fixed in the bottom right corner of every page.
 * - A round aegean button with an arrow. Pressing it opens three ways to reach us, stacked above
 *   it: WhatsApp (green), Viber (purple) and a call to each phone (white). The arrow turns to point down,
 *   which is how you close it again. Escape or a click elsewhere also closes it.
 * - The options rise out of the button one after another (spring, 50ms apart, nearest first) and
 *   drop back into it in reverse when closed (faster, ease out).
 * - Home: hidden while the hero buttons are on screen; when they scroll away, the launcher flies
 *   from where they left the screen into the corner (spring, FLIP). Other pages: it rises in
 *   shortly after load. It shows "Contact us" for a moment after arriving, then folds to a circle.
 *   Two ripples spread from it on arrival.
 * - It steps aside (and closes) while the footer, which has the same buttons, is on screen.
 * - No number configured: the launcher links to the booking form instead.
 * Reduced motion: fades only, no ripples.
 */
export function FloatingContact({ locale, whatsapp, labels }: Props) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const reduce = useReducedMotionSafe();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ripple, setRipple] = useState(0);
  const from = useRef<DOMRect | null>(null);
  const shownOnce = useRef(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const viber = viberHref();
  const calls = phones();

  // When should it show?
  useEffect(() => {
    setVisible(false);
    setMenuOpen(false);
    shownOnce.current = false;
    const footer = document.querySelector("footer");
    // The hero WhatsApp button itself, not its row
    const source = isHome
      ? document.querySelector<HTMLElement>("[data-sticky-source] a[target]") ??
        document.querySelector<HTMLElement>("[data-sticky-source]")
      : null;
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
      const io = new IntersectionObserver(
        ([e]) => {
          footerOn = e.isIntersecting;
          update();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
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
      setMenuOpen(false);
      animate(el, { opacity: 0, transform: reduce ? "none" : "translateY(16px) scale(0.96)" }, { duration: 0.2, ease: EASE_OUT });
      return;
    }
    setHint(true);
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
    const fold = window.setTimeout(() => setHint(false), 2800);
    return () => {
      window.clearTimeout(splash);
      window.clearTimeout(fold);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Close on Escape (focus back to the launcher) and on a press anywhere else
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        launcher.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!scope.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen, scope]);

  const shell = `fixed bottom-6 right-4 z-30 sm:right-6 ${visible ? "" : "pointer-events-none"}`;
  const ring = "ring-4 ring-white/70";

  // No number: a single link to the booking form, as before
  if (!whatsapp) {
    return (
      <div ref={scope} style={{ opacity: 0 }} aria-hidden={!visible} className={shell}>
        <a
          href={`/${locale}/book#request`}
          tabIndex={visible ? 0 : -1}
          aria-label={labels.fallback}
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-aegean text-white transition-[background-color,transform] duration-200 ease-press hover:bg-shoal-deep active:scale-[0.97] ${ring}`}
        >
          <CalendarCheck size={24} weight="fill" aria-hidden />
        </a>
      </div>
    );
  }

  const options = [
    {
      key: "whatsapp",
      href: whatsapp,
      newTab: true,
      label: labels.whatsapp,
      aria: labels.whatsapp,
      icon: <WhatsappLogo size={24} weight="fill" aria-hidden />,
      tone: "bg-whatsapp text-aegean hover:bg-whatsapp-deep",
    },
    ...(viber
      ? [
          {
            key: "viber",
            href: viber,
            newTab: false,
            label: labels.viber,
            aria: labels.viberLabel,
            icon: <ViberLogo size={24} />,
            tone: "bg-viber text-white hover:bg-viber-deep",
          },
        ]
      : []),
    ...calls.map((c) => ({
      key: c.href,
      href: c.href,
      newTab: false,
      label: c.display,
      aria: `${labels.call} ${c.display}`,
      icon: <Phone size={24} weight="fill" aria-hidden />,
      tone: "bg-white text-aegean hover:bg-limestone",
    })),
  ];
  const n = options.length;

  return (
    <div ref={scope} style={{ opacity: 0 }} aria-hidden={!visible} className={shell}>
      {/* Launcher first in the DOM, so Tab moves from it into the options */}
      <button
        ref={launcher}
        type="button"
        tabIndex={visible ? 0 : -1}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? labels.close : labels.label}
        onClick={() => {
          setMenuOpen((o) => !o);
          setHint(false);
        }}
        className={`relative flex items-center rounded-full bg-aegean text-white transition-[background-color,transform] duration-200 ease-press hover:bg-shoal-deep active:scale-[0.97] ${ring}`}
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
        {/* "Contact us" shows for a moment after arriving, then folds away (grid column trick) */}
        <span
          aria-hidden
          className={`grid transition-[grid-template-columns] duration-300 ease-fluid ${hint && !menuOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]"}`}
        >
          <span className="overflow-hidden whitespace-nowrap">
            <span className="block pl-4 text-base font-semibold">{labels.label}</span>
          </span>
        </span>
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center">
          <ArrowUp
            size={24}
            weight="bold"
            aria-hidden
            className={`transition-transform duration-500 ease-fluid ${menuOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            id={menuId}
            aria-label={labels.menu}
            className="absolute bottom-full right-0 flex flex-col items-end gap-3 pb-4"
            initial="closed"
            animate="open"
            exit="closed"
          >
            {options.map((o, i) => {
              // Nearest the launcher (the last one) moves first on the way out, last on the way back
              const fromLauncher = n - 1 - i;
              return (
                <motion.li
                  key={o.key}
                  style={{ transformOrigin: "bottom right" }}
                  variants={{
                    closed: {
                      opacity: 0,
                      transform: reduce ? "none" : `translateY(${16 + fromLauncher * 8}px) scale(0.85)`,
                      transition: reduce ? { duration: 0.15 } : { duration: 0.18, delay: i * 0.03, ease: EASE_OUT },
                    },
                    open: {
                      opacity: 1,
                      transform: "translateY(0px) scale(1)",
                      transition: reduce
                        ? { duration: 0.2 }
                        : { type: "spring", duration: 0.5, bounce: 0.28, delay: fromLauncher * 0.05 },
                    },
                  }}
                >
                  <a
                    href={o.href}
                    {...(o.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={o.aria}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full pl-3 pr-4 text-base font-semibold tabular-nums transition-[background-color,transform] duration-160 ease-press active:scale-[0.97] ${o.tone} ${ring}`}
                  >
                    {o.icon}
                    {o.label}
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
