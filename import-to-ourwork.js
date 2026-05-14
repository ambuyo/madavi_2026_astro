const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Import to local studio with ourWork dataset
const destClient = createClient({
  projectId: '6u680gce',
  dataset: 'ourWork',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || ''
});

const exportDir = './case-studies-export';
const imagesDir = path.join(exportDir, 'images');

async function uploadImage(client, filepath) {
  const filename = path.basename(filepath);
  const buffer = fs.readFileSync(filepath);

  const asset = await client.assets.upload('image', buffer, {
    filename: filename
  });

  console.log(`✓ Uploaded: ${filename} (ID: ${asset._id})`);
  return asset;
}

async function migrateImages(sourceDoc, imageMap) {
  const migratedDoc = JSON.parse(JSON.stringify(sourceDoc));

  if (sourceDoc.image && sourceDoc.image.asset) {
    const assetId = sourceDoc.image.asset._id;
    if (imageMap[assetId]) {
      migratedDoc.image.asset = {
        _type: 'reference',
        _ref: imageMap[assetId]
      };
    }
  }

  if (sourceDoc.projectImages && Array.isArray(sourceDoc.projectImages)) {
    migratedDoc.projectImages = sourceDoc.projectImages.map(img => {
      if (img.asset) {
        const assetId = img.asset._id;
        if (imageMap[assetId]) {
          return {
            ...img,
            asset: {
              _type: 'reference',
              _ref: imageMap[assetId]
            }
          };
        }
      }
      return img;
    });
  }

  return migratedDoc;
}

async function importCaseStudies() {
  try {
    console.log('🔄 Importing to ourWork dataset...\n');

    const metadata = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'export-metadata.json'), 'utf-8')
    );

    const caseStudies = metadata.caseStudies;
    const imageMapping = metadata.imageMapping;
    const newImageAssetMap = {};

    console.log('📤 Uploading images...\n');
    for (const [assetId, filename] of Object.entries(imageMapping)) {
      try {
        const filepath = path.join(imagesDir, filename);
        if (fs.existsSync(filepath)) {
          const newAsset = await uploadImage(destClient, filepath);
          newImageAssetMap[assetId] = newAsset._id;
        }
      } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error.message);
      }
    }

    console.log('\n📝 Uploading case studies...\n');
    let imported = 0;
    let failed = 0;

    for (const caseStudy of caseStudies) {
      try {
        const { _id, _rev, ...docWithoutIdRev } = caseStudy;
        const migratedDoc = await migrateImages(docWithoutIdRev, newImageAssetMap);

        const result = await destClient.create({
          ...migratedDoc,
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
    console.log(`  ✓ Successful: ${imported}`);
    if (failed > 0) console.log(`  ❌ Failed: ${failed}`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importCaseStudies();
