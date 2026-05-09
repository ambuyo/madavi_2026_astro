import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6u680gce',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

async function testConnection() {
  try {
    console.log('🔍 Testing Sanity connection...\n');
    
    // Test 1: Fetch all services
    const services = await client.fetch(`*[_type == "service"]`);
    console.log(`✅ Successfully connected to Sanity`);
    console.log(`📊 Found ${services.length} services\n`);
    
    // Test 2: Fetch AI readiness service specifically
    const aiReadiness = await client.fetch(`*[_type == "service" && slug.current == "ai-readiness"][0]`);
    
    if (aiReadiness) {
      console.log(`✅ Found AI Readiness service`);
      console.log(`📝 Service Name: ${aiReadiness.metadata?.serviceName || aiReadiness.title}`);
      console.log(`🔗 Slug: ${aiReadiness.slug?.current}`);
      console.log(`📋 Sections present:`);
      
      // Check which sections exist
      const sections = [
        'metadata', 'serviceCategory', 'pricing', 'hero', 'problemSection',
        'dimensions', 'whatYouGet', 'whoItsFor', 'scenarios', 'caseStudies',
        'philosophy', 'approach', 'stats', 'faqs', 'finalCTA', 'bookingForm'
      ];
      
      sections.forEach(section => {
        if (aiReadiness[section]) {
          console.log(`   ✓ ${section}`);
        }
      });
    } else {
      console.log(`⚠️  AI Readiness service not found`);
      console.log(`Available services:`);
      services.forEach((s: any) => {
        console.log(`   - ${s.title || 'Untitled'} (${s.slug?.current || 'no-slug'})`);
      });
    }
  } catch (error: any) {
    console.error(`❌ Connection failed:`, error.message);
  }
}

testConnection();
