# 10-Section Service Template Guide

This document describes the new comprehensive service template structure in Mulberry. The template is designed to provide a complete, conversion-optimized service page framework with 10 strategic sections.

## Overview

The service schema has been enhanced to support a 10-section structure that covers the complete customer journey from awareness through decision and conversion. All sections are optional, allowing you to customize based on your service.

### 10 Sections

1. **Hero** — Above-the-fold value proposition
2. **Problem/Context** — Why the service exists
3. **How It Works** — Methodology and process
4. **What You Get** — Deliverables and outcomes
5. **Framework Deep Dive** — Consulting frameworks
6. **Case Study** — Real-world example
7. **Pricing & Investment** — Costs and terms
8. **Who This Is For** — Ideal client profile
9. **FAQ** — Common questions
10. **Conversion** — Final CTA and trust signals

---

## Schema Reference

### Core Metadata Fields

```typescript
{
  title: string;                    // Service name
  slug: string;                     // Auto-generated from title
  summary: string;                  // Brief description (for listings)
  category: "Advisory" | "Compliance" | "Operations";
  featured: boolean;                // Highlight on homepage
  image: Image;                     // Featured image
  pubDate: Date;                    // Published date
  updatedDate: Date;                // Last update
}
```

### Section 1: Hero

Above-the-fold section with immediate value proposition.

**Sanity Schema:**
```typescript
hero: {
  subtitle: string;                 // e.g., "Strategic Advisory"
  description: string;              // Compelling narrative (3-4 sentences)
  primaryCta: {
    text: string;                   // e.g., "Get Started"
    url: string;                    // Button URL
  };
  secondaryCta?: {
    text: string;                   // e.g., "Learn More"
    url: string;
  };
}
```

**Markdown Example:**
```yaml
---
title: Strategic Consulting Services
summary: Expert guidance for transforming your business strategy
category: Advisory
featured: true

hero:
  subtitle: Strategic Advisory Services
  description: >
    Transform your business strategy with our expert consulting.
    We help leaders navigate complex challenges and unlock new growth opportunities.
  primaryCta:
    text: Schedule Consultation
    url: /contact?service=consulting
  secondaryCta:
    text: View Case Studies
    url: /case-studies
---
```

### Section 2: Problem/Context

Articulate the problems your service solves.

**Sanity Schema:**
```typescript
problemContext: {
  title: string;                    // Section heading
  description: string;              // Why the service exists
  painPoints: string[];             // List of specific problems
}
```

**Markdown Example:**
```yaml
problemContext:
  title: The Challenge
  description: >
    Many organizations struggle with strategic direction when facing market disruption,
    competitive pressure, or significant operational changes.
  painPoints:
    - Unclear strategic direction amid market changes
    - Inability to prioritize initiatives effectively
    - Lack of alignment across leadership teams
    - Limited resources for transformation efforts
```

### Section 3: How It Works

Describe your methodology and process.

**Sanity Schema:**
```typescript
howItWorks: {
  title: string;                    // Section heading
  description: string;              // Intro text
  steps: Array<{
    stepNumber: number;             // 1, 2, 3, etc.
    title: string;                  // Step title
    description: string;            // What happens in this step
    duration: string;               // e.g., "2-3 weeks"
  }>;
  timelineTotal: string;            // e.g., "8-12 weeks"
}
```

**Markdown Example:**
```yaml
howItWorks:
  title: Our Process
  description: We follow a proven methodology to ensure successful outcomes
  steps:
    - stepNumber: 1
      title: Discovery & Assessment
      description: >
        We conduct comprehensive interviews and analysis to understand your
        current state, market position, and strategic goals.
      duration: 1-2 weeks
    - stepNumber: 2
      title: Strategy Development
      description: >
        Our team develops strategic options, market analyses, and actionable
        roadmaps aligned with your goals.
      duration: 3-4 weeks
    - stepNumber: 3
      title: Implementation Planning
      description: >
        We create detailed implementation plans with milestones, resource
        requirements, and success metrics.
      duration: 2-3 weeks
  timelineTotal: 8-12 weeks
```

### Section 4: What You Get

Specify deliverables and outcomes.

