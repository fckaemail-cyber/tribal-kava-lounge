import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const files = [
  'index.html',
  'styles.css',
  'app.js',
  'daily-kava.js',
  'site-config.js',
  'analytics.js',
  'favicon.svg',
  'robots.txt',
  'staticwebapp.config.json',
  '34a68ae0477ea10ed9d8a543952e0cdb.txt'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(files.map((file) => cp(path.join(root, file), path.join(output, file))));
await cp(path.join(root, 'images'), path.join(output, 'images'), { recursive: true });

const origin = 'https://www.thetribalkavalounge.com';
const staticPaths = [
  '/', '/menu', '/new-here', '/kava-vs-kratom', '/what-is-kava', '/what-is-kratom',
  '/events', '/visit', '/plan-your-visit', '/private-events', '/press', '/gift-cards',
  '/faq', '/nearby', '/events/two-dollar-tuesday', '/events/friday-loteria', '/events/karaoke',
  '/the-daily-kava'
];
const dailySource = await readFile(path.join(root, 'daily-kava.js'), 'utf8');
const dailyEntries = [...dailySource.matchAll(/\n\s*slug:\s*'([^']+)'[\s\S]*?\n\s*modified:\s*'(\d{4}-\d{2}-\d{2})'/g)]
  .map((match) => ({ path: `/the-daily-kava/${match[1]}`, lastmod: match[2] }));
const dailyPaths = dailyEntries.map((entry) => entry.path);
const dailyLastmod = new Map(dailyEntries.map((entry) => [entry.path, entry.lastmod]));
const urls = [...staticPaths, ...dailyPaths]
  .map((route) => {
    const changefreq = route.includes('events') || route.includes('two-dollar-kava') ? 'weekly' : 'monthly';
    const priority = route === '/' ? '1.0' : route === '/the-daily-kava' ? '0.9' : route.startsWith('/the-daily-kava/') ? '0.8' : '0.7';
    const lastmod = dailyLastmod.has(route) ? `<lastmod>${dailyLastmod.get(route)}</lastmod>` : '';
    return `  <url><loc>${origin}${route}</loc>${lastmod}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  })
  .join('\n');
await writeFile(
  path.join(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`Built ${files.length} files, ${dailyPaths.length} Daily Kava URLs, and images into ${output}`);
