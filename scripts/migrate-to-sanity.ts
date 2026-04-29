/**
 * Migration / Seed Script: Content Collections → Sanity
 *
 * This script reads your existing markdown content from apps/web/src/content
 * and uploads it to Sanity, including images.
 *
 * Collections: posts, team, services, industries, caseStudies, infopages
 *
 * Usage:
 *   pnpm run seed:all   (full clear-then-seed: deletes all docs of each type, then creates one per type from content)
 *   SANITY_TOKEN=... npx tsx scripts/migrate-to-sanity.ts  (migrate only, no delete)
 *
 * seed:all ensures exactly one document per content type in Studio:
 * - Deletes all existing documents of each type (batched, 25 per transaction)
 * - Deletes by the exact document ids that will be created (avoids _type immutable errors)
 * - Waits 2–3 seconds after deletes before creating
 *
 * The script reads SANITY_PROJECT_ID from apps/web/.env
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { config } from "dotenv";

// Load environment variables from apps/web/.env
const webEnvPath = path.join(__dirname, "../apps/web/.env");
if (fs.existsSync(webEnvPath)) {
  config({ path: webEnvPath });
} else {
  console.warn(
    `Warning: ${webEnvPath} not found. Using environment variables.`
  );
}

// Sanity client configuration
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";

if (!projectId) {
  console.error("\n❌ Error: SANITY_PROJECT_ID is missing.");
  console.log("\nMake sure apps/web/.env exists with:");
  console.log("  SANITY_PROJECT_ID=your-project-id");
  console.log("\nOr pass it directly:");
  console.log(
    "  SANITY_PROJECT_ID=your-project-id SANITY_TOKEN=your-token npx tsx migrate-to-sanity.ts"
  );
  process.exit(1);
}

if (!process.env.SANITY_TOKEN) {
  console.error("\n❌ Error: SANITY_TOKEN environment variable is required.");
  console.log("\nTo get a token:");
  console.log("1. Go to https://www.sanity.io/manage → Your Project → API");
  console.log("2. Create a new token with 'Editor' permissions");
  console.log("3. Run: SANITY_TOKEN=your-token npx tsx migrate-to-sanity.ts");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const WEB_PATH = path.join(__dirname, "../apps/web/src");
const CONTENT_PATH = path.join(WEB_PATH, "content");
const IMAGES_PATH = path.join(WEB_PATH, "images");

// Collection names (for reference; content dirs must match)
const _EXPECTED_COLLECTIONS = [
  "posts",
  "team",
  "services",
  "industries",
  "caseStudies",
  "infopages",
];

/** Sanity _type values for each collection (for delete-by-type) */
const SANITY_TYPES = [
  "post",
  "teamMember",
  "service",
  "industry",
  "caseStudy",
  "infoPage",
] as const;

const BATCH_SIZE = 25;
const DELAY_AFTER_DELETE_MS = 2500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all document ids for a given _type */
async function fetchIdsByType(_type: string): Promise<string[]> {
  const ids = await client.fetch<string[]>(`*[_type == $type]._id`, { type: _type });
  return ids;
}

/** Delete documents by id in batches */
async function deleteByIds(ids: string[], label: string) {
  if (ids.length === 0) return;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();
    batch.forEach((id) => tx.delete(id));
    await tx.commit();
    console.log(`  Deleted ${Math.min(i + BATCH_SIZE, ids.length)}/${ids.length} ${label}`);
  }
}

