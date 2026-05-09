import { defineCollection, z } from "astro:content";

const pressReleasesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().default("Press Release"),
  }),
});

const documentsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    documentType: z.string(),
    year: z.number(),
    file: z.string(),
    description: z.string(),
  }),
});

const eventsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string(),
    url: z.string().optional(),
  }),
});

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
});

const capabilitiesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    icon: z.string().optional(),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    philosophy: z.object({
      title: z.string(),
      description: z.string(),
      values: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })).optional(),
    }).optional(),
    approach: z.object({
      title: z.string(),
      description: z.string(),
      steps: z.array(z.object({
        title: z.string(),
        description: z.string(),
        bullets: z.array(z.string()),
      })).optional(),
    }).optional(),
  }),
});

export const collections = {
  pressReleases: pressReleasesCollection,
  documents: documentsCollection,
  events: eventsCollection,
  posts: postsCollection,
  capabilities: capabilitiesCollection,
};
