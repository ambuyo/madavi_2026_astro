import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      bio: z.string().optional(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      socials: z
        .object({
          twitter: z.string().optional(),
          website: z.string().optional(),
          linkedin: z.string().optional(),
          email: z.string().optional(),
        })
        .optional(),
    }),
});

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      team: z.string(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      tags: z.array(z.string()),
    }),
});

const infopages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/infopages" }),
  schema: z.object({
    page: z.string(),
    pubDate: z.date(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum(["Advisory", "Compliance", "Operations"]),
      featured: z.boolean().optional(),
      image: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      pubDate: z.date().optional(),
      updatedDate: z.date().optional(),

      // 1. Hero Section
      hero: z
        .object({
          subtitle: z.string().optional(),
          description: z.string().optional(),
          primaryCta: z
            .object({
              text: z.string().optional(),
              url: z.string().optional(),
            })
            .optional(),
          secondaryCta: z
            .object({
              text: z.string().optional(),
              url: z.string().optional(),
            })
            .optional(),
        })
        .optional(),

      // 2. Problem/Context
      problemContext: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          painPoints: z.array(z.string()).default([]),
        })
        .optional(),

      // 3. How It Works
      howItWorks: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          steps: z
            .array(
              z.object({
                stepNumber: z.number().optional(),
                title: z.string().optional(),
                description: z.string().optional(),
                duration: z.string().optional(),
              })
            )
            .default([]),
          timelineTotal: z.string().optional(),
        })
        .optional(),

      // 4. What You Get
      whatYouGet: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          deliverables: z
            .array(
              z.object({
                title: z.string().optional(),
                description: z.string().optional(),
              })
            )
            .default([]),
        })
        .optional(),

      // 5. Framework Deep Dive
      frameworkDeepDive: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          frameworks: z
            .array(
              z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                benefits: z.array(z.string()).default([]),
              })
            )
            .default([]),
        })
        .optional(),

      // 6. Case Study
      caseStudy: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          featured: z.string().optional(),
          inline: z
            .object({
              client: z.string().optional(),
              industry: z.string().optional(),
              challenge: z.string().optional(),
              solution: z.string().optional(),
              results: z
                .array(
                  z.object({
                    metric: z.string().optional(),
                    value: z.string().optional(),
                  })
                )
                .default([]),
            })
            .optional(),
        })
        .optional(),

      // 7. Pricing & Investment
      pricingSection: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          pricingModel: z
            .enum(["one-time", "monthly", "hourly", "custom"])
            .optional(),
          startingPrice: z.string().optional(),
          monthlyPrice: z.string().optional(),
          paymentTerms: z.string().optional(),
          included: z.array(z.string()).default([]),
          excluded: z.array(z.string()).default([]),
        })
        .optional(),

      // 8. Who This Is For
      whoThisFor: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          idealClient: z.string().optional(),
          fitCriteria: z.array(z.string()).default([]),
          poorFitCriteria: z.array(z.string()).default([]),
          industries: z.array(z.string()).default([]),
          companySize: z.string().optional(),
          annualRevenue: z.string().optional(),
        })
        .optional(),

      // 9. FAQ
      faq: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          items: z
            .array(
              z.object({
                question: z.string().optional(),
                answer: z.string().optional(),
              })
            )
            .default([]),
        })
        .optional(),

      // 10. Conversion
      conversion: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          primaryCta: z
            .object({
              text: z.string().optional(),
              url: z.string().optional(),
            })
            .optional(),
          trustSignals: z.array(z.string()).default([]),
          nextSteps: z.string().optional(),
        })
        .optional(),

      // Legacy fields for backward compatibility
      features: z.array(z.string()).default([]),
      outcomes: z.array(z.string()).default([]),
      industries: z.array(z.string()).default([]),
      pricing: z
        .object({
          startingPrice: z.string().optional(),
          monthlyPrice: z.string().optional(),
          pricingModel: z
            .enum(["one-time", "monthly", "hourly", "custom"])
            .optional(),
          note: z.string().optional(),
        })
        .optional(),
    }),
});

const industries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/industries" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      painPoints: z.array(z.string()).default([]),
      relevantServices: z.array(z.string()).default([]),
      image: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
    }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/caseStudies" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      industry: z.string(),
      services: z.array(z.string()),
      challenge: z.string(),
      solution: z.string(),
      results: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
      testimonial: z
        .object({
          quote: z.string(),
          author: z.string(),
          role: z.string().optional(),
        })
        .optional(),
      image: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      pubDate: z.date(),
    }),
});

export const collections = {
  team,
  infopages,
  posts: postsCollection,
  services,
  industries,
  caseStudies,
};
