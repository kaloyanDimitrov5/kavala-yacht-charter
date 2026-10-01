# DESIGN.md — Kavala skippered yacht charter

This file is the source of truth for every UI decision. Read it before touching UI.
Skills in `.claude/skills/` apply. Where they disagree:

- `landing-page-design` Part B hard constraints win: one typeface, Tailwind type scale, the spacing table, the radius formula, flat backgrounds, the mandatory tagline reveal, the content rules.
- `frontend-design` wins on art direction and restraint.
- The brief below wins over both where it is explicit (for example: no fade up on every section).

---

## 1. Brief

A private yacht holiday **with a skipper** out of Kavala, Greece. Guests do not sail the boat themselves.

| Fact | Value |
|---|---|
| Cabins | 4, two berths each |
| Guests | up to 8 |
| Bathrooms | 2, both with showers |
| Extras | SUP (stand up paddle boards) |
| Home port | Kavala, Greece |
| Standard routes | Thasos, Samothraki, Skopelos, Skiathos, Alonissos, Kyra Panagia. Other routes on request. |

- **Offer:** a private skippered yacht holiday out of Kavala for up to 8 guests.
- **Audience:** groups of friends and families in Bulgaria and abroad who would otherwise book a beach hotel.
- **Primary action:** open WhatsApp with a prefilled message asking for free dates. Label: "Check free dates on WhatsApp". The only CTA above the fold.
- **Core argument:** a beach gives one view and one crowd. A yacht anchors in quiet bays, lets you swim from the boat, paddle, and sleep in a different harbour each night.

### Never invent facts

No prices, boat name, boat length, year, reviews, distances or trip durations unless the owner provides them.
Every unknown lives in `src/config/site.ts` as a `TODO` value. When a value is empty the UI hides that element or shows a neutral version. Never a fake number.

---

## 2. Design read

```yaml
artifact: long form bilingual landing page (layout B, long form story)
audience: Bulgarian and international friend groups and families comparing against a beach hotel
visual-language: quiet Aegean daylight; pale limestone ground, deep sea ink, one sea accent
mode: greenfield
visual-variance: 4   # quiet everywhere except the comparison and the route line
motion-intensity: 3  # five named motion moments, nothing else moves
information-density: 3
asset-dependence: 8  # real photos and video carry the page; placeholders until delivered
brand-fidelity: 5    # no logo or brand name yet
```

**Layout choice: B, long form story.** Visitors default to a beach hotel. They need to be taught how a skippered yacht holiday works and reassured about sleeping, bathrooms and the skipper before they message. That is education plus objection handling, which is what long form is for.

---

## 3. Tokens

### Colour

All backgrounds flat. No background gradients anywhere.

| Token | Hex | Role |
|---|---|---|
| `aegean` | `#0E2A3B` | Primary text, primary button fill, icons |
| `aegean-soft` | `#3E5664` | Secondary text (solid colour, not opacity) |
| `limestone` | `#E8EDEF` | Page background |
| `white` | `#FFFFFF` | Cards, panels, button text on aegean |
| `shoal` | `#2B9AA8` | Accent. **Non text only**: placeholders, decorative marks, route line |
| `shoal-deep` | `#1F7580` | Derived from shoal. Focus rings, inline links |
| `teak` | `#B48253` | Rare warm secondary. **Decoration only**: Kavala marker on the map, deck in the boat diagram, beach placeholder |
| `teak-deep` | `#8A5A2B` | Derived from teak. **Form errors only** (5.87:1 on white, 4.97:1 on limestone), always with a warning icon |

Hero heading uses the mandated text gradient `#000000 → #666666` (left to right, light theme). This is the only gradient on the site and it sits on text, never on a background.

Dark sections, if ever used, must use one of `#000000 #181818 #1F1F1F #272727 #313131 #131209`. `aegean` is **not** a permitted section background. Phase 1 has no dark sections.

#### WCAG AA contrast (measured)

| Foreground | Background | Ratio | Use allowed |
|---|---|---|---|
| aegean | limestone | 12.59 | all text |
| aegean | white | 14.86 | all text |
| white | aegean | 14.86 | button label |
| aegean-soft | limestone | 6.54 | body and small text |
| aegean-soft | white | 7.72 | body and small text |
| shoal-deep | limestone | 4.54 | links, focus ring (≥ 3:1 non text) |
| shoal-deep | white | 5.36 | links, focus ring |
| #666666 (gradient end) | limestone | 4.86 | hero heading end colour |
| shoal | limestone | 2.83 | **fails**: decoration only, never text, never focus |
| shoal | white | 3.34 | **fails** for body text: decoration only |
| white | shoal | 3.34 | **fails**: no white text on shoal |
| aegean | shoal | 4.45 | **fails** body text: no text on shoal |
| teak | limestone | 2.84 | **fails**: decoration only |
| teak | white | 3.36 | **fails**: decoration only |

### Type

One typeface: **Manrope** via `next/font` (latin + cyrillic). No italics. Weights 400, 500, 600 only; semibold is the ceiling.

Tailwind default scale only, no arbitrary sizes.

