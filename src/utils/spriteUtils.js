import { publicUrl } from './publicUrl';

let spritesMapCache = null;
let spritesLoadingPromise = null;

/**
 * Asynchronously loads sprites.json map if a sprite fallback lookup is needed.
 */
export async function loadSpritesMap() {
  if (spritesMapCache) return spritesMapCache;
  if (!spritesLoadingPromise) {
    spritesLoadingPromise = fetch(publicUrl('/data/active/sprites.json'))
      .then(res => res.json())
      .then(data => {
        spritesMapCache = data;
        return data;
      })
      .catch(err => {
        console.error('Failed to load sprites.json map:', err);
        return {};
      });
  }
  return spritesLoadingPromise;
}
