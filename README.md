# Mulberry

![Theme preview](https://lexingtonthemes.com/OpenGraph/mulberry/twitter.png)

## Links

- **Theme specs:** https://lexingtonthemes.com/templates/mulberry
- **Documentation:** https://lexingtonthemes.com/documentation
- **Changelog:** https://lexingtonthemes.com/changelog/mulberry
- **Support:** https://lexingtonthemes.com/legal/support/
- **Get the bundle:** https://lexingtonthemes.com

---

## Two Ways to Use This Theme

This theme supports **two data sources** — choose what works best for you:

### Option A: Content Collections (No CMS Required)

Use markdown files in `apps/web/src/content/`. Perfect for:

- Quick setup with no external services
- Git-based content workflow
- Developers comfortable editing markdown

### Option B: Sanity CMS (Recommended for Clients)

Use Sanity Studio for a visual editing experience. Perfect for:

- Non-technical content editors
- Teams collaborating on content
- Dynamic content updates without code changes

**By default, the theme uses Content Collections.** Follow the instructions below to switch to Sanity.

---

## Quick Start (Content Collections)

If you just want to get started without Sanity:

```bash
# Install dependencies
pnpm install

# Start the website
pnpm dev:web
```

Open http://localhost:4321 — your site is ready with sample content!

Edit content in `apps/web/src/content/`:

- `posts/` — Blog posts
- `team/` — Team member profiles
- `services/` — Service offerings
- `industries/` — Industry pages
- `caseStudies/` — Case study pages
- `infopages/` — Legal/info pages (privacy, terms, etc.)

---

## Getting Started with Sanity

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org)
- **pnpm** — Install with `npm install -g pnpm`
- **Sanity account** — Free at [sanity.io](https://sanity.io)

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Create Your Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Sign up or log in
3. Click **"Create project"**
4. Give it a name (e.g., "My Website")
5. Choose the **Free** plan
6. **Create a dataset** named `production`
7. Copy your **Project ID** (you'll need this next)

### Step 3: Set Up Environment Variables

**For the website** — Create `apps/web/.env`:

```bash
cp apps/web/.env.example apps/web/.env
```

Open `apps/web/.env` and add your Project ID:

```env
SANITY_PROJECT_ID=your-project-id-here
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

**For the CMS** — Create `apps/studio/.env`:

```bash
cp apps/studio/.env.example apps/studio/.env
```

Open `apps/studio/.env` and add the same Project ID:

```env
SANITY_STUDIO_PROJECT_ID=your-project-id-here
SANITY_STUDIO_DATASET=production
```

### Step 4: Enable Sanity Mode

Open `apps/web/src/lib/data.ts` and change:

```typescript
export const USE_SANITY = true;
```

### Step 5: Migrate Your Content (Optional)

Want to use the existing sample content? Run the migration script:

1. Get a Sanity API token:
   - Go to [sanity.io/manage](https://sanity.io/manage) → Your Project → API
   - Click **"Add API token"**
   - Name it "Migration" with **Editor** permissions
   - Copy the token

2. Run the migration:

**Full seed (recommended)** — Clears existing documents of each content type, then creates **one document per type** from `apps/web/src/content/`. Use this to get a clean Studio with exactly one post, one team member, one service, etc.:

```bash
SANITY_TOKEN=your-token-here pnpm run seed:all
```

**Migrate only** (no delete) — Uploads all content from `apps/web/src/content/` without deleting anything:

```bash
cd scripts
SANITY_TOKEN=your-token-here npx tsx migrate-to-sanity.ts
```

The script reads `SANITY_PROJECT_ID` from `apps/web/.env`. Running `pnpm run seed:all` gives one document per collection in Studio.

### Step 6: Start Development

```bash
pnpm dev
```

This starts:

- **Website** → http://localhost:4321
- **Sanity Studio (CMS)** → http://localhost:3333

### Step 7: Add Content in Studio

1. Go to http://localhost:3333
2. Create or edit content (posts, team members, etc.)
3. Click **Publish** so updates show up on http://localhost:4321

---

## Switching Between Data Sources

The `USE_SANITY` flag in `apps/web/src/lib/data.ts` controls the data source:

```typescript
// Use Sanity CMS
export const USE_SANITY = true;

// Use Content Collections (markdown files)
export const USE_SANITY = false;
```

Both options use the same components and layouts — just different data sources.

---

## Project Structure

```
/
├── apps/
│   ├── web/              # Your Astro website
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── lib/sanity/  # Sanity integration
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   └── .env.example
│   │
│   └── studio/           # Sanity CMS
│       ├── schemas/      # Content models
│       └── .env.example
│
├── scripts/              # Utility scripts (migrations, cleanup)
├── pnpm-workspace.yaml
└── package.json
```

---

## Content Types

### Blog Posts

- Title, slug, description
- Cover image with alt text
- Publish date and team member (author)
- Tags for categorization
- Rich text body content

### Team Members

- Name, role, bio
- Profile image
- Social media links (Twitter, LinkedIn, Website, Email)

### Services

- Title, slug, summary
- Category (consulting, implementation, support, training)
- Features and outcomes lists
- Related industries
- Pricing information (tier, amount, period, features)
- Cover image
- Rich text body content

### Industries

- Title, slug, summary
- Pain points list
- Relevant services references
- Cover image
- Rich text body content

### Case Studies

- Title, slug, client name
- Industry and services used
- Challenge and solution text
- Results with metrics (label + value pairs)
- Client testimonial (quote, author, role)
- Cover image
- Rich text body content

### Info Pages (Legal)

- Page title (Privacy, Terms, etc.)
- Slug and publish date
- Rich text content

### Site Settings

- Site title and description
- Navigation links
- Footer content
- Social media links

---

## Website Routes

| URL                    | Page                 |
| ---------------------- | -------------------- |
| `/`                    | Homepage             |
| `/about`               | About page           |
| `/blog`                | Blog listing         |
| `/blog/[slug]`         | Blog post            |
| `/blog/tags`           | All tags             |
| `/blog/tags/[tag]`     | Posts by tag         |
| `/team`                | Team listing         |
| `/team/[slug]`         | Team member profile  |
| `/services`            | Services listing     |
| `/services/[slug]`     | Service details      |
| `/industries`          | Industries listing   |
| `/industries/[slug]`   | Industry details     |
| `/case-studies`        | Case studies listing |
| `/case-studies/[slug]` | Case study details   |
| `/contact`             | Contact page         |
| `/pricing`             | Pricing page         |
| `/faq`                 | FAQ page             |
| `/testimonials`        | Testimonials page    |
| `/locations`           | Locations page       |
| `/legal/[slug]`        | Legal pages          |
| `/rss.xml`             | RSS feed             |

---

## Deployment

### Deploy the Website

**Vercel (recommended):**

```bash
cd apps/web
npx vercel
```

**Netlify:**

```bash
cd apps/web
npx netlify deploy --prod
```

Add these environment variables in your hosting dashboard:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`

### Deploy the CMS

Deploy to Sanity's free hosting:

```bash
cd apps/studio
pnpm deploy
```

You'll get a URL like `https://your-project.sanity.studio`

---

## Customization

### Styling

Edit `apps/web/src/styles/global.css` for global styles. This theme uses Tailwind CSS v4.

### Adding New Content Types

1. Create schema in `apps/studio/schemas/`
2. Register in `apps/studio/schemas/index.ts`
3. Add to `apps/studio/structure.ts`
4. Create query in `apps/web/src/lib/sanity/queries.ts`
5. Add types in `apps/web/src/lib/sanity/types.ts`

---

## Troubleshooting

### "Cannot find module" errors?

Run `pnpm install` in the project root to reinstall dependencies.

### Content not showing?

- Make sure you clicked **"Publish"** in Sanity Studio
- Check that your Project ID is correct in both `.env` files
- Verify your dataset name matches (default: `production`)

### "Failed to fetch" error?

- Your Project ID might be wrong
- Go to [sanity.io/manage](https://sanity.io/manage) and verify the ID

### Images not loading?

- Images must be uploaded directly to Sanity
- Check that your image fields have the required `asset` data

### CORS errors?

- Go to [sanity.io/manage](https://sanity.io/manage) → Your Project → API → CORS Origins
- Add `http://localhost:4321` for development
- Add your production URL for deployment

---

## Useful Commands

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `pnpm install`    | Install all dependencies                       |
| `pnpm dev`        | Start website + CMS                            |
| `pnpm dev:web`    | Start website only                             |
| `pnpm dev:studio` | Start CMS only                                 |
| `pnpm build`      | Build both for production                      |
| `pnpm clean`      | Remove node_modules/.env/dist before packaging |

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lexington Themes](https://lexingtonthemes.com)

---

## License

MIT — Use freely for personal and commercial projects.
# madavi_2026_astro
