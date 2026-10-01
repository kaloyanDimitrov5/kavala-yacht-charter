import { notFound } from "next/navigation";
import { CalendarBlank, Check } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/content";
import { locales } from "@/i18n";
import { courses, courseGallery, isCourse } from "@/config/catalogue";
import { resolveMedia } from "@/lib/media.server";
import { whatsappHref } from "@/lib/whatsapp";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGrid } from "@/components/PhotoGrid";
import { LinkRows } from "@/components/LinkRows";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";

type Params = { params: { locale: string; slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => courses.map((c) => ({ locale, slug: c.slug })));
}

export function generateMetadata({ params }: Params) {
  if (!isCourse(params.slug)) return {};
  const slug = params.slug;
  return pageMetadata(params.locale, `/courses/${slug}`, (t) => ({
    title: t.catalogue.courses[slug].title,
    description: t.catalogue.courses[slug].lead,
  }));
}

export default function CoursePage({ params }: Params) {
  if (!isCourse(params.slug)) notFound();
  const slug = params.slug;
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);
  const c = t.catalogue;
  const course = c.courses[slug];
  const other = courses.find((x) => x.slug !== slug)!;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHeader title={course.title} lead={course.lead} />

      <section aria-labelledby="practise-title" className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading id="practise-title" title={c.courseCommon.practiseTitle} />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.practise.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-aegean">
                  <Check size={20} weight="bold" aria-hidden className="mt-1 shrink-0 text-shoal-deep" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <aside className="self-start rounded-3xl bg-white p-6 lg:col-span-4 lg:col-start-9 lg:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-aegean">
              <CalendarBlank size={24} aria-hidden className="shrink-0 text-shoal-deep" />
              {c.courseCommon.formatTitle}
            </h2>
            <p className="mt-3 text-base text-aegean-soft">{c.courseCommon.formatBody}</p>
            <WhatsAppButton
              className="mt-6"
              href={whatsappHref(c.courseCommon.askMessage(course.title))}
              labels={{ ...t.whatsapp, cta: c.courseCommon.ask }}
            />
          </aside>
        </div>
      </section>

      <PhotoGrid
        id="photos-title"
        title={c.courseCommon.galleryTitle}
        items={courseGallery(slug).map((file, i) => ({ file, alt: c.courseCommon.galleryAlt(course.title, i + 1) }))}
      />

      <section aria-labelledby="other-course" className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="other-course" title={c.courseCommon.otherCourse} />
          <div className="mt-8 lg:mt-12">
            <LinkRows
              size="md"
              rows={[
                {
                  href: `/${locale}/courses/${other.slug}`,
                  label: c.courses[other.slug].title,
                  detail: c.courses[other.slug].card,
                  image: resolveMedia(courseGallery(other.slug)[0]),
                  alt: c.courseCommon.galleryAlt(c.courses[other.slug].title, 1),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
