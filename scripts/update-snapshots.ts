/**
 * Update content snapshots from Sanity
 * Run: npx ts-node scripts/update-snapshots.ts
 *
 * This script:
 * 1. Fetches all services from Sanity
 * 2. Saves snapshots locally
 * 3. Commits changes to git (optional, requires git configured)
 */

import { createClient } from '@sanity/client';
import { saveSnapshot, ServiceSnapshot, ensureSnapshotDir } from '../apps/web/src/sanity/lib/snapshot';
import { execSync } from 'child_process';
import path from 'path';

async function updateSnapshots() {
  // Validate environment variables
  if (!process.env.PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing PUBLIC_SANITY_PROJECT_ID in .env');
    process.exit(1);
  }

  console.log('🔄 Fetching services from Sanity...');

  const sanityClient = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  });

  try {
    const services = await sanityClient.fetch(
      `*[_type == "service"] | order(_createdAt desc) {
        _id,
        _type,
        metadata,
        serviceCategory,
        slug,
        title,
        shortDescription,
        icon,
        pricing,
        timeline,
        hero,
        stats,
        problemSection,
        dimensions,
        whatYouGet,
        whoItsFor,
        scenarios,
        philosophy,
        approach,
        pricingTiers,
        faqs,
        caseStudies,
        finalCTA,
        bookingForm,
        stickyElements,
        abTestVariations,
        additionalMedia,
        seo
      }`
    );

    if (!services || services.length === 0) {
      console.warn('⚠️  No services found in Sanity');
      process.exit(1);
    }

    console.log(`✓ Fetched ${services.length} services from Sanity\n`);

    // Ensure snapshot directory exists
    ensureSnapshotDir();

    // Save each service snapshot
    for (const service of services) {
      if (!service.slug?.current) {
        console.warn(`⚠️  Skipping service without slug: ${service.title || 'Untitled'}`);
        continue;
      }

      const snapshot: ServiceSnapshot = {
        id: service._id,
        slug: service.slug.current,
        title: service.metadata?.serviceName || service.title,
        shortDescription: service.shortDescription,
        icon: service.icon,
        metadata: service.metadata,
        serviceCategory: service.serviceCategory,
        pricing: service.pricing,
        timeline: service.timeline,
        hero: service.hero,
        stats: service.stats,
        problemSection: service.problemSection,
        dimensions: service.dimensions,
        whatYouGet: service.whatYouGet,
        whoItsFor: service.whoItsFor,
        scenarios: service.scenarios,
        philosophy: service.philosophy,
        approach: service.approach,
        pricingTiers: service.pricingTiers,
        faqs: service.faqs,
        caseStudies: service.caseStudies,
        finalCTA: service.finalCTA,
        bookingForm: service.bookingForm,
        stickyElements: service.stickyElements,
        abTestVariations: service.abTestVariations,
        additionalMedia: service.additionalMedia,
        seo: service.seo,
      };

      saveSnapshot(snapshot);
    }

    console.log(`\n✓ Updated ${services.length} snapshots\n`);

    // Attempt to commit snapshots to git
    try {
      const hasChanges = execSync('git diff --exit-code src/content/snapshots', {
        stdio: 'pipe',
      });

      if (!hasChanges) {
        console.log('✓ Snapshots committed to git');
        execSync('git add src/content/snapshots', { stdio: 'pipe' });
        execSync(
          'git commit -m "chore: update content snapshots from Sanity" --no-verify',
          { stdio: 'pipe' }
        );
      }
    } catch (error) {
      console.log(
        '⚠️  Could not commit snapshots (git not configured or no changes)\n'
      );
    }

    console.log('✓ Snapshot update complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update snapshots:');
    console.error(error);
    process.exit(1);
  }
}

updateSnapshots();
