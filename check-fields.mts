import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN || '',
});

async function check() {
  const query = `*[_type == "caseStudy"][0] {
    title,
    client,
    year,
    aboutClient,
    scopeOfWork,
    whatWeDid,
    industry,
    services,
    results,
    testimonial,
    projectUrl
  }`;

  const study = await client.fetch(query);

  console.log('📋 Case Study Fields:\n');
  console.log(`Title: ${study.title}`);
  console.log(`Client: ${study.client}`);
  console.log(`Year: ${study.year}`);
  console.log(`Industry: ${study.industry}`);
  console.log(`Services: ${study.services?.join(', ')}`);
  console.log(`Project URL: ${study.projectUrl || 'Not set'}`);
  console.log(`\n📝 Content Fields:`);
  console.log(`About Client: ${study.aboutClient ? '✅ Set' : '❌ Missing'}`);
  console.log(`Scope of Work: ${study.scopeOfWork ? '✅ Set' : '❌ Missing'}`);
  console.log(`What We Did: ${study.whatWeDid ? '✅ Set' : '❌ Missing'}`);
  console.log(`Results: ${study.results?.length > 0 ? `✅ ${study.results.length} results` : '❌ Missing'}`);
  console.log(`Testimonial: ${study.testimonial ? '✅ Set' : '❌ Missing'}`);
}

check();
