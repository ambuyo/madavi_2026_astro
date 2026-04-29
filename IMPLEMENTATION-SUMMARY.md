# 10-Section Service Template — Implementation Summary

## Overview

The Mulberry service structure has been completely redesigned to support a comprehensive 10-section template for professional service pages. This template supports the complete customer journey from awareness through conversion.

---

## What Was Changed

### 1. **Sanity CMS Schema** (`apps/studio/schemas/service.ts`)

Expanded from ~15 fields to a full 10-section structure with:
- **Core metadata** (title, slug, category, featured, image, dates)
- **10 strategic sections**, each containing multiple fields:
  1. Hero (subtitle, description, CTAs)
  2. Problem/Context (pain points)
  3. How It Works (process steps with timeline)
  4. What You Get (deliverables)
  5. Framework Deep Dive (methodologies and benefits)
  6. Case Study (featured reference or inline case data)
  7. Pricing & Investment (pricing details and inclusions/exclusions)
  8. Who This Is For (ideal client profile and fit criteria)
  9. FAQ (Q&A items)
  10. Conversion (final CTA with trust signals)
- **Legacy fields** (hidden) for backward compatibility
- **Rich body content** support

### 2. **TypeScript Types** (`apps/web/src/lib/sanity/types.ts`)

Added comprehensive type definitions:
- `SanityService` interface with all 10 sections
- `Service` (UI-friendly) interface
- Helper types: `CTA`, `ProcessStep`, `Deliverable`, `Framework`, `InlineCaseStudy`, `FAQItem`
- Full TypeScript support for IDE autocomplete and type safety

### 3. **GROQ Queries** (`apps/web/src/lib/sanity/queries.ts`)

Enhanced queries to fetch all 10 sections:
- `allServicesQuery` — List all services
- `serviceBySlugQuery` — Get single service with all content
- `servicesByCategoryQuery` — Filter by category
- `featuredServicesQuery` — Get featured services only (new)

### 4. **Transform Functions** (`apps/web/src/lib/sanity/transforms.ts`)

Updated `transformService()` to:
- Map Sanity data to UI-friendly shapes
- Handle all 10 sections with proper fallbacks
- Maintain backward compatibility with legacy fields
- Convert dates and image URLs properly

### 5. **Astro Content Collection** (`apps/web/src/content.config.ts`)

Extended markdown schema for services with:
- All 10 sections in Zod schema
- Nested object definitions for complex structures
- Legacy field support
- Full IDE autocomplete for markdown frontmatter

---

## Files Created

### Documentation

1. **SERVICE-TEMPLATE-GUIDE.md** (root)
   - Comprehensive 10-section reference
   - Schema documentation with examples
   - Implementation tips and best practices
   - Query examples for developers
   - Component guidance

2. **apps/web/src/content/services/strategic-transformation-example.md**
   - Full working example of a service page
   - Shows all 10 sections filled out
   - Copy-and-paste template for creating new services
   - Real-world content examples

---

## 10-Section Structure

```
SERVICE PAGE
├── Section 1: HERO
│   ├── Subtitle
│   ├── Description
│   ├── Primary CTA
│   └── Secondary CTA (optional)
│
├── Section 2: PROBLEM/CONTEXT
│   ├── Title
│   ├── Description
│   └── Pain Points (array)
│
├── Section 3: HOW IT WORKS
│   ├── Title
│   ├── Description
│   ├── Process Steps (array with duration)
│   └── Total Timeline
│
├── Section 4: WHAT YOU GET
│   ├── Title
│   ├── Description
│   └── Deliverables (array)
│
├── Section 5: FRAMEWORK DEEP DIVE
│   ├── Title
│   ├── Description
│   └── Frameworks (array with benefits)
│
├── Section 6: CASE STUDY
│   ├── Title
│   ├── Description
│   ├── Featured Case Study (reference)
│   └── Inline Case Study (embedded)
│
├── Section 7: PRICING & INVESTMENT
│   ├── Title
│   ├── Description
│   ├── Pricing Model
│   ├── Price Range
│   ├── Payment Terms
│   ├── What's Included (array)
│   └── What's Excluded (array)
│
├── Section 8: WHO THIS IS FOR
│   ├── Title
│   ├── Description
│   ├── Ideal Client Profile
│   ├── Good Fit Criteria (array)
│   ├── Poor Fit Indicators (array)
│   ├── Target Industries (array)
│   ├── Company Size
│   └── Annual Revenue Range
│
├── Section 9: FAQ
│   ├── Title
│   ├── Description (optional)
│   └── FAQ Items (array of Q&A)
│
└── Section 10: CONVERSION
    ├── Title
    ├── Final Message
    ├── Primary CTA
    ├── Trust Signals (array)
    └── Next Steps Description
```

---

## How to Create a Service

### Option A: Using Sanity CMS

1. Go to the **Services** section in your Sanity studio
2. Click **Create** → **Service**
3. Fill in metadata (title, category, featured)
4. Expand each numbered section (1-10)
5. Add content specific to your service
6. Click **Publish**
7. Done! Your service page is live

### Option B: Using Markdown

