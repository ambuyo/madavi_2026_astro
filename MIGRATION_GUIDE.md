# Case Studies Migration Guide

Complete migration of all case studies from one Sanity studio to another, including all images and metadata.

## Prerequisites

```bash
npm install @sanity/client @sanity/image-url
```

## Step 1: Export from Source Studio

Run the export to fetch all case studies and images:

```bash
node migrate-case-studies.js
```

This will:
- ✓ Fetch all case studies from source studio
- ✓ Download all images (main image + project gallery)
- ✓ Create `case-studies-export/` directory with:
  - `images/` - all downloaded images
  - `export-metadata.json` - all case study data and image mappings

## Step 2: Setup Destination Studio

1. **Create destination Sanity studio** (if not already created)
   - Go to sanity.io/manage
   - Create new project
   - Deploy with same schema (`singleWork` type)

2. **Generate write token**
   - Go to sanity.io/manage → Your Project → API
   - Click "Add API token"
   - Name it: "Migration Token"
   - Select "Editor" role
   - Copy the token

3. **Update script with destination credentials**
   
   Edit `migrate-case-studies.js` line ~18-23:
   ```javascript
   const destClient = sanityClient({
     projectId: 'YOUR_NEW_PROJECT_ID',  // Replace with new project ID
     dataset: 'production',
     apiVersion: '2024-01-01',
     useCdn: false,
     token: 'YOUR_NEW_WRITE_TOKEN'  // Replace with new token
   });
   ```

## Step 3: Import to Destination Studio

Run the import:

```bash
node migrate-case-studies.js --import
```

This will:
- ✓ Upload all images to new studio
- ✓ Create new case study documents with updated image references
- ✓ Generate `import-mapping.json` with import results

## Verification

Check the new studio to verify:
- [ ] All case studies imported (count matches)
- [ ] Images display correctly
- [ ] All fields preserved (client, services, testimonials, etc.)
- [ ] Project images gallery intact

## Cleanup

After successful import:

1. **Delete source token** (from this script):
   ```bash
   # Edit migrate-case-studies.js and remove the token
   ```

2. **Delete temporary files**:
   ```bash
   rm -rf case-studies-export/
   ```

3. **Verify source studio** is still accessible (don't delete it)

## Troubleshooting

### "No case studies found"
- Verify token has read access to source project
- Check project ID matches source studio

### "Failed to upload images"
- Verify write token is correct
- Check destination project exists
- Ensure token has "Editor" or higher role

### Image references broken
- Migration script automatically updates references
- Check `import-mapping.json` for asset ID mappings

### Duplicate imports
- Always start fresh export/import cycle
- Previous imports create new documents with new IDs