| Role | Class | Weight | Notes |
|---|---|---|---|
| Hero heading | `text-4xl` → `sm:text-5xl` → `lg:text-7xl` | 600 | `tracking-tight`, gradient text, max width 680px, manual meaningful line break |
| Tagline reveal | `text-3xl` → `sm:text-4xl` → `lg:text-5xl` | 600 | per word reveal, max width 680px on small, wider cap at `lg` still ≤ 60 characters per line |
| Section heading (Phase 2) | `text-3xl` → `lg:text-5xl` | 600 | sentence case, no eyebrow labels |
| Overlay nav links | `text-4xl` → `sm:text-5xl` | 500 | |
| Subheading / lead | `text-lg` → `lg:text-xl` | 400 | `aegean-soft`, max width 680px |
| Body | `text-base` | 400 | `text-wrap: pretty` |
| Main button | `text-base` | 600 | |
| Header controls | `text-sm` | 600 | |
| Fact line | `text-sm` | 500 | |

Headings get `text-wrap: balance`, body gets `text-wrap: pretty`. No all caps labels. No hyphens in copy.

### Spacing

Only these values: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px
(Tailwind `0, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24`). Main buttons: `py-2 px-3`.

Page gutter: `px-4` (16px) mobile, `sm:px-6`, `lg:px-8`. Section rhythm: `py-20` to `py-24`.

### Radius

Tailwind radius values only. Hierarchy (not one radius on everything):

| Element | Radius |
|---|---|
| Nav island pill, controls inside the pill | `rounded-full` (pill 8px padding holds full radius children) |
| Main button | `rounded-xl` (12px, equals its 12px side padding) |
| Hero media frame | `rounded-3xl` (24px), `rounded-2xl` on mobile |
| Cards (Phase 2) | `rounded-2xl`; inner elements follow `inner = outer − gap` when gap < 32px and result > 2 |

### Borders and elevation

Borders go all the way around or not at all. Nav pill: 1px `white/60` outline plus a hairline `aegean/10` ring for separation on photos. No stock grey drop shadows under cards.

### Icons

Phosphor (`@phosphor-icons/react`), `regular` weight, 20px in text rows, 24px in buttons. Never Material.

---

## 4. Motion

Motion budget is spent in exactly five places. Everything else is still.

| Moment | What moves | Tool | Curve / duration |
|---|---|---|---|
| Hero entrance | heading lines, lead, CTA fade up from `translateY(16px)` + `blur(8px)`; media frame reveals by `clip-path` from the bottom | Framer Motion, transform string | `cubic-bezier(0.32,0.72,0,1)`, 800–1000ms, 80ms stagger, once on load |
| Nav | hamburger lines rotate into an X (never disappear); overlay fades in with `backdrop-blur-3xl bg-white/80`; links stagger up from `translate-y-12 opacity-0` | CSS transitions | `cubic-bezier(0.32,0.72,0,1)` 700ms, 50ms stagger |
| Tagline reveal | each word from 28% opacity to 100% in reading order as scroll progress crosses it | Framer `useScroll` (rAF batched) + CSS opacity transition | `cubic-bezier(0.32,0.72,0,1)` 700ms |
| Beach vs yacht (Phase 2) | scroll driven morning sequence, yacht side changes, beach side stays frozen | Framer Motion | same curve |
| Route line (Phase 2) | SVG path draws from Kavala to each island | `pathLength` | same curve |
| Bachelor party (owner request) | two rows of big words slide in opposite directions as the visitor scrolls; video frame settles from a slight tilt on first view | Framer `useScroll` + `useTransform` (transform strings), `whileInView` | scroll linked, no easing; frame 900ms fluid curve |
| Pilates (owner request) | the morning sequence line draws across, each step's dot fills as the line reaches it | Framer `whileInView`, `scaleX` / `scaleY` | 1600ms `cubic-bezier(0.77,0,0.175,1)` (on screen movement → ease in out), dots staggered to the line |

Rules:

- No fade up on every section. No hover animation on cards.
- Buttons: `scale(0.98)` on `:active` (160ms, ease out curve `cubic-bezier(0.23,1,0.32,1)`), hover is a colour shift gated behind `(hover: hover) and (pointer: fine)`.
- Never `transition: all`; name properties.
- Scroll work uses `IntersectionObserver` or `useScroll`. Never a raw `window.addEventListener('scroll')`.
- `prefers-reduced-motion`: entrance becomes opacity only, overlay links appear without translate, hamburger still morphs (it shows state), tagline words render at full colour, hero video is replaced by its poster.

---

## 5. Layout concept

Content is **left aligned** throughout. Centre alignment is reserved for the nav pill.

### Hero (desktop 1440)

```
┌──────────────────────────────────────────────────────────────────────┐
│                  ( Name        EN | BG      ≡ )   ← glass pill, mt-6  │
│                                                                      │
│  Wake up in a different                                              │
│  bay every morning                ← gradient, text-7xl, ≤ 680px      │
│                                                                      │
│                                     A private yacht with your own    │
│                                     skipper, sailing out of Kavala…  │
│                                     [ ◎ Check free dates on WhatsApp ]│
│                                     ▭ 4 cabins, 8 berths             │
│                                     ▭ 2 bathrooms with showers        │
│                                     ▭ Skipper on board  ▭ From Kavala │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │        boat photo or muted loop, 16:7 horizon crop             │  │
│  │                                               caption (if set) │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

The heading sits on the left, the lead, CTA and fact line hang off its right edge, one step lower, so the eye runs heading → lead → button in a Z. The photo below is cropped as a wide horizon strip; the top edge peeks above the fold at 1440×900 so the boat is visible on load.

### Hero (mobile 375)

```
┌─────────────────────────────┐
│ ( Name   EN|BG  ≡ )         │
│                             │
│ Wake up in a                │
│ different bay               │
│ every morning               │
│                             │
│ A private yacht with your   │
│ own skipper, sailing out…   │
│ [ ◎ Check free dates on WA ]│
│ ▭ 4 cabins, 8 berths        │
│ ▭ 2 bathrooms with showers  │
│ ▭ Skipper on board          │
│ ▭ Departs Kavala            │
│ ┌─────────────────────────┐ │
│ │ photo 4:3               │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Beach vs yacht comparison (Phase 2, the memorable moment)

