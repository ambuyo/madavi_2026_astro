import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  linkStyle: "inlined",
});

// Configure custom rules for better markdown output
turndownService.addRule("strikethrough", {
  filter: ["del", "s"],
  replacement: (content) => `~~${content}~~`,
});

turndownService.addRule("wordpressCaption", {
  filter: (node) =>
    node.tagName === "FIGURE" &&
    node.classList.contains("wp-caption"),
  replacement: (content, node) => {
    const img = node.querySelector("img");
    const figcaption = node.querySelector("figcaption");
    if (img && figcaption) {
      return `![${figcaption.textContent}](${img.src})\n*${figcaption.textContent}*\n`;
    }
    return content;
  },
});

turndownService.addRule("wordpressGallery", {
  filter: (node) =>
    node.tagName === "DIV" &&
    node.classList.contains("wp-block-gallery"),
  replacement: (content, node) => {
    const images = node.querySelectorAll("img");
    const alt = images[0]?.alt || "Gallery";
    return `\n**Gallery**\n${Array.from(images)
      .map((img) => `- ![${img.alt}](${img.src})`)
      .join("\n")}\n`;
  },
});

// Convert HTML to Markdown
export function htmlToMarkdown(html: string): string {
  try {
    let markdown = turndownService.turndown(html);

    // Clean up excessive whitespace
    markdown = markdown
      .replace(/\n{3,}/g, "\n\n") // Max 2 newlines
      .replace(/[ \t]+$/gm, "") // Trailing whitespace
      .trim();

    return markdown;
  } catch (error) {
    console.warn("Error converting HTML to Markdown, returning plain text:", error);
    return stripHtml(html);
  }
}

// Extract plain text from HTML
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

// Extract plain text with better formatting
export function extractPlainText(html: string): string {
  return stripHtml(html)
    .replace(/&hellip;/g, "…")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8212;/g, "—")
    .replace(/&#8211;/g, "–");
}
