import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const rootDir = process.cwd();
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
  '/'
);
const siteUrl = (
  readArgument('site-url') ||
  process.env.SITE_URL ||
  'https://pixelstarships.guide'
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

console.log('[Pages] Static artifact ready in dist/ (index.html, 404.html, .nojekyll).');
