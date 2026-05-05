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
          { title: "Healthcare", value: "healthcare" },
          { title: "Legal", value: "legal" },
          { title: "Foundations", value: "foundations" },
          { title: "Consortiums", value: "consortiums" },
          { title: "Real Estate", value: "realEstate" },
          { title: "Retail & Ecommerce", value: "retailEcommerce" },
          { title: "Agriculture", value: "agriculture" },
          { title: "Venture Capital", value: "ventureCapital" },
          { title: "Technology", value: "technology" },
          { title: "Manufacturing", value: "manufacturing" },
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
