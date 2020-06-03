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

echo "Destroying workload" | chalk green
cd infrastructure/workload
terraform destroy -auto-approve
cd -

echo "Destroying experiment" | chalk green
cd infrastructure/experiment
terraform destroy -var "experiment=${1}" -auto-approve
cd -

echo "Deleting .tfstate and .tfstate.backup" | chalk green
find infrastructure -maxdepth 3 -type f -name "*.tfstate" -delete
find infrastructure -maxdepth 3 -type f -name "*.tfstate.backup" -delete