```
┌──────────────────────────────────────────────────────────────────────┐
│ One view, or a new one every morning           (section heading)     │
│                                                                      │
│  Beach holiday                     │  Yacht holiday                  │
│  ┌──────────────────────────┐      │  ┌──────────────────────────┐   │
│  │ the same sunbed view     │      │  │ Thasos → Samothraki → …  │   │
│  │ (frozen, never changes)  │      │  │ (changes with scroll)    │   │
│  └──────────────────────────┘      │  └──────────────────────────┘   │
│  Same beach, same crowd            │  Anchored in a quiet bay        │
│  Swim where everyone swims         │  Swim straight off the boat     │
│  Same hotel every night            │  A new harbour each night       │
│                                                                      │
│     morning  ●───○───○───○   (progress through the sequence)         │
└──────────────────────────────────────────────────────────────────────┘
```

Section is pinned while scrolling. The yacht side steps through the standard route islands (real names only, no days or durations); the beach side deliberately does not move. The contrast between one frozen panel and one living panel **is** the argument. Followed by the routes section where an SVG line draws from Kavala to each island.

### Tagline reveal

Own full height moment on the limestone ground, heading scale type, left aligned, words light up in reading order.

---

## 6. Plan review: what was generic and what changed

| First instinct | Why it was generic or wrong | Revised to |
|---|---|---|
| Full bleed yacht photo with a centred white headline and a dark gradient scrim | The default travel hero; needs a gradient overlay, which the rules ban | Headline on flat limestone, photo as a separate wide horizon strip beneath it |
| Tracked out caps eyebrow "PRIVATE SKIPPERED CHARTER" above the headline | Template chrome tell #5 | Removed. The headline and lead carry the category |
| Proof as big numbers "4 / 8 / 2" with small labels | The big number stat trio default | A quiet fact list with Phosphor icons in `text-sm` |
| Facts joined as "4 cabins · 8 guests · 2 bathrooms" | Middle dot meta string tell | Separate items with icons, no dots |
| Shoal as the CTA colour with white label | Fails AA (3.34:1) | CTA in aegean with white label (14.86:1); shoal stays decorative |
| Shoal focus ring | Fails 3:1 non text on limestone (2.83:1) | Derived `shoal-deep #1F7580` for focus and links |
| Secondary text as aegean at 70% opacity | Unpredictable on photos, harder to audit | Solid `aegean-soft #3E5664` (6.54:1) |
| Tagline on a full bleed aegean band | aegean is not a permitted dark background, and a dark slab right after the hero shouts | Tagline on limestone, carried by scale and the word reveal |
| Duplicate "Check dates" button inside the nav | Competes with the single above the fold CTA | Nav holds name, language toggle, menu only; the CTA appears in the open menu |
| Fade up on every section, hover lift on every card (B7 default) | Generic; brief overrides | Five named motion moments only |
| One radius everywhere | SaaS card kit tell | Radius hierarchy: pill for nav, 12px buttons, 24px media, 16px cards |
| Subheadline repeating "eight guests, four cabins" and the fact line repeating it again | Redundant | Lead says what and where; the fact line owns the numbers |

---

## 7. Page structure

1. Island nav (glass pill, morphing menu, blurred overlay with staggered links, language toggle)
2. Hero: headline, lead, WhatsApp CTA, fact line, photo or muted loop
3. Tagline reveal (mandatory, B11)
4. Beach holiday vs yacht holiday
4b. Shared by our guests (accent band): guest photos and clips as tilted prints in a swipeable row, right after the comparison so proof sits next to the argument (memorable moment)
5. Routes: six routes plus "your own route on request", SVG route line from Kavala. No distances or durations.
6. The boat: the owner's real deck plan (Bavaria 46 layout drawing), then cabins, bathrooms, SUP, skipper
6b. Bachelor parties: dark night section, loud type, scroll driven word banner, portrait video
6c. Pilates on board: light, calm section, morning sequence that draws, square media
7. How it works: choose route and dates → we confirm availability → board in Kavala with your skipper (a real sequence, so numbering is allowed here)
8. Gallery; reviews only if real ones exist in config
9. FAQ, 8 to 10 questions, `FAQPage` JSON-LD
10. Final CTA identical to the hero CTA, footer with privacy and terms links

Plus: branded 404, skip link, favicon, per locale title / description / og tags, hreflang, semantic landmarks, alt text, full state set on every control.

---

## 8. WhatsApp flow

- `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (see `.env.example`). Never hardcoded.
- CTA opens `https://wa.me/<number>?text=<encoded>` with the generic prefilled message in the current language.
- States: default, hover, active (`scale(0.98)`), focus ring, **opening** (label switches to "Opening WhatsApp" for a moment after the click), **unavailable** (number missing: button disabled with an inline explanation).
- Phase 2: request panel with date range, guests 1 to 8, route select including "Other"; client side validation; more than 8 guests shows an inline error, never an alert.

