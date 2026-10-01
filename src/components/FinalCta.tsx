import type { Dictionary } from "@/content";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppButton } from "./WhatsAppButton";

/** Same button, same message as the hero. */
export function FinalCta({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="final-title" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 id="final-title" className="max-w-measure text-3xl font-semibold tracking-tight text-aegean lg:text-5xl">
          {t.finalCta.title}
        </h2>
        <p className="mt-6 max-w-measure text-lg text-aegean-soft">{t.finalCta.body}</p>
        <WhatsAppButton className="mt-8" href={whatsappHref(t.whatsapp.message)} labels={t.whatsapp} />
      </div>
    </section>
  );
}
