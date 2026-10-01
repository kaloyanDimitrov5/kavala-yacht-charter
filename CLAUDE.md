# CLAUDE.md

Read DESIGN.md before any UI work and follow it strictly. Follow the skills in .claude/skills.

## Project notes

- Next.js 14 App Router, TypeScript, Tailwind (default type scale, spacing locked to the DESIGN.md table in `tailwind.config.ts`), Framer Motion, Phosphor icons, Manrope only.
- Copy lives in `src/content/en.ts` and `src/content/bg.ts`. Never hardcode user facing strings in components.
- Unknown facts live in `src/config/site.ts` as `TODO` values. Empty values hide the element. Never invent numbers, names, reviews, prices, distances or durations.
- Media filenames live in `src/config/media.ts`. Drop files into `public/media/`; missing files render flat placeholders.
- WhatsApp number comes from `NEXT_PUBLIC_WHATSAPP_NUMBER` only.
- `npm run build` and `npm run lint` must pass before handing work back.