---

## 9. i18n

- Routes `/en` and `/bg`; `/` redirects to `/en`. Middleware prefixes any unlocalised path with `/en`.
- All copy in `src/content/en.ts` and `src/content/bg.ts` (typed against the English shape). Natural Bulgarian, addressing the group with "вие".
- `hreflang` alternates for `en`, `bg`, `x-default`.

---

## 10. Draft copy

| Slot | EN | BG |
|---|---|---|
| Hero headline | Wake up in a different bay / every morning | Всяка сутрин се събуждате / в друг залив |
| Lead | A private yacht with your own skipper, sailing out of Kavala to Thasos, Samothraki and the Sporades. | Частна яхта със собствен шкипер, която отплава от Кавала към Тасос, Самотраки и Спорадите. |
| CTA | Check free dates on WhatsApp | Вижте свободните дати в WhatsApp |
| Facts | 4 cabins, 8 berths · 2 bathrooms with showers · Skipper on board · Departs Kavala | 4 каюти, 8 места за спане · 2 бани с душ · Шкипер на борда · Тръгване от Кавала |
| Tagline | A beach holiday gives you one view. A yacht gives you a new one every morning, and a bay with no one else in it. | Почивката на плажа ви дава една гледка. Яхтата ви дава нова всяка сутрин и залив, в който няма никой друг. |
| WhatsApp message | Hello, we are interested in a skippered yacht holiday from Kavala. Which dates are free? | Здравейте, интересуваме се от почивка на яхта с шкипер от Кавала. Кои дати са свободни? |

(The dots in the Facts row above are only table notation. The UI renders separate items.)

---

## 11. Content rules

- Sentence case. Active voice. No hyphens inside copy. No orphans (`text-wrap: balance` / `pretty`).
- No AI clichés ("elevate", "seamless", "unleash"…). No exclamation marks in confirmations, no "Oops".
- No Lorem Ipsum, no stock image URLs, no fabricated numbers, reviews or names.
- Photos and video come from `/public/media/` via `src/config/media.ts`; until a file exists render a flat colour placeholder with the right aspect ratio and real alt text.

---

## 12. Review log

### Phase 1 self review (375px and 1440px screenshots)

| Found | Fix |
|---|---|
| Gradient headline clipped descenders (g, у, з) because `background-clip: text` stops at the padding box and `leading-none` pushes descenders past it | `pb-3` on gradient headings |
| Menu opened but focus stayed on the button: a `visibility` transition is still `hidden` at t=0 | Overlay turns visible instantly on open (fades with opacity only); visibility is only delayed on close; focus moves on the next frame |
| Bulgarian CTA wrapped to two lines at 375px, leaving "WhatsApp" as an orphan | Shortened to "Вижте свободни дати в WhatsApp" (fits one line at 375px) |
| Skip link lost its padding (`not-sr-only` resets padding) and sat under the nav pill | Padding applied on focus, `z-[60]` above the nav |
| Button label swap to "Opening WhatsApp" changed the button width | Both labels stacked in one grid cell |
| Headline forced three lines on mobile would orphan "bay" | Line breaks forced only at `lg`; below that `text-wrap: balance` |

Open question for the owner: Manrope switches to Bulgarian specific Cyrillic forms (в, д, т shaped like the handwritten forms) under `lang="bg"`. This is the correct local typography; if the Russian style forms are preferred, disable `font-feature-settings: "locl"` for `:lang(bg)`.

### Phase 2 self review (375px and 1440px screenshots)

| Found | Fix |
|---|---|
| Four Sporades route lines ran as a parallel bundle and read like cables | Shared trunk passing east of Mount Athos, then a fan to each island |
| Kavala label sat on the Thasos line; SVG graticule labels shrank to about 7px on mobile | Kavala label moved left of its marker; graticule labels became HTML `text-xs` placed below 40°N |
| Comparison chips wrapped onto two lines and broke the nested radius rule on mobile | `text-xs` below `sm`; radius `rounded` (16 − 12 = 4px) on mobile, `rounded-lg` (24 − 16 = 8px) on desktop |
| Boat diagram about 540px tall at 1440 | Capped at `max-w-4xl` inside its panel |
| Language switch on `/bg/privacy` went to `/en` | Switch swaps only the locale segment of the current path |
| Gallery grid of six left one photo alone on the last row | Five slots: one large plus four squares |
| `aria-live` on the comparison chip would announce every scroll step | Removed; the content is in the lists and the routes section |
| Bulgarian copy had forms that need a hyphen (най близкият, по малко, по голяма) | Rephrased instead of misspelling |

### Phase 2 decisions

- Map positions come from real coordinates (x = (lon − 23.2) × 200, y = (41.1 − lat) × 200). No coastline is drawn, so no land shape is invented.
- The boat diagram is schematic and captioned as such. Only brief facts are labelled (cabins, bathrooms, deck, SUP, helm); the centre is left unlabelled.
- FAQ uses native `details`, opening instantly. Motion stays limited to the five moments in section 4.
- The request panel reads the dictionary on the client, because the message builder is a function and cannot cross the server boundary.

### Media pass (owner photos and video)

