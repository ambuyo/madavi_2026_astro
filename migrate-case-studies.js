const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Source studio config
const sourceClient = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skez38FgzwmEwsnwdg3B0tSr7DUI9T6o56ydc1fs7U8mFLdeFuhkNOCjOlEOy9gAmuIvSY9iGOmAKRGAUrZ61jXhEv1bCCicLtpxr4TGXU7C75nhRFUgk26KURSDl2Sppn82821V39QOfz3sYJJe6DWZTKzEp7rX5LL2t3kfiNG2WCrLOf9W'
});

const imageBuilder = imageUrlBuilder(sourceClient);

// Create directories for export
const exportDir = './case-studies-export';
const imagesDir = path.join(exportDir, 'images');

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(imageAsset, filename) {
  return new Promise((resolve, reject) => {
    const imageUrl = imageBuilder.image(imageAsset).url();
    const filepath = path.join(imagesDir, filename);

    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(createWriteStream(filepath))
          .on('finish', () => {
            console.log(`✓ Downloaded: ${filename}`);
            resolve(filepath);
          })
          .on('error', reject);
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

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

async function exportCaseStudies() {
  try {
    console.log('🔄 Fetching case studies from source studio...\n');
    const query = '*[_type == "singleWork"]';
    const caseStudies = await sourceClient.fetch(query);

    if (caseStudies.length === 0) {
      console.log('⚠️  No case studies found');
      return;
    }

    console.log(`✓ Found ${caseStudies.length} case studies\n`);

    console.log('📥 Downloading images...\n');
    const imagesToDownload = [];

    for (const caseStudy of caseStudies) {
      if (caseStudy.image?.asset) {
        const assetId = caseStudy.image.asset._id;
        const filename = `${assetId}-main.jpg`;
        imagesToDownload.push({ assetId, filename, asset: caseStudy.image.asset });
      }

      if (caseStudy.projectImages && Array.isArray(caseStudy.projectImages)) {
        caseStudy.projectImages.forEach((img, idx) => {
          if (img.asset) {
            const assetId = img.asset._id;
            const filename = `${assetId}-project-${idx}.jpg`;
            imagesToDownload.push({ assetId, filename, asset: img.asset });
          }
        });
      }
    }

    const uniqueAssets = {};
    for (const { assetId, filename, asset } of imagesToDownload) {
      if (!uniqueAssets[assetId]) {
        await downloadImage(asset, filename);
        uniqueAssets[assetId] = filename;
      }
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      sourceProject: '6u680gce',
      caseStudiesCount: caseStudies.length,
      caseStudies: caseStudies,
      imageMapping: uniqueAssets
    };

    fs.writeFileSync(
      path.join(exportDir, 'export-metadata.json'),
      JSON.stringify(exportData, null, 2)
    );

    console.log(`\n✓ Export complete!`);
    console.log(`  📁 Location: ${exportDir}`);
    console.log(`  📝 Case studies: ${caseStudies.length}`);
    console.log(`  🖼️  Images: ${Object.keys(uniqueAssets).length}`);
    console.log(`\n📋 Next steps:`);
    console.log(`  1. Update "YOUR_NEW_PROJECT_ID" and "YOUR_NEW_WRITE_TOKEN" in this script`);
    console.log(`  2. Run: node migrate-case-studies.js --import`);

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

async function importCaseStudies() {
  try {
    // Destination studio config (UPDATE WITH YOUR NEW STUDIO DETAILS)
    const destClient = createClient({
      projectId: 'YOUR_NEW_PROJECT_ID',
      dataset: 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
      token: 'YOUR_NEW_WRITE_TOKEN'
    });

    if (destClient.config().projectId.includes('YOUR_')) {
      console.error('❌ Error: Update destination studio config in the script');
      console.error('   - YOUR_NEW_PROJECT_ID');
      console.error('   - YOUR_NEW_WRITE_TOKEN');
      process.exit(1);
    }

    console.log('🔄 Importing to destination studio...\n');

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
        const newAsset = await uploadImage(destClient, filepath);
        newImageAssetMap[assetId] = newAsset._id;
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
        console.error(`❌ Failed to import case study:`, error.message);
        failed++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`  ✓ Successful: ${imported}`);
    if (failed > 0) console.log(`  ❌ Failed: ${failed}`);

    fs.writeFileSync(
      path.join(exportDir, 'import-mapping.json'),
      JSON.stringify({
        importDate: new Date().toISOString(),
        originalImageAssets: imageMapping,
        newImageAssets: newImageAssetMap,
        caseStudiesImported: imported,
        caseStudiesFailed: failed
      }, null, 2)
    );

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

const command = process.argv[2];
if (command === '--import') {
  importCaseStudies();
} else {
  exportCaseStudies();
}
