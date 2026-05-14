import { client } from "./client";

export interface SanityReport {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  summary: string;
  industry: string;
  publicationDate: string;
  compiledBy: string;
  fullSummary?: any[];
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

export async function getReports(): Promise<SanityReport[]> {
  const query = `
    *[_type == "report"] | order(publicationDate desc) {
      _id,
      name,
      slug,
      summary,
      industry,
      publicationDate,
      compiledBy,
      fullSummary,
      "featuredImage": {
        "asset": {
          "url": featuredImage.asset->url
        },
        "alt": featuredImage.alt
      }
    }
  `;

  try {
    const reports = await client.fetch(query);
    return reports;
  } catch (error) {
    console.error("Error fetching reports from Sanity:", error);
    return [];
  }
}

export async function getReportBySlug(slug: string): Promise<SanityReport | null> {
  const query = `
    *[_type == "report" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      summary,
      industry,
      publicationDate,
      compiledBy,
      fullSummary,
      "featuredImage": {
        "asset": {
          "url": featuredImage.asset->url
        },
        "alt": featuredImage.alt
      }
    }
  `;

  try {
    const report = await client.fetch(query, { slug });
    return report || null;
  } catch (error) {
    console.error("Error fetching report from Sanity:", error);
    return null;
  }
}