- `scripts/prepare-media.sh` builds every published file from the originals in `public/media/images` and `public/media/videos`. Originals are never modified. Re-run after changing a source.
- Photos are converted from Display P3 to sRGB, then **all metadata is stripped** (GPS location, camera data, stale orientation tags). IMG_8363 is stored upright but was tagged "rotate 90", which made browsers turn it sideways.
- Hero: `hero-sailing.mp4` cropped to a centred 4:3 band, 30 fps, no audio (4 MB). Its first frame is the poster, so the still and the video match.
- Comparison, yacht side: six photos as a day on board (cove, swim, anchorage, sailing, sunset, night harbour). Captions describe what each photo shows, not where it was taken. Chips sit at the top of the panel so they never cover the subject; `position` in the manifest sets a crop focus (the swimmer sits low in frame).
- Gallery: five slots rebuilt around the real photos (cove, cockpit, helm at sunset, dinner ashore, dolphins). The dolphin clip is a tap to play tile (trimmed to 12 s, 3 MB); the gallery stays still unless the visitor asks.
- Still missing: a crowded beach photo for the frozen side of the comparison (flat sand placeholder until then).

### Occasions section (bachelor parties and pilates)

- Plan review: two side by side cards was the first instinct and is the SaaS card kit tell. Revised to one stage with a switcher, so motion answers the visitor's choice (frontend-design welcomes motion that shows what changed).
- Tabs follow the WAI tabs pattern: roving tabindex, arrows wrap, Home and End.
- Each occasion has its own WhatsApp message ("…ask about a bachelor party…"), same primary action.
- The bachelor clip (`bachelor-party.mp4`, 2 MB) plays muted only while in view, with a pause button; reduced motion shows the poster. Pilates has no media yet (flat placeholder, `occasion-pilates.jpg` / `.mp4`).
- Copy states only what the owner confirmed (they host both) plus boat facts. Music, drinks, instructor and mats are TODO in the dictionaries.
- Found in review: tall 4:5 frame pushed the section past the fold on desktop and buried the copy on mobile. Desktop now puts the frame across both rows with tabs above the copy; mobile uses 4:3.
- Found in review: with reduced motion on, server and client HTML differed (hero, routes, occasions), causing a React hydration error. `useReducedMotionSafe` reports no preference until hydration, then the real setting; animations read it at run time.

### Bachelor and pilates as two sections (supersedes the switcher)

The owner asked for two separate sections, each with its own design. Both stay inside the system (Manrope, Tailwind scale, spacing table, flat backgrounds, Phosphor) and get their identity from subject, colour, weight and motion.

#### Added tokens

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `night` | `#131209` | Bachelor section background (from the permitted dark list; warm, pairs with teak) | white 18.78 |
| `driftwood` | `#B3ADA2` | Secondary text on night | 8.42 on night |
| `teak` on night | `#B48253` | Text, icons and the CTA fill in the bachelor section | 5.60 both ways, passes AA |

#### Bachelor party: "after dark"

Loud, social, a night out. Semibold display type at the top of the scale, white on night, teak accents. Portrait video, because that is how a party gets filmed and shared.

```
┌──────────────────────────────────────────────────────────────────────┐ night
│  Swim ✳ Paddle ✳ Celebrate ✳ No crowd ✳ Swim ✳ Paddle ✳   ──▶ scroll │ row 1
│  ◀── Your bay ✳ Celebrate ✳ Swim ✳ No crowd ✳ Your bay ✳ Celebrate   │ row 2
│                                                                      │
│  A bachelor party                          ┌───────────┐             │
│  at sea                  (text-7xl)        │           │             │
│                                            │  portrait │ 9:16 video  │
│  Your group, a private yacht…              │   video   │ settles     │
│  ✓ Up to 8 guests                          │           │ from tilt   │
│  ✓ Skipper handles the boat                │        ▮▮ │             │
│  ✓ Swim stops and SUP                      └───────────┘             │
│  [ Ask about a bachelor party ]  teak button, night text             │
└──────────────────────────────────────────────────────────────────────┘
```

#### Pilates: "morning on deck"

Quiet, slow, breathing room. Regular weight display type (400) instead of semibold, white background, shoal accents, generous space. The motion explains the morning: anchor, session, swim.

```
┌──────────────────────────────────────────────────────────────────────┐ white
│  Pilates on deck                    (text-6xl, regular weight)       │
│  Start the day with a session on deck…                               │
│                                                                      │
│  ┌──────────────┐    ●───────────────●───────────────●   line draws  │
│  │              │    Anchor in a     Pilates on      Swim straight   │
│  │  square      │    quiet bay       deck            off the boat    │
│  │  media       │                                                    │
│  └──────────────┘    Up to 8 guests on board · [ Ask about pilates ] │
└──────────────────────────────────────────────────────────────────────┘
```

#### Plan review against the generic patterns

| First instinct | Why generic | Revised to |
|---|---|---|
| Two matching cards with photo, title, bullets | Identical card kit; the two occasions feel the same | Two sections with opposite temperatures: dark and loud, light and calm |
| Auto scrolling marquee for the party | Template move, and moving text over 5s needs a pause control (WCAG 2.2.2) | Banner moves only with the visitor's scroll, so it is user driven and stops when they stop |
| Words separated by middle dots | Meta string tell | Teak asterisk icons as separators |
| Pilates as a three card "features" grid | Numbered cards on a non sequence | The morning really is a sequence (anchor, session, swim), so a drawn line with steps is honest |
| Breathing circle animation looping forever | Decorative loop with no purpose, needs a pause control | Cut. One draw on first view, then still |
| Teak still decoration only | It fails on light backgrounds | On night it passes AA (5.60), so it carries the bachelor accent and CTA |

