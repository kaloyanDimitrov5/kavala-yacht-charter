/**
 * Photo library: every web sized photo the galleries can use, defined once.
 * Alt text per photo lives in content/photos.{en,bg}.ts. Galleries pick photos by key
 * (config/catalogue.ts), so one photo can appear on several pages.
 */
export const photoLibrary = {
  // Cruise covers (owner's first cruise photos)
  "cover-thasos-bays": { file: "cruise-thasos-bays-day-cruise-1.jpg" },
  "cover-kavala": { file: "cruise-kavala-day-cruise-1.jpg" },
  "cover-thasos": { file: "cruise-thasos-cruise-1.jpg" },
  "cover-sporades": { file: "cruise-sporades-cruise-1.jpg" },
  "cover-halkidiki": { file: "cruise-halkidiki-cruise-1.jpg" },

  // Earlier batches
  hero: { file: "hero.jpg" },
  "yacht-cove": { file: "yacht-cove.jpg" },
  "yacht-swim": { file: "yacht-swim.jpg" },
  "yacht-anchorage": { file: "yacht-anchorage.jpg" },
  "yacht-sail": { file: "yacht-sail.jpg" },
  "yacht-sunset": { file: "yacht-sunset.jpg" },
  "gallery-cove": { file: "gallery-cove.jpg" },
  "gallery-cockpit": { file: "gallery-cockpit.jpg" },
  "gallery-helm": { file: "gallery-helm.jpg" },
  "guest-dolphins": { file: "guest-dolphins.jpg" },
  "guest-sunset-anchor": { file: "guest-sunset-anchor.jpg" },
  "guest-sunset-sea": { file: "guest-sunset-sea.jpg" },
  "guest-helm": { file: "guest-helm.jpg" },
  "guest-sup": { file: "guest-sup.jpg", video: "guest-sup.mp4" },
  "guest-dive": { file: "guest-dive.jpg", video: "guest-dive.mp4" },

  // Batch of 2026-10-08 (scripts/prepare-media.sh, "Photo library")
  "pic-green-bay": { file: "pic-green-bay.jpg" },
  "pic-turquoise-bay": { file: "pic-turquoise-bay.jpg" },
  "pic-turquoise-deck": { file: "pic-turquoise-deck.jpg" },
  "pic-beach-harbour": { file: "pic-beach-harbour.jpg" },
  "pic-green-cove": { file: "pic-green-cove.jpg" },
  "pic-bay-flag": { file: "pic-bay-flag.jpg" },
  "pic-open-sea-deck": { file: "pic-open-sea-deck.jpg" },
  "pic-thasos-bay": { file: "pic-thasos-bay.jpg" },
  "pic-giola": { file: "pic-giola.jpg" },
  "pic-giola-2": { file: "pic-giola-2.jpg" },
  "pic-alonissos-view": { file: "pic-alonissos-view.jpg" },
  "pic-alonissos-alley": { file: "pic-alonissos-alley.jpg" },
  "pic-alonissos-sunset-alley": { file: "pic-alonissos-sunset-alley.jpg" },
  "pic-alonissos-steps": { file: "pic-alonissos-steps.jpg" },
  "pic-alonissos-church-lane": { file: "pic-alonissos-church-lane.jpg" },
  "pic-alonissos-bougainvillea": { file: "pic-alonissos-bougainvillea.jpg" },
  "pic-skopelos-harbour": { file: "pic-skopelos-harbour.jpg" },
  "pic-skopelos-church": { file: "pic-skopelos-church.jpg" },
  "pic-kyra-panagia": { file: "pic-kyra-panagia.jpg" },
  "pic-island-taverna": { file: "pic-island-taverna.jpg" },
  "pic-island-lane": { file: "pic-island-lane.jpg" },
  "pic-island-white-house": { file: "pic-island-white-house.jpg" },
  "pic-island-sunset-view": { file: "pic-island-sunset-view.jpg" },
  "pic-village-evening": { file: "pic-village-evening.jpg" },
  "pic-athos": { file: "pic-athos.jpg" },
  "pic-tuna-catch": { file: "pic-tuna-catch.jpg" },
  "pic-tuna-deck": { file: "pic-tuna-deck.jpg" },
  "pic-sup-paddle": { file: "pic-sup-paddle.jpg", video: "pic-sup-paddle.mp4" },
  "pic-cockpit-life": { file: "pic-cockpit-life.jpg", video: "pic-cockpit-life.mp4" },
  // Experiences
  bachelor: { file: "occasion-bachelor.jpg", video: "occasion-bachelor.mp4" },
  "pic-pilates": { file: "pic-pilates.jpg" },
  /** Only 450 px wide: small inset use only */
  "pic-yoga": { file: "pic-yoga.jpg" },
} satisfies Record<string, { file: string; video?: string }>;

export type PhotoKey = keyof typeof photoLibrary;
