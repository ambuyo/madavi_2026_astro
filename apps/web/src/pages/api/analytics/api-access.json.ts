import type { APIRoute } from "astro";

// Return empty array for static generation - this is a dynamic API endpoint
export function getStaticPaths() {
  return [];
}

interface APIAccessData {
  timestamp: string;
  endpoint: string;
  crawler: {
    botName: string;
    company: string;
  };
}

// Store API access logs in memory
const apiAccessLogs: APIAccessData[] = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: APIAccessData = await request.json();

    // Validate required fields
    if (!data.endpoint || !data.crawler) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log the API access
    apiAccessLogs.push(data);

    console.log(
      `[API Analytics] ${data.crawler.botName} accessed ${data.endpoint}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "API access logged",
        endpoint: data.endpoint,
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
    console.error("[API Analytics Error]", error);

    return new Response(
      JSON.stringify({
        error: "Failed to log API access",
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
  // Return API access summary
  const summary = {
    totalAccess: apiAccessLogs.length,
    byEndpoint: apiAccessLogs.reduce(
      (acc, log) => {
        acc[log.endpoint] = (acc[log.endpoint] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    byCrawler: apiAccessLogs.reduce(
      (acc, log) => {
        const key = log.crawler.botName;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    recentAccess: apiAccessLogs.slice(-10),
  };

  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
};
