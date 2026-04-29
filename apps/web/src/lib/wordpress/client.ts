// WordPress REST API client
export const wpBaseUrl = "https://cms.madavi.co";
export const wpApiUrl = `${wpBaseUrl}/wp-json/wp/v2`;

// Helper to create Basic Auth header
function createAuthHeader(): string {
  const username = import.meta.env.WP_USERNAME || "Amukune";
  const appPassword = import.meta.env.WP_APP_PASSWORD || "KDZR p3CM RIbh xyjr UHSI mA2d";

  // Create basic auth string
  const authString = `${username}:${appPassword}`;
  const encoded = Buffer.from(authString).toString("base64");

  return `Basic ${encoded}`;
}

export async function wpFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${wpApiUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: createAuthHeader(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from WordPress API at ${url}:`, error);
    throw error;
  }
}
