import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
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
      title: "Event Description",
      type: "text",
      rows: 4,
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
    }),
    defineField({
      name: "startDate",
      title: "Start Date & Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date & Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Physical location or 'Online' for virtual events",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Workshop", value: "workshop" },
          { title: "Webinar", value: "webinar" },
          { title: "Conference", value: "conference" },
          { title: "Cohort", value: "cohort" },
          { title: "Meeting", value: "meeting" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "number",
      description: "Maximum number of attendees",
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration URL",
      type: "url",
    }),
    defineField({
      name: "registrationEmail",
      title: "Registration Email",
      type: "string",
    }),
    defineField({
      name: "speakers",
      title: "Speakers",
      type: "array",
      of: [{ type: "string" }],
      description: "List of speaker names or topics",
    }),
    defineField({
      name: "agenda",
      title: "Agenda",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "time",
              title: "Time",
              type: "string",
            }),
            defineField({
              name: "activity",
              title: "Activity",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "Event price or 'Free'",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "featuredImage",
      date: "startDate",
    },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date ? new Date(date).toLocaleDateString() : "",
      };
    },
  },
  orderings: [
    {
      title: "Start Date (Upcoming)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Start Date (Newest)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
});
