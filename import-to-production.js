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

function cleanSystemFields(doc) {
  const { _id, _rev, _type, _createdAt, _updatedAt, _createdBy, _updatedBy, ...clean } = doc;
  return clean;
}

async function importCaseStudies() {
  try {
    console.log('🔄 Importing to production dataset...\n');

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
        const cleanDoc = cleanSystemFields(caseStudy);
        const migratedDoc = await migrateImages(cleanDoc, newImageAssetMap);

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
    console.log(`  ✓ Successful: ${imported}/${caseStudies.length}`);
    if (failed > 0) console.log(`  ❌ Failed: ${failed}`);
    console.log(`\n📍 View in Sanity Studio: http://localhost:3333/structure/ourWork`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importCaseStudies();
