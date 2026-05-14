import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

async function checkCollections() {
  try {
    console.log('📊 Checking Sanity CMS Collections\n');
    console.log('Project: 6u680gce | Dataset: production\n');

    const collections = [
      { name: 'Blog Posts', type: 'post' },
      { name: 'Team Members', type: 'teamMember' },
      { name: 'Services', type: 'service' },
      { name: 'Industries', type: 'industry' },
      { name: 'Our Work (Case Studies)', type: 'singleWork' },
      { name: 'Client Logos', type: 'clientLogo' },
      { name: 'Reports', type: 'report' },
      { name: 'Info Pages', type: 'infoPage' },
    ];

    console.log('Collection Name                     | Type           | Count');
    console.log('------------------------------------------------------------');

    let totalDocs = 0;

    for (const collection of collections) {
      const docs = await client.fetch(`*[_type == "${collection.type}"]`);
      const count = docs.length;
      totalDocs += count;

      const padName = collection.name.padEnd(35);
      const padType = collection.type.padEnd(14);
      const status = count > 0 ? '✅' : '⚠️ ';

      console.log(`${padName} | ${padType} | ${status} ${count}`);
    }

    console.log('------------------------------------------------------------');
    console.log(`Total Documents: ${totalDocs}\n`);

    // Also check for any other document types
    console.log('📋 Checking for other document types...');
    const allDocs = await client.fetch(`*[!(_id in path("_.**"))][0..0] | group(_type) | map({type: _key, count: length(@)})`);

    if (allDocs && allDocs.length > 0) {
      console.log('\nAll Document Types in Dataset:');
      allDocs.forEach((doc: any) => {
        console.log(`  - ${doc.type}: ${doc.count}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

checkCollections();
