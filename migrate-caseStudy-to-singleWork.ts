import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

async function migrateDocuments() {
  try {
    console.log('🔄 Migrating caseStudy documents to singleWork...\n');

    // Fetch all caseStudy documents
    const caseStudies = await client.fetch(`*[_type == "caseStudy"]`);
    console.log(`Found ${caseStudies.length} documents to migrate\n`);

    if (caseStudies.length === 0) {
      console.log('No documents to migrate.');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Update each document
    for (const doc of caseStudies) {
      try {
        const updated = await client
          .patch(doc._id)
          .set({ _type: 'singleWork' })
          .commit();

        console.log(`✅ Migrated: ${doc.client || doc._id}`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error migrating ${doc._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration Complete`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n🎉 All documents successfully migrated!');
    }
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateDocuments();
