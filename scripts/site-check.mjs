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

const [html, robots, sitemap, config, analytics, siteConfig, app, styles] = await Promise.all([
  read('index.html'), read('robots.txt'), read('dist/sitemap.xml'), read('staticwebapp.config.json'),
  read('analytics.js'), read('site-config.js'), read('app.js'), read('styles.css')
]);
const logo = await readFile(path.join(root, 'images/tribal-logo-cutout.png'));

assert.match(html, /https:\/\/www\.thetribalkavalounge\.com\//, 'canonical domain must use www');
assert.match(html, /daily-kava\.js/, 'public Daily Kava feed must be loaded');
assert.match(html, /analytics\.js/, 'conversion tracker must be loaded');
assert.match(html, /\/images\/tribal-logo-cutout\.png/, 'transparent Tribal logo must be used');
assert.doesNotMatch(html, /\/images\/tribal-logo\.jpg/, 'legacy logo photo must not be rendered');
assert.equal(logo[25], 6, 'Tribal logo PNG must contain an RGBA alpha channel');
assert.match(html, /js\.monitor\.azure\.com\/scripts\/b\/ai\.3\.gbl\.min\.js/, 'Application Insights browser SDK must be loaded');
assert.match(siteConfig, /applicationInsightsConnectionString:\s*'InstrumentationKey=/, 'Tribal Application Insights must be configured');
assert.match(analytics, /azureInsights\.trackEvent/, 'conversion events must be sent to Application Insights');
assert.match(analytics, /azureInsights\.trackPageView/, 'page views must be sent to Application Insights');
assert.doesNotMatch(app, /stay quiet on mobile/, 'the Kava Guide prompt must not be disabled on mobile');
assert.match(styles, /width:\s*min\(210px, calc\(100vw - 6\.75rem\)\)/, 'mobile Kava Guide prompt must fit the viewport');
assert.doesNotMatch(html, /Joined VIP list!/, 'VIP path must not fake a successful signup');
assert.match(html, /data-conversion="directions"/, 'directions conversion must exist');
assert.match(html, /data-conversion="vip_sms"/, 'SMS VIP conversion must exist');
assert.match(html, /data-conversion="order_online"/, 'DoorDash order conversion must exist');
assert.match(robots, /www\.thetribalkavalounge\.com\/sitemap\.xml/, 'robots sitemap must be canonical');
assert.doesNotMatch(sitemap, /kratom-regulation|botanical-drink-trends|kava-bars-across-america/, 'unsafe legacy Daily URLs must not be indexed');
assert.equal((sitemap.match(/<url>/g) || []).length, 27, 'sitemap must include 14 site routes and 13 Daily stories');
assert.equal((sitemap.match(/\/the-daily-kava\//g) || []).length, 13, 'all 13 Daily stories must be indexed');
assert.doesNotMatch(sitemap, /<loc>https:\/\/(?!www\.thetribalkavalounge\.com)/, 'sitemap URLs must use the canonical host');
assert.ok(JSON.parse(config).navigationFallback, 'Azure SPA fallback must be configured');

console.log('Site checks passed.');
