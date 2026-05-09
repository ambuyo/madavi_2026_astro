# WordPress Integration Setup

This app uses a **hybrid approach** for WordPress data:
- **Build-time caching**: WordPress posts are fetched and cached during the build process
- **Server-side rendering (SSR)**: Fast page loads by reading from cache instead of live API
- **Client-side async fetching**: Components can fetch posts asynchronously without blocking page render

## How It Works

### 1. Build Time (Pre-fetching)
When you run `npm run build`, the following happens:
```bash
tsx scripts/cache-wordpress-posts.ts  # Fetches 15 latest posts from WordPress
astro build                            # Builds the site with cached data
```

The cache is stored in `.cache/wordpress-posts.json`

### 2. Server-Side Rendering (SSR)
During SSR, pages load instantly because:
- No live API calls block page generation
- Data comes from the cached JSON file (already fetched at build time)

### 3. Client-Side Fetching
Components can fetch posts asynchronously using the `usePosts` hook:

```tsx
import { usePosts } from '../hooks/usePosts';

export function BlogList() {
  const { posts, loading, error } = usePosts();

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <article key={post.slug}>
          <h2>{post.data.title}</h2>
          <p>{post.data.description}</p>
        </article>
      ))}
    </div>
  );
}
```

## Commands

### Cache WordPress Posts
```bash
pnpm cache:posts
```
Manually fetch and cache the latest posts from WordPress.

### Build with Caching
```bash
pnpm build
```
Automatically caches posts before building.

### Dev Server
```bash
pnpm dev
```
Starts the dev server. Uses any existing cached posts.

## Configuration

### Change Number of Posts
Edit `scripts/cache-wordpress-posts.ts`:
```typescript
"/posts?_embed&per_page=15&orderby=date&order=desc"  // Change 15 to desired number
```

### Cache Duration
Edit `src/pages/api/posts.json.ts`:
```typescript
"Cache-Control": "public, max-age=3600"  // Change 3600 to desired seconds
```

## Benefits

✅ **Fast page loads** - No blocking API calls during SSR
✅ **Fresh content** - Cache updated every build
✅ **Async updates** - Client can fetch new posts without page reload
✅ **Fallback support** - Works even if WordPress API is down during build