/** Full seed: delete all documents of each type, then by exact ids to be created, wait, then migrate */
async function deleteAllThenSeed() {
  console.log("\n🗑️  Deleting existing documents by type (batched)...");
  for (const _type of SANITY_TYPES) {
    const ids = await fetchIdsByType(_type);
    await deleteByIds(ids, _type);
  }

  console.log("\n🗑️  Deleting by exact document ids that will be created (avoids _type immutable)...");
  const teamDir = path.join(CONTENT_PATH, "team");
  const postsDir = path.join(CONTENT_PATH, "posts");
  const servicesDir = path.join(CONTENT_PATH, "services");
  const industriesDir = path.join(CONTENT_PATH, "industries");
  const caseStudiesDir = path.join(CONTENT_PATH, "caseStudies");
  const infoPagesDir = path.join(CONTENT_PATH, "infopages");

  const idsToDelete: string[] = [];
  for (const dir of [teamDir, postsDir, servicesDir, industriesDir, caseStudiesDir, infoPagesDir]) {
    const files = readMarkdownFiles(dir);
    for (const { slug } of files) {
      if (dir === teamDir) idsToDelete.push(`team-${slug}`);
      else if (dir === postsDir) idsToDelete.push(`post-${slug}`);
      else if (dir === servicesDir) idsToDelete.push(`service-${slug}`);
      else if (dir === industriesDir) idsToDelete.push(`industry-${slug}`);
      else if (dir === caseStudiesDir) idsToDelete.push(`casestudy-${slug}`);
      else if (dir === infoPagesDir) idsToDelete.push(`infopage-${slug}`);
    }
  }
  if (idsToDelete.length > 0) {
    await deleteByIds(idsToDelete, "by-id cleanup");
  }

  console.log(`\n⏳ Waiting ${DELAY_AFTER_DELETE_MS / 1000}s for Sanity to apply mutations...`);
  await sleep(DELAY_AFTER_DELETE_MS);
}

// Helper to read markdown files from a directory
function readMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content: body } = matter(content);
    const slug = path.basename(file, ".md");
    return { slug, frontmatter: data, body };
  });
}

// Upload an image to Sanity and return the asset reference
async function uploadImage(imagePath: string, altText: string = "") {
  // Convert /src/images/... path to actual file path
  const relativePath = imagePath.replace(/^\/src\/images\//, "");
  const fullPath = path.join(IMAGES_PATH, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload("image", imageBuffer, {
      filename: path.basename(fullPath),
    });

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: altText,
    };
  } catch (error) {
    console.error(`  ✗ Failed to upload image: ${fullPath}`, error);
    return null;
  }
}

