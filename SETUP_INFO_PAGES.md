# Info Pages Setup Guide

The Info Pages system allows you to manage legal, privacy, and other static pages through Sanity CMS.

## Available Info Pages

The following pages are configured and can be accessed at `/legal/{slug}`:

1. **Privacy Policy** → `/legal/privacy-policy`
2. **Terms of Service** → `/legal/terms-of-service`
3. **Cookie Policy** → `/legal/cookie-policy`
4. **Accessibility Statement** → `/legal/accessibility`

## Setup Instructions

### Step 1: Get Your Sanity Write Token

1. Go to [sanity.io/manage/users](https://sanity.io/manage/users)
2. Log in with your Sanity account
3. Select your project (6u680gce)
4. Generate a new API token with these permissions:
   - Read documents
   - Write documents
5. Copy the token

### Step 2: Configure Environment Variable

Add the token to your `.env.local` file (or `.env` for development):

```bash
SANITY_WRITE_TOKEN=your_token_here
```

### Step 3: Populate Info Pages

Run the population script:

```bash
npm run populate:info-pages
```

This will:
- Create or update the 4 default info pages in Sanity
- Generate proper PortableText content with headings and paragraphs
- Use the slugs for URL routing

### Step 4: Build and Test

```bash
npm run build
npm run preview
```

Visit the pages at:
- http://localhost:3000/legal/privacy-policy
- http://localhost:3000/legal/terms-of-service
- http://localhost:3000/legal/cookie-policy
- http://localhost:3000/legal/accessibility

## Editing Pages in Sanity

Once populated, you can edit these pages directly in the Sanity Studio:

1. Open your Sanity project studio
2. Navigate to Info Pages collection
3. Edit content as needed
4. Republish the site

## Page Structure

Each info page contains:
- **page**: Display name (e.g., "Privacy Policy")
- **slug**: URL identifier (e.g., "privacy-policy")
- **pubDate**: Last updated date
- **body**: Rich text content (PortableText format)

## Routing

The dynamic route at `/apps/web/src/pages/legal/[...slug].astro`:
- Generates static pages for all info pages
- Uses the slug as the URL path
- Renders content using `LegalLayout` component
- Falls back to 404 if page not found

## Customization

To add more info pages:

1. Add new entries to `infoPagesToCreate` array in `scripts/populate-info-pages.ts`
2. Run `npm run populate:info-pages` to create them
3. They'll automatically appear in the routing and be accessible at `/legal/{slug}`

## Troubleshooting

### Script fails with "SANITY_WRITE_TOKEN not set"
- Ensure you've added the token to `.env` or `.env.local`
- Restart your development server after adding the variable

### Pages not showing after build
- Clear the build cache: `rm -rf dist`
- Rebuild: `npm run build`
- Ensure pages exist in Sanity CMS

### Changes in Sanity not showing
- Rebuild the site: `npm run build`
- The site is statically generated at build time
