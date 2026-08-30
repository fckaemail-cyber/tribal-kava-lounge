# Azure Deployment Preflight Report

**Workload:** Tribal Kava daily draft automation  
**Subscription:** Azure subscription 1 (`0fd71da0-a2ba-470a-ac27-fc5b7ef186ca`)  
**Resource group:** `tribal-kava-automation-rg`  
**Region:** East US  
**Checked:** 2026-08-30

## Readiness

**READY — base infrastructure may be deployed.**

- Azure CLI is authenticated as the subscription owner.
- `Microsoft.App` was registered successfully; Container Registry, Key Vault,
  Managed Identity, and Operational Insights providers are registered.
- Both Bicep templates compile without diagnostics.
- `base.bicep` passed `az deployment group validate`.
- Base What-If reports eight creates, zero modifications, and zero deletions.
- ACR and Key Vault global names are available.
- The GitHub workflow code and the user-owned untracked draft are isolated from
  this worktree.

## Planned base changes

| Change | Resource |
| --- | --- |
| Create | Container Apps managed environment `tribal-kava-jobs-env` |
| Create | Basic ACR `tribalkava0fd71da0` with admin access disabled |
| Create | Key Vault `tribal-kava-0fd71da0` with RBAC and purge protection |
| Create | User-assigned identity `tribal-kava-jobs-identity` |
| Create | Log Analytics workspace `tribal-kava-jobs-logs` |
| Create | ACR Pull role assignment for the job identity |
| Create | Key Vault Secrets User role assignment for the job identity |
| Create | Key Vault Secrets Officer role assignment for the signed-in owner |

The registry, Log Analytics workspace, Key Vault, and executed Container Apps
job are billable Azure resources. No Foundry or Mic Drop resources are reused or
modified.

## Security checks

- GitHub access uses a new deploy key limited to this one repository; the broad
  local `gh` OAuth token is never copied to Azure.
- The private deploy key is stored in Key Vault and read through managed
  identity.
- ACR image pulls use managed identity; registry administrator credentials are
  disabled.
- GitHub SSH host keys are pinned from GitHub's current metadata endpoint.
- The job has no OpenAI, Netlify, Azure Foundry, or unrelated application keys.
- The scheduled code creates drafts and state only; publishing remains behind
  the existing human review gate.

## Validation commands

```sh
az bicep build --file infra/azure/base.bicep --stdout
az bicep build --file infra/azure/job.bicep --stdout
az deployment group validate --resource-group tribal-kava-automation-rg \
  --template-file infra/azure/base.bicep \
  --parameters registryName=tribalkava0fd71da0 \
    keyVaultName=tribal-kava-0fd71da0 \
    deployerPrincipalId=a8d3c5c6-061b-41c0-b9af-30d33a900f42
az deployment group what-if --resource-group tribal-kava-automation-rg \
  --template-file infra/azure/base.bicep \
  --parameters registryName=tribalkava0fd71da0 \
    keyVaultName=tribal-kava-0fd71da0 \
    deployerPrincipalId=a8d3c5c6-061b-41c0-b9af-30d33a900f42
```

## Final job gate

**DEPLOYED AND VERIFIED.**

- ACR build `ca1` completed successfully.
- Image `tribal-kava-daily:20260830.1` exists at digest
  `sha256:94b71ab842124280b39b57823daec5bbd198e82d209f3392019921d2f5d1be6c`.
- GitHub deploy key `161745943` is verified, write-enabled, and limited to this
  repository.
- Key Vault secret `github-deploy-key-b64` is enabled.
- `job.bicep` passed `az deployment group validate`.
- Job What-If reports one create (`tribal-kava-daily-job`), five existing
  resources ignored, zero modifications, and zero deletions.
- The base deployment reached `Succeeded` after 12 minutes 41 seconds.
- The protected test execution `tribal-kava-daily-job-o6yvsad` reached
  `Succeeded` in 39 seconds.
- That execution fetched seven new URLs, produced
  `daily-engine/drafts/digest-2026-08-30.md`, passed all compliance checks at
  score 100, and pushed commit `3e5e3b4` to the migration branch.

The GitHub schedule is removed after this successful test; its workflow remains
available only as an operator-triggered fallback. The Azure job owns the daily
11:00 UTC schedule.
