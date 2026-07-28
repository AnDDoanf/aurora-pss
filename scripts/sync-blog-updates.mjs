import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const api =
  'https://blog.pixelstarships.com/wp-json/wp/v2/posts' +
  '?after=2020-01-01T00:00:00' +
  '&before=2026-07-28T00:00:00' +
  '&per_page=100' +
  '&_fields=id,date,link,slug,title';

const decodeHtml = (value) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

const classify = (title) => {
  if (/patch|release notes|release$|bug fix|forced client/i.test(title)) {
    return 'Patch notes';
  }
  if (
    /introducing|preview|sneak peek|announcing|superweapon|level \d+ hull/i.test(
      title
    )
  ) {
    return 'Feature preview';
  }
  if (/update|changes|overhaul|launched|new tournament format/i.test(title)) {
    return 'System update';
  }
  if (/tournament|fair play|automation|community/i.test(title)) {
    return 'Community / tournament';
  }
  if (/collab|festival|easter|holiday|season|lunar|anniversary/i.test(title)) {
    return 'Event / collaboration';
  }
  return 'Announcement';
};

const fetchPage = async (page) => {
  const response = await fetch(`${api}&page=${page}`);
  if (!response.ok) {
    throw new Error(`Blog API page ${page} returned ${response.status}.`);
  }
  return {
    posts: await response.json(),
    pageCount: Number(response.headers.get('x-wp-totalpages') || 1)
  };
};

const firstPage = await fetchPage(1);
const remainingPages = await Promise.all(
  Array.from({ length: firstPage.pageCount - 1 }, (_, index) =>
    fetchPage(index + 2)
  )
);
const posts = [firstPage, ...remainingPages]
  .flatMap(({ posts: pagePosts }) => pagePosts)
  .map((post) => ({
    id: post.id,
    date: post.date.slice(0, 10),
    year: Number(post.date.slice(0, 4)),
    slug: post.slug,
    title: decodeHtml(post.title.rendered),
    url: post.link,
    type: classify(decodeHtml(post.title.rendered))
  }))
  .sort((left, right) => left.date.localeCompare(right.date));

const labels = {
  en: {
    title: (year) => `Official Updates: ${year}`,
    heading: (year) => `Official Pixel Starships Updates — ${year}`,
    intro:
      'Complete index of official Pixel Starships blog posts published during this year. Patch notes and durable feature announcements are incorporated into the current-mechanics guide; event and community posts remain here for historical context.',
    date: 'Date',
    update: 'Official post',
    type: 'Type'
  },
  vi: {
    title: (year) => `Cập nhật chính thức: ${year}`,
    heading: (year) => `Cập nhật Pixel Starships chính thức — ${year}`,
    intro:
      'Danh mục đầy đủ các bài đăng trên blog Pixel Starships chính thức trong năm. Ghi chú bản vá và tính năng lâu dài được tổng hợp vào phần cơ chế hiện tại; bài sự kiện và cộng đồng được giữ tại đây để tra cứu lịch sử.',
    date: 'Ngày',
    update: 'Bài đăng chính thức',
    type: 'Phân loại'
  }
};

const vietnameseTypes = {
  'Patch notes': 'Ghi chú bản vá',
  'Feature preview': 'Giới thiệu tính năng',
  'System update': 'Cập nhật hệ thống',
  'Community / tournament': 'Cộng đồng / tournament',
  'Event / collaboration': 'Sự kiện / hợp tác',
  Announcement: 'Thông báo'
};

