import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const query = `
  *[_type == "caseStudy"] | order(pubDate desc) {
    _id,
    "slug": slug.current,
    client,
    industry,
    services,
    year,
    tagline,
    aboutClient,
    ourProcess,
    projectUrl,
    results[] {
      label,
      value
    },
    businessImpact,
    testimonial {
      quote,
      author,
      role
    },
    image {
      asset->,
      alt
    },
    projectImages[] {
      asset->,
      alt
    },
    pubDate
  }
`;

try {
  const result = await client.fetch(query);
  console.log('✅ Query successful');
  console.log('Total case studies:', result.length);
  
  // Check first item for missing fields
  if (result.length > 0) {
    const first = result[0];
    console.log('\nFirst case study sample:');
    console.log('- Client:', first.client);
    console.log('- Slug:', first.slug);
    console.log('- Image:', first.image ? 'Present' : 'MISSING');
    console.log('- Results:', first.results ? `${first.results.length} items` : 'MISSING');
    console.log('- businessImpact:', first.businessImpact ? 'Present' : 'MISSING');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
