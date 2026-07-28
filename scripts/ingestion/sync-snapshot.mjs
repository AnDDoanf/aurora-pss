import fs from 'fs';
import path from 'path';
import { fetchAllSnapshots } from './fetcher.mjs';
import { validateSnapshotDirectory } from './validator.mjs';
import { normalizeSnapshot } from './normalizer.mjs';
import { processSprites } from './sprite-processor.mjs';

async function runSync() {
  const rootDir = process.cwd();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotDir = path.join(rootDir, 'data', 'snapshots', timestamp);
  const activeJsonPath = path.join(rootDir, 'data', 'snapshots', 'active.json');
  const publicDataDir = path.join(rootDir, 'public', 'data', 'active');
  const publicSpriteDir = path.join(rootDir, 'public', 'assets', 'sprites');

  console.log(`=======================================================`);
  console.log(` Starting PSS Data Sync Snapshot Pipeline [${timestamp}]`);
  console.log(`=======================================================`);

  // Step 1: Fetch all 43 XML endpoints
  await fetchAllSnapshots(snapshotDir, 'en');

  // Step 2: Validate XML payloads & record counts
  const validationReport = validateSnapshotDirectory(snapshotDir);
  if (validationReport.status !== 'PASSED') {
    console.error(`[Sync] Validation failed! Aborting activation of snapshot ${timestamp}.`);
    process.exit(1);
  }

  // Step 3: Normalize XML into JSON catalog database
  const meta = normalizeSnapshot(snapshotDir);

  // Step 4: Process sprite crops into WebP derivatives
  const assetSourceDir = path.join(rootDir, 'public', 'guide-images', 'game_assets');
  await processSprites(snapshotDir, publicSpriteDir, assetSourceDir);

  // Step 5: Atomic Activation — publish normalized files to public/data/active/
  fs.mkdirSync(publicDataDir, { recursive: true });
  const normalizedDir = path.join(snapshotDir, 'normalized');

  const jsonFiles = fs.readdirSync(normalizedDir);
  for (const file of jsonFiles) {
    const srcPath = path.join(normalizedDir, file);
    const destPath = path.join(publicDataDir, file);
    fs.copyFileSync(srcPath, destPath);
  }

  // Save active pointer
  const activeRecord = {
    snapshotId: timestamp,
    activatedAt: new Date().toISOString(),
    meta
  };

  fs.mkdirSync(path.dirname(activeJsonPath), { recursive: true });
  fs.writeFileSync(activeJsonPath, JSON.stringify(activeRecord, null, 2), 'utf8');

  console.log(`=======================================================`);
  console.log(` Pipeline Completed Successfully! Snapshot Active: ${timestamp}`);
  console.log(` Published catalog JSON to: public/data/active/`);
  console.log(`=======================================================`);
}

runSync().catch(err => {
  console.error('[Sync Fatal Error]', err);
  process.exit(1);
});
