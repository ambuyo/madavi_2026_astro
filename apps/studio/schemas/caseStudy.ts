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
      description: "Industry of the client",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "AI & Agentic Workflows", value: "ai-agentic-workflows" },
          { title: "AI Readiness Audit", value: "ai-readiness-audit" },
          { title: "Brand Positioning", value: "brand-positioning" },
          { title: "Content Marketing", value: "content-marketing" },
          { title: "Conversion Rate Optimization", value: "conversion-rate-optimization" },
          { title: "CRM & Automation Setup", value: "crm-automation-setup" },
          { title: "Data Analytics & Attribution", value: "data-analytics-attribution" },
          { title: "Email Marketing", value: "email-marketing" },
          { title: "Go-To-Market (GTM) Strategy", value: "go-to-market-strategy" },
          { title: "Paid Media (PPC)", value: "paid-media-ppc" },
          { title: "Search Engine Optimization", value: "search-engine-optimization" },
          { title: "Social Media Management", value: "social-media-management" },
          { title: "Video Production", value: "video-production" },
          { title: "Visual Identity", value: "visual-identity" },
          { title: "Web Development", value: "web-development" },
        ],
      },
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
      name: "year",
      title: "Year",
      type: "number",
      description: "Year the project was completed",
    }),
    defineField({
      name: "tagline",
      title: "Project Tagline",
      type: "string",
      description: "Brief tagline for the project",
    }),
    defineField({
      name: "aboutClient",
      title: "About Client",
      type: "text",
      rows: 3,
      description: "Background information about the client",
    }),
    defineField({
      name: "scopeOfWork",
      title: "Scope of Work",
      type: "text",
      rows: 4,
      description: "The scope of work defined for this project",
    }),
    defineField({
      name: "whatWeDid",
      title: "What We Did",
      type: "text",
      rows: 4,
      description: "Description of what was done in the project",
    }),
    defineField({
      name: "projectUrl",
      title: "Project URL",
      type: "url",
      description: "Link to the live project (optional)",
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
      name: "projectImages",
      title: "Project Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
      description: "Gallery of project images",
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
