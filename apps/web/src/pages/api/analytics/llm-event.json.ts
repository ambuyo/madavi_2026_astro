import type { APIRoute } from "astro";

// Return empty array for static generation - this is a dynamic API endpoint
export function getStaticPaths() {
  return [];
}

interface LLMEventData {
  timestamp: string;
  eventType: string;
  crawler: {
    botName: string;
    company: string;
  };
  data?: Record<string, any>;
}

// Store events in memory
const llmEvents: LLMEventData[] = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const event: LLMEventData = await request.json();

    // Validate required fields
    if (!event.eventType || !event.crawler) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log the event
    llmEvents.push(event);

    console.log(
      `[LLM Event] ${event.crawler.botName}: ${event.eventType}`,
      event.data
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Event logged",
        eventType: event.eventType,
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
    console.error("[LLM Event Error]", error);

    return new Response(
      JSON.stringify({
        error: "Failed to log event",
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
  // Return event summary
  const summary = {
    totalEvents: llmEvents.length,
    byEventType: llmEvents.reduce(
      (acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    byCrawler: llmEvents.reduce(
      (acc, event) => {
        const key = event.crawler.botName;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    recentEvents: llmEvents.slice(-10),
  };

  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
};
