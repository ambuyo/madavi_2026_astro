# Alignment Steps - Status Report

## ✅ Completed Steps

### 1. Created Migration Script
- **File**: `migrate-caseStudy-to-singleWork.ts`
- **Purpose**: Updates all 26 documents from `_type: "caseStudy"` to `_type: "singleWork"`
- **Status**: Ready to run (needs valid Sanity token)

### 2. Updated Import Scripts
All import scripts now use `_type: 'singleWork'` instead of `'caseStudy'`:
- ✅ `import-to-production.js` (line 103)
- ✅ `import-batch.js` (line 37)
- ✅ `import-to-ourwork.js` (line 99)
- ✅ `migrate-case-studies.js` (line 99 query + line 215 create)

### 3. Updated Migration Script
- ✅ `scripts/migrate-to-sanity.ts`
  - Updated SANITY_TYPES array (line 89): `"singleWork"`
  - Updated doc._type in migrateCaseStudies() (line 707): `"singleWork"`

### 4. Verified Schema
- ✅ `apps/studio/schemas/caseStudy.ts`
  - Already correctly exports as `singleWork`
  - Export name: `singleWork`
  - Type name: `singleWork`
  - Title: `Our Work`

---

## ⏳ Remaining Step (Requires Valid Token)

### Migrate 26 Documents in Sanity

**File**: `migrate-caseStudy-to-singleWork.ts`

**Command**:
```bash
SANITY_AUTH_TOKEN='your-token-here' npx ts-node migrate-caseStudy-to-singleWork.ts
```

**Requirements**:
- A Sanity API token with **Editor** permissions
- Get token from: https://sanity.io/manage → Your Project → API → Create Token

**What it does**:
- Finds all 26 documents with `_type == "caseStudy"`
- Updates each to `_type == "singleWork"`
- Reports success/failure for each

---

## Final Alignment Status

| Component | Old | New | Status |
|-----------|-----|-----|--------|
| Schema Definition | `name: "singleWork"` ✅ | `name: "singleWork"` | ✅ Aligned |
| Database Documents | `_type: "caseStudy"` ❌ | `_type: "singleWork"` | ⏳ Awaiting Token |
| Frontend Queries | `_type == "singleWork"` ✅ | `_type == "singleWork"` | ✅ Aligned |
| Import Scripts | `_type: 'caseStudy'` ❌ | `_type: 'singleWork'` | ✅ Updated |
| Studio Structure | Empty (0 docs) ❌ | Will show 26 docs | ⏳ Awaiting Migration |

---

## After Migration Complete

Once the documents are migrated:
1. The studio menu will show "Our Work" with 26 case studies
2. Frontend will properly display case studies
3. All imports of new case studies will use correct type
4. System is fully aligned

