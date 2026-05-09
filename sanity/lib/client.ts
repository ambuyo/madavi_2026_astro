import { createClient } from '@sanity/client';
import { loadSnapshot, getAllSnapshots, ServiceSnapshot } from './snapshot';

const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for better resilience
});

interface FetchOptions {
  useFallback?: boolean;
  timeout?: number;
}

/**
 * Fetch a single service from Sanity with fallback to snapshot
 */
export async function fetchService(
  slug: string,
  options: FetchOptions = {}
): Promise<ServiceSnapshot | null> {
  const { useFallback = true, timeout = 5000 } = options;

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Sanity fetch timeout')), timeout)
    );

    const service = await Promise.race([
      sanityClient.fetch(
        `*[_type == "service" && slug.current == $slug][0]`,
        { slug }
      ),
      timeoutPromise,
    ]);

    if (!service) {
      console.warn(`Service not found in Sanity: ${slug}`);
      return useFallback ? loadSnapshot(slug) : null;
    }

    return service as ServiceSnapshot;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Failed to fetch from Sanity (${slug}):`, errorMsg);

    if (useFallback) {
      const snapshot = loadSnapshot(slug);
      if (snapshot) {
        console.log(`✓ Loaded snapshot fallback for: ${slug}`);
        return snapshot;
      }
    }

    return null;
  }
}

/**
 * Fetch all services from Sanity with fallback to snapshots
 */
export async function fetchAllServices(
  options: FetchOptions = {}
): Promise<ServiceSnapshot[]> {
  const { useFallback = true } = options;

  try {
    const services = await sanityClient.fetch(
      `*[_type == "service"] | order(_createdAt desc)`
    );

    if (!services || services.length === 0) {
      console.warn('No services found in Sanity');
      return useFallback ? loadAllSnapshots() : [];
    }

    return services as ServiceSnapshot[];
  } catch (error) {
    console.warn('Failed to fetch services from Sanity:', error.message);

    if (useFallback) {
      const snapshots = loadAllSnapshots();
      if (snapshots.length > 0) {
        console.log(`✓ Loaded ${snapshots.length} snapshot fallbacks`);
        return snapshots;
      }
    }

    return [];
  }
}

/**
 * Load all available snapshots
 */
function loadAllSnapshots(): ServiceSnapshot[] {
  try {
    return getAllSnapshots();
  } catch {
    return [];
  }
}

export default sanityClient;
