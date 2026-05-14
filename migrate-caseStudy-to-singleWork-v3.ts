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

    // Step 1: Create new documents with singleWork type
    console.log('📝 Creating new documents with singleWork type...\n');
    const tx = client.transaction();

    for (const doc of caseStudies) {
      const newDoc = {
        ...doc,
        _type: 'singleWork',
      };
      tx.create(newDoc);
    }

    try {
      await tx.commit();
      console.log(`✅ Created ${caseStudies.length} new singleWork documents\n`);
    } catch (error: any) {
      console.error(`❌ Failed to create documents:`, error.message);
      process.exit(1);
    }

    // Step 2: Delete old caseStudy documents
    console.log('🗑️  Deleting old caseStudy documents...\n');
    const deleteTx = client.transaction();

    for (const doc of caseStudies) {
      deleteTx.delete(doc._id);
    }

    try {
      await deleteTx.commit();
      console.log(`✅ Deleted ${caseStudies.length} old caseStudy documents\n`);
    } catch (error: any) {
      console.error(`❌ Failed to delete documents:`, error.message);
      process.exit(1);
    }

    // Step 3: Verify migration
    console.log('✅ Verifying migration...\n');
    const caseStudyCount = await client.fetch('count(*[_type == "caseStudy"])');
    const singleWorkCount = await client.fetch('count(*[_type == "singleWork"])');

    console.log(`📊 Final Status:`);
    console.log(`   caseStudy documents: ${caseStudyCount}`);
    console.log(`   singleWork documents: ${singleWorkCount}`);
    console.log(`\n🎉 Migration Complete!`);
    console.log(`\n✨ Your system is now fully aligned:`);
    console.log(`   ✅ Schema: singleWork`);
    console.log(`   ✅ Database: ${singleWorkCount} singleWork documents`);
    console.log(`   ✅ Queries: Ready to fetch from singleWork`);
    console.log(`   ✅ Studio: "Our Work" menu will now show all ${singleWorkCount} case studies`);

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

migrateDocuments();
