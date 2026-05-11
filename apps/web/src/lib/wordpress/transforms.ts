import {
  WordPressPost,
  WordPressCategory,
  getFeaturedImage,
  stripHtml,
} from "./fetch";
import { htmlToMarkdown, extractPlainText } from "./markdown";
import type { Post } from "../sanity/types";

// Helper to extract categories from embedded data
function extractCategories(wpPost: WordPressPost): WordPressCategory[] {
  if (!wpPost._embedded?.["wp:term"]) {
    return [];
  }

  const categories: WordPressCategory[] = [];
  for (const termArray of wpPost._embedded["wp:term"]) {
    for (const term of termArray) {
      if (term.taxonomy === "category") {
        categories.push({
          id: term.id,
          name: term.name,
          slug: term.slug,
        });
      }
    }
  }

  return categories;
}

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
  const htmlContent = decodeHtmlEntities(wpPost.content.rendered);
  const markdown = htmlToMarkdown(htmlContent);
  const plainText = extractPlainText(htmlContent);
  const categories = extractCategories(wpPost);

  return {
    slug: wpPost.slug,
    data: {
      title: stripHtml(wpPost.title.rendered),
      description: stripHtml(wpPost.excerpt.rendered),
      pubDate: new Date(wpPost.date),
      tags: [], // WordPress tags would need separate API call if needed
      categories: categories,
      team: undefined,
      image: {
        url: featuredImage.url,
        alt: featuredImage.alt,
      },
    },
    body: htmlContent,
    markdown: markdown,
    plainText: plainText,
  };
}
