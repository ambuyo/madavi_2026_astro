const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const destClient = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || ''
});

const exportDir = './case-studies-export';
const imageMapping = {};

async function importCaseStudies() {
  try {
    console.log('🔄 Importing case studies...\n');

    const metadata = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'export-metadata.json'), 'utf-8')
    );

    const caseStudies = metadata.caseStudies;
    let imported = 0;
    let failed = 0;

    console.log('📝 Creating documents...\n');

    for (const caseStudy of caseStudies) {
      try {
        // Remove system fields and image references
        const { _id, _rev, _type, _createdAt, _updatedAt, _createdBy, _updatedBy, image, projectImages, ...docData } = caseStudy;

        const result = await destClient.create({
          ...docData,
          _type: 'singleWork'
        });

        console.log(`✓ Imported: ${result.client}`);
        imported++;
      } catch (error) {
        console.error(`❌ Failed to import: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`  ✓ Successful: ${imported}/${caseStudies.length}`);
    if (failed > 0) console.log(`  ❌ Failed: ${failed}`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importCaseStudies();
