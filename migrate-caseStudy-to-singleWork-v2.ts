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

    // Build a transaction with all updates
    const tx = client.transaction();

    for (const doc of caseStudies) {
      try {
        // Create a new document with singleWork type while keeping all original data
        const newDoc = {
          ...doc,
          _type: 'singleWork',
        };

        // Delete old, create new
        tx.delete(doc._id);
        tx.create(newDoc);

        console.log(`📝 Queued migration: ${doc.client || doc._id}`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error preparing ${doc._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📤 Committing ${successCount} document migrations...\n`);

    try {
      const result = await tx.commit();
      console.log(`✅ Successfully migrated ${successCount} documents!`);
      console.log(`Transaction ID: ${result.transactionId}`);
    } catch (error: any) {
      console.error(`❌ Transaction failed:`, error.message);
      if (error.details) {
        console.error('Details:', error.details);
      }
    }

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

migrateDocuments();
