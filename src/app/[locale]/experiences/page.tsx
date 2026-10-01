import { getDictionary } from "@/content";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { whatsappHref } from "@/lib/whatsapp";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/PageHeader";
import { Bachelor } from "@/components/Bachelor";
import { Pilates } from "@/components/Pilates";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/experiences", (t) => t.pages.experiences);

export default function ExperiencesPage({ params }: Params) {
  const t = getDictionary(toLocale(params.locale));
  const videoLabels = { play: t.bachelor.playVideo, pause: t.bachelor.pauseVideo };

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHeader title={t.pages.experiences.heading} lead={t.pages.experiences.lead} />
      <Bachelor
        title={t.bachelor.title}
        body={t.bachelor.body}
        points={t.bachelor.points}
        banner={t.bachelor.banner}
        media={{
          image: resolveMedia(media.bachelor.file),
          video: resolveMedia(media.bachelor.video),
          alt: t.bachelor.alt,
          file: media.bachelor.file,
        }}
        labels={videoLabels}
        whatsapp={{ href: whatsappHref(t.bachelor.message), labels: { ...t.whatsapp, cta: t.bachelor.cta } }}
      />
      <Pilates
        title={t.pilates.title}
        body={t.pilates.body}
        stepsLabel={t.pilates.stepsLabel}
        steps={t.pilates.steps}
        points={t.pilates.points}
        media={{
          image: resolveMedia(media.pilates.file),
          video: resolveMedia(media.pilates.video),
          alt: t.pilates.alt,
          file: media.pilates.file,
        }}
        labels={videoLabels}
        whatsapp={{ href: whatsappHref(t.pilates.message), labels: { ...t.whatsapp, cta: t.pilates.cta } }}
      />
    </main>
  );
}
