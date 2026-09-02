import { app } from '@azure/functions';
import { buildSocialProof } from '../social-proof-core.js';

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedPayload = null;
let cachedAt = 0;

app.http('social-proof', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'social-proof',
  handler: async () => {
    const now = Date.now();
    if (!cachedPayload || now - cachedAt > CACHE_TTL_MS) {
      cachedPayload = await buildSocialProof();
      cachedAt = now;
    }

    return {
      status: 200,
      jsonBody: cachedPayload,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex'
      }
    };
  }
});
