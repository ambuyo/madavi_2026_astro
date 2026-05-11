import type { APIRoute } from "astro";

// Return empty array for static generation - this is a dynamic API endpoint
export function getStaticPaths() {
  return [];
}

interface LLMVisitData {
  timestamp: string;
  crawler: string;
  company: string;
  url: string;
  path: string;
  userAgent: string;
  referrer: string;
}

// Store visits in memory (in production, use a database)
const llmVisits: LLMVisitData[] = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: LLMVisitData = await request.json();

    // Validate required fields
    if (!data.crawler || !data.company || !data.path) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log the visit
    llmVisits.push(data);

    // In production, you would:
    // 1. Send to a logging service (DataDog, New Relic, etc.)
    // 2. Store in a database
    // 3. Aggregate statistics

    // Log to console for debugging
    console.log(`[LLM Analytics] ${data.crawler} (${data.company}) visited ${data.path}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "LLM visit logged",
        crawler: data.crawler,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("[LLM Analytics Error]", error);

    return new Response(
      JSON.stringify({
        error: "Failed to log LLM visit",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async () => {
  // Return analytics summary (for admin dashboard)
  const summary = {
    totalVisits: llmVisits.length,
    byCompany: llmVisits.reduce(
      (acc, visit) => {
        acc[visit.company] = (acc[visit.company] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    byPath: llmVisits.reduce(
      (acc, visit) => {
        acc[visit.path] = (acc[visit.path] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    recentVisits: llmVisits.slice(-10),
  };

  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
};
