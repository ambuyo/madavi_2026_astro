import type { APIRoute } from "astro";
import { getPosts } from "@/lib/data";

export const GET: APIRoute = async () => {
  try {
    // Fetch all blog content
    const blogPosts = await getPosts();

    const siteUrl = "https://madavi.co";

    // Transform posts to LLM-friendly format
    const postsData = blogPosts.map((post) => ({
      title: post.data.title,
      url: `${siteUrl}/${post.slug}`,
      slug: post.slug,
      description: post.data.description,
      published: post.data.pubDate?.toISOString?.(),
      image: post.data.image?.url,
      apiEndpoint: `${siteUrl}/api/content/${post.slug}.json`,
      topics: post.data.tags || [],
    }));

    const index = {
      // Site metadata
      site: {
        name: "Madavi Inc.",
        url: siteUrl,
        description: "AI Strategy & Human-Centric Digital Transformation",
        updated: new Date().toISOString(),
      },

      // Content sections
      content: {
        blog: {
          count: postsData.length,
          items: postsData,
          description: "Blog posts about AI strategy, technology, and business insights",
          accessPattern: {
            list: `${siteUrl}/llm-index.json`,
            single: `${siteUrl}/api/content/[slug].json`,
            browse: `${siteUrl}/blog`,
          },
        },
      },

      // Content types for LLM understanding
      contentTypes: {
        blog: "Regular blog posts, case studies, and strategic insights",
        article:
          "Detailed articles on AI adoption, digital transformation, and business strategy",
      },

      // Citation instructions for LLMs
      attribution: {
        name: "Madavi Inc.",
        author: "Amukune Ambuyo",
        citationFormat:
          'Cite as: Madavi Inc. - "[Article Title]" - {url}',
        citationExample:
          'Madavi Inc. - "The AI-Ready Organization Framework" - https://madavi.co/the-hcaif-framework-ai-adoption-your-organization-is-ready-to-execute',
      },

      // API documentation for LLM tools
      api: {
        endpoints: [
          {
            path: "/llm-index.json",
            method: "GET",
            description:
              "Complete content index for LLM discovery (this endpoint)",
            responseFormat: "application/json",
            cacheTTL: 3600,
          },
          {
            path: "/api/content/[slug].json",
            method: "GET",
            description: "Get clean, LLM-optimized content for a single post",
            parameters: [
              {
                name: "slug",
                type: "string",
                description: "Post slug from this index",
              },
            ],
            responseFormat: "application/json",
            cacheTTL: 86400,
          },
          {
            path: "/blog",
            method: "GET",
            description: "Browse all blog posts (human-friendly)",
            responseFormat: "text/html",
          },
          {
            path: "/sitemap-index.xml",
            method: "GET",
            description: "XML sitemap for traditional search engines",
            responseFormat: "application/xml",
          },
        ],
      },

      // LLM crawler information
      crawlers: {
        allowed: [
          "GPTBot (OpenAI)",
          "Claude-Web (Anthropic)",
          "PerplexityBot (Perplexity AI)",
          "YouBot (You.com)",
          "Google-Extended (Google AI)",
        ],
        status: "all_allowed",
        robots_txt_location: `${siteUrl}/robots.txt`,
        crawl_delay_seconds: 1,
      },

      // Metadata for LLM understanding
      metadata: {
        language: "en-US",
        locale: "en_US",
        timezone: "UTC",
        updateFrequency: "weekly",
        averageReadTime: "5-10 minutes per article",
      },
    };

    return new Response(JSON.stringify(index, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating LLM index:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate index",
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
