import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = 'www.thetribalkavalounge.com';
const key = '34a68ae0477ea10ed9d8a543952e0cdb';
const keyLocation = `https://${host}/${key}.txt`;
const sitemap = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/www\.thetribalkavalounge\.com[^<]+)<\/loc>/g)]
  .map((match) => match[1]);

if (!urlList.length) {
  throw new Error('No canonical Tribal URLs were found in dist/sitemap.xml.');
}

const keyResponse = await fetch(keyLocation, { redirect: 'follow' });
if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) {
  throw new Error(`IndexNow key is not live at ${keyLocation}. Deploy the site before submitting.`);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList })
});

if (!response.ok) {
  throw new Error(`IndexNow rejected the submission with HTTP ${response.status}.`);
}

console.log(`IndexNow accepted ${urlList.length} Tribal URLs (HTTP ${response.status}).`);
