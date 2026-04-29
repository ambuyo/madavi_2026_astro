# AGENTS.md — Mulberry (Lexington Themes)

**Mulberry** is a Lexington Themes Astro starter oriented toward **professional-services and accounting-firm marketing**: a homepage with services, industries, case studies, testimonials, and blog previews, plus dedicated routes for pricing, FAQ, contact, locations, team pages, and legal/info content. Source: [Lexington Themes](https://lexingtonthemes.com/); this repo’s specs are linked from the root `README.md`.

---

## Tech stack (from manifests only)

**Root** (`package.json`): pnpm workspace scripts (`dev`, `dev:web`, `dev:studio`, `build`, `build:web`, `build:studio`, `clean`, `seed:all`); deps `@sanity/client`, `dotenv`, `gray-matter`; devDep `tsx`. Migration: `scripts/migrate-to-sanity.ts` (invoked via `pnpm run seed:all` or `npx tsx`).

**`apps/web`** (`package.json`, `astro.config.mjs`): Astro **^6.0.0**; **Tailwind CSS ^4.x** via **`@tailwindcss/vite`**; `@astrojs/sitemap` integration; **`@astrojs/rss`**; **`@lexingtonthemes/seo`**; **`@sanity/client`**, **`@sanity/image-url`**; **`groq`**; **`@portabletext/to-html`**, `@portabletext/types`; **`reading-time`**; **`sharp`**; Tailwind plugins `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwind-scrollbar-hide`. **No `@astrojs/mdx`** in this package — MDX is not present in this repo.

**`astro.config.mjs`**: `site: "https://yourwebsite.com"`; `integrations: [sitemap()]`; `vite.plugins: [tailwindcss()]`; `markdown.drafts: true`; **Shiki** theme `css-variables`; top-level **`experimental.svgo: true`**; duplicate `shikiConfig` block (wrap, skipInline, drafts). **MDX integration is not configured.**

**`apps/studio`**: **`sanity` ^5.16.0**; **`@sanity/vision`**; **`@sanity/icons`**; **React 19** + **styled-components**; TypeScript. **`sanity.config.ts`**: `structureTool` with custom `structure` (`apps/studio/structure.ts`), `visionTool` only — no other plugins in this file.

---

## Monorepo / folder map

| Area | Path |
|------|------|
| Site pages | `apps/web/src/pages/` |
| Layouts | `apps/web/src/layouts/` |
| Components | `apps/web/src/components/` (includes **`components/fundations/`** — keep this spelling) |
| Content (markdown) | `apps/web/src/content/` |
| Global styles | `apps/web/src/styles/` (`global.css`) |
| Unified data API | `apps/web/src/lib/data.ts` |
| Sanity integration | `apps/web/src/lib/sanity/` — `client.ts`, `fetch.ts`, `queries.ts`, `transforms.ts`, `types.ts`, `image.ts`, `portableText.ts`, `index.ts` |
| Static assets | `apps/web/public/` |
| Studio schemas | `apps/studio/schemas/` |
| Migrations / seed | `scripts/migrate-to-sanity.ts` |

Workspace: `pnpm-workspace.yaml` lists `apps/*` and `packages/*` (`packages/` may be empty in a minimal checkout).

---

## Dual content model

### A) Astro Content Collections — `apps/web/src/content.config.ts`

Loaders: **`glob`** from **`astro/loaders`** per collection; schemas use **`z` from `astro/zod`** and Astro’s **`image()`** helper for **local image metadata** (`image.url` points at files under `apps/web/src/`, commonly `/src/images/...` in sample markdown).

| Collection key | Folder (base) | Required / notable frontmatter | Images |
|----------------|---------------|--------------------------------|--------|
| `team` | `./src/content/team` | **Required:** `name`, `image.url`, `image.alt`. Optional: `role`, `bio`, `socials.*` | `{ url: image(), alt }` |
| `posts` | `./src/content/posts` | **Required:** `title`, `pubDate`, `description`, `team`, `image`, `tags` | `{ url: image(), alt }` |
| `infopages` | `./src/content/infopages` | **Required:** `page`, `pubDate` | No image field |
| `services` | `./src/content/services` | **Required:** `title`, `summary`, `category` (**enum:** `Advisory` \| `Compliance` \| `Operations`). Optional: `features`, `outcomes`, `industries`, `pricing`, `image`, dates | Optional `image` |
| `industries` | `./src/content/industries` | **Required:** `title`, `summary`. Optional: `painPoints`, `relevantServices`, `image` | Optional `image` |
| `caseStudies` | `./src/content/caseStudies` | **Required:** `title`, `client`, `industry`, `services`, `challenge`, `solution`, `results[]`, `pubDate`. Optional: `testimonial`, `image` | Optional `image` |

**Copy-this-entry examples (real files):**

- Posts: `apps/web/src/content/posts/1.md`
- Team: `apps/web/src/content/team/david-lee.md`
- Services: `apps/web/src/content/services/bookkeeping-accounting.md`
- Industries: `apps/web/src/content/industries/technology-software.md`
- Case studies: `apps/web/src/content/caseStudies/tech-startup-growth.md`
- Info pages: `apps/web/src/content/infopages/terms.md`

### B) Sanity CMS — `apps/studio/schemas/`

Document types (registered in `apps/studio/schemas/index.ts`; Studio navigation in `apps/studio/structure.ts`):

| Sanity `_type` | Aligns with collection |
|----------------|-------------------------|
| `post` | `posts` — title, slug, description, pubDate, image+alt, tags, **reference** `team` → `teamMember`, portable `body` |
| `teamMember` | `team` — name, slug, role, bio, image+alt, socials, optional `body` |
| `service` | `services` — title, slug, summary, category (Advisory/Compliance/Operations), features, outcomes, industries, pricing object, optional image, dates, portable `body` |
| `industry` | `industries` — title, slug, summary, painPoints, relevantServices, image, portable `body` |
| `caseStudy` | `caseStudies` — title, slug, client, industry, services, challenge, solution, results, testimonial, image, pubDate, portable `body` |
| `infoPage` | `infopages` — page title, slug, pubDate, portable `body` |
| `siteSettings` | **Singleton** (fixed id in structure) — site title, description, siteUrl, OG image, twitter, **navigation**, **footer**, **socials** — not exposed via `data.ts` helpers |

**Unified consumption on the site:** `apps/web/src/lib/data.ts` exports **`USE_SANITY`** and getters (`getPosts`, `getPostBySlug`, `getTeamMembers`, …). When `USE_SANITY` is true, it lazy-loads `./sanity/fetch`, `./sanity/queries`, `./sanity/transforms` and returns normalized shapes aligned with `apps/web/src/lib/sanity/types.ts`. Portable Text and image URL helpers: `apps/web/src/lib/sanity/portableText.ts`, `apps/web/src/lib/sanity/image.ts`.

**Note:** `apps/web/src/components/fundations/head/Seo.astro` imports **`sanityFetch`** and **`siteSettingsQuery`** from `@/lib/sanity` for default SEO — this is **separate** from `USE_SANITY` in `data.ts`. Plan for valid **`SANITY_PROJECT_ID`** (and related env) at build time unless you change that component.

### Toggle & env

- **Content source toggle:** `export const USE_SANITY` in **`apps/web/src/lib/data.ts`** (not an `.env` variable in this repo). README describes setting it to `true` for Sanity.
- **`apps/web/.env`** (from `.env.example`): `SANITY_PROJECT_ID`, `SANITY_DATASET` (default `production`), `SANITY_API_VERSION` (`2024-01-01`), optional `SANITY_READ_TOKEN` (draft/preview; also referenced in `client.ts`).
- **`apps/studio/.env`:** `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`.

**Collections-only (intent per README):** page **content lists/detail** can avoid Sanity when `USE_SANITY` is false. **Sanity mode:** Studio + web env as above.

### Seeding / migration

- **`pnpm run seed:all`** (`SEED_ALL=1` → `tsx scripts/migrate-to-sanity.ts`): per script header, **clears** existing docs per content type, then seeds **one document per type** from markdown under `apps/web/src/content/`, uploading images from `apps/web/src/images` as needed.
- **Migrate only:** `SANITY_TOKEN=... npx tsx scripts/migrate-to-sanity.ts` from `scripts/` (or repo root with path as in README) — uploads without the full delete/seed behavior.
- **Requires:** `SANITY_PROJECT_ID` in **`apps/web/.env`**; **`SANITY_TOKEN`** with Editor permissions (per README). Client API version in script: `2024-01-01`.

---

## Routing (from `apps/web/src/pages/`)

| URL pattern | Source file(s) |
|-------------|----------------|
| `/` | `index.astro` |
| `/about` | `about.astro` |
| `/blog` | `blog/index.astro` |
| `/blog/posts/[slug]` | `blog/posts/[...slug].astro` (**rest param**; cards link to `/blog/posts/` + slug) |
| `/blog/tags`, `/blog/tags/[tag]` | `blog/tags/index.astro`, `blog/tags/[tag].astro` |
| `/team`, `/team/[...]` | `team/index.astro`, `team/[...slug].astro` |
| `/services`, `/services/[...]` | `services/index.astro`, `services/[...slug].astro` |
| `/industries`, `/industries/[...]` | `industries/index.astro`, `industries/[...slug].astro` |
| `/case-studies`, `/case-studies/[...]` | `case-studies/index.astro`, `case-studies/[...slug].astro` |
| `/legal/[...]` | `legal/[...slug].astro` |
| `/contact`, `/pricing`, `/faq`, `/testimonials`, `/locations` | matching `*.astro` |
| `/rss.xml` | `rss.xml.js` |
| `/system/colors`, `/system/typography`, `/system/overview`, `/system/link`, `/system/buttons` | `system/*.astro` |
| `/404` | `404.astro` |

**Not present** in this repo’s `pages/`: changelog, customers, integrations, help center, or dynamic **`[...slug]`** catch-alls outside the paths above.

---

## Customization (real files)

- **Canonical site URL:** `apps/web/astro.config.mjs` → `site`; overrides/default merging in **`apps/web/src/components/fundations/head/Seo.astro`** via Sanity `siteUrl` / fallbacks.
- **Brand tokens:** `apps/web/src/styles/global.css` — `@theme` fonts (Lora, Inter), accent/base palettes, Tailwind plugins.
- **Head / SEO assembly:** `apps/web/src/components/fundations/head/BaseHead.astro` (composes `Seo`, `Meta`, `Fonts`, `Favicons`, `FuseJS`).
- **Nav / footer:** `apps/web/src/components/global/Navigation.astro`, `Footer.astro`.
- **Layouts:** `apps/web/src/layouts/BaseLayout.astro`, `BlogLayout.astro`, `TeamLayout.astro`, `ServicesLayout.astro`, `IndustriesLayout.astro`, `CaseStudiesLayout.astro`, `LegalLayout.astro`.

---

## Commands

Prefer **`pnpm`** from repo root: `pnpm install`; **`pnpm dev:web`** for site-only (often day-to-day); **`pnpm dev:studio`** for CMS; **`pnpm dev`** runs all packages’ `dev` in parallel; **`pnpm build:web`** / **`pnpm build:studio`**; **`pnpm clean`**. Seed: **`pnpm run seed:all`** with `SANITY_TOKEN`.

---

## Guardrails

- Do **not** rename **`fundations`** — paths and imports depend on it.
- Do **not** widen Zod collection schemas or Sanity fields without updating **`data.ts`**, **`transforms.ts`**, **`queries.ts`**, **`types.ts`**, affected pages, and migration script mappings.
- Keep **markdown shape** and **Sanity normalized shape** in sync whenever you change the unified layer.
- Prefer **minimal diffs** consistent with existing patterns.

---

## Support / docs

Match the root **`README.md`** link pattern: [Documentation](https://lexingtonthemes.com/documentation), [Support](https://lexingtonthemes.com/legal/support/), theme [specs](https://lexingtonthemes.com/templates/mulberry). README also links [Sanity Documentation](https://www.sanity.io/docs) and project management at `sanity.io/manage` for env setup and API tokens.
