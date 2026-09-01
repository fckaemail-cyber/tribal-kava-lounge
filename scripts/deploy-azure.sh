#!/bin/zsh
set -euo pipefail

for required_command in az npm; do
  if ! command -v "$required_command" >/dev/null 2>&1; then
    echo "Missing required command: $required_command" >&2
    exit 1
  fi
done

npm test

TRIBAL_DEPLOYMENT_TOKEN="$(az staticwebapp secrets list \
  --name tribal-kava-lounge-site \
  --resource-group tribal-kava-site-rg \
  --query 'properties.apiKey' \
  --output tsv)"

if [[ -z "$TRIBAL_DEPLOYMENT_TOKEN" ]]; then
  echo "Azure did not return a deployment token. Run 'az login' and try again." >&2
  exit 1
fi

npm exec --yes --package @azure/static-web-apps-cli -- swa deploy ./dist \
  --api-location ./api \
  --env production \
  --deployment-token "$TRIBAL_DEPLOYMENT_TOKEN"
