import { readCachedPosts } from "../../lib/wordpress/cache";
import { transformWordPressPost } from "../../lib/wordpress/transforms";

export async function GET() {
  try {
    const cachedPosts = await readCachedPosts();

    if (!cachedPosts) {
      return new Response(JSON.stringify({ posts: [], error: "No cached posts" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const transformedPosts = cachedPosts.map(transformWordPressPost);

    return new Response(JSON.stringify({ posts: transformedPosts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ posts: [], error: "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
