import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};

envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && !key.startsWith("#")) {
    env[key.trim()] = valueParts.join("=").trim();
  }
});

const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID || "6u680gce",
  dataset: env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

const infoPagesToCreate = [
  {
    _type: "infoPage",
    page: "Privacy Policy",
    slug: {
      _type: "slug",
      current: "privacy-policy",
    },
    pubDate: new Date().toISOString(),
    body: [
      {
        _key: "intro",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "intro-text",
            _type: "span",
            text: "Privacy Policy",
          },
        ],
      },
      {
        _key: "intro-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "intro-para-text",
            _type: "span",
            text: "At Madavi, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
          },
        ],
      },
      {
        _key: "info-collect",
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "info-collect-text",
            _type: "span",
            text: "Information We Collect",
          },
        ],
      },
      {
        _key: "info-collect-list",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "info-collect-list-text",
            _type: "span",
            text: "We collect information you provide directly, such as your name, email address, phone number, and any other information you choose to provide when contacting us or using our services.",
          },
        ],
        listItem: "bullet",
      },
    ],
  },
  {
    _type: "infoPage",
    page: "Terms of Service",
    slug: {
      _type: "slug",
      current: "terms-of-service",
    },
    pubDate: new Date().toISOString(),
    body: [
      {
        _key: "tos-intro",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "tos-intro-text",
            _type: "span",
            text: "Terms of Service",
          },
        ],
      },
      {
        _key: "tos-intro-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "tos-intro-para-text",
            _type: "span",
            text: "These Terms of Service constitute a legally binding agreement between you and Madavi Inc. By accessing and using this website and our services, you accept and agree to be bound by and abide by the terms and conditions outlined here.",
          },
        ],
      },
      {
        _key: "tos-acceptance",
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "tos-acceptance-text",
            _type: "span",
            text: "Acceptance of Terms",
          },
        ],
      },
      {
        _key: "tos-acceptance-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "tos-acceptance-para-text",
            _type: "span",
            text: "If you do not agree with any part of these terms, then you may not use our website or services. We reserve the right to update these Terms of Service at any time.",
          },
        ],
      },
    ],
  },
  {
    _type: "infoPage",
    page: "Cookie Policy",
    slug: {
      _type: "slug",
      current: "cookie-policy",
    },
    pubDate: new Date().toISOString(),
    body: [
      {
        _key: "cookie-intro",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "cookie-intro-text",
            _type: "span",
            text: "Cookie Policy",
          },
        ],
      },
      {
        _key: "cookie-intro-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "cookie-intro-para-text",
            _type: "span",
            text: "This Cookie Policy explains how Madavi uses cookies and similar tracking technologies on our website to enhance your browsing experience and understand how you use our services.",
          },
        ],
      },
      {
        _key: "cookie-what",
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "cookie-what-text",
            _type: "span",
            text: "What Are Cookies?",
          },
        ],
      },
      {
        _key: "cookie-what-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "cookie-what-para-text",
            _type: "span",
            text: "Cookies are small data files stored on your browser or device. They help us remember your preferences, understand site usage patterns, and improve your experience.",
          },
        ],
      },
    ],
  },
  {
    _type: "infoPage",
    page: "Accessibility Statement",
    slug: {
      _type: "slug",
      current: "accessibility",
    },
    pubDate: new Date().toISOString(),
    body: [
      {
        _key: "access-intro",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "access-intro-text",
            _type: "span",
            text: "Accessibility Statement",
          },
        ],
      },
      {
        _key: "access-intro-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "access-intro-para-text",
            _type: "span",
            text: "Madavi is committed to ensuring digital accessibility for all users, including those with disabilities. We strive to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA.",
          },
        ],
      },
      {
        _key: "access-commitment",
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "access-commitment-text",
            _type: "span",
            text: "Our Commitment",
          },
        ],
      },
      {
        _key: "access-commitment-para",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "access-commitment-para-text",
            _type: "span",
            text: "We are continuously working to improve the accessibility of our website. If you encounter any accessibility issues or have suggestions, please contact us at accessibility@madavi.co.",
          },
        ],
      },
    ],
  },
];

async function populateInfoPages() {
  if (!env.SANITY_WRITE_TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not found in .env file");
    console.error("Available keys:", Object.keys(env).filter(k => k.includes("SANITY")));
    process.exit(1);
  }

  try {
    console.log("🔄 Creating info pages in Sanity...");

    for (const page of infoPagesToCreate) {
      try {
        // Check if page already exists
        const existing = await client.fetch(
          `*[_type == "infoPage" && slug.current == $slug][0]._id`,
          { slug: page.slug.current }
        );

        if (existing) {
          console.log(`✏️  Updating: ${page.page}`);
          await client.patch(existing).set(page).commit();
        } else {
          console.log(`✅ Creating: ${page.page}`);
          await client.create(page);
        }
      } catch (error) {
        console.error(`❌ Error processing ${page.page}:`, error);
      }
    }

    console.log("\n✨ Info pages populated successfully!");
  } catch (error) {
    console.error("Failed to populate info pages:", error);
    process.exit(1);
  }
}

populateInfoPages();
