# Analytics Setup & Configuration

This document explains the analytics system implemented for Madavi Inc., covering both traditional user analytics and LLM crawler tracking.

## Overview

The analytics system has two distinct tracks:

1. **Traditional Analytics (Google Analytics 4)** - Tracks human user interactions
2. **LLM Analytics** - Tracks AI crawler interactions and API usage

## Google Analytics Setup

### Configuration

Set your Google Analytics 4 ID via environment variable:

```bash
# .env or .env.local
GA4_ID=G-XXXXXXXXXX
# or
PUBLIC_GA4_ID=G-XXXXXXXXXX
```

### Tracked Events

#### Automatic Events
- **page_view** - Triggered on page load and navigation
- **scroll_depth** - Triggered every 25% scroll depth (25%, 50%, 75%, 100%)
- **time_on_page** - Tracked every 30 seconds
- **link_click** - Tracks all link clicks (internal/external)
- **button_click** - Tracks all button interactions

#### Custom Events
Use the analytics utility functions to track custom events:

```typescript
import { trackEvent, trackContentInteraction, trackSearch } from "@/lib/analytics";

// Track article reading
trackContentInteraction("article", "slug-name", "view");

// Track search
trackSearch("ai strategy", 42);

// Custom event
trackEvent("custom_event", {
  custom_property: "value",
});
```

## LLM Analytics Setup

### Detected Crawlers

The system automatically detects and tracks the following LLM crawlers:

- **GPTBot** (OpenAI)
- **Claude-Web** (Anthropic)
- **PerplexityBot** (Perplexity AI)
- **YouBot** (You.com)
- **Google-Extended** (Google AI)
- **CCBot** (Common Crawl)

### LLM Tracking Endpoints

All LLM analytics data is sent to server-side endpoints:

#### `/api/analytics/llm-visit.json`
Tracks LLM crawler visits to pages.

**Request:**
```json
{
  "timestamp": "2026-05-11T12:00:00Z",
  "crawler": "Claude-Web",
  "company": "Anthropic",
  "url": "https://madavi.co/blog/article-title",
  "path": "/blog/article-title",
  "userAgent": "Mozilla/5.0 (compatible; Claude-Web/1.0)",
  "referrer": ""
}
```

**Response:**
```json
{
  "success": true,
  "message": "LLM visit logged",
  "crawler": "Claude-Web"
}
```

**GET (Analytics Summary):**
```bash
curl https://madavi.co/api/analytics/llm-visit.json
```

Returns:
```json
{
  "totalVisits": 150,
  "byCompany": {
    "Anthropic": 45,
    "OpenAI": 60,
    "Perplexity AI": 30,
    "You.com": 15
  },
  "byPath": {
    "/blog/ai-adoption": 25,
    "/llm-index.json": 50,
    "/api/content/...": 75
  },
  "recentVisits": [...]
}
```

#### `/api/analytics/api-access.json`
Tracks API endpoint access by LLM crawlers.

**Request:**
```json
{
  "timestamp": "2026-05-11T12:00:00Z",
  "endpoint": "/api/content/article-slug.json",
  "crawler": {
    "botName": "Claude-Web",
    "company": "Anthropic"
  }
}
```

#### `/api/analytics/llm-event.json`
Tracks custom LLM events.

**Request:**
```json
{
  "timestamp": "2026-05-11T12:00:00Z",
  "eventType": "content_indexed",
  "crawler": {
    "botName": "Claude-Web",
    "company": "Anthropic"
  },
  "data": {
    "content_type": "article",
    "word_count": 1234
  }
}
```

### Viewing LLM Analytics

View analytics summaries via GET requests:

```bash
# LLM visit analytics
curl https://madavi.co/api/analytics/llm-visit.json

# API access analytics
curl https://madavi.co/api/analytics/api-access.json

# LLM event analytics
curl https://madavi.co/api/analytics/llm-event.json
```

## JavaScript API

### Available Functions

#### `trackEvent(eventName, eventData)`
Track a custom event with Google Analytics.

```typescript
trackEvent("custom_event", {
  property: "value",
});
```

#### `trackPageView(pagePath, pageTitle)`
Track a page view.

```typescript
trackPageView("/blog/article", "Article Title");
```

#### `trackContentInteraction(contentType, contentId, action)`
Track content interactions.

```typescript
trackContentInteraction("article", "article-slug", "read");
```

#### `trackLinkClick(linkUrl, linkText, isExternal)`
Track link clicks.

```typescript
trackLinkClick("https://example.com", "Example", true);
```

#### `trackFormSubmission(formName, formData)`
Track form submissions.

```typescript
trackFormSubmission("contact_form", {
  category: "inquiry",
});
```

#### `trackError(errorType, errorMessage, additionalData)`
Track errors.

```typescript
trackError("api_error", "Failed to fetch data", {
  endpoint: "/api/data",
});
```

#### `trackArticleReading(slug, readingTimeMinutes, scrollDepth)`
Track article reading.

```typescript
trackArticleReading("article-slug", 5, 75);
```

#### `trackSearch(searchQuery, resultsCount)`
Track search queries.

```typescript
trackSearch("ai strategy", 42);
```

#### `logLLMAccess(eventType, data)`
Log custom LLM crawler events (client-side).

```typescript
window.logLLMAccess("content_accessed", {
  content_id: "article-slug",
  content_type: "article",
});
```

## Production Setup

### Recommendations

1. **Database Integration**
   - Move in-memory analytics to a database (PostgreSQL, MongoDB, etc.)
   - Implement retention policies

2. **Analytics Service**
   - Connect to DataDog, New Relic, or similar
   - Set up dashboards and alerts

3. **Privacy Considerations**
   - Respect privacy regulations (GDPR, CCPA)
   - Anonymize IP addresses (already enabled in GA4)
   - Clear retention policies

4. **Real-time Monitoring**
   - Set up alerts for unusual crawler activity
   - Monitor API endpoint usage
   - Track content performance metrics

## Debugging

### Check LLM Crawler Detection

Open browser console and check:

```javascript
// View detected crawler info
console.log("User Agent:", navigator.userAgent);

// Manually log a visit
fetch("/api/analytics/llm-visit.json", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    timestamp: new Date().toISOString(),
    crawler: "Claude-Web",
    company: "Anthropic",
    url: window.location.href,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  }),
});
```

### Monitor Analytics Endpoints

```bash
# Watch for incoming analytics requests
curl -v https://madavi.co/api/analytics/llm-visit.json

# Check current analytics state
curl https://madavi.co/api/analytics/llm-visit.json | jq '.byCompany'
```

## Next Steps

1. Add database backend for persistent storage
2. Implement analytics dashboard (admin panel)
3. Set up automated reports
4. Integrate with business intelligence tools
5. Implement advanced LLM behavior analysis
