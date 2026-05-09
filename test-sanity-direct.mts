import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

async function test() {
  console.log("🧪 Testing Sanity connection...\n");

  try {
    const query = `*[_type == "caseStudy"] | order(_createdAt desc) [0...3] {
      _id,
      slug,
      title,
      client,
      industry
    }`;

    const caseStudies = await client.fetch(query);

    if (!caseStudies || caseStudies.length === 0) {
      console.log("❌ No case studies found in Sanity");
      return;
    }

    console.log(`✅ Successfully connected to Sanity!`);
    console.log(`📊 Found ${caseStudies.length} case studies:\n`);

    caseStudies.forEach((study, i) => {
      console.log(`[${i + 1}] ${study.title}`);
      console.log(`    Client: ${study.client}`);
      console.log(`    Industry: ${study.industry}`);
      console.log(`    Slug: ${study.slug.current}\n`);
    });

  } catch (error) {
    console.error("❌ Error connecting to Sanity:", error.message);
  }
}

test();
