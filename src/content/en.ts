/**
 * English copy. This file defines the dictionary shape; bg.ts must match it.
 * Rules: sentence case, active voice, no hyphens in copy, no invented facts.
 */
export const en = {
  meta: {
    title: "Skippered yacht holidays from Kavala for up to 8 guests",
    description:
      "Charter a private yacht with your own skipper out of Kavala. Four cabins, two bathrooms, SUP boards on board. Sail to Thasos, Samothraki and the Sporades.",
    ogLocale: "en_GB",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main",
    languageNav: "Language",
  },
  nav: {
    /** Shown when site.brandName is empty */
    brandFallback: "Yacht charter Kavala",
    home: "Back to the top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Sections",
    links: {
      compare: "Beach or yacht",
      guests: "Guest photos",
      routes: "Routes",
      boat: "The boat",
      bachelor: "Bachelor parties",
      pilates: "Pilates on board",
      how: "How it works",
      faq: "Questions",
    },
    languages: { en: "English", bg: "Български" },
  },
  hero: {
    /**
     * Each entry is one intended line on large screens. Break where the thought breaks.
     * Below lg the lines flow together and text-wrap: balance picks the breaks.
     */
    headline: ["Wake up", "in a different bay", "every morning"],
    lead: "A private yacht with your own skipper, sailing out of Kavala to Thasos, Samothraki and the Sporades.",
    facts: {
      cabins: (cabins: number, berths: number) => `${cabins} cabins, ${berths} berths`,
      bathrooms: (count: number) => `${count} bathrooms with showers`,
      skipper: "Skipper on board",
      port: "Departs Kavala",
    },
    factsLabel: "What is included",
    mediaAlt: "The yacht at anchor in a quiet bay off the coast near Kavala",
    /** TODO(owner): where the hero photo was taken, e.g. "At anchor off Thasos". Empty hides it. */
    mediaCaption: "",
    videoPause: "Pause background video",
    videoPlay: "Play background video",
    placeholderNote: "Photo goes here: public/media/hero.jpg",
  },
  whatsapp: {
    cta: "Check free dates on WhatsApp",
    opening: "Opening WhatsApp",
    opensInNewTab: "Opens WhatsApp in a new tab",
    unavailable: "WhatsApp booking is not connected yet. Please try again later.",
    message:
      "Hello, we are interested in a skippered yacht holiday from Kavala. Which dates are free?",
  },
  /** {key} marks an inline photo chip (see media.tagline). Chips are visual only. */
  tagline: [
    "A beach holiday {beach} gives you one view.",
    "A yacht gives you a new one every morning, {cove} a swim straight off the deck, {swim} and a bay {bay} with no one else in it.",
  ],
  /** Desktop frame beside the tagline: label and alt per chip */
  taglineFrame: {
    beach: { label: "Same sunbed, same view", alt: "" },
    cove: { label: "A new bay every morning", alt: "The yacht at anchor in a turquoise cove lined with pine trees" },
    swim: { label: "Straight off the deck", alt: "A guest diving into the sea from the bow of the yacht" },
    bay: { label: "Nobody else here", alt: "Drone view of the yacht alone in a quiet bay" },
  },
  compare: {
    title: "What changes when you swap the hotel for a yacht",
    lead: "Scroll and watch what moves. The beach stays where it is. The yacht does not.",
    beachLabel: "Beach holiday",
    yachtLabel: "Yacht holiday",
    beachChip: "Same beach, same crowd",
    beachAlt: "A crowded beach with rows of sunbeds",
    /** Captions say what each photo shows, not where it was taken. */
    moments: {
      cove: { chip: "Clear water in a sheltered bay", alt: "Turquoise water in a bay with pine covered hills, seen from the yacht" },
      swim: { chip: "Swimming straight off the boat", alt: "A guest swimming next to the yacht in a green bay" },
      anchorage: { chip: "At anchor among the pines", alt: "Sailing yachts at anchor in a calm bay below pine forest" },
      sail: { chip: "Sailing on to the next island", alt: "The yacht under sail with a guest on deck and an island ahead" },
      sunset: { chip: "Sunset under sail", alt: "The sun setting over the sea, seen from the yacht's deck" },
      night: { chip: "A harbour under the stars", alt: "Masts and harbour lights under a starry night sky" },
    },
    beachPoints: [
      "One view from the same sunbed",
      "Swim where everyone else swims",
      "The same hotel room every night",
    ],
    yachtPoints: [
      "A new bay every morning",
      "Swim off the boat, paddle to the shore",
      "A different harbour each night",
    ],
    progressLabel: "Along the way",
  },
  guests: {
    title: "Shared by our guests",
    lead: "Photos and videos our guests took on board.",
    regionLabel: "Guest photos and videos",
    prev: "Previous photos",
    next: "Next photos",
    playVideo: "Play video",
    pauseVideo: "Pause video",
    items: {
      dive: { caption: "Diving off the bow", alt: "A guest diving into the sea from the bow of the yacht" },
      dolphins: { caption: "Dolphins at the bow", alt: "Guests at the bow watching dolphins swim alongside the yacht" },
      sup: { caption: "SUP in a turquoise cove", alt: "A paddle board on deck at anchor in a turquoise cove below pine trees" },
      sunsetAnchor: { caption: "Sunset at anchor", alt: "The sun setting over the hills, seen from the deck at anchor" },
      harbour: { caption: "Morning in the harbour", alt: "The yacht moored in a harbour below a hillside town" },
      helm: { caption: "At the helm", alt: "The helm and the Greek flag above a green bay" },
      anchorage: { caption: "A calm anchorage", alt: "Calm water and green hills seen from the deck at anchor" },
      sunsetSea: { caption: "The sun goes down", alt: "The sun setting over the open sea" },
    },
  },
  routes: {
    title: "Where we sail from Kavala",
    lead: "Six islands we sail to from Kavala, or a route you plan with us.",
    mapLabel: "Map of the standard routes from Kavala. Positions are approximate.",
    mapNote: "Positions are approximate.",
    kavala: "Kavala",
    names: {
      thasos: "Thasos",
      samothraki: "Samothraki",
      skopelos: "Skopelos",
      skiathos: "Skiathos",
      alonissos: "Alonissos",
      "kyra-panagia": "Kyra Panagia",
    },
    /** TODO(owner): confirm or rewrite each note. General knowledge only, no distances or durations. */
    notes: {
      thasos: "The island closest to Kavala, green down to the water, with bays all around its coast.",
      samothraki: "A mountainous island out in the northern Aegean with a wild, quiet coastline.",
      skopelos: "Pine forest running down to the sea and a harbour town of white houses.",
      skiathos: "The liveliest of the Sporades, known for the sandy beaches along its south coast.",
      alonissos: "The heart of the National Marine Park of Alonissos and the Northern Sporades, with very clear water.",
      "kyra-panagia": "A quiet island inside the marine park, home to a monastery and sheltered coves.",
    },
    ask: "Ask about this route",
    customTitle: "Your own route",
    customBody: "Have another island or harbour in mind? Tell us and we will check what is possible.",
    customCta: "Plan your own route",
  },
  boat: {
    title: "The boat",
    lead: "Room for eight guests to sleep, shower on board and spend the day in the water.",
    diagramLabel: "Deck plan of the yacht: four cabins with two berths each, two bathrooms with showers, the saloon and the galley.",
    diagramNote: "The real cabin layout of the yacht.",
    bow: "Bow",
    stern: "Stern",
    features: {
      cabins: {
        title: (cabins: number) => `${cabins} cabins`,
        body: (berths: number, guests: number) =>
          `Every cabin has ${berths} berths, so up to ${guests} guests sleep on board.`,
      },
      bathrooms: {
        title: (count: number) => `${count} bathrooms`,
        body: "Both bathrooms have a shower, so nobody waits long after a swim.",
      },
      sup: {
        title: "SUP boards",
        body: "Stand up paddle boards on board to explore the bay once you drop anchor.",
      },
      skipper: {
        title: "Your skipper",
        body: "The skipper handles the boat, the route and the harbours. You need no sailing experience.",
      },
    },
    specs: { model: "Model", length: "Length", year: "Year", meters: (m: number) => `${m} m` },
  },
  bachelor: {
    title: "A bachelor party at sea",
    body: "Your group, a private yacht and a bay to yourselves. Swim, paddle and celebrate with no crowd around you.",
    // TODO(owner): add what you arrange for parties (music, drinks, decorations) once confirmed.
    points: [
      "Up to 8 guests on board",
      "Your skipper handles the boat, you handle the celebration",
      "Swim stops and SUP boards",
    ],
    /** Big words in the scroll banner. Decorative, hidden from screen readers. */
    banner: ["Swim", "Paddle", "Celebrate", "No crowd", "Your bay"],
    alt: "The yacht at anchor in a pine lined bay with guests on deck",
    cta: "Ask about a bachelor party",
    message: "Hello, we would like to ask about a bachelor party on the yacht from Kavala. Which dates are free?",
    pauseVideo: "Pause video",
    playVideo: "Play video",
  },
  pilates: {
    title: "Pilates on deck",
    body: "Start the day with a pilates session on deck while the yacht is at anchor, then swim straight off the boat.",
    stepsLabel: "A pilates morning on board",
    steps: ["Anchor in a quiet bay", "Pilates on deck", "Swim straight off the boat"],
    // TODO(owner): confirm whether an instructor and mats are included and add them here.
    points: ["Up to 8 guests on board"],
    alt: "A pilates session on the deck of the yacht at anchor",
    cta: "Ask about pilates on board",
    message: "Hello, we would like to ask about pilates on the yacht from Kavala. Which dates are free?",
  },
  how: {
    title: "How it works",
    steps: [
      {
        title: "Choose a route and dates",
        body: "Pick an island or two and the dates you have in mind. Not sure yet? Say so and we will suggest options.",
      },
      {
        title: "We confirm availability",
        body: "We reply on WhatsApp with the free dates and answer your questions.",
      },
      {
        title: "Board in Kavala",
        body: "Meet your skipper at the harbour in Kavala, stow your bags and set sail.",
      },
    ],
  },
  request: {
    title: "Send us your dates",
    lead: "We open WhatsApp with your details filled in. Nothing is sent until you press send there.",
    from: "From",
    to: "To",
    guests: "Guests",
    guestsHint: "Up to 8 guests",
    decrease: "One guest fewer",
    increase: "One guest more",
    route: "Route",
    routeOther: "Other or not sure yet",
    submit: "Send request on WhatsApp",
    opening: "Opening WhatsApp",
    errorSummary: "Check the fields marked below.",
    errors: {
      fromRequired: "Choose a start date.",
      toRequired: "Choose an end date.",
      past: "Choose a date from today onwards.",
      order: "The end date must be after the start date.",
      guestsRange: "Enter a number of guests from 1 to 8.",
      guestsMax: "The yacht sleeps up to 8 guests. For a bigger group, message us about it.",
    },
    message: (d: { from: string; to: string; guests: number; route: string }) =>
      [
        "Hello, we would like to check free dates for a skippered yacht holiday from Kavala.",
        `Dates: ${d.from} to ${d.to}`,
        `Guests: ${d.guests}`,
        `Route: ${d.route}`,
      ].join("\n"),
  },
  gallery: {
    title: "On board and at anchor",
    alts: {
      cove: "The yacht at anchor in a turquoise cove lined with pine trees",
      cockpit: "View from the cockpit across a green bay",
      helm: "Sunset from the helm, with the Greek flag at the stern",
      dinner: "Dinner on a terrace above the sea in an island village",
      dolphins: "Dolphins swimming alongside the yacht",
    },
    playVideo: "Play video",
    pauseVideo: "Pause video",
  },
  reviews: {
    title: "What guests say",
  },
  faq: {
    title: "Questions before you book",
    items: [
      {
        q: "Do we need to know how to sail?",
        a: "No. Every charter comes with a skipper who sails the boat, plans the route and handles the harbours. You swim, paddle and relax.",
      },
      {
        q: "How many people can come?",
        a: "Up to 8 guests. The yacht has 4 cabins with 2 berths each.",
      },
      {
        q: "What are the cabins and bathrooms like?",
        a: "There are 4 cabins, each with 2 berths, and 2 bathrooms, both with a shower.",
      },
      {
        q: "Are there SUP boards on board?",
        a: "Yes. Stand up paddle boards come with the boat, so you can paddle to the shore or around the bay after you anchor.",
      },
      {
        q: "Where can we sail?",
        a: "Our standard routes from Kavala go to Thasos, Samothraki, Skopelos, Skiathos, Alonissos and Kyra Panagia.",
      },
      {
        q: "Can we plan our own route?",
        a: "Yes. Tell us where you would like to go and we will check what is possible for your dates.",
      },
      {
        q: "What should we bring?",
        // TODO(owner): confirm whether towels and bed linen are provided and add it here.
        a: "Soft bags rather than hard suitcases, swimwear, sun protection, a hat, shoes with light soles for the deck, any personal medication and your ID documents.",
      },
      {
        q: "What happens if the weather is bad?",
        // TODO(owner): replace with the real weather policy.
        a: "Safety comes first, and your skipper decides where it is safe to sail. We agree the weather terms with you before you book, so ask us on WhatsApp.",
      },
      {
        q: "What is the cancellation policy?",
        // TODO(owner): replace with the real cancellation terms.
        a: "We agree the cancellation terms with you in writing before you book. Ask us on WhatsApp for the current terms.",
      },
      {
        q: "How do we book?",
        a: "Send us your dates, route and number of guests on WhatsApp. We reply with the free dates and confirm the booking with you.",
      },
    ],
  },
  finalCta: {
    title: "Tell us your dates and we will tell you what is free",
    body: "One message on WhatsApp is enough. We reply with the free dates for your group.",
  },
  footer: {
    tagline: "Private skippered yacht holidays from Kavala, Greece.",
    privacy: "Privacy",
    terms: "Terms",
    legalNav: "Legal",
    rights: (year: number, name: string) => `© ${year} ${name}`,
  },
  legal: {
    back: "Back to the home page",
    privacy: {
      title: "Privacy",
      metaDescription: "How this website handles your data.",
      // TODO(owner): review with your advisor before launch.
      body: [
        "This website does not use cookies, analytics or tracking.",
        "The booking form does not send data to us. It opens WhatsApp on your device with your dates, route and number of guests filled in. Nothing is shared until you press send in WhatsApp.",
        "Once you message us, WhatsApp's own privacy policy applies to that conversation. We use your messages only to answer your request and arrange your charter.",
      ],
    },
    terms: {
      title: "Terms",
      metaDescription: "Charter terms for the skippered yacht from Kavala.",
      // TODO(owner): replace with the real charter terms.
      body: [
        "Charter terms, including payment, cancellation and weather, are agreed with you in writing before you book.",
        "Information on this website describes the yacht and our standard routes. Your written charter agreement is what counts.",
      ],
    },
  },
  notFound: {
    title: "This bay is not on our chart",
    body: "The page you opened does not exist or has moved. Head back and start from the harbour.",
    back: "Back to the home page",
    metaTitle: "Page not found",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
