import fs from 'fs';
import path from 'path';

const SNAPSHOT_DIR = path.join(process.cwd(), 'src/content/snapshots');

export interface ServiceSnapshot {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon?: string;
  hero: {
    headline: string;
    subheadline?: string;
    videoUrl?: string;
    ctaText: string;
    ctaLink: string;
  };
  stats?: Array<{ value: string; label: string }>;
  problemSection?: {
    headline: string;
    copy: string;
    painPoints?: Array<{ icon: string; label: string }>;
    keyStatistic?: { stat: string; description: string };
  };
  philosophy?: {
    title: string;
    description: string;
    values?: Array<{ title: string; description: string; icon?: string }>;
  };
  approach?: {
    title: string;
    description: string;
    steps?: Array<{ title: string; description: string; bullets?: string[]; timeline?: string }>;
  };
  pricing?: Array<{
    name: string;
    priceRange: { min: number; max: number; currency: string };
    timelineWeeks: { min: number; max: number };
    description: string;
    highlights: string[];
  }>;
  faqs?: Array<{ question: string; answer: string }>;
  caseStudyIds?: string[];
  seo?: { metaDescription: string; focusKeyword?: string };
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
    .catch(() => {
      console.warn(`Warning: Failed to parse ${file}`);
      return null;
    })
    .filter(Boolean);
}

export function snapshotExists(slug: string): boolean {
  const filePath = path.join(SNAPSHOT_DIR, `${slug}.json`);
  return fs.existsSync(filePath);
}
