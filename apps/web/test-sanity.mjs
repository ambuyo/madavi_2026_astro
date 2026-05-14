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
    pubDate
  }
`;

try {
  const result = await client.fetch(query);
  console.log('Case Studies Found:', result.length);
  console.log('Data:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}
