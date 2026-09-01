import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSocialProof } from '../src/social-proof-core.js';

function response(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload
  };
}

test('returns honest snapshots without provider credentials', async () => {
  const payload = await buildSocialProof({
    env: {},
    fetchImpl: async () => { throw new Error('fetch should not run'); }
  });
  assert.equal(payload.providerStatus.google, 'snapshot');
  assert.equal(payload.providerStatus.instagram, 'snapshot');
  assert.equal(payload.google.rating, 4.8);
  assert.equal(payload.google.reviewCount, 269);
  assert.equal(payload.instagram.items.length, 2);
});

test('hydrates live Google rating and curated Instagram carousel media', async () => {
  const calls = [];
  const payload = await buildSocialProof({
    env: {
      GOOGLE_PLACES_API_KEY: 'test-google-key',
      GOOGLE_PLACE_ID: 'test-place-id',
      INSTAGRAM_ACCESS_TOKEN: 'test-instagram-token',
      INSTAGRAM_CURATED_POST_CODES: 'GOOD123'
    },
    fetchImpl: async (input, options = {}) => {
      const url = String(input);
      calls.push({ url, options });
      if (url.includes('places.googleapis.com/v1/places/test-place-id')) {
        return response({
          id: 'test-place-id',
          rating: 4.9,
          userRatingCount: 301,
          googleMapsUri: 'https://www.google.com/maps/place/test'
        });
      }
      if (url.includes('graph.instagram.com')) {
        return response({
          data: [{
            id: 'post-1',
            caption: 'Real lounge night at Tribal',
            media_type: 'CAROUSEL_ALBUM',
            permalink: 'https://www.instagram.com/p/GOOD123/',
            timestamp: '2026-08-18T21:00:00+0000',
            children: {
              data: [
                { id: 'photo-1', media_type: 'IMAGE', media_url: 'https://scontent.cdninstagram.com/photo-1.jpg' },
                { id: 'photo-2', media_type: 'IMAGE', media_url: 'https://scontent.xx.fbcdn.net/photo-2.jpg' }
              ]
            }
          }]
        });
      }
      throw new Error(`Unexpected URL: ${url}`);
    }
  });

  assert.equal(payload.providerStatus.google, 'live');
  assert.equal(payload.google.rating, 4.9);
  assert.equal(payload.google.reviewCount, 301);
  assert.equal(payload.providerStatus.instagram, 'live');
  assert.equal(payload.instagram.items.length, 2);
  assert.ok(calls.find((call) => call.url.includes('places.googleapis.com')).options.headers['X-Goog-FieldMask'].includes('userRatingCount'));
  assert.equal(calls.find((call) => call.url.includes('graph.instagram.com')).options.headers.Authorization, 'Bearer test-instagram-token');
  assert.doesNotMatch(JSON.stringify(payload), /test-google-key|test-instagram-token/);
});

test('can discover the Google place ID with Text Search', async () => {
  const calls = [];
  const payload = await buildSocialProof({
    env: { GOOGLE_PLACES_API_KEY: 'test-key' },
    fetchImpl: async (input) => {
      const url = String(input);
      calls.push(url);
      if (url.endsWith('/places:searchText')) return response({ places: [{ id: 'discovered-id' }] });
      if (url.endsWith('/places/discovered-id')) return response({ rating: 4.7, userRatingCount: 290 });
      throw new Error(`Unexpected URL: ${url}`);
    }
  });
  assert.equal(payload.google.placeId, 'discovered-id');
  assert.equal(payload.providerStatus.google, 'live');
  assert.equal(calls.length, 2);
});

test('falls back cleanly when providers reject a request', async () => {
  const payload = await buildSocialProof({
    env: {
      GOOGLE_PLACES_API_KEY: 'bad-key',
      GOOGLE_PLACE_ID: 'bad-place',
      INSTAGRAM_ACCESS_TOKEN: 'bad-token'
    },
    fetchImpl: async () => response({ error: 'denied' }, 403)
  });
  assert.equal(payload.providerStatus.google, 'snapshot');
  assert.equal(payload.providerStatus.instagram, 'snapshot');
  assert.equal(payload.google.checkedAt, '2026-08-31T00:00:00-04:00');
});
