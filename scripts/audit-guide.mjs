import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const guideRoot = path.join(root, 'src', 'content', 'guide');
const errors = [];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    })
  );
  return nested.flat();
};

const markdownFiles = (await walk(guideRoot)).filter((file) =>
  file.endsWith('.md')
);

for (const language of ['en', 'vi']) {
  const orders = new Map();
  const files = markdownFiles.filter(
    (file) => path.relative(guideRoot, file).split(path.sep)[0] === language
  );
  const updateFiles = files.filter((file) =>
    path.relative(guideRoot, file).split(path.sep).includes('Updates')
  );
  const expectedUpdateFile =
    language === 'en'
      ? 'official-updates-2020-2026.md'
      : 'cap-nhat-chinh-thuc-2020-2026.md';
  if (
    updateFiles.length !== 1 ||
    path.basename(updateFiles[0] || '') !== expectedUpdateFile
  ) {
    errors.push(
      `${language}: expected exactly one combined update index named ${expectedUpdateFile}`
    );
  }
  const obsoleteTrainingFiles = files.filter((file) =>
    path.relative(guideRoot, file).split(path.sep).includes('Crews Trainning')
  );
  if (obsoleteTrainingFiles.length) {
    errors.push(`${language}: Crews Trainning must be merged into Crews`);
  }
  const obsoleteRoomGroups = files.filter((file) => {
    const group = path.basename(path.dirname(file));
    return group === 'Offensive Rooms' || group === 'Defensive Rooms';
  });
  if (obsoleteRoomGroups.length) {
    errors.push(`${language}: offensive and defensive room files must be merged into Rooms`);
  }
  const expectedRoomFiles =
    language === 'en'
      ? [
          'introduction.md',
          'laser-and-cannon.md',
          'missiles.md',
          'hangars.md',
          'super-weapons.md',
          'shields.md',
          'engines.md',
          'cloak-and-radar.md',
          'anti-craft.md',
          'teleport-and-anti-teleport.md',
          'androids.md'
        ]
      : [
          'gioi-thieu.md',
          'laser-va-dai-phao.md',
          'ten-lua.md',
          'hangar.md',
          'sieu-vu-khi.md',
          'khien.md',
          'dong-co.md',
          'cloak-va-radar.md',
          'anti-craft.md',
          'teleport-va-anti-teleport.md',
          'android.md'
        ];
  const actualRoomFiles = files
    .filter((file) => path.basename(path.dirname(file)) === 'Rooms')
    .map((file) => path.basename(file))
    .sort();
  if (
    actualRoomFiles.length !== expectedRoomFiles.length ||
    expectedRoomFiles.some((file) => !actualRoomFiles.includes(file))
  ) {
    errors.push(`${language}: Rooms must contain exactly the eleven merged topics`);
  }
  const expectedTrainingFiles =
    language === 'en'
      ? ['advanced-crew-training.md', 'crew-training-fundamentals.md']
      : ['nen-tang-train-crew.md', 'phuong-phap-train-crew-nang-cao.md'];
  for (const expected of expectedTrainingFiles) {
    if (
      !files.some(
        (file) =>
          path.basename(file) === expected &&
          path.basename(path.dirname(file)) === 'Crews'
      )
    ) {
      errors.push(`${language}: missing merged Crew guide ${expected}`);
    }
  }

  for (const file of files) {
    const slug = path.basename(file, '.md');
    const relative = path.relative(root, file);
    const source = await readFile(file, 'utf8');
    const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);


    if (/^\d{1,3}[-_.\s]/.test(slug)) {
      errors.push(`${relative}: filename starts with an order number`);
    }
    if (!frontMatter) {
      errors.push(`${relative}: missing front matter`);
      continue;
    }

    const title = frontMatter[1].match(/^title:\s*(.+)$/m)?.[1]?.trim();
    const orderText = frontMatter[1].match(/^order:\s*(\d+)$/m)?.[1];
    if (!title) errors.push(`${relative}: missing title metadata`);
    if (!orderText) {
      errors.push(`${relative}: missing numeric order metadata`);
    } else {
      const order = Number(orderText);
      const group = path.basename(path.dirname(file));
      const orderKey = `${group}:${order}`;
      const previous = orders.get(orderKey);
      if (previous) {
        errors.push(
          `${relative}: order ${order} is also used by ${path.relative(root, previous)}`
        );
      } else {
        orders.set(orderKey, file);
      }
    }

    for (const match of source.matchAll(
      /!\[[^\]]*]\((\/guide-images\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g
    )) {
      const publicPath = path.join(root, 'public', ...match[1].split('/').slice(1));
      const imageName = path.basename(publicPath);
      if (!imageName.startsWith(slug)) {
        errors.push(`${relative}: image ${imageName} does not match slug ${slug}`);
      }
      try {
        const details = await stat(publicPath);
        if (details.size === 0) {
          errors.push(`${relative}: image ${imageName} is empty`);
        }
      } catch {
        errors.push(`${relative}: image ${match[1]} is missing`);
      }
    }
  }
}

const ledgerPath = path.join(
  root,
  'scripts',
  'data',
  'pixel-starships-blog-2020-2026.json'
);
const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
const years = new Set(ledger.map(({ date }) => Number(date.slice(0, 4))));
if (ledger.length !== 139) {
  errors.push(`official update ledger has ${ledger.length} posts; expected 139`);
}
for (let year = 2020; year <= 2026; year += 1) {
  if (!years.has(year)) errors.push(`official update ledger is missing ${year}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Guide audit passed: ${markdownFiles.length} Markdown files, 139 official posts, 2020–2026.`
  );
}
