/**
 * Verify that snapshots directory exists and contains valid JSON
 * Run: npm run snapshot:verify
 */

const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(
  process.cwd(),
  'apps/web/src/content/snapshots'
);

function verifySnapshots() {
  console.log('🔍 Verifying snapshots...\n');

  if (!fs.existsSync(SNAPSHOT_DIR)) {
    console.log('ℹ️  Snapshots directory does not exist yet.');
    console.log('   Run: npm run snapshot:update\n');
    return true;
  }

  const files = fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('⚠️  No snapshot files found.');
    console.log('   Run: npm run snapshot:update\n');
    return true;
  }

  let valid = 0;
  let invalid = 0;

  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(SNAPSHOT_DIR, file), 'utf-8');
      JSON.parse(content);
      console.log(`✓ ${file}`);
      valid++;
    } catch (error) {
      console.error(`✗ ${file}: ${error.message}`);
      invalid++;
    }
  });

  console.log(`\n${valid} valid, ${invalid} invalid\n`);

  if (invalid > 0) {
    console.error('❌ Snapshot verification failed\n');
    process.exit(1);
  }

  console.log('✓ All snapshots valid\n');
  process.exit(0);
}

verifySnapshots();
