/**
 * Cruises and courses copy (English). This file defines the shape; catalogue.bg.ts must match it.
 * Itineraries come from the owner. Where the owner listed more stops than days, the day mapping
 * is our proposal (marked TODO). Clock times and prices are the owner's; prices live in
 * src/config/pricing.ts. No distances: none were given.
 */
export const catalogueEn = {
  index: {
    title: "Cruises from Kavala",
    description:
      "Day cruises to the bays of Thasos and along the Kavala coast, island cruises to Thasos, the Sporades and Halkidiki, and tuna fishing trips. We plan the route, you enjoy it.",
    heading: "Cruises from Kavala",
    lead: "Never been on a boat? You do not have to plan anything. Pick a cruise and we plan the route, the stops and the days.",
    kinds: {
      day: { title: "Day cruises", lead: "One day at sea, back in Kavala by the evening." },
      multi: { title: "Cruises of several days", lead: "Sleep on board and wake up somewhere new." },
      fishing: { title: "Fishing trips", lead: "Days at sea on the tuna route." },
    },
    coursesTitle: "Learn to sail",
    coursesLead: "Courses on our yacht, with an experienced captain.",
    mapTitle: "The waters we sail",
    mapLead: "Pick an island to see the cruise that goes there.",
    seeCruise: "See the cruise",
  },
  common: {
    factsLabel: "At a glance",
    duration: "Duration",
    departs: "Departs",
    departsValue: "Kavala",
    guests: "Guests",
    guestsValue: "Up to 8",
    skipper: "Skipper",
    skipperValue: "Included",
    proposalTitle: "A proposal, not a fixed route",
    proposalBody:
      "This is how we would plan it. We change any cruise on request, and the skipper adjusts the plan to the wind and the weather.",
    timelineTitle: "Day by day",
    stepsTitle: "How the day goes",
    galleryTitle: "Photos",
    ask: "Ask about this cruise",
    askMessage: (title: string) =>
      `Hello, we would like to ask about the ${title} from Kavala. Which dates are free?`,
    book: "Send your dates",
    otherCruises: "Other cruises",
    kindLabels: { day: "Day cruise", multi: "Cruise", fishing: "Fishing trip" },
    placesTitle: "Places you can visit",
    priceFact: "Price from",
    fromPrice: (price: string) => `From ${price}`,
    prices: {
      title: "Prices",
      lead: "For the whole yacht and up to 8 guests. The price depends on the season you sail in.",
      from: "From",
      seasonsLabel: "Seasons from May to October",
      seasons: { high: "High season", low: "Low season", pre: "Early and late season" },
      includedTitle: "Included",
      included: { skipper: "An experienced Bulgarian skipper", linen: "Bed linen", insurance: "Insurance" },
      excludedTitle: "Not included",
      excluded: ["Food", "Fuel", "Port fees and harbour costs (electricity and water)"],
      cleaning: (fee: string) => `Cleaning when you return the yacht: ${fee}`,
    },
  },
  cruises: {
    "thasos-bays-day-cruise": {
      title: "Thasos bays day cruise",
      duration: "1 day",
      card: "Across to Thasos for a day of swimming in its bays",
      lead: "A full day at sea. We sail from Kavala across to Thasos, stop in quiet bays to swim and paddle, and sail back.",
      timeline: [
        { label: "Step 1", title: "Board in Kavala", body: "Meet your skipper in Kavala harbour, stow your bags and get a short safety talk before we leave." },
        { label: "Step 2", title: "Across to Thasos", body: "The crossing to Thasos. Sit back on deck and watch Kavala get smaller behind you." },
        { label: "Step 3", title: "Swim in the bays", body: "We anchor in quiet bays along the coast of Thasos. Swim straight off the boat and take out the SUP boards." },
        { label: "Step 4", title: "Back to Kavala", body: "We sail back across and arrive in Kavala at the end of the day." },
      ],
    },
    "kavala-day-cruise": {
      title: "Kavala day cruise",
      duration: "1 day",
      card: "A first day on a boat, along the coast near Kavala",
      lead: "A day along the coast near Kavala. A good first time on a boat, with no long crossing.",
      timeline: [
        { label: "Step 1", title: "Board in Kavala", body: "Meet your skipper in Kavala harbour and get a short safety talk before we leave." },
        { label: "Step 2", title: "Kavala from the sea", body: "We leave the harbour with the old town and its castle behind us." },
        { label: "Step 3", title: "Bays along the coast", body: "Swim stops in bays along the coast, chosen on the day for calm water. SUP boards are on board." },
        { label: "Step 4", title: "Back in Kavala", body: "We sail back into Kavala harbour at the end of the day." },
      ],
    },
    "thasos-weekend-cruise": {
      title: "Thasos weekend cruise",
      duration: "3 days",
      card: "Friday to Sunday around Thasos, with nights in island harbours",
      lead: "Three days sailing around Thasos, Friday to Sunday. Swim in quiet bays by day and spend the nights in the island's harbours, with dinner at a fish taverna.",
      places: [
        "Skala Marion",
        "Tripiti Beach",
        "Limenaria",
        "Aliki Beach",
        "Marble Beach",
        "Golden Beach",
        "St. Archangel Michael Monastery",
        "Paradise Beach",
      ],
      timeline: [
        {
          label: "Thursday, after 22:00",
          title: "Board in Kavala",
          body: "Settle in on board in Kavala harbour. Your skipper gives you a safety briefing and shows you around the yacht.",
        },
        {
          label: "Day 1 · Friday",
          title: "Kavala → Thasos",
          body: "We sail from Kavala across to Thasos and stop in picturesque bays to swim and enjoy the beach.",
        },
        {
          label: "Day 2 · Saturday",
          title: "Around the island",
          body: "We carry on around Thasos. In the evening we stop in one of the island's harbours for the night, close to authentic fish tavernas with long menus.",
          note: "Which way we sail round depends on the weather and on what you would like. The skipper has the last word, for the safety of the crew.",
        },
        {
          label: "Day 3 · Sunday",
          title: "Back to Kavala",
          body: "We sail back to Kavala. You leave the yacht by 17:00.",
        },
      ],
    },
    "thasos-cruise": {
      title: "Thasos cruise",
      duration: "4 days",
      card: "Monday to Thursday around Thasos: Limenas, Vahti and Golden Beach",
      lead: "Four days around Thasos, Monday to Thursday. More time for fun and for the sights, with nights on board in the island's harbours.",
      places: [
        "Skala Marion",
        "Tripiti Beach",
        "Limenaria",
        "Aliki Beach",
        "Marble Beach",
        "Golden Beach",
        "St. Archangel Michael Monastery",
        "Paradise Beach",
      ],
      timeline: [
        {
          label: "Sunday, after 22:00",
          title: "Board in Kavala",
          body: "Settle in on board in Kavala harbour. Your skipper gives you a safety briefing and shows you around the yacht.",
        },
        {
          label: "Day 1 · Monday",
          title: "Kavala → Limenas",
          body: "We sail from Kavala to Limenas, the main town of Thasos, and spend the night in its harbour.",
          note: "We stop in a bay on the way for a swim if the weather and the time allow.",
        },
        // TODO(owner): confirm the spelling of Vahti in English and Bulgarian.
        {
          label: "Day 2 · Tuesday",
          title: "Vahti",
          body: "On to Vahti for a day of swimming and paddling. Each evening we stop in one of the island's harbours, close to authentic fish tavernas.",
          note: "Which way we sail round depends on the weather and on what you would like.",
        },
        { label: "Day 3 · Wednesday", title: "Golden Beach", body: "A day at Golden Beach, swimming from the boat at anchor off the long sandy bay." },
        { label: "Day 4 · Thursday", title: "Back to Kavala", body: "We sail back across to Kavala. You leave the yacht by 17:00." },
      ],
    },
    "sporades-cruise": {
      title: "Sporades cruise",
      duration: "7 days",
      card: "Thasos, Kyra Panagia, Alonissos, Skopelos and Skiathos",
      lead: "A week from Kavala down to the Northern Sporades and back, Monday to Sunday, through the National Marine Park of Alonissos and the Northern Sporades.",
      proposal:
        "You set the final route with us, once we have seen the forecast. Spend the days on the beach in quiet, exotic bays you can only reach by sea, or walk inland to the islands' sights and classic tavernas with Greek ouzo and fine meze. It is up to you.",
      // TODO(owner): confirm this day mapping of the eight places over the week.
      timeline: [
        { label: "Sunday, from 22:00", title: "Board in Kavala", body: "Settle in on board in Kavala harbour the evening before we sail." },
        {
          label: "Day 1 · Monday",
          title: "Kavala → Thasos",
          body: "We leave Kavala at 08:00 and cross to Thasos for the first night at sea.",
          note: "We can leave earlier or later if we agree it together.",
        },
        { label: "Day 2 · Tuesday", title: "Thasos → Kyra Panagia", body: "The longest leg of the trip, south to Kyra Panagia, a quiet island inside the marine park." },
        { label: "Day 3 · Wednesday", title: "Alonissos", body: "On to Alonissos, at the heart of the marine park, known for its very clear water." },
        { label: "Day 4 · Thursday", title: "Skopelos", body: "Pine forest running down to the sea and a harbour town of white houses." },
        { label: "Day 5 · Friday", title: "Skiathos", body: "The liveliest of the Sporades, with sandy beaches along its south coast." },
        { label: "Day 6 · Saturday", title: "Skiathos → Thasos", body: "We sail north again, back to Thasos for the last night." },
        { label: "Day 7 · Sunday", title: "Thasos → Kavala", body: "The last crossing, back to Kavala. You leave the yacht by 17:00." },
      ],
    },
    "halkidiki-cruise": {
      title: "Halkidiki cruise",
      duration: "7 days",
      card: "Thasos, then the bays of Halkidiki",
      lead: "A week from Kavala to Halkidiki and its bays, Monday to Sunday, with a night on Thasos on the way out and on the way back.",
      proposal:
        "You set the final route with us, once we have seen the forecast. Spend the days on the beach in quiet, exotic bays you can only reach by sea, or walk inland to the sights and classic tavernas with Greek ouzo and fine meze. It is up to you.",
      timeline: [
        { label: "Sunday, from 22:00", title: "Board in Kavala", body: "Settle in on board in Kavala harbour the evening before we sail." },
        {
          label: "Day 1 · Monday",
          title: "Kavala → Thasos",
          body: "We leave Kavala at 08:00 and cross to Thasos for the first night at sea.",
          note: "We can leave earlier or later if we agree it together.",
        },
        { label: "Day 2 · Tuesday", title: "Thasos → Halkidiki", body: "We sail west to Halkidiki." },
        { label: "Day 3 · Wednesday", title: "Bays of Halkidiki", body: "A different bay or anchorage on Halkidiki, chosen with you and with the weather." },
        { label: "Day 4 · Thursday", title: "More of Halkidiki", body: "Another stretch of the Halkidiki coast and another quiet bay for the night." },
        { label: "Day 5 · Friday", title: "Beach or village", body: "A lazy day in a bay you can only reach by sea, or a walk inland to a village and its taverna." },
        { label: "Day 6 · Saturday", title: "Halkidiki → Thasos", body: "We head back east to Thasos for the last night." },
        { label: "Day 7 · Sunday", title: "Thasos → Kavala", body: "The last crossing, back to Kavala. You leave the yacht by 17:00." },
      ],
    },
    "tuna-fishing-trip": {
      title: "Tuna fishing trip",
      duration: "4 to 5 days, longer on request",
      card: "On the tuna route between Thasos and Samothraki",
      lead: "A fishing trip on the tuna route in the waters between Thasos and Samothraki. Four to five days, or longer on request.",
      // TODO(owner): add what is provided (rods, tackle, bait) and how permits work.
      timeline: [
        { label: "Day 1", title: "Kavala → Thasos", body: "We cross to Thasos and get the gear ready." },
        { label: "Days 2 and 3", title: "On the tuna route", body: "Days at sea in the waters between Thasos and Samothraki, fishing on the tuna route." },
        { label: "Day 4", title: "Samothraki", body: "A stop at Samothraki, the wild, mountainous island at the far end of the route." },
        { label: "Day 5", title: "Back to Kavala", body: "We sail back to Kavala. On a longer trip we add more days on the tuna route." },
      ],
    },
  },
  coursesIndex: {
    title: "Captain and yachting courses",
    description: "Learn to sail on our yacht out of Kavala: captain courses and yachting courses with an experienced captain.",
    heading: "Captain and yachting courses",
    lead: "Learn on a real yacht, in real conditions, with an experienced captain beside you.",
  },
  courseCommon: {
    practiseTitle: "What you practise",
    formatTitle: "Dates and format",
    // TODO(owner): replace with real duration, group size and the certificate the course leads to.
    formatBody: "We agree the dates, the length of the course and the certificate it prepares you for with you. Ask us on WhatsApp.",
    galleryTitle: "Photos",
    ask: "Ask about this course",
    askMessage: (title: string) => `Hello, we would like to ask about the ${title} on the yacht from Kavala. Which dates are free?`,
    otherCourse: "The other course",
  },
  courses: {
    "captain-course": {
      title: "Captain course",
      card: "Learn to skipper a sailing yacht yourself",
      lead: "Learn to skipper a sailing yacht yourself, on our boat and in real conditions, with an experienced captain beside you.",
      // TODO(owner): confirm the syllabus.
      practise: [
        "Leaving and entering a harbour",
        "Anchoring and mooring",
        "Handling and trimming the sails",
        "Basic navigation and planning a passage",
        "Safety on board and man overboard drills",
        "Reading the weather",
      ],
    },
    "yachting-course": {
      title: "Yachting course",
      card: "A first course for people who have never sailed",
      lead: "A first course for people who have never sailed: how a yacht works, how to help on board and how to feel at home at sea.",
      // TODO(owner): confirm the syllabus.
      practise: [
        "How a sailing yacht works",
        "The ropes and knots you will actually use",
        "Steering under the captain's guidance",
        "Life on board: water, power and safety",
        "Swimming and SUP safely at anchor",
      ],
    },
  },
};

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

type TimelineStep = { label: string; title: string; body: string; note?: string };
type Base = Widen<typeof catalogueEn>;
type CruiseCopy = { title: string; duration: string; card: string; lead: string; timeline: TimelineStep[] };

export type Catalogue = Omit<Base, "cruises"> & {
  /** Every cruise has the core copy. Optional: places worth a visit, and its own route note. */
  cruises: { [K in keyof Base["cruises"]]: CruiseCopy & { places?: string[]; proposal?: string } };
};