// Convert markdown to Portable Text blocks
function markdownToPortableText(markdown: string) {
  const blocks: any[] = [];
  const lines = markdown.split("\n");
  let currentParagraph: string[] = [];
  let inList = false;
  let listType: "bullet" | "number" = "bullet";
  let listItems: any[] = [];

  const generateKey = () => Math.random().toString(36).substr(2, 9);

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join("\n").trim();
      if (text) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: generateKey(),
              text: text,
              marks: [],
            },
          ],
        });
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      listItems.forEach((item) => blocks.push(item));
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    // Headers
    if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h4",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^#### /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^### /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h2",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^## /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h1",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^# /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.match(/^[-*]\s/)) {
      // Bullet list item
      flushParagraph();
      if (!inList || listType !== "bullet") {
        flushList();
        inList = true;
        listType = "bullet";
      }
      listItems.push({
        _type: "block",
        _key: generateKey(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^[-*]\s/, ""),
            marks: [],
          },
        ],
      });
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered list item
      flushParagraph();
      if (!inList || listType !== "number") {
        flushList();
        inList = true;
        listType = "number";
      }
      listItems.push({
        _type: "block",
        _key: generateKey(),
        style: "normal",
        listItem: "number",
        level: 1,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^\d+\.\s/, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("> ")) {
      // Blockquote
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "blockquote",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^> /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else if (!line.startsWith("![") && !line.startsWith("|")) {
      // Skip images and tables, add to paragraph
      flushList();
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}

// =============================================================================
// MIGRATE TEAM MEMBERS
// =============================================================================

async function migrateTeam(): Promise<Record<string, string>> {
  console.log("\n👥 Migrating Team Members...");
  const teamDir = path.join(CONTENT_PATH, "team");
  const teamMembers = readMarkdownFiles(teamDir);
  const teamMap: Record<string, string> = {}; // slug -> _id

  if (teamMembers.length === 0) {
    console.log("  No team members found, skipping...");
    return teamMap;
  }

  for (const member of teamMembers) {
    const { slug, frontmatter, body } = member;
    console.log(`  - ${frontmatter.name} (${slug})`);

    // Validate required fields
    if (!frontmatter.name) {
      console.error(`    ✗ Missing required field: name`);
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Convert body to Portable Text
    const portableTextBody = body.trim()
      ? markdownToPortableText(body)
      : undefined;

    const doc = {
      _type: "teamMember",
      _id: `team-${slug}`,
      name: frontmatter.name,
      slug: { _type: "slug", current: slug },
      role: frontmatter.role,
      bio: frontmatter.bio,
      image,
      socials: frontmatter.socials
        ? {
            twitter:
              frontmatter.socials.twitter !== "#_"
                ? frontmatter.socials.twitter
                : undefined,
            website:
              frontmatter.socials.website !== "#_"
                ? frontmatter.socials.website
                : undefined,
            linkedin:
              frontmatter.socials.linkedin !== "#_"
                ? frontmatter.socials.linkedin
                : undefined,
            email:
              frontmatter.socials.email !== "#_"
                ? frontmatter.socials.email
                : undefined,
          }
        : undefined,
      body: portableTextBody,
    };

    try {
      const result = await client.createOrReplace(doc);
      teamMap[slug] = result._id;
      console.log(`    ✓ Created: ${frontmatter.name}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.name}`, error);
    }
  }

  return teamMap;
}

// =============================================================================
// MIGRATE POSTS
// =============================================================================

async function migratePosts(teamMap: Record<string, string>) {
  console.log("\n📝 Migrating Posts...");
  const postsDir = path.join(CONTENT_PATH, "posts");
  const posts = readMarkdownFiles(postsDir);

  if (posts.length === 0) {
    console.log("  No posts found, skipping...");
    return;
  }

  for (const post of posts) {
    const { slug, frontmatter, body } = post;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Validate required fields
    if (
      !frontmatter.title ||
      !frontmatter.pubDate ||
      !frontmatter.description
    ) {
      console.error(
        `    ✗ Missing required fields (title, pubDate, description)`
      );
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Get team reference
    const teamRef =
      frontmatter.team && teamMap[frontmatter.team]
        ? { _type: "reference", _ref: teamMap[frontmatter.team] }
        : undefined;

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "post",
      _id: `post-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description,
      pubDate: new Date(frontmatter.pubDate).toISOString(),
      image,
      tags: frontmatter.tags || [],
      team: teamRef,
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }
}

// =============================================================================
// MIGRATE SERVICES
// =============================================================================

async function migrateServices() {
  console.log("\n🛠️ Migrating Services...");
  const servicesDir = path.join(CONTENT_PATH, "services");
  const services = readMarkdownFiles(servicesDir);

  if (services.length === 0) {
    console.log("  No services found, skipping...");
    return;
  }

  for (const service of services) {
    const { slug, frontmatter, body } = service;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Validate required fields
    if (!frontmatter.title || !frontmatter.summary || !frontmatter.category) {
      console.error(`    ✗ Missing required fields (title, summary, category)`);
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "service",
      _id: `service-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      summary: frontmatter.summary,
      category: frontmatter.category,
      features: frontmatter.features || [],
      outcomes: frontmatter.outcomes || [],
      industries: frontmatter.industries || [],
      pricing: frontmatter.pricing
        ? {
            startingPrice: frontmatter.pricing.startingPrice,
            monthlyPrice: frontmatter.pricing.monthlyPrice,
            pricingModel: frontmatter.pricing.pricingModel,
            note: frontmatter.pricing.note,
          }
        : undefined,
      image,
      pubDate: frontmatter.pubDate
        ? new Date(frontmatter.pubDate).toISOString()
        : undefined,
      updatedDate: frontmatter.updatedDate
        ? new Date(frontmatter.updatedDate).toISOString()
        : undefined,
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }
}

// =============================================================================
// MIGRATE INDUSTRIES
// =============================================================================

async function migrateIndustries() {
  console.log("\n🏭 Migrating Industries...");
  const industriesDir = path.join(CONTENT_PATH, "industries");
  const industries = readMarkdownFiles(industriesDir);

  if (industries.length === 0) {
    console.log("  No industries found, skipping...");
    return;
  }

  for (const industry of industries) {
    const { slug, frontmatter, body } = industry;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Validate required fields
    if (!frontmatter.title || !frontmatter.summary) {
      console.error(`    ✗ Missing required fields (title, summary)`);
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "industry",
      _id: `industry-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      summary: frontmatter.summary,
      painPoints: frontmatter.painPoints || [],
      relevantServices: frontmatter.relevantServices || [],
      image,
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }
}

// =============================================================================
// MIGRATE CASE STUDIES
// =============================================================================

async function migrateCaseStudies() {
  console.log("\n📊 Migrating Case Studies...");
  const caseStudiesDir = path.join(CONTENT_PATH, "caseStudies");
  const caseStudies = readMarkdownFiles(caseStudiesDir);

  if (caseStudies.length === 0) {
    console.log("  No case studies found, skipping...");
    return;
  }

  for (const caseStudy of caseStudies) {
    const { slug, frontmatter, body } = caseStudy;
    console.log(`  - ${frontmatter.title} (${slug})`);

    // Validate required fields
    if (
      !frontmatter.title ||
      !frontmatter.client ||
      !frontmatter.industry ||
      !frontmatter.services ||
      !frontmatter.challenge ||
      !frontmatter.solution ||
      !frontmatter.results ||
      !frontmatter.pubDate
    ) {
      console.error(
        `    ✗ Missing required fields (title, client, industry, services, challenge, solution, results, pubDate)`
      );
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(frontmatter.image.url, frontmatter.image.alt);
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "caseStudy",
      _id: `casestudy-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      client: frontmatter.client,
      industry: frontmatter.industry,
      services: frontmatter.services,
      challenge: frontmatter.challenge,
      solution: frontmatter.solution,
      results: frontmatter.results.map((r: any) => ({
        _type: "object",
        _key: Math.random().toString(36).substr(2, 9),
        label: r.label,
        value: r.value,
      })),
      testimonial: frontmatter.testimonial
        ? {
            quote: frontmatter.testimonial.quote,
            author: frontmatter.testimonial.author,
            role: frontmatter.testimonial.role,
          }
        : undefined,
      image,
      pubDate: new Date(frontmatter.pubDate).toISOString(),
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.title}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.title}`, error);
    }
  }
}

// =============================================================================
// MIGRATE INFO PAGES
// =============================================================================

async function migrateInfoPages() {
  console.log("\n📄 Migrating Info Pages...");
  const infoPagesDir = path.join(CONTENT_PATH, "infopages");
  const infoPages = readMarkdownFiles(infoPagesDir);

  if (infoPages.length === 0) {
    console.log("  No info pages found, skipping...");
    return;
  }

  for (const page of infoPages) {
    const { slug, frontmatter, body } = page;
    console.log(`  - ${frontmatter.page} (${slug})`);

    // Validate required fields
    if (!frontmatter.page || !frontmatter.pubDate) {
      console.error(`    ✗ Missing required fields (page, pubDate)`);
      continue;
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "infoPage",
      _id: `infopage-${slug}`,
      page: frontmatter.page,
      slug: { _type: "slug", current: slug },
      pubDate: new Date(frontmatter.pubDate).toISOString(),
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created: ${frontmatter.page}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${frontmatter.page}`, error);
    }
  }
}

// =============================================================================
// MAIN MIGRATION
// =============================================================================

async function migrate() {
  console.log("🚀 Starting migration to Sanity...\n");
  console.log("Project ID:", projectId);
  console.log("Dataset:", dataset);
  console.log("Content path:", CONTENT_PATH);

  // Verify content directory exists
  if (!fs.existsSync(CONTENT_PATH)) {
    console.error(`\n❌ Error: Content directory not found: ${CONTENT_PATH}`);
    process.exit(1);
  }

  if (process.env.SEED_ALL === "1") {
    await deleteAllThenSeed();
  }

  // List available collections
  const availableCollections = fs
    .readdirSync(CONTENT_PATH)
    .filter((f) => fs.statSync(path.join(CONTENT_PATH, f)).isDirectory());
  console.log("\nAvailable collections:", availableCollections.join(", "));

  try {
    // Migrate in order (team first since posts reference them)
    const teamMap = await migrateTeam();
    await migratePosts(teamMap);
    await migrateServices();
    await migrateIndustries();
    await migrateCaseStudies();
    await migrateInfoPages();

    console.log("\n✅ Migration complete!");
    console.log("\nYou can now:");
    console.log("1. Open Sanity Studio: cd apps/studio && pnpm dev");
    console.log("2. View your content at http://localhost:3333");
    console.log(
      "3. Enable Sanity in apps/web/src/lib/data.ts: USE_SANITY = true"
    );
    console.log("4. Run the site: cd apps/web && pnpm dev");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
