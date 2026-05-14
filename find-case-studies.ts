import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

async function findCaseStudies() {
  try {
    console.log('🔍 Searching for Case Studies in Sanity\n');

    // Get first 100 documents to see what types exist
    console.log('Fetching all documents in the dataset...\n');
    const allDocs = await client.fetch(`*[!(_id in path("_.**"))][0..100]`);

    // Group by type
    const typeMap: { [key: string]: number } = {};
    const sampleByType: { [key: string]: any[] } = {};

    allDocs.forEach((doc: any) => {
      if (!typeMap[doc._type]) {
        typeMap[doc._type] = 0;
        sampleByType[doc._type] = [];
      }
      typeMap[doc._type]++;
      if (sampleByType[doc._type].length < 3) {
        sampleByType[doc._type].push({
          _id: doc._id,
          title: doc.title,
          client: doc.client,
          slug: doc.slug?.current,
        });
      }
    });

    console.log('Document Types Found:');
    console.log('======================\n');

    for (const [type, count] of Object.entries(typeMap)) {
      console.log(`📄 Type: "${type}" - ${count} documents`);
      if (sampleByType[type]) {
        sampleByType[type].forEach((doc: any) => {
          const label = doc.title || doc.client || doc._id;
          console.log(`   - ${label}`);
        });
      }
      console.log();
    }

    // Specifically search for documents with client field (case studies likely have this)
    console.log('\n🎯 Documents with "client" field (likely case studies):');
    const clientDocs = await client.fetch(`*[client != null]`);
    console.log(`Found ${clientDocs.length} documents with a client field\n`);

    if (clientDocs.length > 0) {
      console.log('Sample of documents with client field:');
      clientDocs.slice(0, 5).forEach((doc: any) => {
        console.log(`  - Type: "${doc._type}", Client: "${doc.client}", Title: "${doc.title || 'N/A'}"`);
      });

      if (clientDocs.length > 5) {
        console.log(`  ... and ${clientDocs.length - 5} more`);
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

findCaseStudies();
