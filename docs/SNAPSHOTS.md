# Content Snapshots: Resilience Against Sanity Downtime

This document explains how the snapshot system works and how to maintain it.

## What is a Snapshot?

A snapshot is a cached JSON copy of your service/capability content from Sanity. If Sanity is unavailable during a build, the site uses snapshots to generate pages instead of failing.

**Key Points:**
- Snapshots are stored in `apps/web/src/content/snapshots/`
- Each snapshot is a single `.json` file (one per service slug)
- Snapshots are committed to git — they act as a fallback, not a backup
- When Sanity is available, snapshots are automatically updated

## How It Works

### Build Process

```
Build triggered
    ↓
Try to fetch from Sanity
    ↓
    ├─ Success → Use Sanity data, update snapshots
    └─ Fail (timeout/down) → Use snapshot fallback
    ↓
Build completes with data
    ↓
Deploy to production
```

### Data Flow

1. **Editorial Update**: Editor updates service in Sanity
2. **Manual Snapshot**: Run `npm run snapshot:update` (or automated via webhook)
3. **Git Commit**: Snapshots are committed to git
4. **Next Build**: Build fetches from Sanity (with snapshot fallback)
5. **Sanity Down?**: Build uses last-known-good snapshot instead

## Commands

### Update snapshots from Sanity
```bash
npm run snapshot:update
```

What this does:
- Fetches all services from Sanity
- Saves each as `[slug].json` in `apps/web/src/content/snapshots/`
- Attempts to commit changes to git
- Logs summary of updates

### Verify snapshots are valid
```bash
npm run snapshot:verify
```

What this does:
- Checks if snapshots directory exists
- Validates all `.json` files are valid JSON
- Reports count of valid/invalid snapshots
- Exits with error if any are invalid

## Workflows

### Workflow 1: Manual Updates (Simple)

1. **Editor updates content in Sanity**
2. **Before deploying, run:**
   ```bash
   npm run snapshot:update
   ```
3. **Review the changes:**
   ```bash
   git status
   ```
4. **Commit if needed:**
   ```bash
   git add apps/web/src/content/snapshots
   git commit -m "chore: update snapshots"
   ```
5. **Deploy as normal**

### Workflow 2: Automated Updates (Webhook)

Set up a webhook in Sanity to trigger snapshot updates:

**In Sanity Studio settings:**

1. Go to **API** → **Webhooks**
2. Create new webhook:
   - **URL**: `https://github.com/api/v1/repos/[owner]/[repo]/dispatches`
   - **Events**: Select "Publish" and "Unpublish"
   - **Include raw content**: Yes

3. Your CI/CD will need to handle the webhook and run:
   ```bash
   npm run snapshot:update
   git push origin main
   ```

*(Example assumes GitHub; adjust for your CI/CD provider)*

## Structure of a Snapshot File

**File**: `apps/web/src/content/snapshots/ai-readiness.json`

```json
{
  "id": "sanity-doc-id",
  "slug": "ai-readiness",
  "title": "AI Readiness Assessment",
  "shortDescription": "Assess organizational readiness...",
  "hero": {
    "headline": "AI Readiness Audit",
    "subheadline": "Honest Assessment Before You Waste Money",
    "videoUrl": "/services/bgvideo2.mp4",
    "ctaText": "Book Free Audit",
    "ctaLink": "booking-form"
  },
  "stats": [
    { "value": "20+", "label": "Years Experience" },
    { "value": "500+", "label": "Organizations Assessed" }
  ],
  "problemSection": { ... },
  "philosophy": { ... },
  "approach": { ... },
  "pricing": [ ... ],
  "faqs": [ ... ],
  "seo": { ... }
}
```

## Handling Sanity Downtime

### During an Outage

**Build gets triggered** → Sanity timeout → **Snapshot used** → Build succeeds ✓

**Content shown**: Last snapshot (may be 1-3 hours old, depending on last update)

**What to do:**
1. Build will succeed automatically (no action needed)
2. Check the build logs to confirm fallback was used:
   ```
   ✓ Loaded snapshot fallback for: ai-readiness
   ```
3. Once Sanity recovers, run `npm run snapshot:update` to sync latest content

### After an Outage

```bash
# Once Sanity is back online:
npm run snapshot:update

# Verify snapshots are current:
npm run snapshot:verify

# Commit and push:
git add apps/web/src/content/snapshots
git commit -m "chore: restore fresh snapshots after Sanity recovery"
git push
```

## Snapshot Staleness

**How old can snapshots be?**
- For most cases: 1-24 hours is acceptable
- For rapidly-changing services: Run `snapshot:update` more frequently
- For critical updates: Always run `snapshot:update` immediately after publishing

**Recommended schedule:**
- Manual: Run after each major service update
- Automated: Daily via cron job, or on Sanity publish webhook

## Troubleshooting

### Snapshots not updating

**Check 1: Verify Sanity credentials**
```bash
# These must be set in your .env file:
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
```

**Check 2: Verify snapshots directory exists**
```bash
ls -la apps/web/src/content/snapshots/
```

**Check 3: Run with verbose output**
```bash
npm run snapshot:update
# Look for error messages
```

### Build succeeds but content is stale

This means the snapshot fallback was used (Sanity was unavailable). 

**Solution:**
1. Wait for Sanity to recover
2. Run `npm run snapshot:update`
3. Redeploy

### Snapshot file is invalid JSON

**Check the file:**
```bash
cat apps/web/src/content/snapshots/[slug].json | jq .
```

**If invalid:**
1. Manually fetch the service from Sanity and save it
2. Or delete the broken snapshot and re-run `snapshot:update`

## Best Practices

✅ **Do:**
- Run `snapshot:update` after every major service update
- Commit snapshots to git
- Keep snapshots directory in `.gitignore` comments (document why it's tracked)
- Monitor Sanity uptime/status page
- Test builds with `npm run build` locally before pushing

❌ **Don't:**
- Manually edit snapshot files
- Use snapshots as a long-term backup (use Sanity's export for that)
- Commit stale snapshots without good reason
- Forget to `snapshot:update` before deploying to production

## Architecture Decision: Why This Approach?

### Benefits of Snapshots:
1. **No external dependency blocks deploys** — if Sanity is down for 30 min, you still ship code
2. **Simple to implement** — ~200 lines of code, no complex caching layer
3. **Auditable** — snapshots are in git, you can see exactly what changed
4. **Readable** — snapshot files are plain JSON, easy to inspect
5. **Git as backup** — full history of content snapshots available in git

### Trade-offs:
- Content may be 1-24 hours old during Sanity outage
- Requires manual/automated script to stay fresh
- Snapshots add to repo size (~100KB for 10-20 services)

For a marketing site with 5-15 services, this is the right balance between resilience and simplicity.

---

## Related Files

- `apps/web/src/sanity/lib/snapshot.ts` — Core snapshot utilities
- `apps/web/src/sanity/lib/client.ts` — Sanity client with fallback logic
- `scripts/update-snapshots.ts` — Snapshot generation script
- `apps/web/src/pages/capabilities/[slug].astro` — Page that uses snapshots
