import { useState, useEffect } from "react";
import type { Post } from "../lib/sanity/types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch("/api/posts.json");
        const data = await response.json();

        if (response.ok && data.posts) {
          setPosts(data.posts);
        } else {
          setError(data.error || "Failed to fetch posts");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
