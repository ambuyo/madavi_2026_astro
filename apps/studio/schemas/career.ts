import { defineField, defineType } from "sanity";

export const career = defineType({
  name: "career",
  title: "Career",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
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
      name: "description",
      title: "Job Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Contract", value: "Contract" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "remote",
      title: "Work Arrangement",
      type: "string",
      options: {
        list: [
          { title: "On-site", value: "On-site" },
          { title: "Remote", value: "Remote" },
          { title: "Hybrid", value: "Hybrid" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "salary",
      title: "Salary Range",
      type: "string",
    }),
    defineField({
      name: "postedDate",
      title: "Posted Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "applyUrl",
      title: "Apply URL",
      type: "url",
    }),
    defineField({
      name: "applyEmail",
      title: "Apply Email",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Posted Date (Newest)",
      name: "postedDateDesc",
      by: [{ field: "postedDate", direction: "desc" }],
    },
  ],
});
