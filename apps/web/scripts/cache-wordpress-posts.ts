// Build-time script to fetch and cache WordPress posts
import { wpFetch } from "../src/lib/wordpress/client";
import { writeCachedPosts } from "../src/lib/wordpress/cache";
import type { WordPressPost } from "../src/lib/wordpress/fetch";

async function cachePosts() {
  try {
    console.log("Fetching WordPress posts...");
    const posts = await wpFetch<WordPressPost[]>(
      "/posts?_embed&per_page=15&orderby=date&order=desc"
    );

    await writeCachedPosts(posts);
    console.log(`✓ Cached ${posts.length} WordPress posts`);
  } catch (error) {
    console.error("Failed to cache WordPress posts:", error);
    process.exit(1);
  }
}

cachePosts();
