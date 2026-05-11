// Analytics tracking utilities for both traditional and LLM analytics

/**
 * Track a custom event with Google Analytics
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, any>
): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, eventData);
  }
}

/**
 * Track a page view
 */
export function trackPageView(
  pagePath: string,
  pageTitle: string
): void {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Track content interaction
 */
export function trackContentInteraction(
  contentType: string,
  contentId: string,
  action: string
): void {
  trackEvent("content_interaction", {
    content_type: contentType,
    content_id: contentId,
    action: action,
  });
}

/**
 * Track a link click
 */
export function trackLinkClick(
  linkUrl: string,
  linkText: string,
  isExternal: boolean = false
): void {
  trackEvent("link_click", {
    link_url: linkUrl,
    link_text: linkText,
    link_type: isExternal ? "external" : "internal",
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  formData?: Record<string, any>
): void {
  trackEvent("form_submission", {
    form_name: formName,
    ...formData,
  });
}

/**
 * Track error event
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  additionalData?: Record<string, any>
): void {
  trackEvent("error", {
    error_type: errorType,
    error_message: errorMessage,
    ...additionalData,
  });
}

/**
 * Track API endpoint access (for LLM analytics)
 */
export function trackAPIEndpoint(
  endpoint: string,
  method: string = "GET"
): void {
  trackEvent("api_access", {
    endpoint: endpoint,
    method: method,
  });
}

/**
 * Track reading time for articles
 */
export function trackArticleReading(
  slug: string,
  readingTimeMinutes: number,
  scrollDepth: number = 0
): void {
  trackEvent("article_reading", {
    article_slug: slug,
    reading_time_minutes: readingTimeMinutes,
    scroll_depth: scrollDepth,
  });
}

/**
 * Track search query
 */
export function trackSearch(
  searchQuery: string,
  resultsCount: number = 0
): void {
  trackEvent("search", {
    search_query: searchQuery,
    results_count: resultsCount,
  });
}

/**
 * Set user properties for analytics
 */
export function setUserProperties(
  properties: Record<string, any>
): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", {
      user_properties: properties,
    });
  }
}

/**
 * Initialize analytics (called automatically by analytics components)
 */
export function initializeAnalytics(): void {
  if (typeof window === "undefined") return;

  // Set default properties
  setUserProperties({
    content_language: "en",
    page_referrer: document.referrer,
  });
}

// Auto-initialize on module load
if (typeof window !== "undefined") {
  initializeAnalytics();
}
