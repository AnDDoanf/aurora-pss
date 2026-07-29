import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { loadEnv } from 'vite';

const rootDir = process.cwd();
const fileEnv = loadEnv(process.env.NODE_ENV || 'production', rootDir, '');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const readArgument = (name) => {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((argument) => argument.startsWith(prefix));
  return match ? match.slice(prefix.length) : '';
};
const normalizeBase = (value) => {
  const cleaned = String(value || '/').trim();
  if (!cleaned || cleaned === '/') return '/';
  return `/${cleaned.replace(/^\/+|\/+$/g, '')}/`;
};
const run = (args, env = process.env) => {
  const result = spawnSync(npmCommand, args, {
    cwd: rootDir,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
};

const base = normalizeBase(
  readArgument('base') ||
  process.env.PAGES_BASE_PATH ||
  process.env.VITE_BASE_PATH ||
  fileEnv.PAGES_BASE_PATH ||
  fileEnv.VITE_BASE_PATH ||
  '/'
);
const siteUrl = (
  readArgument('site-url') ||
  process.env.SITE_URL ||
  fileEnv.SITE_URL ||
  'https://anddoanf.github.io/aurora-pss'
).replace(/\/$/, '');

console.log(`[Pages] Building with base path: ${base}`);
console.log(`[Pages] Sitemap origin: ${siteUrl}`);

run(['run', 'sitemap'], { ...process.env, SITE_URL: siteUrl });
run(['run', 'build', '--', '--base', base], { ...process.env, VITE_BASE_PATH: base });

const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  throw new Error('Vite build did not produce dist/index.html.');
}

// GitHub Pages serves this for unknown paths. The browser router then handles
// the original URL, allowing refreshes on routes such as /en/tools/training.
fs.copyFileSync(indexPath, path.join(distDir, '404.html'));
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
if (base !== '/' && !indexHtml.includes(base)) {
  throw new Error(`Built index does not contain the configured base path ${base}.`);
}

// GitHub Pages has no SPA rewrite support. Materialize sitemap routes as
// lightweight HTML entry points so direct navigation and iframe loads return
// the app with HTTP 200 instead of relying on the 404 fallback.
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const siteOrigin = new URL(siteUrl).origin;
const configuredBase = base === '/' ? '/' : base.replace(/\/$/, '');
let routeEntryCount = 0;

for (const match of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const routeUrl = new URL(match[1]);
  if (routeUrl.origin !== siteOrigin) continue;

  const routePath = decodeURIComponent(routeUrl.pathname);
  if (
    configuredBase !== '/' &&
    routePath !== configuredBase &&
    !routePath.startsWith(`${configuredBase}/`)
  ) {
    continue;
  }

  const relativeRoute = configuredBase === '/'
    ? routePath.replace(/^\/+/, '')
    : routePath.slice(configuredBase.length).replace(/^\/+/, '');
  if (!relativeRoute || relativeRoute.split('/').includes('..')) continue;

  const routeDirectory = path.join(distDir, ...relativeRoute.split('/'));
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.copyFileSync(indexPath, path.join(routeDirectory, 'index.html'));
  routeEntryCount++;
}

console.log(
  `[Pages] Static artifact ready with ${routeEntryCount} direct route entry points.`
);
