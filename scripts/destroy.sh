#!/bin/bash

set -euo pipefail

export TF_VAR_TINYFAAS_ADDRESS=$TINYFAAS_ADDRESS

export TF_VAR_fn_env='{}'
export TF_VAR_OPENFAAS_GATEWAY=$OPENFAAS_GATEWAY
export TF_VAR_OPENFAAS_USER=admin
export TF_VAR_OPENFAAS_TOKEN=$OPENFAAS_TOKEN
export TF_VAR_DOCKERHUB_USER=`docker info 2>/dev/null | sed '/Username:/!d;s/.* //'`


providers=`ls infrastructure/`
providers=( "${providers[@]/services}" )
providers=( "${providers[@]/experiment}" )

services=`ls infrastructure/services/`
services=( "${services[@]/vpc}" )

for provider in $providers; do
  echo "Destroying $provider" | chalk green
  cd infrastructure/${provider}
  if test -f terraform.tfstate && [ "$(jq -r '.resources | length' terraform.tfstate)" != "0" ]; then
    terraform destroy -auto-approve
  fi
  cd -
done

for service in $services; do
  echo "Destroying service $service" | chalk green
  cd infrastructure/services/${service}
  if test -f terraform.tfstate && [ "$(jq -r '.resources | length' terraform.tfstate)" != "0" ]; then
    terraform destroy -auto-approve
  fi
  cd -
done


echo "Destroying vpc" | chalk green
cd infrastructure/services/vpc
if test -f terraform.tfstate && [ "$(jq -r '.resources | length' terraform.tfstate)" != "0" ]; then
  terraform destroy -auto-approve
fi
cd -

for provider in $providers; do
  echo "Destroying endpoints for $provider" | chalk green
  cd infrastructure/${provider}/endpoint
  if test -f terraform.tfstate && [ "$(jq -r '.resources | length' terraform.tfstate)" != "0" ]; then
    terraform destroy -auto-approve
  fi
  cd -
done

echo "Destroying experiment" | chalk green
cd infrastructure/experiment
if test -f terraform.tfstate && [ "$(jq -r '.resources | length' terraform.tfstate)" != "0" ]; then
  terraform destroy -var "experiment=test" -auto-approve # just needs some experiment that exists
fi
cd -
