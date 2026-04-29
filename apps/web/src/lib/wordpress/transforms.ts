import { WordPressPost, getFeaturedImage, stripHtml } from "./fetch";
import type { Post } from "../sanity/types";

// Helper to decode HTML entities in content
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
    "&#8220;": String.fromCharCode(8220),
    "&#8221;": String.fromCharCode(8221),
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

// Transform WordPress post to our Post type
export function transformWordPressPost(wpPost: WordPressPost): Post {
  const featuredImage = getFeaturedImage(wpPost);

  return {
    slug: wpPost.slug,
    data: {
      title: stripHtml(wpPost.title.rendered),
      description: stripHtml(wpPost.excerpt.rendered),
      pubDate: new Date(wpPost.date),
      tags: [], // WordPress tags would need separate API call if needed
      team: undefined,
      image: {
        url: featuredImage.url,
        alt: featuredImage.alt,
      },
    },
    body: decodeHtmlEntities(wpPost.content.rendered),
  };
}
