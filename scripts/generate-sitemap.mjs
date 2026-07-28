import fs from 'fs';
import path from 'path';

const SITE_URL = (process.env.SITE_URL || 'https://pixelstarships.guide').replace(/\/$/, '');
const activeDir = path.join(process.cwd(), 'public', 'data', 'active');
const publicDir = path.join(process.cwd(), 'public');

const readJson = (file) => {
  const p = path.join(activeDir, file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
};

console.log('[Sitemap] Generating public/sitemap.xml...');

const languages = ['en', 'vi'];
const staticRoutes = [
  '',
  '/guide',
  '/library/crew',
  '/library/rooms',
  '/library/ships',
  '/library/items',
  '/library/crafts',
  '/library/missiles',
  '/library/research',
  '/library/missions',
  '/library/galaxy',
  '/library/collections',
  '/library/skins',
  '/compare/crew',
  '/tools/training',
  '/tools/targeting',
  '/tools/advisor',
  '/tools/tournaments',
  '/tools/market',
  '/about/data'
];

const urls = [];

// Static & Library Section URLs
for (const lang of languages) {
  for (const route of staticRoutes) {
    urls.push(`${SITE_URL}/${lang}${route}`);
  }
}

// Crew Detail URLs
const crew = readJson('crew.json');
crew.forEach(c => {
  languages.forEach(lang => {
    urls.push(`${SITE_URL}/${lang}/library/crew/${c.id}`);
  });
});

// Room Detail URLs
const rooms = readJson('rooms.json');
rooms.forEach(r => {
  languages.forEach(lang => {
    urls.push(`${SITE_URL}/${lang}/library/rooms/${r.rootId}`);
  });
});

// Ship Detail URLs
const ships = readJson('ships.json');
ships.forEach(s => {
  languages.forEach(lang => {
    urls.push(`${SITE_URL}/${lang}/library/ships/${s.id}`);
  });
});

// Item Detail URLs
const items = readJson('items.json');
items.forEach(i => {
  languages.forEach(lang => {
    urls.push(`${SITE_URL}/${lang}/library/items/${i.id}`);
  });
});

const today = new Date().toISOString().split('T')[0];

const xmlEntries = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim(), 'utf8');
console.log(`[Sitemap] Complete! Written ${urls.length} URLs to public/sitemap.xml`);
