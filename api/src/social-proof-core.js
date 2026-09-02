const GOOGLE_LISTING_URL = 'https://www.google.com/maps/search/?api=1&query=Tribal+Kava+Lounge&query_place_id=ChIJFe_zmzQp2YgRh1ooSVUot9Y';
const GOOGLE_PLACE_ID = 'ChIJFe_zmzQp2YgRh1ooSVUot9Y';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/tribalkavalounge/';
const SNAPSHOT_DATE = '2026-08-31T00:00:00-04:00';
const DEFAULT_CURATED_CODES = 'DcMhfR2kY2X';

const fallbackInstagramItems = Object.freeze([
  {
    id: 'fallback-community',
    imageUrl: '/images/tribal-community-game-night.webp',
    permalink: 'https://www.instagram.com/tribalkavalounge/p/DcMhfR2kY2X/',
    alt: 'Guests holding drinks during a real community game night at Tribal Kava Lounge',
    caption: 'Community night at Tribal Kava Lounge'
  },
  {
    id: 'fallback-bar',
    imageUrl: '/images/tribal-bar-game-night.webp',
    permalink: 'https://www.instagram.com/tribalkavalounge/p/DcMhfR2kY2X/',
    alt: 'The Tribal Kava Lounge bar during a real Mario Kart event',
    caption: 'The bar at Tribal during game night'
  },
  {
    id: 'fallback-racers',
    imageUrl: '/images/tribal-mario-kart-racers.webp',
    permalink: 'https://www.instagram.com/tribalkavalounge/p/DcMhfR2kY2X/',
    alt: 'Nine guests playing Mario Kart during a real community event at Tribal Kava Lounge',
    caption: 'The tribe came to race at Mario Kart night'
  }
]);

function snapshotGoogle() {
  return {
    mode: 'snapshot',
    rating: 4.8,
    reviewCount: 269,
    url: GOOGLE_LISTING_URL,
    checkedAt: SNAPSHOT_DATE
  };
}

function fallbackInstagram() {
  return {
    mode: 'curated-snapshot',
    profileUrl: INSTAGRAM_PROFILE_URL,
    checkedAt: SNAPSHOT_DATE,
    items: fallbackInstagramItems.map((item) => ({ ...item }))
  };
}

function trimmed(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function apiVersion(value) {
  const candidate = trimmed(value);
  return /^v\d+\.\d+$/.test(candidate) ? candidate : 'v23.0';
}

function trustedUrl(value, allowedHosts) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return '';
    const trusted = allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
    return trusted ? url.href : '';
  } catch {
    return '';
  }
}

function captionText(value, maxLength = 180) {
  return trimmed(value).replace(/\s+/g, ' ').slice(0, maxLength);
}

async function jsonResponse(response, provider) {
  if (!response.ok) throw new Error(`${provider} returned HTTP ${response.status}`);
  return response.json();
}

async function googleSocialProof(env, fetchImpl, signal) {
  const apiKey = trimmed(env.GOOGLE_PLACES_API_KEY);
  if (!apiKey) return snapshotGoogle();

  const placeId = trimmed(env.GOOGLE_PLACE_ID) || GOOGLE_PLACE_ID;
  const response = await fetchImpl(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'rating,userRatingCount'
    },
    signal
  });
  const payload = await jsonResponse(response, 'Google Place Details');
  const rating = Number(payload.rating);
  const reviewCount = Number(payload.userRatingCount);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5 || !Number.isInteger(reviewCount) || reviewCount < 0) {
    throw new Error('Google Place Details returned invalid rating data');
  }

  return {
    mode: 'live',
    rating,
    reviewCount,
    url: GOOGLE_LISTING_URL,
    placeId,
    checkedAt: new Date().toISOString()
  };
}

function shortcode(permalink) {
  try {
    const url = new URL(permalink);
    return url.pathname.split('/').filter(Boolean).at(-1) || '';
  } catch {
    return '';
  }
}

function instagramImage(media) {
  return trustedUrl(media?.thumbnail_url || media?.media_url, ['cdninstagram.com', 'fbcdn.net', 'instagram.com']);
}

function normalizeInstagramItem(media, parent, index) {
  const imageUrl = instagramImage(media);
  const permalink = trustedUrl(parent.permalink, ['instagram.com']);
  if (!imageUrl || !permalink) return null;
  const caption = captionText(parent.caption) || 'From @TribalKavaLounge';
  return {
    id: trimmed(media.id) || `${trimmed(parent.id) || 'instagram'}-${index}`,
    imageUrl,
    permalink,
    alt: caption,
    caption,
    timestamp: trimmed(parent.timestamp)
  };
}

async function instagramSocialProof(env, fetchImpl, signal) {
  const accessToken = trimmed(env.INSTAGRAM_ACCESS_TOKEN);
  if (!accessToken) return fallbackInstagram();

  const userId = trimmed(env.INSTAGRAM_USER_ID) || 'me';
  const version = apiVersion(env.INSTAGRAM_API_VERSION);
  const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_type,media_url,thumbnail_url}';
  const url = new URL(`https://graph.instagram.com/${version}/${encodeURIComponent(userId)}/media`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', '25');
  const response = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal
  });
  const payload = await jsonResponse(response, 'Instagram media');
  const allowedCodes = new Set((trimmed(env.INSTAGRAM_CURATED_POST_CODES) || DEFAULT_CURATED_CODES)
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean));

  const items = [];
  for (const media of Array.isArray(payload.data) ? payload.data : []) {
    if (!allowedCodes.has(shortcode(media.permalink))) continue;
    const children = Array.isArray(media?.children?.data) && media.children.data.length ? media.children.data : [media];
    for (const [index, child] of children.entries()) {
      const normalized = normalizeInstagramItem(child, media, index);
      if (normalized) items.push(normalized);
      if (items.length === 6) break;
    }
    if (items.length === 6) break;
  }

  if (!items.length) throw new Error('Instagram returned no media matching the curated post list');
  return {
    mode: 'live-curated',
    profileUrl: INSTAGRAM_PROFILE_URL,
    checkedAt: new Date().toISOString(),
    items
  };
}

export async function buildSocialProof({
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = 8000
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const [googleResult, instagramResult] = await Promise.allSettled([
      googleSocialProof(env, fetchImpl, controller.signal),
      instagramSocialProof(env, fetchImpl, controller.signal)
    ]);
    return {
      version: 1,
      generatedAt: new Date().toISOString(),
      google: googleResult.status === 'fulfilled' ? googleResult.value : snapshotGoogle(),
      instagram: instagramResult.status === 'fulfilled' ? instagramResult.value : fallbackInstagram(),
      providerStatus: {
        google: googleResult.status === 'fulfilled' && googleResult.value.mode === 'live' ? 'live' : 'snapshot',
        instagram: instagramResult.status === 'fulfilled' && instagramResult.value.mode === 'live-curated' ? 'live' : 'snapshot'
      }
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const socialProofSnapshot = Object.freeze({
  google: snapshotGoogle(),
  instagram: fallbackInstagram()
});
