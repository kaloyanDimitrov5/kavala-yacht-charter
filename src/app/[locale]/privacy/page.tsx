import { getDictionary } from "@/content";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/privacy", (t) => ({ title: t.legal.privacy.title, description: t.legal.privacy.metaDescription }));

export default function Page({ params }: Params) {
  const locale = toLocale(params.locale);
  return <LegalPage locale={locale} t={getDictionary(locale)} page="privacy" />;
}