#### Review log (two section build)

| Found | Fix |
|---|---|
| Horizontal pilates line stopped 16px short of the last dot (grid gaps shift the columns) | Width `2/3 + 16px`, derived from the gap maths in a comment |
| Mobile dots sat above the text's centre line; vertical line overshot the last step | Dots nudged 4px down on mobile; line runs 12px from top to 16px from bottom |
| Line and dots had separate in-view triggers and could drift apart | One parent trigger with variants; dot delays match the symmetric ease in out |
| Disabled CTA on night (night text on 40% teak) was unreadable | Night tone disabled state: `white/10` fill with driftwood text |
| Shoal-deep focus ring is only 3.47:1 on night | `[data-surface="night"]` switches the ring to white |
| `Occasions.tsx` switcher | Removed; shared `InViewVideo` keeps the in-view play and pause behaviour for both sections |

### Guest gallery and real deck plan

- **Deck plan.** The owner supplied `bavaria-46-cabins.jpg`, the real layout drawing (4 cabins, 2 bathrooms, saloon, galley). It replaces the schematic SVG and its legend. Trimmed of its white margin, shown on a white panel so the drawing's own ground blends in.
- **"Shared by our guests" is the accent section.** Placed after the comparison (landing-page-design A4: proof beside the claim), not at the end.
  - Surface: `shoal-deep` band, white text (5.36:1). Focus ring turns white on it (`data-surface="accent"`).
  - Vernacular: guest snapshots as white print frames with a handwritten-free caption strip, alternating ±2° tilt. Frame radius 16px, 8px border, media radius 8px (nested formula).
  - Motion: prints fan in once (rise from 48px, settle into their tilt, 70ms stagger, 800ms fluid). Clips play muted only while visible, each with a pause button. Reduced motion: fade only, tilt static.
  - Row: native horizontal scroll with snap (swipe, trackpad, arrow keys on the focusable region) plus previous and next buttons that step one card and disable at the ends. Scroll edges are measured with an element listener batched through requestAnimationFrame.
  - `.track-gutter` lines the first card up with the page container at every width; it resolves to the container edge, not a new spacing value.
- Captions describe only what each shot shows. No guest names, no quotes.

#### Review log

| Found | Fix |
|---|---|
| Three new HEICs came out sideways: tagged "rotate 90" over landscape pixels, and stripping metadata dropped the tag | Explicit per file rotation in `photo()`; IMG_8363 (same tag, upright pixels) is not rotated |
| Dolphin screenshot kept dark gradient bars (a brightness threshold of 24 missed them) | Measured the photo rows (540 → 2256) and cropped to them |
| On mobile the prints never appeared: the in-view trigger watched the list, which is about six screens wide, so 25% was never visible | Trigger moved to the scroller (the visible window) |
| `role="region"` on the `<ul>` would erase its list semantics | Region and focus on a wrapping scroller; the list stays a list |

### Hero video and tagline redesign

- **Hero:** `1001.mp4`, a landscape drone orbit of the yacht at anchor in a turquoise cove. First 16 s, 1600 px wide, 30 fps, no audio (3 MB, from 136 MB). Landscape fits the 16:7 strip without the heavy crop the portrait clip needed.
- **Tagline (B11) now carries the experience.** The per word reveal stays. Inline photo chips sit inside the sentence, so the line shows what it says:

```
A beach holiday (☂) gives you one view.
A yacht gives you a new one every morning, (cove photo) a swim straight off
the deck, (diving photo) and a bay (drone photo) with no one else in it.
```

- The beach gets an icon chip, not a photo: generic on purpose. The yacht gets the owner's real photos. The contrast is the argument, without repeating the comparison section.
- Chips are 0.8em tall pills (`rounded-full`), so they scale with the type at every breakpoint. They wake up when the reveal reaches them: opacity 0.3 → 1, scale 0.85 → 1, and the photo inside settles from a 1.15 zoom (700 ms fluid curve). Reduced motion: everything shown at once.
- Screen readers get the plain sentence; chips are decorative (the words already say it).
- Plan review: a separate row of three "benefit cards" under the tagline was the first instinct (card kit tell, and it repeats the comparison). Rejected in favour of putting the evidence inside the sentence.
- **Review pass on the tagline:** at 0.8em the chips read as coloured dots and the desktop right half stayed empty ("only text"). Chips grew to 0.85em × 2em (the dive photo gets a crop focus on the diver), and on desktop a 4:5 frame beside the sentence shows the last chip reached: an umbrella panel ("Same sunbed, same view") first, then the cove, the dive and the drone bay, each with a short label. The frame is decorative (`aria-hidden`); mobile keeps the inline chips only.
- **Mobile review (owner feedback: "does not look good on mobile"):** at phone sizes the inline chips shrank to about 30px blobs and broke the line rhythm. Below `lg` the chips are now hidden (the sentence reads as clean type) and the same reveal driven frame sits under the sentence at 4:3, switching umbrella → cove → dive → bay as the words light up. Desktop is unchanged: inline chips plus the 4:5 frame beside the sentence.

---

## 13. Multi page structure (owner request: "too much for only one page")

