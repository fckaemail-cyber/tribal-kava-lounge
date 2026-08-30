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
