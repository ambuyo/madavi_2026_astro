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

    // Step 1: Delete all old caseStudy documents
    console.log('🗑️  Step 1: Deleting old caseStudy documents...\n');

    const batchSize = 25;
    let deletedCount = 0;

    for (let i = 0; i < caseStudies.length; i += batchSize) {
      const batch = caseStudies.slice(i, i + batchSize);
      const tx = client.transaction();

      for (const doc of batch) {
        tx.delete(doc._id);
      }

      try {
        await tx.commit();
        deletedCount += batch.length;
        console.log(`✅ Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} documents`);
      } catch (error: any) {
        console.error(`❌ Delete batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
        process.exit(1);
      }
    }

    console.log(`\n✅ Successfully deleted ${deletedCount} old documents\n`);

    // Step 2: Wait a moment for deletion to propagate
    console.log('⏳ Waiting for Sanity to process deletions...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Create new documents with singleWork type
    console.log('📝 Step 2: Creating new singleWork documents...\n');
    let createdCount = 0;

    for (let i = 0; i < caseStudies.length; i += batchSize) {
      const batch = caseStudies.slice(i, i + batchSize);
      const tx = client.transaction();

      for (const doc of batch) {
        const migratedDoc = {
          ...doc,
          _type: 'singleWork',
        };
        tx.create(migratedDoc);
      }

      try {
        await tx.commit();
        createdCount += batch.length;
        console.log(`✅ Created batch ${Math.floor(i / batchSize) + 1}: ${batch.length} documents`);
        batch.forEach((doc: any) => {
          console.log(`   - ${doc.client || doc._id}`);
        });
      } catch (error: any) {
        console.error(`❌ Create batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
        process.exit(1);
      }
    }

    console.log(`\n✅ Successfully created ${createdCount} new documents\n`);

    // Step 4: Verify migration
    console.log('✅ Verifying migration...\n');
    const caseStudyCount = await client.fetch('count(*[_type == "caseStudy"])');
    const singleWorkCount = await client.fetch('count(*[_type == "singleWork"])');

    console.log(`📊 Final Status:`);
    console.log(`   caseStudy documents: ${caseStudyCount}`);
    console.log(`   singleWork documents: ${singleWorkCount}`);

    if (caseStudyCount === 0 && singleWorkCount === 26) {
      console.log(`\n🎉 Migration Complete!`);
      console.log(`\n✨ Your system is now fully aligned:`);
      console.log(`   ✅ Schema: singleWork`);
      console.log(`   ✅ Database: ${singleWorkCount} singleWork documents`);
      console.log(`   ✅ Queries: Ready to fetch from singleWork`);
      console.log(`   ✅ Studio: "Our Work" menu will now show all ${singleWorkCount} case studies`);
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Go to Sanity Studio: cd apps/studio && pnpm dev`);
      console.log(`   2. Check the "Our Work" menu - it should now display all 26 case studies`);
      console.log(`   3. Verify the website displays case studies correctly`);
    } else {
      console.log(`\n⚠️  Migration may have issues`);
      console.log(`   Expected: caseStudy=0, singleWork=26`);
      console.log(`   Got: caseStudy=${caseStudyCount}, singleWork=${singleWorkCount}`);
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
