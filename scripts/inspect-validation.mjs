import fs from 'fs';
import path from 'path';
import { validateSnapshotDirectory } from './ingestion/validator.mjs';

const baseDir = path.join(process.cwd(), 'data', 'snapshots');
const snapshots = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());
snapshots.sort().reverse();

const latestSnapshot = snapshots[0];
console.log(`Re-validating snapshot: ${latestSnapshot}`);

const snapshotDir = path.join(baseDir, latestSnapshot);
const report = validateSnapshotDirectory(snapshotDir);

console.log(`Validator Status: ${report.status} (${report.validEndpoints}/${report.totalEndpoints} valid)`);
if (report.status !== 'PASSED') {
  for (const [ep, res] of Object.entries(report.details)) {
    if (!res.valid) {
      console.log(`[FAILED] ${ep}: ${res.reason}`);
    }
  }
}