The owner asked to split the single page into separate pages. This overrides the single landing page structure of section 7; the one offer and the one primary action (WhatsApp) stay the same on every page.

| Route | Purpose | Content |
|---|---|---|
| `/{locale}` Home | The argument | Hero (drone video, CTA) · tagline reveal · beach vs yacht comparison · guest gallery (accent) · "Plan your trip" index linking to the pages below · reviews (hidden until real) |
| `/{locale}/routes` | Where we sail | Page header · routes map and list. "Ask about this route" goes to `/book?route=<id>` and preselects it |
| `/{locale}/boat` | What you get | Page header · real deck plan · cabins, bathrooms, SUP, skipper · specs when set · "On board and at anchor" gallery |
| `/{locale}/experiences` | Occasions | Page header · bachelor party (night section) · pilates (light section) |
| `/{locale}/book` | Convert | Page header · how it works (3 steps) · request panel |
| `/{locale}/faq` | Objections | Page header · 10 questions · FAQPage JSON-LD |
| `/{locale}/privacy`, `/terms` | Legal | unchanged |

- **Nav:** the menu lists pages (Home, Routes, The boat, Experiences, Book, Questions). The current page carries `aria-current="page"` and the shoal-deep colour.
- **Page header:** every inner page opens with the same quiet header: h1 in the B5 heading gradient (as on the hero, 404 and legal pages) plus a lead. One h1 per page; sections below use h2.
- **Home "Plan your trip" index:** editorial rows (big label, one line of detail, a photo, an arrow), not a card grid, so the home page hands off to the inner pages.
- **Per page metadata:** title, description, canonical and hreflang for every page and locale.

### Footer (owner request: bigger, dark blue, with an SVG yacht)

- **Colour exception, recorded:** landing-page-design limits dark sections to six near blacks. The owner explicitly asked for dark blue, and that skill says the user's explicit prompt wins, so the footer uses `aegean #0E2A3B`. It is the only aegean surface on the site.
- New tokens for the aegean surface: `mist #A3B8C4` secondary text (7.23:1), `shoal-light #5FC0CC` accent and link hover (7.01:1). White text 14.86:1. Focus ring white (`data-surface="night"` rule).
- Layout, top to bottom: the closing CTA (big heading, line of detail, WhatsApp button in a light tone), so every page ends on the primary action and the separate final CTA section is retired · four columns (brand and tagline, pages, contact, legal) · a full width SVG yacht under sail on line drawn swells · copyright bar.
- The yacht is a simple geometric mark (hull, cabin, mast, mainsail, jib), drawn with the palette, not an illustration of a real boat. It is still and decorative (`aria-hidden`).

```
┌──────────────────────────────────────────────────────────────────────┐ aegean
│  Tell us your dates and we will                                      │
│  tell you what is free                    (text-6xl, white)          │
│  One message on WhatsApp is enough…       (mist)                     │
│  [ Check free dates on WhatsApp ]         (white button, aegean text)│
│                                                                      │
│  Yacht charter Kavala   Pages        Contact         Legal           │
│  Private skippered…     Routes       WhatsApp        Privacy         │
│                         The boat     email (if set)  Terms           │
│                         Experiences                                  │
│                                                                      │
│                    ▲                                                 │
│                   ╱│╲          (yacht, limestone sails, white hull)  │
│      ~~~~~~~~~~~~▔▔▔▔▔▔~~~~~~~~~~~~~~~~~~~~~~~~~~~~ (shoal swells)    │
│  © 2026 Yacht charter Kavala                                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 14. Cruises and courses (owner request)

Goal from the owner: guests have never been on a boat, so **we plan the trip, they do not**. "Routes" becomes **Cruises**: ready made, named trips, each with a detailed page and a day by day timeline. Every cruise page states that the plan is a proposal and can change on request.

### Catalogue (facts from the owner)

| Slug | Kind | Duration | Owner's itinerary |
|---|---|---|---|
| `thasos-bays-day-cruise` | Day cruise | 1 day | Kavala, bays of Thasos, Kavala |
| `kavala-day-cruise` | Day cruise | 1 day | Along the Kavala coast |
| `thasos-cruise` | Multi day | 2 to 4 days | D1 Kavala → Limenas (bay stop if weather and time allow) · D2 Vahti · D3 Golden Beach · D4 back to Kavala |
| `sporades-cruise` | Multi day | 6 days | Kavala, Thasos, Kyra Panagia, Alonissos, Skopelos, Skiathos, Thasos, Kavala |
| `halkidiki-cruise` | Multi day | 6 days | Kavala, Thasos, Halkidiki (different bays for the middle days), Thasos, Kavala |
| `tuna-fishing-trip` | Fishing | 4 to 5 days or more on request | On the tuna route between Thasos and Samothraki |
| `captain-course` | Course | TODO | Owner offers captain courses |
| `yachting-course` | Course | TODO | Owner offers yachting courses |

Day by day mapping where the owner listed more stops than days (Sporades: eight places over six days) is our proposal and is flagged for the owner to confirm. Day cruise steps use sequence labels, not clock times (no times were given).

### Pages

| Route | Content |
|---|---|
| `/{locale}/cruises` | Header ("You do not plan anything") · day cruises · multi day cruises · fishing · "a proposal, not a fixed route" note · courses teaser · map of the waters we sail (each island links to the cruise that goes there) |
| `/{locale}/cruises/{slug}` | Header (h1, lead) · facts strip (duration, departs Kavala, up to 8 guests, skipper included) · proposal note · **day by day timeline** · gallery (placeholders until photos) · CTA "Ask about this cruise" (WhatsApp with the cruise named) · other cruises |
| `/{locale}/courses` | Header · the two courses |
| `/{locale}/courses/{slug}` | Header · what you practise · format (TODO) · gallery · CTA |
| `/{locale}/routes` | Permanent redirect to `/cruises` |

- Menu: Home, Cruises, Courses, The boat, Experiences, Book, Questions.
- Booking form: "Route" becomes "Cruise" (the six cruises, the two courses, "Other or not sure yet"); `?cruise=<slug>` preselects it.

### Timeline (the motion moment on detail pages)

A vertical line with one stop per day. Each stop: "Day 1" (a real sequence, so numbering is honest), the leg ("Kavala → Limenas"), what we do, and an optional condition ("If the weather and time allow"). The line fills as the visitor scrolls through the days (scroll linked, `useScroll`), and each day's dot fills when the line reaches it. Reduced motion: drawn and filled from the start.

```
  ●  Day 1   Kavala → Limenas
  │          We sail from Kavala to Limenas…   [ If weather and time allow ]
  │
  ●  Day 2   Vahti
  │          …
  ○  Day 3   Golden Beach
  ┆
  ○  Day 4   Back to Kavala
