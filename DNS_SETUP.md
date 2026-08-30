# GoDaddy DNS launch — thetribalkavalounge.com

The finished site is live with HTTPS on Azure at:

`https://green-plant-0a6f9d30f.7.azurestaticapps.net`

The GoDaddy domain is still parked. These are the only domain changes needed.

## 1. Point `www` to Azure

Open [GoDaddy Domain Portfolio](https://dcc.godaddy.com/control/portfolio), sign in, select `thetribalkavalounge.com`, then open **DNS**.

Replace the current `www` record with:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `green-plant-0a6f9d30f.7.azurestaticapps.net` | Default |

Do not include `https://` in the CNAME value. Leave email/MX records untouched.

## 2. Forward the root domain

In GoDaddy **Forwarding → Domain**, permanently forward:

`thetribalkavalounge.com` → `https://www.thetribalkavalounge.com`

Choose:

- **Permanent (301)**
- **Forward only**
- **HTTPS on**
- **No masking**

This setup uses `www` as the canonical site because GoDaddy does not provide the apex-record flattening Azure Static Web Apps expects.

## 3. Finish the Azure binding

After the CNAME resolves, run:

```bash
az staticwebapp hostname set \
  --name tribal-kava-lounge-site \
  --resource-group tribal-kava-site-rg \
  --hostname www.thetribalkavalounge.com
```

Azure provisions and renews the TLS certificate. DNS commonly updates within an hour, but can take up to 48 hours.

## Verification

```bash
dig +short www.thetribalkavalounge.com CNAME
# green-plant-0a6f9d30f.7.azurestaticapps.net.

curl -I https://www.thetribalkavalounge.com
# HTTP 200 and a valid Azure-managed certificate
```

The site’s canonical URLs, sitemap, robots file, and Business Profile links already use `https://www.thetribalkavalounge.com`.
