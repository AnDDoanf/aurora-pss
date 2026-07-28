import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const cleanHeading = (heading) =>
  heading
    .replace(/\s+\{#[^}]+\}\s*$/, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();

const slugify = (value) => {
  const slug = cleanHeading(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'section';
};

const withFrontMatter = (title, order, content) =>
  [
    '---',
    `title: ${JSON.stringify(cleanHeading(title))}`,
    `order: ${order}`,
    '---',
    '',
    content
  ].join('\n');

const groupForSection = (sectionNumber) => {
  if (
    [1, 2, 3, 10, 63].includes(sectionNumber) ||
    (sectionNumber >= 34 && sectionNumber <= 51)
  ) {
    return 'Rooms';
  }
  if (
    (sectionNumber >= 4 && sectionNumber <= 9) ||
    (sectionNumber >= 16 && sectionNumber <= 27) ||
    (sectionNumber >= 52 && sectionNumber <= 56)
  ) {
    return 'Crews';
  }
  if (sectionNumber >= 11 && sectionNumber <= 15) {
    return 'AIs';
  }

  return 'Strategies';
};

const mergedDocuments = [
  {
    sectionNumbers: new Set([52, 53, 54, 55, 56]),
    fileName: 'crews-assets.md',
    group: 'Crews',
    sectionNumber: 52,
    title: "Crew's Assets",
    anchor: 'crews-assets'
  }
];

// These source sections are maintained as eleven hand-curated room topics.
// Do not regenerate the former per-section room documents.
const manuallyMergedRoomSections = new Set([
  1, 2, 3, 10, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
  49, 50, 51, 63
]);

const mergedTrainingDocuments = {
  en: [
    {
      sectionNumbers: new Set([16, 17, 18, 19, 20, 21, 22, 23, 24]),
      fileName: 'crew-training-fundamentals.md',
      group: 'Crews',
      sectionNumber: 16,
      title: 'Crew Training Fundamentals',
      anchor: 'crew-training-fundamentals',
      relinkImages: true
    },
    {
      sectionNumbers: new Set([25, 26, 27]),
      fileName: 'advanced-crew-training.md',
      group: 'Crews',
      sectionNumber: 25,
      title: 'Advanced Crew Training',
      anchor: 'advanced-crew-training',
      relinkImages: true
    }
  ],
  vi: [
    {
      sectionNumbers: new Set([16, 17, 18, 19, 20, 21, 22, 23, 24]),
      fileName: 'nen-tang-train-crew.md',
      group: 'Crews',
      sectionNumber: 16,
      title: 'Nền tảng train crew',
      anchor: 'nen-tang-train-crew',
      relinkImages: true
    },
    {
      sectionNumbers: new Set([25, 26, 27]),
      fileName: 'phuong-phap-train-crew-nang-cao.md',
      group: 'Crews',
      sectionNumber: 25,
      title: 'Phương pháp train crew nâng cao',
      anchor: 'phuong-phap-train-crew-nang-cao',
      relinkImages: true
    }
  ]
};

const nestMergedContent = (content) =>
  content
    .replace(/^#{1,2}(?!#)\s+.*(?:\r?\n)?/gm, '')
    .replace(/^(#{3,5})(?=\s)/gm, '$1#')
    .trim();

const relinkMergedImages = (content, language, slug) => {
  const pattern = new RegExp(`/guide-images/${language}/[^)\\s]+`, 'g');
  const sources = [...new Set(content.match(pattern) || [])];
  let linked = content;

  sources.forEach((source, index) => {
    const extension = path.extname(source);
    const suffix = index === 0 ? '' : `-${index + 1}`;
    linked = linked.replaceAll(
      source,
      `/guide-images/${language}/${slug}${suffix}${extension}`
    );
  });
  return linked;
};

export const writeSplitGuide = async (markdown, outputDirectory) => {
  const sectionHeadings = [...markdown.matchAll(/^###(?!#)\s+(.+)$/gm)];
  const fragments = [];

  if (sectionHeadings.length === 0) {
    throw new Error('The guide does not contain any level-three headings.');
  }

  const documentTitle = markdown.match(/^#(?!#)\s+.+$/m);
  const sectionStarts = sectionHeadings.map((heading, index) => {
    const searchStart =
      index === 0
        ? (documentTitle?.index ?? 0) + (documentTitle?.[0].length ?? 0)
        : sectionHeadings[index - 1].index +
          sectionHeadings[index - 1][0].length;
    const precedingContent = markdown.slice(searchStart, heading.index);
    const parentHeading = precedingContent.match(/^#{1,2}(?!#)\s+.+$/m);

    return parentHeading
      ? searchStart + parentHeading.index
      : heading.index;
  });

  const introduction = markdown.slice(0, sectionStarts[0]).trim();
  if (introduction) {
    const title = cleanHeading(documentTitle?.[0].replace(/^#\s+/, '') || 'PSS Guide');
    fragments.push({
      fileName: 'introduction.md',
      sectionNumber: 0,
      title,
      content: withFrontMatter(title, 0, introduction)
    });
  }

  const usedFileNames = new Set();
  sectionHeadings.forEach((heading, index) => {
    const start = sectionStarts[index];
    const end = sectionStarts[index + 1] ?? markdown.length;
    const baseSlug = slugify(heading[1]);
    let slug = baseSlug;
    let duplicate = 2;

    while (usedFileNames.has(`${slug}.md`)) {
      slug = `${baseSlug}-${duplicate}`;
      duplicate += 1;
    }
    usedFileNames.add(`${slug}.md`);

    fragments.push({
      fileName: `${slug}.md`,
      group: groupForSection(index + 1),
      sectionNumber: index + 1,
      title: cleanHeading(heading[1]),
      content: withFrontMatter(
        heading[1],
        index + 1,
        markdown.slice(start, end).trim()
      )
    });
  });

  let outputFragments = fragments.filter(
    ({ sectionNumber }) => !manuallyMergedRoomSections.has(sectionNumber)
  );
  const language = path.basename(outputDirectory);
  const documentsToMerge = [
    ...mergedDocuments,
    ...(mergedTrainingDocuments[language] || [])
  ];
  for (const mergedDocument of documentsToMerge) {
    const mergedFragments = outputFragments.filter(({ sectionNumber }) =>
      mergedDocument.sectionNumbers.has(sectionNumber)
    );
    outputFragments = outputFragments.filter(
      ({ sectionNumber }) =>
        !mergedDocument.sectionNumbers.has(sectionNumber)
    );
    let mergedContent = [
      `### ${mergedDocument.title} {#${mergedDocument.anchor}}`,
      ...mergedFragments.map(({ content }) =>
        nestMergedContent(content.replace(/^---[\s\S]*?---\r?\n?/, ''))
      )
    ].join('\n\n');
    if (mergedDocument.relinkImages) {
      mergedContent = relinkMergedImages(
        mergedContent,
        language,
        path.basename(mergedDocument.fileName, '.md')
      );
    }
    outputFragments.push({
      fileName: mergedDocument.fileName,
      group: mergedDocument.group,
      sectionNumber: mergedDocument.sectionNumber,
      title: mergedDocument.title,
      content: withFrontMatter(
        mergedDocument.title,
        mergedDocument.sectionNumber,
        mergedContent
      )
    });
  }

  // Keep manually maintained guides (notably Updates) when regenerating the
  // split documents. Generated files are overwritten below by their stable
  // slug instead of deleting the whole language tree.
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all(
    outputFragments.map(async ({ fileName, group, content }) => {
      const directory = group
        ? path.join(outputDirectory, group)
        : outputDirectory;
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, fileName), `${content}\n`, 'utf8');
    })
  );

  return outputFragments.length;
};