```

### Galleries

Every cruise and course page has a five slot gallery (one large, four small), with flat placeholders and filenames from `media.ts` until the owner sends photos: `cruise-<slug>-1.jpg` … `-5.jpg`, `course-<slug>-1.jpg` … `-5.jpg`.

#### Built (section 14)

- `config/catalogue.ts` lists the six cruises and two courses; copy in `content/catalogue.{en,bg}.ts` (typed, Bulgarian checked for hyphen dependent forms).
- `/cruises` groups day cruises, cruises of several days and fishing trips as link rows, opens with the "proposal, not a fixed route" note, then courses, then the map (each island links to its cruise).
- `/cruises/{slug}`: page header, facts strip (duration, departs Kavala, up to 8 guests, skipper included) with "Ask about this cruise" (WhatsApp names the cruise) and "Send your dates" (`/book?cruise=<slug>`), scroll filled timeline with the proposal note pinned beside it, five slot gallery, other cruises.
- `/courses` and `/courses/{slug}`: what you practise, dates and format (TODO), gallery, the other course.
- Menu: Home, Cruises, Courses, The boat, Experiences, Book, Questions; detail pages mark their section as current. `/routes` redirects permanently to `/cruises`.
- Booking form: "Cruise" list of all cruises and courses plus "Other or not sure yet".

Open for the owner: spelling of **Vahti** (EN and BG), the **Sporades day mapping** (eight places over six days), fishing **gear and permits**, course **duration, certificate and syllabus**, and the gallery photos below.

Photo slots (drop into `public/media/` with these exact names; until then flat placeholders):
- Cruise `thasos-bays-day-cruise`: `cruise-thasos-bays-day-cruise-1.jpg`, `cruise-thasos-bays-day-cruise-2.jpg`, `cruise-thasos-bays-day-cruise-3.jpg`, `cruise-thasos-bays-day-cruise-4.jpg`, `cruise-thasos-bays-day-cruise-5.jpg`
- Cruise `kavala-day-cruise`: `cruise-kavala-day-cruise-1.jpg`, `cruise-kavala-day-cruise-2.jpg`, `cruise-kavala-day-cruise-3.jpg`, `cruise-kavala-day-cruise-4.jpg`, `cruise-kavala-day-cruise-5.jpg`
- Cruise `thasos-cruise`: `cruise-thasos-cruise-1.jpg`, `cruise-thasos-cruise-2.jpg`, `cruise-thasos-cruise-3.jpg`, `cruise-thasos-cruise-4.jpg`, `cruise-thasos-cruise-5.jpg`
- Cruise `sporades-cruise`: `cruise-sporades-cruise-1.jpg`, `cruise-sporades-cruise-2.jpg`, `cruise-sporades-cruise-3.jpg`, `cruise-sporades-cruise-4.jpg`, `cruise-sporades-cruise-5.jpg`
- Cruise `halkidiki-cruise`: `cruise-halkidiki-cruise-1.jpg`, `cruise-halkidiki-cruise-2.jpg`, `cruise-halkidiki-cruise-3.jpg`, `cruise-halkidiki-cruise-4.jpg`, `cruise-halkidiki-cruise-5.jpg`
- Cruise `tuna-fishing-trip`: `cruise-tuna-fishing-trip-1.jpg`, `cruise-tuna-fishing-trip-2.jpg`, `cruise-tuna-fishing-trip-3.jpg`, `cruise-tuna-fishing-trip-4.jpg`, `cruise-tuna-fishing-trip-5.jpg`
- Course `captain-course`: `course-captain-course-1.jpg`, `course-captain-course-2.jpg`, `course-captain-course-3.jpg`, `course-captain-course-4.jpg`, `course-captain-course-5.jpg`
- Course `yachting-course`: `course-yachting-course-1.jpg`, `course-yachting-course-2.jpg`, `course-yachting-course-3.jpg`, `course-yachting-course-4.jpg`, `course-yachting-course-5.jpg`
- The first photo of each is also its thumbnail in the cruise and course lists.