// Keep the crawl as source data only. Guide content is maintained in the
// existing topical documents, not generated as chronological update pages.
for (const language of []) {
  const outputDirectory = path.join(
    root,
    'src',
    'content',
    'guide',
    language,
    'Updates'
  );
  await mkdir(outputDirectory, { recursive: true });

  for (let year = 2020; year <= 2026; year += 1) {
    const copy = labels[language];
    const yearPosts = posts.filter((post) => post.year === year);
    const rows = yearPosts.map((post) => {
      const type =
        language === 'vi' ? vietnameseTypes[post.type] : post.type;
      const safeTitle = post.title.replaceAll('|', '\\|');
      return `| ${post.date} | [${safeTitle}](${post.url}) | ${type} |`;
    });
    const markdown = [
      '---',
      `title: ${JSON.stringify(copy.title(year))}`,
      `order: ${200 + year - 2020}`,
      '---',
      '',
      `### ${copy.heading(year)}`,
      '',
      copy.intro,
      '',
      `**${yearPosts.length} ${language === 'vi' ? 'bài đăng' : 'posts'}**`,
      '',
      `| ${copy.date} | ${copy.update} | ${copy.type} |`,
      '| --- | --- | --- |',
      ...rows,
      ''
    ].join('\n');

    await writeFile(
      path.join(outputDirectory, `${year}-official-updates.md`),
      markdown,
      'utf8'
    );
  }
}

const dataDirectory = path.join(root, 'scripts', 'data');
await mkdir(dataDirectory, { recursive: true });
await writeFile(
  path.join(dataDirectory, 'pixel-starships-blog-2020-2026.json'),
  `${JSON.stringify(posts, null, 2)}\n`,
  'utf8'
);

console.log(`Indexed ${posts.length} official blog posts from 2020–2026.`);

const archiveCopy = {
  en: {
    file: 'official-updates-2020-2026.md',
    title: 'Official Updates: 2020–2026',
    heading: 'Official Pixel Starships Updates, 2020–2026',
    intro:
      'Complete chronological index of official Pixel Starships blog posts. Durable mechanics from these releases are documented in their relevant room, crew, AI, training, and strategy guides.',
    count: 'official posts',
    date: 'Date',
    post: 'Official post',
    type: 'Type'
  },
  vi: {
    file: 'cap-nhat-chinh-thuc-2020-2026.md',
    title: 'Cập nhật chính thức: 2020–2026',
    heading: 'Cập nhật Pixel Starships chính thức, 2020–2026',
    intro:
      'Danh mục theo thời gian của toàn bộ bài đăng trên blog Pixel Starships chính thức. Cơ chế còn hiệu lực từ các bản phát hành này được cập nhật trong hướng dẫn phòng, crew, AI, training và chiến thuật tương ứng.',
    count: 'bài đăng chính thức',
    date: 'Ngày',
    post: 'Bài đăng chính thức',
    type: 'Phân loại'
  }
};
const archiveTypesVi = {
  'Patch notes': 'Ghi chú bản vá',
  'Feature preview': 'Giới thiệu tính năng',
  'System update': 'Cập nhật hệ thống',
  'Community / tournament': 'Cộng đồng / tournament',
  'Event / collaboration': 'Sự kiện / hợp tác',
  Announcement: 'Thông báo'
};

for (const language of ['en', 'vi']) {
  const copy = archiveCopy[language];
  const sections = [];

  for (let year = 2026; year >= 2020; year -= 1) {
    const yearPosts = posts.filter((post) => post.year === year).reverse();
    sections.push(
      `#### ${year}`,
      '',
      `| ${copy.date} | ${copy.post} | ${copy.type} |`,
      '| --- | --- | --- |',
      ...yearPosts.map((post) => {
        const type =
          language === 'vi' ? archiveTypesVi[post.type] : post.type;
        return `| ${post.date} | [${post.title.replaceAll('|', '\\|')}](${post.url}) | ${type} |`;
      }),
      ''
    );
  }

  const markdown = [
    '---',
    `title: ${JSON.stringify(copy.title)}`,
    'order: 200',
    '---',
    '',
    `### ${copy.heading}`,
    '',
    copy.intro,
    '',
    `**${posts.length} ${copy.count}.**`,
    '',
    ...sections
  ].join('\n');
  const outputDirectory = path.join(
    root,
    'src',
    'content',
    'guide',
    language,
    'Updates'
  );
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, copy.file), markdown, 'utf8');
}
