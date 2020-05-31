#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

export TF_VAR_fn_env='{}'

providers=$(jq -r '[.program.functions[].provider] | unique | .[]' experiments/${1}/experiment.json)

for provider in $providers; do
  echo "Destroying $provider" | chalk green
  cd infrastructure/${provider}
  terraform destroy -auto-approve
  cd -
done

for provider in $providers; do
  echo "Destroying endpoints for $provider" | chalk green
  cd infrastructure/${provider}/endpoint
  terraform destroy -auto-approve
  cd -
done

cd infrastructure/experiment/
terraform destroy -var "experiment=${1}" -auto-approve
cd -
