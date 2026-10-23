"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle, Minus, Phone, Plus, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import { phones, viberHref } from "@/lib/whatsapp";
import { ViberLogo } from "./ViberLogo";
import { courses, cruises } from "@/config/catalogue";

/** A cruise or course slug, or "other" */
type RequestRoute = string;
import type { Locale } from "@/i18n";
import { getDictionary } from "@/content";

type Props = {
  locale: Locale;
  /** Digits only; empty means WhatsApp is not configured */
  number: string;
  maxGuests: number;
};

type Field = "from" | "to" | "guests";
type Errors = Partial<Record<Field, string>>;

const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/** Send buttons and the call link share one shape (main button rules: 8px by 12px, 12px radius) */
const send =
  "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold transition-[background-color,transform] duration-160 ease-press " +
  "before:absolute before:-inset-0.5 before:content-[''] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

const input =
  "block w-full rounded-xl bg-limestone px-3 py-2 text-base text-aegean ring-1 ring-inset transition-[box-shadow] duration-160 ease-press hover:ring-aegean/40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-teak-deep";

export function RequestPanel({ locale, number, maxGuests }: Props) {
  // Read on the client: the dictionary holds the message builder, which cannot cross the server boundary
  const t = getDictionary(locale);
  const labels = { ...t.request, unavailable: t.whatsapp.unavailable, call: t.whatsapp.call };
  const viber = viberHref();
  const calls = phones();
  const buildMessage = t.request.message;
  // Every cruise and course, so the request names exactly what the visitor picked
  const routes = [
    ...cruises.map((c) => ({ id: c.slug as string, name: t.catalogue.cruises[c.slug].title })),
    ...courses.map((c) => ({ id: c.slug as string, name: t.catalogue.courses[c.slug].title })),
  ];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState("2");
  const [route, setRoute] = useState<RequestRoute>("other");
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  /** Which app is opening after a send, for the button label */
  const [opening, setOpening] = useState<false | "whatsapp" | "viber">(false);
  /** After a Viber send: whether the request reached the clipboard */
  const [viberNote, setViberNote] = useState<null | "copied" | "notCopied">(null);
  const [minDate, setMinDate] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const ids = { from: `${uid}from`, to: `${uid}to`, guests: `${uid}guests`, route: `${uid}route` };

  // Set on the client only, so server and client HTML match
  useEffect(() => setMinDate(todayIso()), []);

  // Cruise and course pages link here with ?cruise=<slug>
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("cruise");
    if (wanted && (wanted === "other" || routes.some((r) => r.id === wanted))) setRoute(wanted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!opening) return;
    const reset = () => setOpening(false);
    window.addEventListener("focus", reset);
    const timer = window.setTimeout(reset, 4000);
    return () => {
      window.removeEventListener("focus", reset);
      window.clearTimeout(timer);
    };
  }, [opening]);

  function validate(values = { from, to, guests }): Errors {
    const e: Errors = {};
    const today = todayIso();
    if (!values.from) e.from = labels.errors.fromRequired;
    else if (values.from < today) e.from = labels.errors.past;
    if (!values.to) e.to = labels.errors.toRequired;
    else if (values.from && values.to <= values.from) e.to = labels.errors.order;
    const n = Number(values.guests);
    if (!values.guests || !Number.isInteger(n) || n < 1) e.guests = labels.errors.guestsRange;
    else if (n > maxGuests) e.guests = labels.errors.guestsMax;
    return e;
  }

  /** Re-validate after the first submit; the guest limit is always checked live. */
  function update(next: Partial<{ from: string; to: string; guests: string }>) {
    const values = { from, to, guests, ...next };
    if (next.from !== undefined) setFrom(next.from);
    if (next.to !== undefined) setTo(next.to);
    if (next.guests !== undefined) setGuests(next.guests);
    const all = validate(values);
    if (attempted) setErrors(all);
    else if (next.guests !== undefined) setErrors((prev) => ({ ...prev, guests: all.guests }));
  }

  const stepGuests = (delta: number) => {
    const n = Number(guests) || 0;
    update({ guests: String(Math.min(maxGuests, Math.max(1, n + delta))) });
  };

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(y, m - 1, d));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Two submit buttons: which one was pressed decides the app
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.value === "viber" ? "viber" : "whatsapp";
    setAttempted(true);
    setViberNote(null);
    const found = validate();
    setErrors(found);
    const first = (["from", "to", "guests"] as Field[]).find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(ids[first])}`)?.focus();
      return;
    }
    if (!number) return;
    const routeName = route === "other" ? labels.routeOther : routes.find((r) => r.id === route)?.name ?? labels.routeOther;
    const text = buildMessage({ from: formatDate(from), to: formatDate(to), guests: Number(guests), route: routeName });
    setOpening(channel);
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      return;
    }
    // Viber links cannot carry a message, so the request goes to the clipboard for the visitor to paste
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = false;
    }
    setViberNote(copied ? "copied" : "notCopied");
    if (viber) window.location.href = viber;
  }

  const hasErrors = Object.values(errors).some(Boolean);
  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`${ids[field]}-error`} className="mt-2 flex items-start gap-2 text-sm font-medium text-teak-deep">
        <WarningCircle size={20} aria-hidden className="shrink-0" />
        {errors[field]}
      </p>
    ) : null;
  const describedBy = (field: Field, extra?: string) =>
    [errors[field] ? `${ids[field]}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;
  const labelClass = "mb-2 block text-sm font-semibold text-aegean";

  return (
    <div id="request" className="rounded-3xl bg-white p-6 lg:p-8">
      <h3 className="text-2xl font-medium tracking-tight text-aegean">{labels.title}</h3>
      <p className="mt-2 text-base text-aegean-soft">{labels.lead}</p>

      <form ref={formRef} noValidate onSubmit={onSubmit} className="mt-8">
        <p role="alert" className={hasErrors && attempted ? "mb-6 rounded-xl bg-teak/10 px-3 py-2 text-sm font-medium text-teak-deep" : "sr-only"}>
          {hasErrors && attempted ? labels.errorSummary : ""}
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.from} className={labelClass}>
              {labels.from}
            </label>
            <input
              id={ids.from}
              type="date"
              required
              min={minDate}
              value={from}
              onChange={(e) => update({ from: e.target.value })}
              aria-invalid={!!errors.from}
              aria-describedby={describedBy("from")}
              className={`${input} ring-aegean/15`}
            />
            {errorText("from")}
          </div>

          <div>
            <label htmlFor={ids.to} className={labelClass}>
              {labels.to}
            </label>
            <input
              id={ids.to}
              type="date"
              required
              min={from || minDate}
              value={to}
              onChange={(e) => update({ to: e.target.value })}
              aria-invalid={!!errors.to}
              aria-describedby={describedBy("to")}
              className={`${input} ring-aegean/15`}
            />
            {errorText("to")}
          </div>

          <div>
            <label htmlFor={ids.guests} className={labelClass}>
              {labels.guests}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => stepGuests(-1)}
                disabled={Number(guests) <= 1}
                aria-label={labels.decrease}
                aria-controls={ids.guests}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-limestone text-aegean transition-[background-color,transform] duration-160 ease-press hover:bg-aegean/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={20} aria-hidden />
              </button>
              <input
                id={ids.guests}
                type="number"
                inputMode="numeric"
                min={1}
                max={maxGuests}
                step={1}
                required
                value={guests}
                onChange={(e) => update({ guests: e.target.value })}
                aria-invalid={!!errors.guests}
                aria-describedby={describedBy("guests", `${ids.guests}-hint`)}
                className={`${input} ring-aegean/15 text-center`}
              />
              <button
                type="button"
                onClick={() => stepGuests(1)}
                disabled={Number(guests) >= maxGuests}
                aria-label={labels.increase}
                aria-controls={ids.guests}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-limestone text-aegean transition-[background-color,transform] duration-160 ease-press hover:bg-aegean/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={20} aria-hidden />
              </button>
            </div>
            <p id={`${ids.guests}-hint`} className="mt-2 text-sm text-aegean-soft">
              {labels.guestsHint}
            </p>
            {errorText("guests")}
          </div>

          <div>
            <label htmlFor={ids.route} className={labelClass}>
              {labels.route}
            </label>
            <select
              id={ids.route}
              value={route}
              onChange={(e) => setRoute(e.target.value as RequestRoute)}
              className={`${input} ring-aegean/15`}
            >
              <option value="other">{labels.routeOther}</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          <div role="group" aria-label={labels.sendLabel} className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              name="channel"
              value="whatsapp"
              disabled={!number}
              aria-describedby={!number ? `${uid}unavailable` : undefined}
              data-state={opening === "whatsapp" ? "opening" : "idle"}
              className={`${send} bg-whatsapp text-aegean hover:bg-whatsapp-deep data-[state=opening]:bg-whatsapp-deep`}
            >
              <WhatsappLogo size={24} aria-hidden weight={opening === "whatsapp" ? "fill" : "regular"} />
              <span className="grid">
                <span className={`[grid-area:1/1] ${opening === "whatsapp" ? "invisible" : ""}`}>{labels.submit}</span>
                <span className={`[grid-area:1/1] ${opening === "whatsapp" ? "" : "invisible"}`}>{labels.opening}</span>
              </span>
            </button>
            {viber && (
              <button
                type="submit"
                name="channel"
                value="viber"
                data-state={opening === "viber" ? "opening" : "idle"}
                className={`${send} bg-viber text-white hover:bg-viber-deep data-[state=opening]:bg-viber-deep`}
              >
                <ViberLogo size={24} />
                <span className="grid">
                  <span className={`[grid-area:1/1] ${opening === "viber" ? "invisible" : ""}`}>{labels.submitViber}</span>
                  <span className={`[grid-area:1/1] ${opening === "viber" ? "" : "invisible"}`}>{labels.openingViber}</span>
                </span>
              </button>
            )}
            {calls.map((c) => (
              <a
                key={c.href}
                href={c.href}
                aria-label={`${labels.call} ${c.display}`}
                className={`${send} bg-white tabular-nums text-aegean ring-1 ring-inset ring-aegean/15 hover:bg-limestone`}
              >
                <Phone size={24} aria-hidden />
                {c.display}
              </a>
            ))}
          </div>
          {!number && (
            <p id={`${uid}unavailable`} className="mt-3 flex items-start gap-2 text-sm text-aegean-soft">
              <WarningCircle size={20} aria-hidden className="shrink-0" />
              {labels.unavailable}
            </p>
          )}
          {viberNote && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-viber/10 px-3 py-2 text-sm font-medium text-aegean">
              <CheckCircle size={20} aria-hidden className="shrink-0 text-viber" />
              {viberNote === "copied" ? labels.viberCopied : labels.viberNotCopied}
            </p>
          )}
          <span className="sr-only" aria-live="polite">
            {opening === "whatsapp" ? labels.opening : opening === "viber" ? labels.openingViber : ""}
            {viberNote === "copied" ? ` ${labels.viberCopied}` : viberNote === "notCopied" ? ` ${labels.viberNotCopied}` : ""}
          </span>
        </div>
      </form>
    </div>
  );
}
