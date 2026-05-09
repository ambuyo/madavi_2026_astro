import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN || '',
});

async function migrate() {
  console.log('🔄 Starting case study migration...\n');

  try {
    // Fetch all case studies
    const query = `*[_type == "caseStudy"]`;
    const caseStudies = await client.fetch(query);

    if (!caseStudies || caseStudies.length === 0) {
      console.log('✅ No case studies found');
      return;
    }

    console.log(`📋 Found ${caseStudies.length} case studies\n`);

    for (const study of caseStudies) {
      console.log(`📝 Processing: ${study.title}`);

      // Prepare the update with new fields
      const updates: Record<string, any> = {};

      // Map old fields to new fields
      if (study.challenge && !study.scopeOfWork) {
        updates.scopeOfWork = study.challenge;
        console.log('  ✅ scopeOfWork ← challenge');
      }

      if (study.solution && !study.whatWeDid) {
        updates.whatWeDid = study.solution;
        console.log('  ✅ whatWeDid ← solution');
      }

      // Add default values for new required fields if missing
      if (!study.year) {
        updates.year = new Date().getFullYear();
        console.log(`  ✅ year set to ${updates.year}`);
      }

      if (!study.aboutClient) {
        updates.aboutClient = study.challenge || 'Client overview';
        console.log('  ✅ aboutClient set');
      }

      // Only update if there are changes to make
      if (Object.keys(updates).length > 0) {
        console.log(`  🔄 Updating document...`);
        await client.patch(study._id).set(updates).commit();
        console.log('  ✅ Update successful\n');
      } else {
        console.log('  ℹ️  Already has all new fields\n');
      }
    }

    console.log('✅ Migration complete!');
  } catch (error) {
    const err = error as any;
    if (err.message?.includes('Unauthorized')) {
      console.error('❌ Authentication failed. You need a Sanity auth token.');
      console.error('\nTo get a token:');
      console.error('1. Go to https://manage.sanity.io/projects/6u680gce/settings/api');
      console.error('2. Create a new API token with Editor permissions');
      console.error('3. Run: SANITY_AUTH_TOKEN="your-token" npx tsx migrate-case-studies.mts');
    } else {
      console.error('❌ Migration failed:', err.message);
    }
    process.exit(1);
  }
}

migrate();
