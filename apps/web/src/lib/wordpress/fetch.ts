import { wpFetch } from "./client";

export interface WordPressPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      slug: string;
    }>;
  };
}

export interface WordPressImage {
  id: number;
  source_url: string;
  alt_text: string;
}

// Fetch all blog posts from WordPress
export async function fetchWordPressPosts(): Promise<WordPressPost[]> {
  return wpFetch<WordPressPost[]>(
    "/posts?_embed&per_page=100&orderby=date&order=desc"
  );
}

// Fetch single post by slug
export async function fetchWordPressPostBySlug(
  slug: string
): Promise<WordPressPost | null> {
  const posts = await wpFetch<WordPressPost[]>(
    `/posts?slug=${slug}&_embed`
  );
  return posts.length > 0 ? posts[0] : null;
}

// Get featured image from embedded data
export function getFeaturedImage(post: WordPressPost) {
  const images = post._embedded?.["wp:featuredmedia"];
  if (images && images.length > 0) {
    return {
      url: images[0].source_url,
      alt: images[0].alt_text || post.title.rendered,
    };
  }
  return {
    url: "",
    alt: post.title.rendered,
  };
}

// Decode HTML entities properly
function decodeHtmlEntities(text: string): string {
  const entityMap: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&hellip;": "…",
    "&#8217;": "'",
    "&#8216;": "'",
    "&#8220;": "“",
    "&#8221;": "”",
    "&#8212;": "—",
    "&#8211;": "–",
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entityMap)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }

  // Handle numeric entities &#XXXX;
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  // Handle hex entities &#xXXXX;
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

// Extract plain text from HTML
export function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .trim()
  );
}
