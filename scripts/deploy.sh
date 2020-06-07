#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

# Check for regiosn
[ -z "${AWS_REGION:-}" ] && {
    echo -e "Environment variable AWS_REGION should be set\n" | chalk red
    exit 1
}

[ -z "${GOOGLE_REGION:-}" ] && {
    echo -e "Environment variable GOOGLE_REGION should be set\n" | chalk red
    exit 1
}

# Check for credentials
[ -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" ] && {
    echo -e "Environment variable GOOGLE_APPLICATION_CREDENTIALS should be set\n" | chalk red
    exit 1
}

[ -z "${GOOGLE_PROJECT:-}" ] && {
    echo -e "Environment variable GOOGLE_PROJECT should be set\n" | chalk red
    exit 1
}

export TF_VAR_TINYFAAS_ADDRESS=$TINYFAAS_ADDRESS

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

chalk -t "{green Running deploy for} {green.bold $1}"
build_timestamp=$(cat .build_timestamp || true)
echo "Last build: $build_timestamp" | chalk green

cd infrastructure/experiment/
terraform init
terraform apply -var "experiment=${1}" -var "build_timestamp=${build_timestamp}" -auto-approve
cd -

providers=$(jq -r '[.program.functions[].provider] | unique | .[]' experiments/${1}/experiment.json)
states=""
for provider in $providers; do
  echo "Initializing endpoints for $provider" | chalk green
  cd infrastructure/${provider}/endpoint
  terraform init
  terraform apply -auto-approve
  states="${states}$(terraform output --json)"
  cd -
done

echo "Initializing services" | chalk green
if [ "$(jq -r '.services | length' experiments/${1}/experiment.json)" != "0" ]; then
  echo "Setting up VPC" | chalk green
  cd infrastructure/services/vpc
  terraform init
  terraform apply -auto-approve
  cd -
  for service in $(jq -r '.services | keys[]' experiments/${1}/experiment.json); do
    [ "$service" == 'workload' ] && continue
    echo "Starting service $service" | chalk green
    cd infrastructure/services/${service}
    terraform init
    terraform apply -auto-approve
    states="${states}$(terraform output --json)"
    cd -
  done
fi

export TF_VAR_fn_env=$(echo $states | jq -sc 'add | with_entries(select(.key | endswith("ENDPOINT"))) | map_values(.value)')

for provider in $providers; do
  echo "Deploying $provider" | chalk green
  cd infrastructure/${provider}
  terraform init
  terraform apply -auto-approve
  cd -
done

echo $TF_VAR_fn_env | jq
