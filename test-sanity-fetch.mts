import { getCaseStudies } from "./apps/web/src/lib/data";

async function test() {
  console.log("🧪 Testing Sanity fetch...\n");

  try {
    const caseStudies = await getCaseStudies();

    if (!caseStudies || caseStudies.length === 0) {
      console.log("❌ No case studies returned");
      return;
    }

    console.log(`✅ Successfully fetched ${caseStudies.length} case studies from Sanity\n`);

    caseStudies.slice(0, 3).forEach((study, i) => {
      console.log(`[${i + 1}] ${study.data.title}`);
      console.log(`    Client: ${study.data.client}`);
      console.log(`    Industry: ${study.data.industry}`);
      console.log(`    Slug: ${study.slug}\n`);
    });

  } catch (error) {
    console.error("❌ Error fetching from Sanity:", error);
  }
}

test();
