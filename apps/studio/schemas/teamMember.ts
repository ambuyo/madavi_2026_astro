import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
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
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title or role",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
      description: "Short biography",
    }),
    defineField({
      name: "image",
      title: "Profile Image",
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
      name: "socials",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({
          name: "twitter",
          title: "Twitter",
          type: "string",
        }),
        defineField({
          name: "website",
          title: "Website",
          type: "string",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "string",
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Extended Bio",
      type: "array",
      description: "Optional detailed content about this team member",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Name Z-A",
      name: "nameDesc",
      by: [{ field: "name", direction: "desc" }],
    },
  ],
});
