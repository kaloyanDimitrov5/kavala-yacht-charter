import { getDictionary } from "@/content";
import { courses, courseGallery } from "@/config/catalogue";
import { resolveMedia } from "@/lib/media.server";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/PageHeader";
import { LinkRows } from "@/components/LinkRows";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/courses", (t) => t.catalogue.coursesIndex);

export default function CoursesPage({ params }: Params) {
  const locale = toLocale(params.locale);
  const c = getDictionary(locale).catalogue;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHeader title={c.coursesIndex.heading} lead={c.coursesIndex.lead} />
      <section aria-label={c.coursesIndex.heading} className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <LinkRows
            rows={courses.map((co) => ({
              href: `/${locale}/courses/${co.slug}`,
              label: c.courses[co.slug].title,
              detail: c.courses[co.slug].card,
              image: resolveMedia(courseGallery(co.slug)[0]),
              alt: c.courseCommon.galleryAlt(c.courses[co.slug].title, 1),
            }))}
          />
        </div>
      </section>
    </main>
  );
}
