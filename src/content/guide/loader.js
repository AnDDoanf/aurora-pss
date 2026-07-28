export const guideGroups = [
  'Rooms',
  'Crews',
  'Strategies',
  'AIs',
  'Updates'
];

const cleanHeading = (heading) =>
  heading.replace(/\s+\{#[^}]+\}\s*$/, '').trim();

const cleanMarkdown = (markdown) =>
  markdown.replace(/\s+\{#[^}]+\}(?=\s*$)/gm, '').trim();

const parseGuideFile = (markdown, filePath) => {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    throw new Error(`Missing front matter for ${filePath}.`);
  }

  const metadata = Object.fromEntries(
    match[1].split(/\r?\n/).map((line) => {
      const separator = line.indexOf(':');
      const key = line.slice(0, separator).trim();
      const rawValue = line.slice(separator + 1).trim();
      let value = rawValue;

      if (rawValue.startsWith('"')) {
        value = JSON.parse(rawValue);
      } else if (/^-?\d+$/.test(rawValue)) {
        value = Number(rawValue);
      }

      return [key, value];
    })
  );

  if (typeof metadata.title !== 'string' || !Number.isInteger(metadata.order)) {
    throw new Error(`Invalid guide metadata for ${filePath}.`);
  }

  return {
    metadata,
    content: markdown.slice(match[0].length)
  };
};

const pathParts = (filePath) => filePath.replaceAll('\\', '/').split('/');
const fileNameFromPath = (filePath) => pathParts(filePath).at(-1) || filePath;

const groupFromPath = (filePath) => {
  const parts = pathParts(filePath);
  const group = parts.at(-2);

  return guideGroups.includes(group) ? group : null;
};

const loadGuide = (language, modules) => {
  const files = Object.entries(modules)
    .map(([filePath, markdown]) => [
      filePath,
      parseGuideFile(markdown, filePath)
    ])
    .sort(
      ([leftPath, left], [rightPath, right]) =>
        left.metadata.order - right.metadata.order ||
        leftPath.localeCompare(rightPath)
    );
  const introductionFile = files.find(([filePath]) =>
    filePath.endsWith('/introduction.md')
  );

  if (!introductionFile) {
    throw new Error(`Missing introduction for the ${language} guide.`);
  }

  const introductionMarkdown = cleanMarkdown(introductionFile[1].content);
  const titleHeading = introductionMarkdown.match(/^# (.+)$/m);
  const title = introductionFile[1].metadata.title;
  const introduction = titleHeading
    ? introductionMarkdown
        .slice(titleHeading.index + titleHeading[0].length)
        .trim()
    : introductionMarkdown;

  const sections = files
    .filter(([filePath]) => !filePath.endsWith('/introduction.md'))
    .map(([filePath, guideFile], index) => {
      const group = groupFromPath(filePath);

      if (!group) {
        throw new Error(`Unknown guide group for ${filePath}.`);
      }

      const content = cleanMarkdown(guideFile.content);

      return {
        id:
          fileNameFromPath(filePath).replace(/\.md$/, '') ||
          `guide-section-${index}`,
        group,
        title: guideFile.metadata.title,
        order: guideFile.metadata.order,
        level: guideFile.metadata.level || 'beginner',
        content,
        subsectionCount: (content.match(/^#### /gm) || []).length
      };
    });

  return { title, introduction, sections };
};

const vietnameseGuideFiles = import.meta.glob('./vi/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});
const englishGuideFiles = import.meta.glob('./en/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

export const guides = {
  vi: loadGuide('Vietnamese', vietnameseGuideFiles),
  en: loadGuide('English', englishGuideFiles)
};
