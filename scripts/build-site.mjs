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
  'events.ics',
  'favicon.svg',
  'robots.txt',
  'staticwebapp.config.json',
  '34a68ae0477ea10ed9d8a543952e0cdb.txt'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(files.map((file) => cp(path.join(root, file), path.join(output, file))));
await cp(path.join(root, 'images'), path.join(output, 'images'), { recursive: true });
const calendarSource = await readFile(path.join(root, 'events.ics'), 'utf8');
await writeFile(path.join(output, 'events.ics'), calendarSource.replace(/\r?\n/g, '\r\n'));

const origin = 'https://www.thetribalkavalounge.com';
const staticPaths = [
  '/', '/menu', '/new-here', '/kava-vs-kratom', '/what-is-kava', '/what-is-kratom',
  '/events', '/visit', '/plan-your-visit', '/private-events', '/press', '/gift-cards',
  '/faq', '/nearby', '/nearby/west-palm-beach', '/nearby/lake-worth', '/nearby/greenacres',
  '/events/two-dollar-tuesday', '/events/friday-loteria', '/events/karaoke',
  '/events/mario-kart', '/events/poker-night', '/events/art-club', '/events/sip-and-paint',
  '/the-daily-kava'
];
const htmlTemplate = await readFile(path.join(root, 'index.html'), 'utf8');
const appSource = await readFile(path.join(root, 'app.js'), 'utf8');
const dailySource = await readFile(path.join(root, 'daily-kava.js'), 'utf8');
const dailyEntries = [...dailySource.matchAll(/\n\s*slug:\s*'([^']+)',\n\s*title:\s*'([^']+)',\n\s*seoTitle:\s*'([^']+)',\n\s*metaDescription:\s*'([^']+)'[\s\S]*?\n\s*modified:\s*'(\d{4}-\d{2}-\d{2})'/g)]
  .map((match) => ({
    path: `/the-daily-kava/${match[1]}`,
    title: `${match[3]} | Tribal Kava Lounge`,
    description: match[4],
    lastmod: match[5]
  }));
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

const routeMetadata = new Map();
const seoDatabaseStart = appSource.indexOf('const seoDatabase = {');
const seoDatabaseEnd = appSource.indexOf('\n};', seoDatabaseStart);
const seoDatabaseSource = appSource.slice(seoDatabaseStart, seoDatabaseEnd);
for (const match of seoDatabaseSource.matchAll(/\n {4}'[^']+':\s*\{\n {8}title:\s*'([^']+)',\n {8}description:\s*'([^']+)',[\s\S]*?\n {8}slug:\s*'([^']+)',/g)) {
  routeMetadata.set(match[3], { title: match[1], description: match[2] });
}

const eventDatabaseStart = appSource.indexOf('const eventDatabase = {');
const eventDatabaseEnd = appSource.indexOf('\n};', eventDatabaseStart);
const eventDatabaseSource = appSource.slice(eventDatabaseStart, eventDatabaseEnd);
for (const match of eventDatabaseSource.matchAll(/\n {4}'([^']+)':\s*\{\n {8}seoKey:[^\n]+\n {8}eyebrow:[^\n]+\n {8}title:\s*'([^']+)',\n {8}intro:\s*'([^']+)',/g)) {
  routeMetadata.set(`/events/${match[1]}`, {
    title: `${match[2]} | Tribal Kava Lounge West Palm Beach`,
    description: match[3]
  });
}

const nearbyDatabaseStart = appSource.indexOf('const nearbyAreaDatabase = {');
const nearbyDatabaseEnd = appSource.indexOf('\n};', nearbyDatabaseStart);
const nearbyDatabaseSource = appSource.slice(nearbyDatabaseStart, nearbyDatabaseEnd);
for (const match of nearbyDatabaseSource.matchAll(/\n {4}'([^']+)':\s*\{\n {8}seoKey:[^\n]+\n {8}areaName:[^\n]+\n {8}eyebrow:[^\n]+\n {8}title:\s*'([^']+)',\n {8}intro:[^\n]+\n {8}description:\s*'([^']+)',/g)) {
  routeMetadata.set(`/nearby/${match[1]}`, {
    title: `${match[2]} | Tribal Kava Lounge`,
    description: match[3]
  });
}

for (const entry of dailyEntries) {
  routeMetadata.set(entry.path, { title: entry.title, description: entry.description });
}

const missingMetadata = [...staticPaths, ...dailyPaths].filter((route) => !routeMetadata.has(route));
if (missingMetadata.length) {
  throw new Error(`Missing pre-render metadata for: ${missingMetadata.join(', ')}`);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderRouteHtml(route, metadata) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = `${origin}${route === '/' ? '/' : route}`;
  return htmlTemplate
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<link rel="canonical" href="[^"]+" id="seo-canonical">/, `<link rel="canonical" href="${canonical}" id="seo-canonical">`)
    .replace(/<meta property="og:title" content="[^"]*" id="og-title">/, `<meta property="og:title" content="${title}" id="og-title">`)
    .replace(/<meta property="og:description" content="[^"]*" id="og-desc">/, `<meta property="og:description" content="${description}" id="og-desc">`)
    .replace(/<meta property="og:url" content="[^"]*" id="og-url">/, `<meta property="og:url" content="${canonical}" id="og-url">`);
}

for (const route of [...staticPaths, ...dailyPaths]) {
  const routeFile = route === '/'
    ? path.join(output, 'index.html')
    : path.join(output, route.slice(1), 'index.html');
  await mkdir(path.dirname(routeFile), { recursive: true });
  await writeFile(routeFile, renderRouteHtml(route, routeMetadata.get(route)));
}

console.log(`Built ${files.length} files, ${dailyPaths.length} Daily Kava URLs, ${routeMetadata.size} pre-rendered routes, and images into ${output}`);
