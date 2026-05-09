import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_STUDIO_TOKEN || "",
  apiVersion: "2024-01-01",
});

const sampleCareers = [
  {
    _type: "career",
    title: "Senior AI Strategy Consultant",
    slug: { _type: "slug", current: "senior-ai-strategy-consultant" },
    description:
      "Lead transformational AI adoption initiatives for enterprise clients across East Africa. Work with C-suite executives to develop and execute comprehensive AI strategies.",
    location: "Nairobi, Kenya",
    type: "Full-time",
    remote: "Hybrid",
    salary: "$100,000 - $150,000",
    postedDate: "2026-05-03",
    responsibilities: [
      "Conduct comprehensive AI readiness assessments for enterprise clients",
      "Develop multi-year AI adoption roadmaps aligned with business objectives",
      "Lead executive workshops and strategy sessions",
      "Manage implementation planning and change management initiatives",
      "Mentor and develop junior consultants",
    ],
    requirements: [
      "8+ years in business strategy or management consulting",
      "Deep understanding of AI/ML technologies and applications",
      "Proven experience with organizational transformation",
      "Excellent communication and stakeholder management skills",
      "Bachelor's degree in business, technology, or related field (MBA preferred)",
    ],
    benefits: [
      "Competitive salary with performance bonus",
      "Flexible work arrangement",
      "Professional development budget ($5,000/year)",
      "Health, dental, and wellness benefits",
      "Equity participation",
    ],
    applyUrl: "https://careers.madavi.ai/apply/senior-consultant",
    applyEmail: "careers@madavi.ai",
  },
  {
    _type: "career",
    title: "AI Impact Research Specialist",
    slug: { _type: "slug", current: "ai-impact-research-specialist" },
    description:
      "Drive our research agenda by investigating AI adoption patterns, impacts, and best practices across African organizations. Produce actionable insights that inform client strategies.",
    location: "Dar es Salaam, Tanzania",
    type: "Full-time",
    remote: "Remote",
    salary: "$55,000 - $75,000",
    postedDate: "2026-05-02",
    responsibilities: [
      "Conduct qualitative and quantitative research on AI adoption in African markets",
      "Analyze case studies of successful and failed AI implementations",
      "Prepare research reports, white papers, and thought leadership content",
      "Interview organizational leaders and capture lessons learned",
      "Track emerging AI trends and technologies",
      "Present findings to clients and at industry events",
    ],
    requirements: [
      "4+ years in research, data analysis, or similar role",
      "Strong writing and analytical skills",
      "Understanding of AI technologies and business applications",
      "Experience with both qualitative and quantitative research methods",
      "Bachelor's degree in relevant field (Master's preferred)",
      "Familiarity with African tech ecosystem",
    ],
    benefits: [
      "Competitive salary",
      "Fully remote work arrangement",
      "Professional development budget",
      "Health benefits",
      "Conference attendance allowance",
    ],
    applyUrl: "https://careers.madavi.ai/apply/research-specialist",
    applyEmail: "careers@madavi.ai",
  },
];

const sampleEvents = [
  {
    _type: "event",
    title: "AI Leadership Cohort - Cohort 3",
    slug: { _type: "slug", current: "ai-leadership-cohort-cohort-3" },
    description:
      "A transformative 12-week cohort program for C-suite executives and senior leaders navigating AI adoption. Learn from industry experts and peer leaders while developing your organizational AI strategy.",
    startDate: "2026-06-15T09:00:00Z",
    endDate: "2026-09-01T17:00:00Z",
    location: "Nairobi, Kenya",
    eventType: "cohort",
    capacity: 25,
    registrationUrl: "https://madavi.ai/register/cohort-3",
    registrationEmail: "cohorts@madavi.ai",
    speakers: [
      "Dr. Jane Okonkwo - AI Strategy Lead",
      "Prof. David Kipchoge - Organizational Transformation",
      "Amara Obi - Ethics & Governance",
    ],
    price: "$8,500",
  },
  {
    _type: "event",
    title: "Workshop: Building Your AI Governance Framework",
    slug: { _type: "slug", current: "workshop-ai-governance-framework" },
    description:
      "Hands-on workshop where teams develop a customized AI governance framework for their organization. Perfect for legal, compliance, and leadership teams.",
    startDate: "2026-05-20T09:00:00Z",
    endDate: "2026-05-20T17:00:00Z",
    location: "Kampala, Uganda",
    eventType: "workshop",
    capacity: 40,
    registrationUrl: "https://madavi.ai/register/governance-workshop",
    registrationEmail: "workshops@madavi.ai",
    speakers: ["Dr. Amara Obi - Governance Expert"],
    price: "$2,500",
  },
];

async function seedData() {
  try {
    console.log("Seeding Sanity database with sample data...\n");

    // Create careers
    console.log("Creating sample careers...");
    for (const career of sampleCareers) {
      const createdCareer = await client.create(career);
      console.log(`✓ Created career: ${createdCareer.title}`);
    }

    console.log("\nCreating sample events...");
    for (const event of sampleEvents) {
      const createdEvent = await client.create(event);
      console.log(`✓ Created event: ${createdEvent.title}`);
    }

    console.log("\n✅ Successfully seeded Sanity database!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
