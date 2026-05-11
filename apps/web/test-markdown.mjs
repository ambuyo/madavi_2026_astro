import { htmlToMarkdown, extractPlainText, stripHtml } from "./src/lib/wordpress/markdown.ts";

const testHtml = `
<h1>Hello World</h1>
<p>This is a <strong>test</strong> paragraph.</p>
<a href="https://example.com">Link to example</a>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
<figure class="wp-caption">
  <img src="/image.jpg" alt="Test image" />
  <figcaption>Test caption</figcaption>
</figure>
`;

console.log("=== Original HTML ===");
console.log(testHtml);

console.log("\n=== Converted Markdown ===");
const markdown = htmlToMarkdown(testHtml);
console.log(markdown);

console.log("\n=== Plain Text ===");
const plainText = extractPlainText(testHtml);
console.log(plainText);

console.log("\n=== Strip HTML ===");
const stripped = stripHtml(testHtml);
console.log(stripped);