**Sanity Schema:**
```typescript
whatYouGet: {
  title: string;                    // Section heading
  description: string;              // Intro text
  deliverables: Array<{
    title: string;                  // Deliverable name
    description: string;            // What it includes
  }>;
}
```

**Markdown Example:**
```yaml
whatYouGet:
  title: What You'll Receive
  description: Concrete deliverables that drive results
  deliverables:
    - title: Strategic Assessment Report
      description: >
        A comprehensive 50+ page document outlining market analysis,
        competitive landscape, and strategic recommendations.
    - title: 3-Year Strategic Roadmap
      description: >
        Detailed roadmap with phased initiatives, timelines, and success metrics.
    - title: Implementation Playbook
      description: >
        Step-by-step guide for executing the strategy with templates and tools.
    - title: Executive Workshops
      description: >
        3 sessions to align leadership teams and launch initiatives.
```

### Section 5: Framework Deep Dive

Explain consulting frameworks used.

**Sanity Schema:**
```typescript
frameworkDeepDive: {
  title: string;                    // Section heading
  description: string;              // Intro text
  frameworks: Array<{
    name: string;                   // Framework name
    description: string;            // How it's applied
    benefits: string[];             // Key benefits
  }>;
}
```

**Markdown Example:**
```yaml
frameworkDeepDive:
  title: Our Strategic Frameworks
  description: We apply proven methodologies tailored to your situation
  frameworks:
    - name: Blue Ocean Strategy
      description: >
        We help you identify uncontested market spaces and break the
        value-cost trade-off.
      benefits:
        - Reduced competitive pressure
        - New market opportunities
        - Higher profit margins
    - name: McKinsey 7S Framework
      description: >
        Aligning Strategy, Structure, Systems, Skills, Staff, Style, and Shared Values.
      benefits:
        - Organizational alignment
        - Clarity on capability gaps
        - Holistic transformation approach
```

### Section 6: Case Study

Real-world example with metrics (can reference a linked case study or inline).

**Sanity Schema:**
```typescript
caseStudy: {
  title: string;                    // Section heading
  description: string;              // Intro text
  featured?: string;                // Reference to case study doc ID
  inline?: {
    client: string;                 // Client name
    industry: string;               // Industry
    challenge: string;              // The problem they faced
    solution: string;               // How you helped
    results: Array<{
      metric: string;               // e.g., "Revenue Growth"
      value: string;                // e.g., "45% YoY"
    }>;
  };
}
```

**Markdown Example:**
```yaml
caseStudy:
  title: See It In Action
  description: How we helped a mid-market tech company accelerate growth
  inline:
    client: TechVenture Inc
    industry: SaaS/B2B Software
    challenge: >
      The company had developed strong products but lacked clear market positioning
      and struggled to attract enterprise customers.
    solution: >
      We conducted competitive analysis, developed market positioning, and created
      a go-to-market strategy targeting enterprise buyers.
    results:
      - metric: Revenue Growth
        value: 280% in Year 1
      - metric: Enterprise Customer Acquisition
        value: From 0 to 15 enterprise clients
      - metric: Average Contract Value
        value: Increased 320%
```

### Section 7: Pricing & Investment

Transparent pricing and payment terms.

**Sanity Schema:**
```typescript
pricingSection: {
  title: string;                    // Section heading
  description: string;              // Intro text
  pricingModel: "one-time" | "monthly" | "hourly" | "custom";
  startingPrice: string;            // e.g., "$25,000"
  monthlyPrice?: string;            // For retainers
  paymentTerms: string;             // e.g., "50% upfront, 50% at completion"
  included: string[];               // What's included
  excluded: string[];               // What's not included
}
```

**Markdown Example:**
```yaml
pricingSection:
  title: Investment & Pricing
  description: >
    Transparent pricing for strategic consulting that delivers ROI
  pricingModel: custom
  startingPrice: $25,000 - $100,000
  paymentTerms: >
    50% upfront, 25% at discovery completion, 25% upon delivery of final roadmap.
    Flexible payment options available for qualified engagements.
  included:
    - Comprehensive market and competitive analysis
    - Strategic assessment and opportunity identification
    - 3-year strategic roadmap development
    - Implementation playbook and playbooks
    - 3 executive strategy workshops
    - 90-day post-launch support and refinement
  excluded:
    - External travel and accommodation costs
    - Market research beyond scope
    - Implementation execution (can be bundled separately)
    - Ongoing strategic advisory (available as separate retainer)
```

