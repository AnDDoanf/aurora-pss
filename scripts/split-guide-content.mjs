import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { writeSplitGuide } from './guide-files.mjs';

const root = process.cwd();
const contentDirectory = path.join(root, 'src', 'content');
const languages = ['vi', 'en'];

for (const language of languages) {
  const markdown = await readFile(
    path.join(contentDirectory, `pssGuide.${language}.md`),
    'utf8'
  );
  const count = await writeSplitGuide(
    markdown,
    path.join(contentDirectory, 'guide', language)
  );

  console.log(`Generated ${count} ${language} guide fragments.`);
}
