# Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Changes Committed
- Sprint 3 features implemented and committed
- All changes tracked in git history
- .env files excluded from commits via .gitignore

### ✅ Environment Variables Required

Ensure these are set in your hosting platform (NOT in .env file):

**Sanity CMS:**
- `PUBLIC_SANITY_PROJECT_ID=6u680gce`
- `PUBLIC_SANITY_DATASET=production`
- `SANITY_READ_TOKEN=` (for public content fetching)

**R2 CDN:**
- `PUBLIC_R2_CDN_URL=https://images.madavi.co`

**Google Analytics:**
- `PUBLIC_GA4_ID=G-MWD6444FBQ`

**Sanity Management (only needed for populate scripts):**
- `SANITY_WRITE_TOKEN=` (keep secure, only for development/scripts)

---

## Deployment Steps

### 1. Deploy Sanity CMS

Sanity is managed via their cloud platform. No deployment needed from your end for content changes.

**To publish changes:**
```bash
npm run populate:info-pages  # Updates info pages in Sanity
```

### 2. Build Astro Static Site

```bash
cd apps/web
npm run build
```

This will:
- Cache WordPress posts locally
- Generate static HTML for all pages
- Output to `dist/` folder
- Include blog category pages and legal pages

**Build Output Structure:**
```
dist/
├── /blog/cat/{category-slug}/index.html
├── /legal/{page-slug}/index.html
├── /api/analytics/ (JSON endpoints)
├── /api/posts.json
└── [other static pages]
```

### 3. Deploy to Production

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
```

**Option B: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=apps/web/dist
```

**Option C: Traditional Hosting (AWS S3 + CloudFront, Azure Static Web Apps, etc.)**
```bash
# Upload dist/ folder to your hosting
# Ensure all routes redirect to index.html for SPA-like behavior
```

### 4. Verify Deployment

After deployment, verify these endpoints work:

**Blog Category Pages:**
- `/blog/cat/growth-marketing`
- `/blog/cat/healthcare`
- `/blog/cat/legal`

**Legal Pages:**
- `/legal/privacy-policy`
- `/legal/terms-of-service`
- `/legal/cookie-policy`
- `/legal/accessibility`

**Analytics API:**
- `/api/analytics/llm-visit.json` (POST)
- `/api/analytics/llm-event.json` (POST)

---

## Post-Deployment

### 1. Update DNS (if needed)
Point your domain to the deployment platform

### 2. Set Up CDN for Images
R2 CDN URL is already configured:
- Domain: `https://images.madavi.co`
- All images optimized automatically

### 3. Monitor Analytics
- Google Analytics 4 tracking active
- LLM analytics endpoints ready
- Check GA4 dashboard for traffic

### 4. Content Updates

**To update blog posts:**
1. Add/edit posts in WordPress CMS
2. Rebuild site: `npm run build`
3. Redeploy

**To update legal pages:**
1. Edit in Sanity Studio
2. Run: `npm run populate:info-pages` (if adding new pages)
3. Rebuild: `npm run build`
4. Redeploy

---

## Environment Variables by Platform

### Vercel
- Add variables in Project Settings → Environment Variables
- Use "Automatically expose to preview deployments" for non-secret vars

### Netlify
- Add variables in Site Settings → Build & Deploy → Environment
- Mark as "Sensitive" for secrets (SANITY_WRITE_TOKEN, tokens)

### GitHub Actions (if using)
- Add secrets in Repository Settings → Secrets and variables
- Reference as `${{ secrets.VARIABLE_NAME }}`

---

## Troubleshooting Deployments

**Build fails with module errors:**
- Clear cache: `rm -rf .astro dist`
- Rebuild: `npm run build`

**Pages not found (404):**
- Ensure static routes are generated during build
- Check `dist/` has the correct HTML files

**Images not loading:**
- Verify R2 CDN URL in environment variables
- Check CloudFlare configuration for domain

**Analytics not tracking:**
- Verify `PUBLIC_GA4_ID` environment variable
- Check GA4 property ID in console
- Ensure script tags are loaded

---

## Rollback Procedure

If deployment has issues:

```bash
# Rollback to previous build
git revert HEAD
npm run build
# Redeploy
```

Or use your hosting platform's deployment history to restore previous version.

---

## Security Notes

⚠️ **Never commit .env files**
- ✅ .env is in .gitignore
- ✅ Set variables in hosting platform only
- ✅ Rotate SANITY_WRITE_TOKEN regularly

**Secrets to protect:**
- `SANITY_WRITE_TOKEN` - Only needed for development
- Database credentials (if added later)
- API keys (now just GA4, which is public)

---

## Performance Optimization

Deployed site includes:

- ✅ Static HTML generation (fast)
- ✅ Image optimization (WebP, R2 CDN)
- ✅ Responsive image srcsets
- ✅ Lazy loading images
- ✅ Minified CSS/JS
- ✅ Sitemap generation

Monitor Core Web Vitals in:
- Google PageSpeed Insights
- Google Search Console
- Vercel Analytics (if using)

