import { defineField, defineType } from "sanity";

export const report = defineType({
  name: "report",
  title: "Report",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Report Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the image for accessibility",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      options: {
        list: [
          { title: "Accelerators/Incubators", value: "accelerators-incubators" },
          { title: "Agriculture", value: "agriculture" },
          { title: "Consortiums", value: "consortiums" },
          { title: "Edtech", value: "edtech" },
          { title: "Foundations", value: "foundations" },
          { title: "Healthcare", value: "healthcare" },
          { title: "Legal & Law Firms", value: "legal-law-firms" },
          { title: "Manufacturing", value: "manufacturing" },
          { title: "Non Profits", value: "non-profits" },
          { title: "Real Estate", value: "real-estate" },
          { title: "Retail & Ecommerce", value: "retail-ecommerce" },
          { title: "Technology", value: "technology" },
          { title: "Venture Capital", value: "venture-capital" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      description: "Brief summary of the report",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publicationDate",
      title: "Publication Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "compiledBy",
      title: "Report Compiled by",
      type: "string",
      description: "Name of the person or organization that compiled the report",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullSummary",
      title: "Full Summary",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
            ],
          },
        },
      ],
      description: "Full article summary with rich formatting (bold, lists, headings, etc.)",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "featuredImage",
      subtitle: "industry",
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Publication Date (Newest)",
      name: "pubDateDesc",
      by: [{ field: "publicationDate", direction: "desc" }],
    },
    {
      title: "Publication Date (Oldest)",
      name: "pubDateAsc",
      by: [{ field: "publicationDate", direction: "asc" }],
    },
    {
      title: "Report Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
