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
  assert.equal(payload.instagram.items.length, 3);
  assert.equal(payload.instagram.items[2].imageUrl, '/images/tribal-mario-kart-racers.webp');
});

test('hydrates live Google rating and curated Instagram carousel media', async () => {
  const calls = [];
  const payload = await buildSocialProof({
    env: {
      GOOGLE_PLACES_API_KEY: 'test-google-key',
      INSTAGRAM_ACCESS_TOKEN: 'test-instagram-token',
      INSTAGRAM_CURATED_POST_CODES: 'GOOD123'
    },
    fetchImpl: async (input, options = {}) => {
      const url = String(input);
      calls.push({ url, options });
      if (url.includes('places.googleapis.com/v1/places/ChIJFe_zmzQp2YgRh1ooSVUot9Y')) {
        return response({
          rating: 4.9,
          userRatingCount: 301
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
  const googleCall = calls.find((call) => call.url.includes('places.googleapis.com'));
  assert.equal(googleCall.options.headers['X-Goog-FieldMask'], 'rating,userRatingCount');
  assert.equal(calls.filter((call) => call.url.includes('places.googleapis.com')).length, 1);
  assert.equal(calls.find((call) => call.url.includes('graph.instagram.com')).options.headers.Authorization, 'Bearer test-instagram-token');
  assert.doesNotMatch(JSON.stringify(payload), /test-google-key|test-instagram-token/);
});

test('uses an explicit Google place override without a Text Search request', async () => {
  const calls = [];
  const payload = await buildSocialProof({
    env: { GOOGLE_PLACES_API_KEY: 'test-key', GOOGLE_PLACE_ID: 'override-id' },
    fetchImpl: async (input) => {
      const url = String(input);
      calls.push(url);
      if (url.endsWith('/places/override-id')) return response({ rating: 4.7, userRatingCount: 290 });
      throw new Error(`Unexpected URL: ${url}`);
    }
  });
  assert.equal(payload.google.placeId, 'override-id');
  assert.equal(payload.providerStatus.google, 'live');
  assert.equal(calls.length, 1);
  assert.ok(calls.every((url) => !url.includes('searchText')));
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
