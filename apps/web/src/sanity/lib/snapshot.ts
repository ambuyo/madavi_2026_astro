import fs from 'fs';
import path from 'path';

const SNAPSHOT_DIR = path.join(process.cwd(), 'apps/web/src/content/snapshots');

export interface ServiceSnapshot {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon?: string;

  // Metadata & SEO
  metadata?: {
    serviceName: string;
    slug: { current: string };
    pageTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: any;
  };

  serviceCategory?: string;

  // Pricing & Timeline
  pricing?: {
    priceType: string;
    priceMin?: number;
    priceMax?: number;
    priceDisplay: string;
  };
  timeline?: string;

  // Hero Section
  hero?: {
    headline?: string;
    subheadline?: string;
    supportingCopy?: any[];
    heroImage?: any;
    trustSignals?: Array<{ icon?: string; text: string }>;
    primaryCTA?: { text: string; link?: string };
    // Legacy fields for backward compatibility
    videoUrl?: string;
    ctaText?: string;
    ctaLink?: string;
  };

  // Problem Section
  problemSection?: {
    headline?: string;
    painPoints?: Array<{ icon?: any; label: string }>;
    calloutBox?: { stat?: string; description?: string };
    // Legacy fields
    copy?: string;
    keyStatistic?: { stat: string; description: string };
  };

  // Key Dimensions/Features (Accordion)
  dimensions?: Array<{
    number?: number;
    icon?: any;
    title: string;
    question?: string;
    whatWeEvaluate?: string;
    whyItMatters?: string;
    lookingFor?: {
      positive?: string[];
      negative?: string[];
    };
  }>;

  // What You Get Section
  whatYouGet?: {
    headline?: string;
    columns?: Array<{
      title: string;
      items: Array<{ text: string; subitems?: string[] }>;
    }>;
  };

  // Who It's For Section
  whoItsFor?: {
    perfectFor?: string[];
    notIdealFor?: string[];
    alternativeServices?: string[];
  };

  // Scenarios/Outcomes Section
  scenarios?: {
    headline?: string;
    scenarioCards?: Array<{
      icon?: any;
      title?: string;
      scoreRange?: string;
      colorTheme?: string;
      whatThisMeans?: string[];
      commonPatterns?: string[];
      nextSteps?: { heading?: string; steps?: string[] };
      investment?: string;
      timeline?: string;
      outcome?: string;
      cta?: { text?: string; link?: string };
      // Legacy fields
      color?: string;
      score?: number;
    }>;
  };

  // Case Studies
  caseStudies?: {
    headline?: string;
    studies?: Array<{
      clientType: string;
      clientImage?: any;
      readinessScore?: number;
      scoreDimension?: string;
      keyFinding?: string;
      recommendation?: Array<{ type: string; text: string }>;
      whatTheyDid?: string;
      outcome?: string;
      timeline?: string;
      investment?: string;
      // Legacy fields for backward compatibility
      score?: string;
      finding?: string;
    }>;
  };
  caseStudyIds?: string[];

  // Philosophy
  philosophy?: {
    title?: string;
    description?: string;
    values?: Array<{ title: string; description?: string; icon?: string }>;
  };

  // Approach
  approach?: {
    title?: string;
    description?: string;
    steps?: Array<{ title: string; description?: string; bullets?: string[]; timeline?: string }>;
  };

  // Stats
  stats?: Array<{ value: string; label: string }>;

  // Pricing Tiers
  pricingTiers?: Array<{
    name: string;
    priceRange?: { min: number; max: number; currency?: string };
    timelineWeeks?: { min: number; max: number };
    description?: string;
    highlights?: string[];
  }>;

  // Final CTA Section
  finalCTA?: {
    headline?: string;
    subheadline?: string;
    backgroundImage?: any;
    showBookingForm?: boolean;
    bookingForm?: boolean; // Legacy field
    trustSignals?: Array<{ icon?: string; text: string }>;
    alternativeAction?: {
      text?: string;
      linkText?: string;
      link?: string;
    };
  };

  // Booking Form
  bookingForm?: {
    formTitle?: string;
    industryOptions?: Array<string | { title: string; value: string }>;
    submitButtonText?: string;
    confirmationMessage?: string;
    formAction?: string;
  };

  // Sticky Elements
  stickyElements?: {
    stickyBar?: {
      enabled?: boolean;
      message: string;
      buttonText?: string;
    };
    exitIntent?: {
      enabled?: boolean;
      headline?: string;
      offer?: string;
    };
  };

  // A/B Testing Variations
  abTestVariations?: {
    headlines?: Array<{ text: string; active?: boolean }>;
    ctas?: Array<{ text: string; active?: boolean }>;
  };

  // Additional Media
  additionalMedia?: Array<{
    image?: any;
    label?: string;
    altText?: string;
  }>;

  // SEO
  faqs?: Array<{ question: string; answer: string }>;
  seo?: { metaDescription?: string; focusKeyword?: string };
}

export function ensureSnapshotDir() {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
}

export function saveSnapshot(service: ServiceSnapshot) {
  ensureSnapshotDir();
  const filePath = path.join(SNAPSHOT_DIR, `${service.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(service, null, 2));
  console.log(`✓ Snapshot saved: ${service.slug}`);
}

export function loadSnapshot(slug: string): ServiceSnapshot | null {
  const filePath = path.join(SNAPSHOT_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load snapshot for ${slug}:`, error);
    return null;
  }
}

export function getAllSnapshots(): ServiceSnapshot[] {
  ensureSnapshotDir();

  if (!fs.existsSync(SNAPSHOT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.json'));
  return files
    .map(file => {
      const data = fs.readFileSync(path.join(SNAPSHOT_DIR, file), 'utf-8');
      return JSON.parse(data) as ServiceSnapshot;
    })
    .filter(Boolean);
}

export function snapshotExists(slug: string): boolean {
  const filePath = path.join(SNAPSHOT_DIR, `${slug}.json`);
  return fs.existsSync(filePath);
}
