# Tribal social-proof API

`GET /api/social-proof` returns Google rating/count data and a curated Instagram gallery. Provider credentials stay in Azure Static Web Apps application settings and are never shipped to the browser.

Without credentials, the endpoint deliberately returns the dated Google snapshot and the three locally hosted, source-linked Instagram images already used by the site. The response identifies each provider as `live` or `snapshot`.

## Production settings

Configure these under **Azure Static Web App → Environment variables → Production**:

- `GOOGLE_PLACES_API_KEY` — server-restricted key with Places API (New) enabled.
- `GOOGLE_PLACE_ID` — optional override; the API defaults to Tribal’s verified Place ID, `ChIJFe_zmzQp2YgRh1ooSVUot9Y`, and never spends an extra request on Text Search.
- `INSTAGRAM_ACCESS_TOKEN` — token for the Tribal professional Instagram account.
- `INSTAGRAM_USER_ID` — optional; defaults to `me`.
- `INSTAGRAM_API_VERSION` — optional; defaults to `v23.0`.
- `INSTAGRAM_CURATED_POST_CODES` — comma-separated Instagram shortcodes. Defaults to `DcMhfR2kY2X`, the verified Tribal Mario Kart carousel.

Never add real values to `local.settings.json`, Git, frontend JavaScript, or screenshots. Azure application settings are encrypted at rest and exposed only to the managed API.

The Google request asks only for `rating` and `userRatingCount`, the two fields the public response actually uses. The managed function caches provider results for ten minutes and publishes shared-cache instructions so repeat visits do not create one provider request per page view.
