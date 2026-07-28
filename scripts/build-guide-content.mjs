import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { writeSplitGuide } from './guide-files.mjs';

const root = process.cwd();
const sourcePath = path.join(root, 'PSS Guideline.md');
const contentDirectory = path.join(root, 'src', 'content');
const imageDirectory = path.join(root, 'public', 'guide-images');

const source = await readFile(sourcePath, 'utf8');
const firstArticleHeading = source.indexOf('\n# Các cơ chế căn bản');
const firstImageDefinition = source.search(/^\[image1\]:/m);

if (firstArticleHeading < 0 || firstImageDefinition < 0) {
  throw new Error('Unable to locate guide content or embedded images.');
}

const introduction = source
  .slice(0, firstArticleHeading)
  .split(/\r?\n\s*\r?\n/)
  .slice(0, 3)
  .join('\n\n')
  .trim();
const definitions = source.slice(firstImageDefinition);
let vietnamese = `${introduction}\n\n${source
  .slice(firstArticleHeading + 1, firstImageDefinition)
  .trim()}\n`;

await mkdir(contentDirectory, { recursive: true });
await mkdir(imageDirectory, { recursive: true });

const extensionByImage = new Map();
const imagePattern = /^\[image(\d+)\]:\s*<data:image\/([^;]+);base64,([^>]+)>/gm;
for (const match of definitions.matchAll(imagePattern)) {
  const [, imageNumber, rawExtension, base64] = match;
  const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension;
  extensionByImage.set(imageNumber, extension);
  await writeFile(
    path.join(imageDirectory, `image${imageNumber}.${extension}`),
    Buffer.from(base64, 'base64')
  );
}

vietnamese = vietnamese.replace(
  /!\[([^\]]*)\]\[image(\d+)\]/g,
  (_, alt, imageNumber) => {
    const extension = extensionByImage.get(imageNumber);
    return extension
      ? `![${alt || `PSS guide illustration ${imageNumber}`}](/guide-images/image${imageNumber}.${extension})`
      : '';
  }
);

await writeSplitGuide(
  vietnamese,
  path.join(contentDirectory, 'guide', 'vi')
);

const blocks = vietnamese.split(/\n\s*\n/).filter(Boolean);
const chunks = [];
let currentChunk = [];
let currentLength = 0;

for (const block of blocks) {
  const marker = `[[[PSSBLOCK${currentChunk.length}]]]`;
  const additionLength = marker.length + block.length + 4;
  if (currentChunk.length > 0 && currentLength + additionLength > 3500) {
    chunks.push(currentChunk);
    currentChunk = [];
    currentLength = 0;
  }
  currentChunk.push(block);
  currentLength += additionLength;
}
if (currentChunk.length > 0) chunks.push(currentChunk);

const translateChunk = async (chunk, chunkIndex) => {
  const markedText = chunk
    .map((block, index) => `[[[PSSBLOCK${index}]]]\n${block}`)
    .join('\n\n');
  const url = new URL(
    'https://translate.googleapis.com/translate_a/single'
  );
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'vi');
  url.searchParams.set('tl', 'en');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', markedText);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation chunk ${chunkIndex} failed: ${response.status}`);
  }

  const payload = await response.json();
  const translatedText = payload[0].map((part) => part[0]).join('');
  const translatedBlocks = translatedText
    .split(/\[\[\[PSSBLOCK\d+\]\]\]/)
    .slice(1)
    .map((block) => block.trim());

  if (translatedBlocks.length !== chunk.length) {
    throw new Error(
      `Translation chunk ${chunkIndex} returned ${translatedBlocks.length} of ${chunk.length} blocks.`
    );
  }

  return translatedBlocks;
};

const translatedChunks = [];
for (let index = 0; index < chunks.length; index += 4) {
  const batch = chunks.slice(index, index + 4);
  const translatedBatch = await Promise.all(
    batch.map((chunk, offset) => translateChunk(chunk, index + offset))
  );
  translatedChunks.push(...translatedBatch);
}

const english = translatedChunks
  .flat()
  .join('\n\n')
  .split('\n')
  .map((line) =>
    line.replace(/^(#+(?:\s+#+)*)\s*/, (headingMarks) => {
      const level = (headingMarks.match(/#/g) || []).length;
      return `${'#'.repeat(Math.min(level, 6))} `;
    })
  )
  .join('\n');

await writeSplitGuide(
  `${english}\n`,
  path.join(contentDirectory, 'guide', 'en')
);

console.log(
  `Generated ${extensionByImage.size} images and ${blocks.length} bilingual guide blocks.`
);
