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

const [html, robots, sitemap, config, analytics, siteConfig, app, styles, dailyKava, workbookConfig, workbookBicep] = await Promise.all([
  read('index.html'), read('robots.txt'), read('dist/sitemap.xml'), read('staticwebapp.config.json'),
  read('analytics.js'), read('site-config.js'), read('app.js'), read('styles.css'), read('daily-kava.js'),
  read('infra/azure/conversion-workbook.json'), read('infra/azure/conversion-workbook.bicep')
]);
const logo = await readFile(path.join(root, 'images/tribal-logo-cutout.png'));
const communityPhoto = await readFile(path.join(root, 'images/tribal-community-game-night.webp'));
const barPhoto = await readFile(path.join(root, 'images/tribal-bar-game-night.webp'));
const indexNowKey = await readFile(path.join(root, 'dist/34a68ae0477ea10ed9d8a543952e0cdb.txt'), 'utf8');

assert.match(html, /https:\/\/www\.thetribalkavalounge\.com\//, 'canonical domain must use www');
assert.match(html, /daily-kava\.js/, 'public Daily Kava feed must be loaded');
assert.match(html, /analytics\.js/, 'conversion tracker must be loaded');
assert.match(html, /\/images\/tribal-logo-cutout\.png/, 'transparent Tribal logo must be used');
assert.doesNotMatch(html, /\/images\/tribal-logo\.jpg/, 'legacy logo photo must not be rendered');
assert.doesNotMatch(html, /\/images\/(?:lounge-interior|hero-placeholder)\.jpg/, 'inauthentic lounge placeholders must not be rendered');
assert.doesNotMatch(app, /\/images\/lounge-interior\.jpg/, 'inauthentic lounge image must not appear in schema');
assert.match(html, /\/images\/tribal-community-game-night\.webp/, 'authentic owned community photography must appear in the hero');
assert.match(html, /\/images\/tribal-bar-game-night\.webp/, 'authentic owned lounge photography must appear in the gallery');
assert.ok(communityPhoto.length > 50000, 'owned community photo must be a real optimized image asset');
assert.ok(barPhoto.length > 50000, 'owned lounge photo must be a real optimized image asset');
assert.match(html, /published by[\s\S]*@TribalKavaLounge on August 18, 2026/, 'owned photography must retain visible source provenance');
assert.doesNotMatch(`${html}\n${app}\n${dailyKava}`, /Kava Clouds?|Kratom Refreshers?|Agua Frescas?|Viral Signatures?/, 'retired drink branding must not return');
assert.equal(logo[25], 6, 'Tribal logo PNG must contain an RGBA alpha channel');
assert.equal(indexNowKey.trim(), '34a68ae0477ea10ed9d8a543952e0cdb', 'IndexNow ownership key must ship at the site root');
assert.match(html, /js\.monitor\.azure\.com\/scripts\/b\/ai\.3\.gbl\.min\.js/, 'Application Insights browser SDK must be loaded');
assert.match(siteConfig, /applicationInsightsConnectionString:\s*'InstrumentationKey=/, 'Tribal Application Insights must be configured');
assert.match(analytics, /azureInsights\.trackEvent/, 'conversion events must be sent to Application Insights');
assert.match(analytics, /azureInsights\.trackPageView/, 'page views must be sent to Application Insights');
assert.match(analytics, /isProductionHost/, 'local previews must be excluded from production telemetry');
assert.match(workbookBicep, /Microsoft\.Insights\/workbooks@2023-06-01/, 'conversion workbook must be deployable');
assert.equal(JSON.parse(workbookConfig).items.filter(item => item.type === 3).length, 5, 'conversion workbook must contain five query panels');
assert.doesNotMatch(app, /stay quiet on mobile/, 'the Kava Guide prompt must not be disabled on mobile');
assert.match(styles, /width:\s*min\(210px, calc\(100vw - 6\.75rem\)\)/, 'mobile Kava Guide prompt must fit the viewport');
assert.doesNotMatch(html, /Joined VIP list!/, 'VIP path must not fake a successful signup');
assert.match(html, /data-conversion="directions"/, 'directions conversion must exist');
assert.match(html, /data-conversion="vip_sms"/, 'SMS VIP conversion must exist');
assert.match(html, /data-conversion="order_online"/, 'DoorDash order conversion must exist');
assert.match(html, /doordash\.com\/business\/tribal-kava-bar-w-p-b-17836977\//, 'Active DoorDash storefront must be linked');
assert.doesNotMatch(html, /order\.online\/store\/637148/, 'Inactive legacy DoorDash storefront must not be linked');
assert.equal((html.match(/class="drink-finder-step"/g) || []).length, 3, 'drink finder must ask exactly three questions');
assert.match(app, /tribalTrack\?\.\('drink_recommendation'/, 'drink recommendations must be tracked');
assert.doesNotMatch(html, /quiz-card|data-recommendation/, 'legacy one-click drink quiz must be removed');
assert.match(styles, /\.hero-ctas \.btn:nth-child\(n \+ 3\)\s*\{\s*display:\s*none;/, 'mobile hero must prioritize two conversion actions');
assert.equal((html.match(/href="\/events\/(?:two-dollar-tuesday|friday-loteria|karaoke|mario-kart|poker-night|art-club|sip-and-paint)"/g) || []).length, 7, 'all seven verified events must have shareable routes');
assert.equal((app.match(/embedUrl:\s*'https:\/\/www\.instagram\.com\/p\//g) || []).length, 5, 'five event pages must embed their official scheduling proof');
assert.match(html, /instagram\.com\/p\/DZC5nDruES3\/embed\/captioned/, 'official Instagram proof must be embedded');
assert.match(html, /id="view-nearby"/, 'nearby-area search coverage page must exist');
assert.match(robots, /www\.thetribalkavalounge\.com\/sitemap\.xml/, 'robots sitemap must be canonical');
assert.doesNotMatch(sitemap, /kratom-regulation|botanical-drink-trends|kava-bars-across-america/, 'unsafe legacy Daily URLs must not be indexed');
assert.match(sitemap, /\/the-daily-kava\/crafted-kava-drinks/, 'new crafted-kava article URL must be indexed');
assert.doesNotMatch(sitemap, /\/the-daily-kava\/what-is-a-kava-cloud/, 'retired Cloud article URL must not be indexed');
assert.equal((sitemap.match(/<url>/g) || []).length, 35, 'sitemap must include 22 site routes and 13 Daily stories');
assert.equal((sitemap.match(/\/the-daily-kava\//g) || []).length, 13, 'all 13 Daily stories must be indexed');
assert.doesNotMatch(sitemap, /<loc>https:\/\/(?!www\.thetribalkavalounge\.com)/, 'sitemap URLs must use the canonical host');
assert.ok(JSON.parse(config).navigationFallback, 'Azure SPA fallback must be configured');
assert.equal(JSON.parse(config).routes[0].statusCode, 301, 'retired Cloud article must redirect permanently');

console.log('Site checks passed.');
