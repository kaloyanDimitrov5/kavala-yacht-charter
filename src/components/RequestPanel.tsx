"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import type { RouteId } from "@/config/site";
import type { Locale } from "@/i18n";
import { getDictionary } from "@/content";
import { REQUEST_ROUTE_EVENT, type RequestRoute } from "@/lib/requestRoute";

type Props = {
  locale: Locale;
  /** Digits only; empty means WhatsApp is not configured */
  number: string;
  maxGuests: number;
  routes: RouteId[];
};

type Field = "from" | "to" | "guests";
type Errors = Partial<Record<Field, string>>;

const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const input =
  "block w-full rounded-xl bg-limestone px-3 py-2 text-base text-aegean ring-1 ring-inset transition-[box-shadow] duration-160 ease-press hover:ring-aegean/40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-teak-deep";

export function RequestPanel({ locale, number, maxGuests, routes: routeIds }: Props) {
  // Read on the client: the dictionary holds the message builder, which cannot cross the server boundary
  const t = getDictionary(locale);
  const labels = { ...t.request, unavailable: t.whatsapp.unavailable };
  const buildMessage = t.request.message;
  const routes = routeIds.map((id) => ({ id, name: t.routes.names[id] }));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState("2");
  const [route, setRoute] = useState<RequestRoute>("other");
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [opening, setOpening] = useState(false);
  const [minDate, setMinDate] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const ids = { from: `${uid}from`, to: `${uid}to`, guests: `${uid}guests`, route: `${uid}route` };

  // Set on the client only, so server and client HTML match
  useEffect(() => setMinDate(todayIso()), []);

  // "Ask about this route" elsewhere on the page preselects the route
  useEffect(() => {
    const onRoute = (e: Event) => setRoute((e as CustomEvent<RequestRoute>).detail);
    window.addEventListener(REQUEST_ROUTE_EVENT, onRoute);
    return () => window.removeEventListener(REQUEST_ROUTE_EVENT, onRoute);
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
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
    setOpening(true);
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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
      <h3 className="text-2xl font-semibold tracking-tight text-aegean">{labels.title}</h3>
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
          <button
            type="submit"
            disabled={!number}
            aria-describedby={!number ? `${uid}unavailable` : undefined}
            data-state={opening ? "opening" : "idle"}
            className="relative inline-flex items-center gap-2 rounded-xl bg-aegean px-3 py-2 text-base font-semibold text-white transition-[background-color,transform] duration-160 ease-press before:absolute before:-inset-0.5 before:content-[''] hover:bg-aegean/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-aegean/40 data-[state=opening]:bg-aegean/80"
          >
            <WhatsappLogo size={24} aria-hidden weight={opening ? "fill" : "regular"} />
            <span className="grid">
              <span className={`[grid-area:1/1] ${opening ? "invisible" : ""}`}>{labels.submit}</span>
              <span className={`[grid-area:1/1] ${opening ? "" : "invisible"}`}>{labels.opening}</span>
            </span>
          </button>
          {!number && (
            <p id={`${uid}unavailable`} className="mt-3 flex items-start gap-2 text-sm text-aegean-soft">
              <WarningCircle size={20} aria-hidden className="shrink-0" />
              {labels.unavailable}
            </p>
          )}
          <span className="sr-only" aria-live="polite">
            {opening ? labels.opening : ""}
          </span>
        </div>
      </form>
    </div>
  );
}
