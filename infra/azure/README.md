# Azure daily publisher

The scheduled Daily Kava draft job runs in Azure Container Apps at 11:00 UTC.
It clones this public repository, runs the deterministic fetch/draft/compliance
pipeline, and pushes only `daily-engine/state/` and `daily-engine/drafts/` back
to `master` for human review.

Security boundaries:

- The Azure resource group is dedicated to Tribal Kava automation.
- A repository-specific GitHub deploy key has write access only to this repo.
- The private key is held in Azure Key Vault and exposed to the job through a
  managed identity; the ACR admin account is disabled.
- The container pins GitHub's current SSH public host keys and refuses unknown
  hosts.
- The job does not receive an OpenAI key and cannot publish to Netlify.

The GitHub workflow remains available for manual fallback, but its schedule is
disabled after the Azure execution is verified.

## Conversion dashboard

`conversion-workbook.bicep` deploys the shared **Tribal Kava Conversion
Dashboard** against `tribal-kava-insights` in `tribal-kava-site-rg`.
The workbook reports:

- visits, menu sessions, directions/calls, and DoorDash checkout starts;
- conversion actions and unique sessions;
- Google, Instagram, QR, direct, and other UTM sources;
- drink-finder recommendations.

Local previews never initialize browser telemetry. Controlled validation uses
`utm_medium=qa`, which every workbook query excludes. `begin_checkout` means
the visitor opened Tribal's DoorDash checkout path; DoorDash does not expose a
completed-purchase event to this site.

Validate all five KQL queries before deployment, then update the workbook with:

```sh
az deployment group create \
  --resource-group tribal-kava-site-rg \
  --template-file infra/azure/conversion-workbook.bicep
```
