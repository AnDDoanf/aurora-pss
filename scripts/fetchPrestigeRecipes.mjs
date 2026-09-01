import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SOURCE_URL = 'https://www.pixelstarships.com/prestige';
const OUTPUT_PATH = resolve('public/data/active/prestigeRecipes.json');
const VERIFIED_SEEDS_PATH = resolve('scripts/prestigeRecipeSeeds.md');

const response = await fetch(SOURCE_URL);
if (!response.ok) throw new Error(`Prestige recipe request failed: ${response.status}`);
const html = await response.text();
const text = html
  .replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/<[^>]+>/g, '\n')
  .replace(/&gt;/gi, '>')
  .replace(/&amp;/gi, '&')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&quot;/gi, '"');
const recipes = [];
const seen = new Set();
const addRecipe = (leftValue, rightValue, outputValue) => {
  const left = leftValue.trim();
  const right = rightValue.trim();
  const output = outputValue.trim();
  const key = `${[left.toLowerCase(), right.toLowerCase()].sort().join('|')}|${output.toLowerCase()}`;
  if (!seen.has(key)) {
    seen.add(key);
    recipes.push({ left, right, output });
  }
};
const pattern = /^\s*(.+?)\s+x\s+(.+?)\s+=>\s+(.+?)\s*;\s*$/gim;
for (const match of text.matchAll(pattern)) {
  addRecipe(match[1], match[2], match[3]);
}
const verifiedSeeds = await readFile(VERIFIED_SEEDS_PATH, 'utf8');
for (const line of verifiedSeeds.split('\n')) {
  const cleaned = line.trim().replace(/^\[(?:x| )?\]\s*/i, '').replace(/\*\*/g, '');
  if (!cleaned.includes('→')) continue;
  const [inputs, output] = cleaned.split(/\s*→\s*/);
  const [left, right] = inputs.split(' + ');
  if (left && right && output) addRecipe(left, right, output);
}
if (recipes.length < 1000) throw new Error(`Only ${recipes.length} prestige recipes were parsed.`);
await writeFile(OUTPUT_PATH, `${JSON.stringify({
  sources: [SOURCE_URL, 'scripts/prestigeRecipeSeeds.md'],
  fetchedAt: new Date().toISOString(),
  recipes
}, null, 2)}\n`, 'utf8');
console.log(`Wrote ${recipes.length} recipes to ${OUTPUT_PATH}`);
