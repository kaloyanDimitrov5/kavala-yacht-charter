"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { sections, type SectionKey } from "@/config/sections";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";

type Props = {
  locale: Locale;
  brand: string;
  labels: {
    home: string;
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    mainNav: string;
    languageNav: string;
    links: Record<SectionKey, string>;
    languages: Record<Locale, string>;
  };
  whatsapp: { href: string | null; labels: WhatsAppLabels };
};

const focusableSelector =
  'a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Floating glass pill (B7). The menu button morphs its two lines into an X,
 * the overlay fades in with a heavy blur, links rise from a masked box with a stagger.
 * Open: focus moves into the overlay, Tab is trapped in pill + overlay, Esc closes,
 * page scroll is locked. Close: focus returns to the menu button.
 */
export function IslandNav({ locale, brand, labels, whatsapp }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  /** Same page in the other language: swap the first path segment */
  const localized = (l: Locale) => `/${l}${pathname.replace(/^\/[^/]+/, "")}`;
  const [activeId, setActiveId] = useState<string | null>(null);
  const pillRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Current section for the overlay: the one crossing the middle of the viewport
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
          else setActiveId((prev) => (prev === entry.target.id ? null : prev));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      overlayRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [pillRef.current, overlayRef.current].flatMap((el) =>
        el ? Array.from(el.querySelectorAll<HTMLElement>(focusableSelector)) : [],
      );
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const lineBase =
    "absolute left-1/2 top-1/2 h-0.5 w-5 rounded-full bg-aegean transition-transform duration-700 ease-fluid";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
        <nav
          ref={pillRef}
          aria-label={labels.mainNav}
          className="pointer-events-auto mx-auto mt-6 flex w-max items-center gap-1 rounded-full bg-white/75 p-2 ring-1 ring-inset ring-aegean/10 backdrop-blur-xl"
        >
          <Link
            href={`/${locale}`}
            onClick={() => open && close(false)}
            aria-label={`${brand}. ${labels.home}`}
            className="rounded-full px-3 py-2 text-sm font-semibold text-aegean transition-colors duration-160 ease-press hover:bg-aegean/5 active:bg-aegean/10"
          >
            {brand}
          </Link>

          <ul aria-label={labels.languageNav} className="flex items-center rounded-full bg-limestone p-0.5">
            {locales.map((l) => {
              const current = l === locale;
              return (
                <li key={l}>
                  <Link
                    href={localized(l)}
                    hrefLang={l}
                    lang={l}
                    aria-label={labels.languages[l]}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-full px-3 py-1 text-sm font-semibold transition-[background-color,color,transform] duration-160 ease-press active:scale-[0.98] ${
                      current ? "bg-aegean text-white" : "text-aegean-soft hover:bg-white hover:text-aegean"
                    }`}
                  >
                    {l.toUpperCase()}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => (open ? close() : setOpen(true))}
            className="relative h-10 w-10 shrink-0 rounded-full transition-[background-color,transform] duration-160 ease-press before:absolute before:-inset-0.5 before:content-[''] hover:bg-aegean/5 active:scale-[0.98]"
          >
            <span
              aria-hidden
              className={lineBase}
              style={{ transform: open ? "translate(-50%, -1px) rotate(45deg)" : "translate(-50%, -5px)" }}
            />
            <span
              aria-hidden
              className={lineBase}
              style={{ transform: open ? "translate(-50%, -1px) rotate(-45deg)" : "translate(-50%, 3px)" }}
            />
          </button>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={labels.menuTitle}
        aria-hidden={!open}
        data-open={open}
        className={`group fixed inset-0 z-40 overflow-y-auto bg-white/80 px-4 pb-12 pt-24 backdrop-blur-3xl duration-700 ease-fluid sm:px-6 lg:px-8 ${
          // Opening: visible at once so focus can move in. Closing: stay visible until the fade ends.
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      >
        <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-between gap-12 pt-12">
          <ul className="flex flex-col gap-2">
            {sections.map((s, i) => (
              <li key={s.id} className="overflow-hidden">
                <div
                  style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                  className="translate-y-12 opacity-0 transition-[transform,opacity] duration-700 ease-fluid group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:translate-y-0"
                >
                  <a
                    href={`/${locale}#${s.id}`}
                    onClick={() => close(false)}
                    aria-current={activeId === s.id ? "location" : undefined}
                    className="inline-flex items-center gap-4 rounded-lg py-1 text-4xl font-medium tracking-tight text-aegean transition-colors duration-160 ease-press hover:text-shoal-deep aria-[current=location]:text-shoal-deep sm:text-5xl"
                  >
                    {labels.links[s.key]}
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? `${100 + sections.length * 50}ms` : "0ms" }}
            className="translate-y-12 opacity-0 transition-[transform,opacity] duration-700 ease-fluid group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:translate-y-0"
          >
            <WhatsAppButton href={whatsapp.href} labels={whatsapp.labels} />
          </div>
        </div>
      </div>
    </>
  );
}