### Section 8: Who This Is For

Ideal client profile and fit criteria.

**Sanity Schema:**
```typescript
whoThisFor: {
  title: string;                    // Section heading
  description: string;              // Intro text
  idealClient: string;              // Detailed description
  fitCriteria: string[];            // Signs of good fit
  poorFitCriteria?: string[];       // When it's not a fit
  industries: string[];             // Target industries
  companySize?: string;             // e.g., "50-500 employees"
  annualRevenue?: string;           // e.g., "$5M - $100M"
}
```

**Markdown Example:**
```yaml
whoThisFor:
  title: Who This Service Is For
  description: >
    This service works best for companies facing strategic inflection points
    and ready to make bold moves.
  idealClient: >
    Mid-market companies ($10M - $250M revenue) with strong operations but
    unclear growth strategy. Leadership teams that are ambitious, data-driven,
    and committed to transformation.
  fitCriteria:
    - Clear executive alignment on need for strategic refresh
    - Willingness to challenge current assumptions
    - Available time commitment from leadership (4-6 hours/week)
    - Budget for strategic advisory ($25K-$100K+)
    - 2+ year planning horizon
  poorFitCriteria:
    - Cost-cutting only focus without growth ambition
    - Lack of leadership alignment
    - Unable to commit executive time
    - Expecting quick fixes rather than strategic transformation
  industries:
    - SaaS and B2B Software
    - Professional Services
    - Manufacturing and Operations
    - Healthcare and Life Sciences
  companySize: 50-500 employees (or $5M-$150M revenue)
  annualRevenue: $10M - $250M
```

### Section 9: FAQ

8-10 common questions and objections.

**Sanity Schema:**
```typescript
faq: {
  title: string;                    // Section heading
  description?: string;             // Optional intro
  items: Array<{
    question: string;
    answer: string;
  }>;
}
```

**Markdown Example:**
```yaml
faq:
  title: Frequently Asked Questions
  description: Answers to common concerns about our strategic advisory service
  items:
    - question: How is this different from other consulting?
      answer: >
        We combine deep industry expertise with a collaborative approach that
        keeps your team at the center of decision-making. We're not here to
        impose ideas, but to facilitate your team's strategic thinking.
    - question: What if we don't implement your recommendations?
      answer: >
        That's your choice. We believe in providing honest counsel and letting
        leadership make informed decisions. Even recommendations not implemented
        provide value in clarifying strategic thinking.
    - question: How much executive time is required?
      answer: >
        We typically require 4-6 hours/week from key stakeholders during the
        engagement. This includes interviews, workshops, and review sessions.
    - question: Can you help with implementation?
      answer: >
        Yes. While the core service is strategy development, we can provide
        implementation support and guidance separately. Discuss with your advisor.
    - question: How do you measure success?
      answer: >
        Success metrics are established during the discovery phase. Typically,
        we track clarity of strategy, stakeholder alignment, and business
        outcomes like revenue growth and market share.
    - question: What if our market changes during the engagement?
      answer: >
        Strategy is not set in stone. We build flexibility into roadmaps and
        include quarterly review points to adjust for market changes.
```

### Section 10: Conversion

Final CTA with trust signals and next steps.

**Sanity Schema:**
```typescript
conversion: {
  title: string;                    // Section heading
  description: string;              // Final persuasive message
  primaryCta: {
    text: string;                   // e.g., "Schedule a Consultation"
    url: string;
  };
  trustSignals: string[];           // Social proof items
  nextSteps: string;                // What happens after they click CTA
}
```

**Markdown Example:**
```yaml
conversion:
  title: Ready to Transform Your Strategy?
  description: >
    Let's schedule a 30-minute conversation to discuss your strategic challenges
    and explore how we can help you navigate change and unlock growth.
  primaryCta:
    text: Schedule a Consultation
    url: /contact?service=strategic-advisory
  trustSignals:
    - "ISO 27001 Certified — Enterprise-grade security"
    - "500+ strategy engagements completed"
    - "98% client satisfaction rating"
    - "Average ROI of 3.2x on strategy investments"
    - "Featured in Forbes, HBR, McKinsey Quarterly"
  nextSteps: >
    After you submit, our team will reach out within 24 hours to schedule your
    consultation. We'll spend 30 minutes understanding your situation and
    determine if we're a good fit.
```

