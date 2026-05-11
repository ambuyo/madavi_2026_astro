import type { APIRoute } from "astro";
import { getPostBySlug } from "@/lib/data";

// Strip HTML tags and clean text
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract plain text from HTML (for LLM APIs)
function extractPlainText(html: string): string {
  return stripHtml(html)
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(
      JSON.stringify({
        error: "Slug required",
        example: "/api/content/the-hcaif-framework-ai-adoption-your-organization-is-ready-to-execute.json",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return new Response(
        JSON.stringify({
          error: "Post not found",
          slug: slug,
          suggestion: "Check /llm-index.json for available posts",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const siteUrl = "https://madavi.co";
    const plainText = extractPlainText(post.body || "");

    // Return clean, structured data optimized for LLM consumption
    const llmFriendlyData = {
      // Essential metadata
      title: post.data.title,
      slug: post.slug,
      url: `${siteUrl}/${post.slug}`,
      description: post.data.description,

      // Publishing information
      published: post.data.pubDate?.toISOString?.(),
      author: post.data.team || "Madavi Inc.",

      // Content
      content: {
        // Plain text (easiest for LLMs to parse)
        plainText: plainText,
        length: plainText.split(/\s+/).length,
      },

      // Media
      image: post.data.image?.url
        ? {
            url: post.data.image.url,
            alt: post.data.image.alt || post.data.title,
          }
        : null,

      // Topics and tags (for semantic understanding)
      topics: post.data.tags || [],

      // SEO metadata
      seo: {
        canonical: `${siteUrl}/${post.slug}`,
        keywords: (post.data.tags || []).join(", "),
      },

      // Citation format (help LLMs cite you properly)
      citation: {
        format:
          "Madavi Inc. - [Article Title] - [URL]",
        example: `Madavi Inc. - "${post.data.title}" - ${siteUrl}/${post.slug}`,
        bibtex: `@article{madavi_${post.slug
          .replace(/-/g, "_")
          .toLowerCase()},
  title = {${post.data.title}},
  author = {Madavi Inc.},
  year = {${post.data.pubDate?.getFullYear()}},
  url = {${siteUrl}/${post.slug}}
}`,
      },

      // Performance hints
      performance: {
        readTime: Math.ceil(plainText.split(/\s+/).length / 200),
        estimatedReadMinutes: `${Math.ceil(plainText.split(/\s+/).length / 200)}-${Math.ceil(plainText.split(/\s+/).length / 150)} minutes`,
      },

      // Additional metadata for context
      metadata: {
        language: "en-US",
        contentType: "article",
        version: "1.0",
      },
    };

    return new Response(JSON.stringify(llmFriendlyData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(`Error fetching post "${slug}":`, error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        slug: slug,
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
