import path from 'path';
import { processSprites } from './ingestion/sprite-processor.mjs';

const rootDir = process.cwd();
const snapshotDir = path.join(rootDir, 'data', 'snapshots', '2026-07-28T03-30-49-730Z');
const outputSpriteDir = path.join(rootDir, 'public', 'assets', 'sprites');
const assetSourceDir = 'C:\\Users\\AnDoan\\AppData\\LocalLow\\SavySoda\\Pixel Starships\\AssetFiles\\Prod';

console.log('Running sprite processor on active snapshot with raw PSS AppData assets...');
processSprites(snapshotDir, outputSpriteDir, assetSourceDir)
  .then((res) => console.log('Sprite crop result:', res))
  .catch((err) => console.error('Sprite crop error:', err));