1. Create file: `apps/web/src/content/services/my-service.md`
2. Copy the frontmatter template from [strategic-transformation-example.md](./apps/web/src/content/services/strategic-transformation-example.md)
3. Fill in all 10 sections in the YAML frontmatter
4. Optionally add body content using Markdown below the frontmatter
5. Save and commit
6. Your service is automatically available in the content collection

---

## Key Features

✅ **10 strategic sections** — Complete customer journey coverage  
✅ **Flexible content** — Use sections you need, skip optional ones  
✅ **Rich formatting** — Portable Text in Sanity, Markdown in files  
✅ **Multiple CTAs** — Hero CTA + conversion CTA for maximum conversions  
✅ **Case study integration** — Link to case studies or embed inline  
✅ **Transparent pricing** — Include/exclude lists for clarity  
✅ **Ideal client definition** — Filter out poor-fit prospects  
✅ **FAQ section** — Address objections upfront  
✅ **Trust signals** — Build credibility with social proof  
✅ **Backward compatible** — Existing services continue to work  

---

## Queries Available

```typescript
// Fetch all services
const services = await getServices();

// Fetch single service
const service = await getServiceBySlug('strategic-consulting');

// Fetch featured services (new)
const featured = await sanityFetch(featuredServicesQuery);

// Fetch by category
const advisory = await sanityFetch(servicesByCategoryQuery, { 
  category: 'Advisory' 
});
```

---

## Component Development Guide

Your service page components now have access to:

```typescript
service.data.hero               // Hero section with CTAs
service.data.problemContext     // Problem definition
service.data.howItWorks        // Process steps
service.data.whatYouGet        // Deliverables
service.data.frameworkDeepDive // Methodologies
service.data.caseStudy         // Real-world example
service.data.pricingSection    // Transparent pricing
service.data.whoThisFor        // Ideal customer profile
service.data.faq               // FAQ items
service.data.conversion        // Conversion section
```

Each section has consistent structure with title, description, and specific content fields.

---

## Migration Guide

### Existing Services

If you have existing services, they'll continue to work:
- Legacy `features` field still available
- Legacy `outcomes` field still available
- Legacy `pricing` object still available
- No breaking changes

To migrate to new template:
1. Open service in Sanity
2. Copy content from legacy fields into new section fields
3. Organize content into 10 strategic sections
4. Add new content where needed
5. Save and publish

### New Services

Start with the 10-section template from day one for maximum conversion optimization.

---

## Best Practices

### 1. Hero Section
- Write from the prospect's perspective, not yours
- Lead with the benefit, not the feature
- Keep description to 3-4 sentences max
- Use compelling CTAs (e.g., "Schedule Consultation" vs. "Learn More")

### 2. Problem Section
- Be specific about pain points
- Show you understand their situation
- Explain why the problem matters
- Build urgency around solving it

### 3. How It Works
- Show your process is methodical
- Include realistic timelines
- Break into clear phases
- Add duration estimates for transparency

### 4. What You Get
- List tangible deliverables
- Be specific (what's in each deliverable?)
- Include supporting materials and workshops
- Show post-engagement support

### 5. Frameworks
- Use recognized frameworks when possible
- Explain how you'll apply them
- Show the benefits of each approach
- Build confidence in your methodology

### 6. Case Study
- Use quantified results
- Show before/after transformation
- Pick a client similar to your ideal customer
- Make metrics memorable (45% growth, 3.2x ROI)

### 7. Pricing
- Be transparent about ranges
- Explain what's included/excluded
- Show payment flexibility
- Justify the investment with ROI

### 8. Who This Is For
- Be specific about ideal customer
- List fit criteria (they can self-qualify)
- Show poor-fit indicators (saves sales time)
- Include company size and revenue ranges

### 9. FAQ
- Address common objections
- Answer "why you" vs. competitors
- Clarify scope and limitations
- Explain what happens after they buy

### 10. Conversion
- Create urgency without manipulation
- Use social proof and trust signals
- Explain next steps clearly
- Make the CTA easy to find

---

## Testing & Optimization

1. **A/B test CTAs** — Different copy, buttons, or colors
2. **Track conversions** — Which sections drive most engagement?
3. **Monitor metrics** — Qualified leads, conversion rate, deal size
4. **Iterate content** — Based on performance data
5. **Update case studies** — Keep them current and relevant

---

## Support

- Full schema documentation: [SERVICE-TEMPLATE-GUIDE.md](./SERVICE-TEMPLATE-GUIDE.md)
- Example service page: [strategic-transformation-example.md](./apps/web/src/content/services/strategic-transformation-example.md)
- Main project guide: [AGENTS.md](./AGENTS.md)
- Sanity docs: [www.sanity.io/docs](https://www.sanity.io/docs)

---

## Summary

You now have a **complete 10-section service template** that:
- ✅ Covers the entire customer journey
- ✅ Optimizes for conversion at every stage
- ✅ Works in both Sanity CMS and Markdown
- ✅ Provides type-safe development in TypeScript
- ✅ Maintains backward compatibility
- ✅ Includes real-world examples
- ✅ Follows conversion optimization best practices

**Ready to create powerful service pages that convert?** Start with the [example service](./apps/web/src/content/services/strategic-transformation-example.md) or the [comprehensive guide](./SERVICE-TEMPLATE-GUIDE.md).
