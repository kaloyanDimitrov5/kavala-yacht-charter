import { getDictionary } from "@/content";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/PageHeader";
import { HowItWorks } from "@/components/HowItWorks";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/book", (t) => t.pages.book);

export default function BookPage({ params }: Params) {
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHeader title={t.pages.book.heading} lead={t.pages.book.lead} />
      <HowItWorks t={t} locale={locale} />
    </main>
  );
}
