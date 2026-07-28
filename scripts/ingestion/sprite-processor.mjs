import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Process and crop sprites defined in sprites.json and files.json with image bounds clamping
 */
export async function processSprites(snapshotDir, outputSpriteDir, assetSourceDir) {
  const normalizedDir = path.join(snapshotDir, 'normalized');
  const spritesPath = path.join(normalizedDir, 'sprites.json');
  const filesPath = path.join(normalizedDir, 'files.json');

  if (!fs.existsSync(spritesPath) || !fs.existsSync(filesPath)) {
    console.warn(`[SpriteProcessor] Missing sprites.json or files.json in ${normalizedDir}`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  const sprites = JSON.parse(fs.readFileSync(spritesPath, 'utf8'));
  const files = JSON.parse(fs.readFileSync(filesPath, 'utf8'));

  fs.mkdirSync(outputSpriteDir, { recursive: true });

  const candidateSearchDirs = [
    assetSourceDir,
    'C:\\Users\\AnDoan\\AppData\\LocalLow\\SavySoda\\Pixel Starships\\AssetFiles\\Prod',
    path.join(process.cwd(), 'public', 'guide-images', 'game_assets')
  ].filter(Boolean);

  const spriteIds = Object.keys(sprites);
  console.log(`[SpriteProcessor] Processing ${spriteIds.length} sprite crop definitions...`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const spriteId of spriteIds) {
    const sprite = sprites[spriteId];
    if (!sprite || !sprite.imageFileId) {
      skipped++;
      continue;
    }

    const fileMeta = files[sprite.imageFileId];
    if (!fileMeta) {
      skipped++;
      continue;
    }

    // Try finding local PNG asset file
    const candidateFilenames = [
      `${fileMeta.fileId}.png`,
      fileMeta.filename,
      fileMeta.awsFilename
    ].filter(Boolean);

    let sourcePath = null;
    for (const searchDir of candidateSearchDirs) {
      if (fs.existsSync(searchDir)) {
        for (const name of candidateFilenames) {
          const p = path.join(searchDir, name);
          if (fs.existsSync(p)) {
            sourcePath = p;
            break;
          }
        }
      }
      if (sourcePath) break;
    }

    if (!sourcePath) {
      skipped++;
      continue;
    }

    const outFilename = `${spriteId}.webp`;
    const outPath = path.join(outputSpriteDir, outFilename);

    if (fs.existsSync(outPath)) {
      processed++;
      continue; // Skip already generated WebP derivatives
    }

    try {
      const { x, y, width, height } = sprite;
      if (width <= 0 || height <= 0) {
        skipped++;
        continue;
      }

      const img = sharp(sourcePath);
      const meta = await img.metadata();
      
      const imgW = meta.width || 0;
      const imgH = meta.height || 0;

      if (imgW === 0 || imgH === 0) {
        skipped++;
        continue;
      }

      const left = Math.max(0, Math.min(x, imgW - 1));
      const top = Math.max(0, Math.min(y, imgH - 1));
      const cropW = Math.min(width, imgW - left);
      const cropH = Math.min(height, imgH - top);

      if (cropW <= 0 || cropH <= 0) {
        skipped++;
        continue;
      }

      await sharp(sourcePath)
        .extract({ left, top, width: cropW, height: cropH })
        .toFormat('webp', { quality: 90, reductionEffort: 4 })
        .toFile(outPath);

      processed++;
    } catch (err) {
      console.warn(`[SpriteProcessor] Failed crop for sprite ${spriteId} from ${sourcePath}: ${err.message}`);
      failed++;
    }
  }

  console.log(`[SpriteProcessor] Sprite processing complete. Processed: ${processed}, Skipped: ${skipped}, Failed: ${failed}`);
  return { processed, skipped, failed };
}
