/**
 * Central Data Utility
 *
 * This module provides a unified interface for fetching data from either
 * Content Collections or Sanity CMS. The data source is controlled by
 * the USE_SANITY flag.
 *
 * Usage:
 *   import { getPosts, getServices, ... } from "@/lib/data";
 *
 * When USE_SANITY is false (default):
 *   - Data comes from src/content/**
 *   - No Sanity code is loaded or executed
 *   - No Sanity env vars required
 *
 * When USE_SANITY is true:
 *   - Data comes from Sanity CMS
 *   - Requires SANITY_PROJECT_ID in apps/web/.env
 */

import { getCollection, getEntry, render } from "astro:content";

// Import types statically (no runtime cost)
import type {
  Post,
  TeamMember,
  Service,
  Industry,
  CaseStudy,
  InfoPage,
} from "./sanity/types";

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Toggle between Content Collections and Sanity CMS
 * Set to true to use Sanity, false to use Content Collections
 */
export const USE_SANITY = false;

// =============================================================================
// LAZY SANITY IMPORTS
// =============================================================================

/**
 * Dynamically import Sanity modules only when needed
 * This ensures no Sanity code is bundled when USE_SANITY is false
 */
async function getSanityModules() {
  const [
    { sanityFetch },
    {
      allPostsQuery,
      postBySlugQuery,
      postsByTagQuery,
      allTagsQuery,
      allTeamMembersQuery,
      teamMemberBySlugQuery,
      allServicesQuery,
      serviceBySlugQuery,
      allIndustriesQuery,
      industryBySlugQuery,
      allCaseStudiesQuery,
      caseStudyBySlugQuery,
      allInfoPagesQuery,
      infoPageBySlugQuery,
    },
    {
      transformPost,
      transformTeamMember,
      transformService,
      transformIndustry,
      transformCaseStudy,
      transformInfoPage,
    },
  ] = await Promise.all([
    import("./sanity/fetch"),
    import("./sanity/queries"),
    import("./sanity/transforms"),
  ]);

  return {
    sanityFetch,
    queries: {
      allPostsQuery,
      postBySlugQuery,
      postsByTagQuery,
      allTagsQuery,
      allTeamMembersQuery,
      teamMemberBySlugQuery,
      allServicesQuery,
      serviceBySlugQuery,
      allIndustriesQuery,
      industryBySlugQuery,
      allCaseStudiesQuery,
      caseStudyBySlugQuery,
      allInfoPagesQuery,
      infoPageBySlugQuery,
    },
    transforms: {
      transformPost,
      transformTeamMember,
      transformService,
      transformIndustry,
      transformCaseStudy,
      transformInfoPage,
    },
  };
}

// =============================================================================
// POSTS
// =============================================================================

/**
 * Get all posts - fetches from WordPress instead of Sanity
 */
export async function getPosts() {
  const { fetchWordPressPosts } = await import("./wordpress/fetch");
  const { transformWordPressPost } = await import("./wordpress/transforms");

  const posts = await fetchWordPressPosts();
  return posts.map(transformWordPressPost);
}

/**
 * Get a single post by slug from WordPress
 */
export async function getPostBySlug(slug: string) {
  const { fetchWordPressPostBySlug } = await import("./wordpress/fetch");
  const { transformWordPressPost } = await import("./wordpress/transforms");

  const post = await fetchWordPressPostBySlug(slug);
  return post ? transformWordPressPost(post) : null;
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const posts = await sanityFetch<any[]>(queries.postsByTagQuery, { tag });
    return posts.map(transforms.transformPost);
  }

  const posts = await getCollection("posts", ({ data }) =>
    data.tags.includes(tag)
  );
  return posts.map((post) => ({
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      tags: post.data.tags,
      team: post.data.team,
      image: post.data.image,
    },
    render: () => render(post),
  }));
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries } = await getSanityModules();
    return sanityFetch<string[]>(queries.allTagsQuery);
  }

  const posts = await getCollection("posts");
  const tags = new Set<string>();
  posts.forEach((p) => p.data.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
}

// =============================================================================
// TEAM MEMBERS
// =============================================================================

/**
 * Get all team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const members = await sanityFetch<any[]>(queries.allTeamMembersQuery);
    return members.map(transforms.transformTeamMember);
  }

  const members = await getCollection("team");
  return members.map((member) => ({
    slug: member.id,
    data: {
      name: member.data.name,
      role: member.data.role,
      bio: member.data.bio,
      image: member.data.image,
      socials: member.data.socials,
    },
    render: () => render(member),
  }));
}

/**
 * Get a single team member by slug
 */
export async function getTeamMemberBySlug(
  slug: string
): Promise<TeamMember | null> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const member = await sanityFetch<any>(queries.teamMemberBySlugQuery, {
      slug,
    });
    return member ? transforms.transformTeamMember(member) : null;
  }

  const entry = await getEntry("team", slug);
  if (!entry) return null;
  return {
    slug: entry.id,
    data: {
      name: entry.data.name,
      role: entry.data.role,
      bio: entry.data.bio,
      image: entry.data.image,
      socials: entry.data.socials,
    },
    render: () => render(entry),
  };
}

// =============================================================================
// SERVICES
// =============================================================================

/**
 * Get all services
 */