---

## Using the Template

### In Sanity CMS

1. Go to **Services** in the structure
2. Create a new **Service** document
3. Fill in core metadata (title, category, summary)
4. Expand each numbered section and fill in content
5. Use **Portable Text** for rich formatting
6. Add images where applicable
7. Publish when ready

### In Markdown (Content Collections)

Create a file in `apps/web/src/content/services/your-service.md`:

```markdown
---
title: Strategic Consulting
summary: Expert guidance for business transformation
category: Advisory
featured: true
image:
  url: ./images/consulting-hero.png
  alt: Strategic consulting meeting

hero:
  subtitle: Strategic Advisory
  description: >
    Transform your business with expert guidance...
  primaryCta:
    text: Get Started
    url: /contact

problemContext:
  title: The Challenge
  description: Many organizations struggle with...
  painPoints:
    - Unclear strategy
    - Poor execution

# ... continue with other sections
---

# Optional body content using Markdown
```

---

## Backwards Compatibility

Legacy fields are preserved for backward compatibility:
- `features` (use `whatYouGet.deliverables` instead)
- `outcomes` (use `whatYouGet` or `conversion` instead)
- `pricing` object (use `pricingSection` instead)

Existing services will continue to work. New services should use the 10-section template.

---

## Implementation Tips

1. **Hero should be compelling** — Spend time on the hero section. This is where most visitors decide to continue reading.

2. **Be specific in Problem/Context** — Don't be generic. Name the specific problems your ideal clients face.

3. **Show your methodology in How It Works** — This builds confidence. Use real process names and timeline estimates.

4. **Use metrics in Case Studies** — Quantify results: revenue growth, time saved, efficiency gains.

5. **Be transparent about pricing** — Even if "custom," provide a range. Transparency builds trust.

6. **Profile your ideal customer clearly** — The more specific, the more qualified leads you'll attract.

7. **FAQ should address objections** — Think about why prospects might hesitate and address those concerns directly.

8. **Test your CTAs** — Try different messaging to see what converts best.

---

## Queries

### Fetch All Services
```typescript
import { allServicesQuery, sanityFetch } from "@/lib/sanity";

const services = await sanityFetch(allServicesQuery);
```

### Fetch Service by Slug
```typescript
import { serviceBySlugQuery, sanityFetch } from "@/lib/sanity";

const service = await sanityFetch(serviceBySlugQuery, { slug: "strategic-consulting" });
```

### Fetch Featured Services
```typescript
import { featuredServicesQuery, sanityFetch } from "@/lib/sanity";

const featured = await sanityFetch(featuredServicesQuery);
```

### Fetch Services by Category
```typescript
import { servicesByCategoryQuery, sanityFetch } from "@/lib/sanity";

const advisory = await sanityFetch(servicesByCategoryQuery, { category: "Advisory" });
```

---

## Component Implementation

Services fetched using `getServiceBySlug()` return data shaped like:

```typescript
interface Service {
  slug: string;
  data: {
    title: string;
    hero?: { subtitle, description, primaryCta, secondaryCta };
    problemContext?: { title, description, painPoints };
    howItWorks?: { title, description, steps, timelineTotal };
    whatYouGet?: { title, description, deliverables };
    frameworkDeepDive?: { title, description, frameworks };
    caseStudy?: { title, description, featured, inline };
    pricingSection?: { title, description, pricingModel, startingPrice, ... };
    whoThisFor?: { title, description, idealClient, fitCriteria, ... };
    faq?: { title, description, items };
    conversion?: { title, description, primaryCta, trustSignals, nextSteps };
    // ... other fields
  };
  body?: string;
}
```

Use this shape in your Astro components to render each section.

---

## Questions?

Refer to [AGENTS.md](./AGENTS.md) for the overall project structure or consult the [Sanity documentation](https://www.sanity.io/docs).
