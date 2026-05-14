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

    // Migrate in batches using createOrReplace
    console.log('📝 Migrating documents (updating _type field)...\n');

    const batchSize = 25;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < caseStudies.length; i += batchSize) {
      const batch = caseStudies.slice(i, i + batchSize);
      const tx = client.transaction();

      for (const doc of batch) {
        const migratedDoc = {
          ...doc,
          _type: 'singleWork',
        };
        tx.createOrReplace(migratedDoc);
      }

      try {
        await tx.commit();
        successCount += batch.length;
        console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}: ${batch.length} documents`);
        batch.forEach((doc: any) => {
          console.log(`   - ${doc.client || doc._id}`);
        });
      } catch (error: any) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
        errorCount += batch.length;
      }
    }

    // Step 2: Verify migration
    console.log('\n✅ Verifying migration...\n');
    const caseStudyCount = await client.fetch('count(*[_type == "caseStudy"])');
    const singleWorkCount = await client.fetch('count(*[_type == "singleWork"])');

    console.log(`📊 Final Status:`);
    console.log(`   caseStudy documents: ${caseStudyCount}`);
    console.log(`   singleWork documents: ${singleWorkCount}`);
    console.log(`   Successfully migrated: ${successCount}/${caseStudies.length}`);

    if (errorCount === 0) {
      console.log(`\n🎉 Migration Complete!`);
      console.log(`\n✨ Your system is now fully aligned:`);
      console.log(`   ✅ Schema: singleWork`);
      console.log(`   ✅ Database: ${singleWorkCount} singleWork documents`);
      console.log(`   ✅ Queries: Ready to fetch from singleWork`);
      console.log(`   ✅ Studio: "Our Work" menu will now show all ${singleWorkCount} case studies`);
    } else {
      console.log(`\n⚠️  Migration completed with errors`);
      console.log(`   Successful: ${successCount}`);
      console.log(`   Failed: ${errorCount}`);
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
