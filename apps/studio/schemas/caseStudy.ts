import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      description: "Name of the client",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      description: "Industry of the client",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      description: "Services provided to the client",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 4,
      description: "The challenge the client faced",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "text",
      rows: 4,
      description: "The solution provided",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        defineField({
          name: "quote",
          title: "Quote",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "author",
          title: "Author",
          type: "string",
        }),
        defineField({
          name: "role",
          title: "Role",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
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
    }),
    defineField({
      name: "pubDate",
      title: "Publish Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "image",
    },
    prepare({ title, client, media }) {
      return {
        title,
        subtitle: client,
        media,
      };
    },
  },
});
