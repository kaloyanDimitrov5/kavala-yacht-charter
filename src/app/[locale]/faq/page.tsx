import { getDictionary } from "@/content";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structuredData";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/Faq";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/faq", (t) => t.pages.faq);

export default function FaqPage({ params }: Params) {
  const t = getDictionary(toLocale(params.locale));

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <JsonLd data={breadcrumbs(t, toLocale(params.locale), [{ name: t.nav.links.faq, path: "/faq" }])} />
      <PageHeader title={t.pages.faq.heading} lead={t.pages.faq.lead} />
      <Faq t={t} showHeading={false} />
    </main>
  );
}
