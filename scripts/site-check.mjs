import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(root, file), 'utf8');

for (const file of ['app.js', 'daily-kava.js', 'site-config.js', 'analytics.js']) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' });
}

const [html, robots, sitemap, config] = await Promise.all([
  read('index.html'), read('robots.txt'), read('dist/sitemap.xml'), read('staticwebapp.config.json')
]);

assert.match(html, /https:\/\/www\.thetribalkavalounge\.com\//, 'canonical domain must use www');
assert.match(html, /daily-kava\.js/, 'public Daily Kava feed must be loaded');
assert.match(html, /analytics\.js/, 'conversion tracker must be loaded');
assert.doesNotMatch(html, /Joined VIP list!/, 'VIP path must not fake a successful signup');
assert.match(html, /data-conversion="directions"/, 'directions conversion must exist');
assert.match(html, /data-conversion="vip_sms"/, 'SMS VIP conversion must exist');
assert.match(robots, /www\.thetribalkavalounge\.com\/sitemap\.xml/, 'robots sitemap must be canonical');
assert.doesNotMatch(sitemap, /kratom-regulation|botanical-drink-trends|kava-bars-across-america/, 'unsafe legacy Daily URLs must not be indexed');
assert.equal((sitemap.match(/<url>/g) || []).length, 27, 'sitemap must include 14 site routes and 13 Daily stories');
assert.equal((sitemap.match(/\/the-daily-kava\//g) || []).length, 13, 'all 13 Daily stories must be indexed');
assert.doesNotMatch(sitemap, /<loc>https:\/\/(?!www\.thetribalkavalounge\.com)/, 'sitemap URLs must use the canonical host');
assert.ok(JSON.parse(config).navigationFallback, 'Azure SPA fallback must be configured');

console.log('Site checks passed.');
