# DNS Setup — tribalkavalounge.com

**Status (checked 2026-07-10):** Apex still points at Network Solutions parking (`208.91.197.27`). Nameservers remain Worldnic (`ns63` / `ns64.worldnic.com`). Netlify site is ready; **you must change DNS at Network Solutions** for the custom domain to go live.

**Netlify site ID:** `1296a8dc-a399-4fa4-9be8-13963f335311`  
**Likely Netlify subdomain:** `tribal-kava-lounge-wpb.netlify.app` (confirm in Netlify → Domain management)

---

## Goal

| Host | Type | Value |
|------|------|--------|
| `@` (apex / tribalkavalounge.com) | **A** | `75.2.60.5` |
| `www` | **CNAME** | `tribal-kava-lounge-wpb.netlify.app` |

Also in Netlify Domain management:

1. Add custom domain: `tribalkavalounge.com`
2. Add domain alias: `www.tribalkavalounge.com`
3. Enable HTTPS (Let’s Encrypt) after DNS propagates

---

## Network Solutions steps

1. Log in → **My Domain Names** → `tribalkavalounge.com` → **Manage** → **DNS** / **Advanced DNS**
2. **Remove or disable** parking/“Under Construction” records that point the apex to `208.91.x.x` or Worldnic parking hosts
3. Add / edit:

```
Type: A
Host: @
Data: 75.2.60.5
TTL: 3600 (or default)
```

```
Type: CNAME
Host: www
Data: tribal-kava-lounge-wpb.netlify.app
TTL: 3600
```

4. Save. Propagation: often 15–60 minutes; can take up to 24–48 hours.
5. Verify:

```bash
dig +short tribalkavalounge.com A
# expect: 75.2.60.5

dig +short www.tribalkavalounge.com CNAME
# expect: tribal-kava-lounge-wpb.netlify.app. (or similar Netlify target)
```

6. Open `https://tribalkavalounge.com/menu` — should load (path routes, not hash).

---

## Optional: Netlify DNS (full transfer)

If you prefer Netlify to manage DNS entirely:

1. Netlify → Domains → Add domain → Use Netlify DNS  
2. At Network Solutions, change nameservers to the four Netlify NS hosts Netlify shows  
3. Netlify auto-creates apex + www records  

Only do this if you are comfortable moving DNS away from Worldnic.

---

## Do not change (unless you know why)

- MX / email records for `TribalKavaLounge.Co` (email may live on a different host)
- Unrelated subdomains

---

## After DNS is live

- [ ] HTTPS certificate shows as provisioned in Netlify  
- [ ] `https://tribalkavalounge.com` and `https://www.tribalkavalounge.com` both work  
- [ ] Google Business Profile website URL = `https://tribalkavalounge.com`  
- [ ] Submit sitemap: `https://tribalkavalounge.com/sitemap.xml` in Google Search Console  
