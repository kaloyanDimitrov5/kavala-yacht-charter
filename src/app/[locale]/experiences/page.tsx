import { Champagne, FlowerLotus } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/content";
import { photoLibrary, type PhotoKey } from "@/config/photos";
import { resolveMedia } from "@/lib/media.server";
import { whatsappHref } from "@/lib/whatsapp";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/PageHeader";
import { ExperienceDecor } from "@/components/ExperienceDecor";
import { ExperienceFeature } from "@/components/ExperienceFeature";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/experiences", (t) => t.pages.experiences);

export default function ExperiencesPage({ params }: Params) {
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);
  const eh = t.experiencesHome;
  const videoLabels = { play: t.bachelor.playVideo, pause: t.bachelor.pauseVideo };
  const photo = (key: PhotoKey, withVideo = false) => {
    const p: { file: string; video?: string } = photoLibrary[key];
    return {
      src: resolveMedia(p.file),
      alt: t.photos[key],
      file: p.file,
      ...(withVideo ? { video: p.video ? resolveMedia(p.video) : null } : {}),
    };
  };

  return (
    <main id="main" tabIndex={-1} className="relative overflow-hidden outline-none">
      <ExperienceDecor />
      <div className="relative">
        <PageHeader title={t.pages.experiences.heading} lead={t.pages.experiences.lead} />

        <ExperienceFeature
          id="bachelor"
          icon={Champagne}
          badge={eh.bachelor.badge}
          title={t.bachelor.title}
          body={t.bachelor.body}
          points={t.bachelor.points}
          main={photo("bachelor", true)}
          inset={photo("guest-dive")}
          videoLabels={videoLabels}
          whatsapp={{ href: whatsappHref(t.bachelor.message), labels: { ...t.whatsapp, cta: t.bachelor.cta } }}
          book={{ href: `/${locale}/book#request`, label: t.catalogue.common.book }}
        />

        <ExperienceFeature
          id="yoga"
          icon={FlowerLotus}
          badge={eh.yoga.badge}
          title={t.pilates.title}
          body={t.pilates.body}
          steps={{ label: t.pilates.stepsLabel, items: t.pilates.steps }}
          points={t.pilates.points}
          main={photo("pic-pilates")}
          inset={photo("pic-yoga")}
          flip
          videoLabels={videoLabels}
          whatsapp={{ href: whatsappHref(t.pilates.message), labels: { ...t.whatsapp, cta: t.pilates.cta } }}
          book={{ href: `/${locale}/book#request`, label: t.catalogue.common.book }}
        />
        <div className="h-12" aria-hidden />
      </div>
    </main>
  );
}