export async function getServices(): Promise<Service[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const services = await sanityFetch<any[]>(queries.allServicesQuery);
    return services.map(transforms.transformService);
  }

  const services = await getCollection("services");
  return services.map((service) => ({
    slug: service.id,
    data: {
      title: service.data.title,
      summary: service.data.summary,
      category: service.data.category,
      features: service.data.features,
      outcomes: service.data.outcomes,
      industries: service.data.industries,
      pricing: service.data.pricing,
      image: service.data.image,
      pubDate: service.data.pubDate,
      updatedDate: service.data.updatedDate,
    },
    render: () => render(service),
  }));
}

/**
 * Get a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const service = await sanityFetch<any>(queries.serviceBySlugQuery, {
      slug,
    });
    return service ? transforms.transformService(service) : null;
  }

  const entry = await getEntry("services", slug);
  if (!entry) return null;
  return {
    slug: entry.id,
    data: {
      title: entry.data.title,
      summary: entry.data.summary,
      category: entry.data.category,
      features: entry.data.features,
      outcomes: entry.data.outcomes,
      industries: entry.data.industries,
      pricing: entry.data.pricing,
      image: entry.data.image,
      pubDate: entry.data.pubDate,
      updatedDate: entry.data.updatedDate,
    },
    render: () => render(entry),
  };
}

// =============================================================================
// INDUSTRIES
// =============================================================================

/**
 * Get all industries
 */
export async function getIndustries(): Promise<Industry[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const industries = await sanityFetch<any[]>(queries.allIndustriesQuery);
    return industries.map(transforms.transformIndustry);
  }

  const industries = await getCollection("industries");
  return industries.map((industry) => ({
    slug: industry.id,
    data: {
      title: industry.data.title,
      summary: industry.data.summary,
      painPoints: industry.data.painPoints,
      relevantServices: industry.data.relevantServices,
      image: industry.data.image,
    },
    render: () => render(industry),
  }));
}

/**
 * Get a single industry by slug
 */
export async function getIndustryBySlug(
  slug: string
): Promise<Industry | null> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const industry = await sanityFetch<any>(queries.industryBySlugQuery, {
      slug,
    });
    return industry ? transforms.transformIndustry(industry) : null;
  }

  const entry = await getEntry("industries", slug);
  if (!entry) return null;
  return {
    slug: entry.id,
    data: {
      title: entry.data.title,
      summary: entry.data.summary,
      painPoints: entry.data.painPoints,
      relevantServices: entry.data.relevantServices,
      image: entry.data.image,
    },
    render: () => render(entry),
  };
}

// =============================================================================
// CASE STUDIES
// =============================================================================

/**
 * Get all case studies
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const caseStudies = await sanityFetch<any[]>(queries.allCaseStudiesQuery);
    return caseStudies.map(transforms.transformCaseStudy);
  }

  const caseStudies = await getCollection("caseStudies");
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.id,
    data: {
      title: caseStudy.data.title,
      client: caseStudy.data.client,
      industry: caseStudy.data.industry,
      services: caseStudy.data.services,
      challenge: caseStudy.data.challenge,
      solution: caseStudy.data.solution,
      results: caseStudy.data.results,
      testimonial: caseStudy.data.testimonial,
      image: caseStudy.data.image,
      pubDate: caseStudy.data.pubDate,
    },
    render: () => render(caseStudy),
  }));
}

/**
 * Get a single case study by slug
 */
export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | null> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const caseStudy = await sanityFetch<any>(queries.caseStudyBySlugQuery, {
      slug,
    });
    return caseStudy ? transforms.transformCaseStudy(caseStudy) : null;
  }

  const entry = await getEntry("caseStudies", slug);
  if (!entry) return null;
  return {
    slug: entry.id,
    data: {
      title: entry.data.title,
      client: entry.data.client,
      industry: entry.data.industry,
      services: entry.data.services,
      challenge: entry.data.challenge,
      solution: entry.data.solution,
      results: entry.data.results,
      testimonial: entry.data.testimonial,
      image: entry.data.image,
      pubDate: entry.data.pubDate,
    },
    render: () => render(entry),
  };
}

// =============================================================================
// INFO PAGES (Legal/Privacy/Terms)
// =============================================================================

/**
 * Get all info pages
 */
export async function getInfoPages(): Promise<InfoPage[]> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const pages = await sanityFetch<any[]>(queries.allInfoPagesQuery);
    return pages.map(transforms.transformInfoPage);
  }

  const pages = await getCollection("infopages");
  return pages.map((page) => ({
    slug: page.id,
    data: {
      page: page.data.page,
      pubDate: page.data.pubDate,
    },
    render: () => render(page),
  }));
}

/**
 * Get a single info page by slug
 */
export async function getInfoPageBySlug(
  slug: string
): Promise<InfoPage | null> {
  if (USE_SANITY) {
    const { sanityFetch, queries, transforms } = await getSanityModules();
    const page = await sanityFetch<any>(queries.infoPageBySlugQuery, { slug });
    return page ? transforms.transformInfoPage(page) : null;
  }

  const entry = await getEntry("infopages", slug);
  if (!entry) return null;
  return {
    slug: entry.id,
    data: {
      page: entry.data.page,
      pubDate: entry.data.pubDate,
    },
    render: () => render(entry),
  };
}

// =============================================================================
// EXPORT TYPES FOR COMPONENTS
// =============================================================================

export type {
  Post,
  TeamMember,
  Service,
  Industry,
  CaseStudy,
  InfoPage,
} from "./sanity/types";
