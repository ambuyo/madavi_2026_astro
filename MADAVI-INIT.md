# Madavi Project Initialization — Setup Guide

## ✅ Project Initialized

Your Madavi project has been set up with the following configuration:

### Project Details
- **Name:** Madavi
- **Tagline:** AI Advisory for Enterprises
- **Description:** Human-centric AI advisory firm helping African enterprise leaders adopt AI
- **Framework:** HCAIF (proprietary framework)
- **Site URL:** https://madavi.ai
- **Page Structure:** `<page name> | Madavi`

---

## 🔧 Next Steps

### 1. Sanity CMS Site Settings

Go to your Sanity Studio and create/update the **Site Settings** document:

```
URL: http://localhost:3333
```

**Fill in:**

| Field | Value |
|-------|-------|
| **Site Title** | Madavi |
| **Site Description** | Madavi is a human-centric AI advisory firm that helps African enterprise leaders adopt AI by addressing organizational readiness before technology deployment — using the proprietary HCAIF framework to tell executives what they need to hear, not what they want to hear. |
| **Site URL** | https://madavi.ai |
| **Default OG Image** | Upload your logo/brand image (1200x630 recommended) |
| **Twitter Handle** | @madaviai (or your handle) |
| **Navigation Links** | Configure main navigation menu |
| **Footer Settings** | Add footer text and links |

### 2. Favicon Setup

Your favicon configuration is ready in `apps/web/src/components/fundations/head/Favicons.astro`.

The following files are expected in `apps/web/public/`:
- `favicon.ico` — Main favicon
- `icon.svg` — SVG favicon
- `apple-touch-icon.png` — iOS/macOS (180x180)
- `favicon-16x16.png` — 16x16 version
- `favicon-32x32.png` — 32x32 version
- `favicon-48x48.png` — 48x48 version
- `manifest.webmanifest` — PWA manifest

**To add your favicon:**
1. Generate favicon from your Madavi logo: [favicon.io](https://favicon.io) or similar
2. Place all favicon files in `apps/web/public/`
3. Restart dev server

### 3. Site-Wide Pages

Create these essential pages in Sanity or as Markdown:

- **Contact** — `apps/web/src/pages/contact.astro`
- **About** — `apps/web/src/pages/about.astro`
- **Blog/Resources** — `apps/web/src/pages/blog/`
- **Services** — Already templated with 10-section structure
- **Case Studies** — `apps/web/src/pages/case-studies/`

### 4. Brand Colors & Typography

Update brand tokens in `apps/web/src/styles/global.css`:

```css
@theme {
  --font-display: "Lora", serif;        /* Headlines */
  --font-body: "Inter", sans-serif;     /* Body text */
  --color-accent: #your-brand-color;   /* Primary action color */
  --color-base: #your-neutral-color;   /* Base text/elements */
}
```

### 5. Update Environment Variables

If you haven't already, update `apps/web/.env`:

```env
SANITY_PROJECT_ID=6u680gce
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

---

## 📋 Page Title Structure

All pages automatically use the format: **`<page name> | Madavi`**

Examples:
- Service page: "Strategic AI Transformation | Madavi"
- Blog post: "5 Mistakes in AI Adoption | Madavi"
- Contact: "Get in Touch | Madavi"

This is configured in `apps/web/src/components/fundations/head/Seo.astro`

---

## 🚀 Start Building

### Start Development Servers

```bash
# From project root
pnpm dev

# Or separately:
pnpm dev:web      # Astro web app (http://localhost:3000)
pnpm dev:studio    # Sanity Studio (http://localhost:3333)
```

### Create Your First Service

1. Open Sanity Studio: http://localhost:3333
2. Navigate to **Services**
3. Click **Create** → **Service**
4. Use the 10-section template to fill in:
   - Hero section (tagline + CTA)
   - Problem/Context (challenges you solve)
   - How It Works (process + timeline)
   - What You Get (deliverables)
   - Frameworks (methodologies)
   - Case Study (real example)
   - Pricing & Investment (costs + terms)
   - Who This Is For (ideal client)
   - FAQ (objections)
   - Conversion (final CTA)
5. Publish
6. Your service page appears at `/services/<slug>`

---

## 📝 Content Structure

### Services (10-Section Template)
✅ Already configured and ready to use. See [SERVICE-TEMPLATE-GUIDE.md](./SERVICE-TEMPLATE-GUIDE.md)

### Blog Posts
- Markdown in `apps/web/src/content/posts/`
- Or Sanity CMS documents (fetches from WordPress REST API)

### Team Members
- Markdown in `apps/web/src/content/team/`
- Or Sanity CMS documents

### Case Studies
- Markdown in `apps/web/src/content/caseStudies/`
- Or Sanity CMS documents

### Industries
- Markdown in `apps/web/src/content/industries/`
- Or Sanity CMS documents

---

## 🔗 Git Setup

Your repository is initialized and pushed to GitHub:

```bash
# Repository
https://github.com/ambuyo/madavi_2026_astro.git

# Initial commit: 6248d87
# Branch: main
```

**Next commits:**
```bash
git add .
git commit -m "Add Madavi branding and site configuration"
git push origin main
```

---

## 📚 Documentation

- [10-Section Service Template Guide](./SERVICE-TEMPLATE-GUIDE.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Implementation Summary](./IMPLEMENTATION-SUMMARY.md)
- [Project Architecture](./AGENTS.md)

---

## ✨ What's Ready to Use

✅ **Astro Framework** — Fast, static-first web framework  
✅ **Sanity CMS** — Headless CMS for content management  
✅ **10-Section Service Template** — Conversion-optimized service pages  
✅ **Dual Content Model** — Markdown or Sanity CMS  
✅ **Tailwind CSS** — Utility-first styling  
✅ **TypeScript** — Type-safe development  
✅ **SEO Ready** — Automatic sitemaps, RSS, meta tags  
✅ **Responsive Design** — Mobile-first components  

---

## 🎯 Your Madavi Journey Starts Here

You now have a professional, conversion-optimized platform ready to showcase Madavi's AI advisory services. The 10-section service template is specifically designed to guide prospects through your complete value proposition.

**Start by creating your flagship service page using the template, then build from there.**

Questions? Check the docs or dive into the code. You're all set! 🚀
