# OLIO — product/ecommerce use case (clone of drinkstill.nz)

1:1 UX/layout clone of [drinkstill.nz](https://www.drinkstill.nz/) re-branded for OLIO, a Greek extra virgin olive oil.
Reference palette `ink` (black) → OLIO olive `#8D906E` and darker shades.

**Live:** https://olio-still-clone.vercel.app · **Repo:** https://github.com/mqrijqm/olio-still-clone

## Languages
Bosnian (`bs`) is the primary language, English (`en`) via the BS / EN toggle (hero top-right, nav, mobile menu).
The choice is stored in `localStorage` (`olio-lang`).
- `src/content/site.ts` — English content + `en` dictionary (the shape is the source of truth)
- `src/content/bs.ts` — Bosnian dictionary of the same `Dict` type (TypeScript fails if a string is missing)
- `src/i18n/LocaleProvider.tsx` — `useT()`, `useLocale()`, `<LangToggle />`

## Stack
Next.js 16 (App Router) · Tailwind 4 · GSAP + ScrollTrigger + SplitText · Lenis · three.js via React Three Fiber.

## Sections (same order and scroll lengths as the reference)
| Section | File | Behaviour |
|---|---|---|
| Hero | `sections/Hero.tsx` | letter intro → circle mask with 3D tin → circle grows to full dark screen (pin +120%) |
| Harvests | `sections/Flavors.tsx` | pinned +300%, 3 products swap by scroll, 3D tin spins + swaps labels |
| Inside | `sections/Inside.tsx` | pinned +400%, 4 tabs, tin rotates with scroll, counter + level bar |
| Story | `sections/Story.tsx` | intro + pinned chapters with outline years, image reveal, timeline |
| Details | `sections/Details.tsx` | close-up gallery with parallax (not in reference) |
| Press | `sections/Press.tsx` | quotes + double marquee |
| Stockists / Shop | `sections/Shop.tsx` | city lists, coming soon, product cards (size toggle, hover → lifestyle photo) |
| Footer | `sections/Footer.tsx` | newsletter + links |

Global: `Nav` (appears after hero, mobile menu), `Cursor` (difference-blend ring), grain overlay, cart drawer + demo checkout.

## Re-using for a new brand
1. Replace copy in `src/content/site.ts` and `src/content/bs.ts`.
2. Replace colour tokens in `src/app/globals.css` (`@theme`).
3. Regenerate media (below) and drop them into `public/`.
4. 3D tin: `src/components/webgl/Tin.tsx` — box proportions `W/H/D`, label textures come from `products[].labels`.

## Media pipeline (Codex, gpt-6-sol — never Astra)
Lives in `../_gen`:
- `style.txt` — brand art direction, `bX.txt` — one image per line `filename | ratio | subject`
- `./run.sh b1.txt` — generates via `codex exec` (brand tin photos attached with `-i`)
- `./collect.sh log-b1.txt.log` — copies images to `out/` using the `MAP` lines Codex prints
- Ink illustrations → SVG: `magick … -threshold` → `potrace -s` (see `_gen/svg`)
- Icons: `icons-prompt.txt` → Codex writes SVG → `src/components/Icon.tsx`

## Dev
```
pnpm dev
pnpm build
```
