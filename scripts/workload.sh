#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

exp_dir="experiments/$1"

if [[ ! -d $exp_dir ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

exp_json=$(cat $exp_dir/experiment.json)

workload_config=$(realpath ${exp_dir}/$(echo $exp_json | jq -r '.workload.config'))

echo "Found workload config: $workload_config" | chalk blue

echo "Getting endpoints..." | chalk blue
states=""
for provider in $(echo $exp_json | jq -r '[.program.functions[].provider] | unique | .[]'); do
  cd infrastructure/${provider}/endpoint
  states="${states}$(terraform output --json)"
  cd -
done

endpoints=$(echo $states | jq -sc 'add | with_entries(select(.key | endswith("ENDPOINT"))) | map_values(.value)')

echo "Matching endpoints..." | chalk blue
var_json="{}"
for fname in $(echo $exp_json | jq -r '.program.functions | keys[]'); do
  provider=$(echo $exp_json | jq -r --arg f $fname '.program.functions[$f].provider')
  f_ep=$(echo $endpoints | jq -r --arg p $provider 'with_entries(select(.key | ascii_downcase | startswith($p))) | to_entries[0].value')/$fname
 var_json=`echo $var_json | jq ". + {$fname: [\"$f_ep\"]}"`
done

echo "Writing config..." | chalk blue
echo -n $var_json > artillery/variables.json
cp $workload_config artillery/workload.yml

echo "Creating docker image..." | chalk blue
docker build -t faastermetrics/artillery artillery/

echo "Exporting docker image..." | chalk blue
docker save faastermetrics/artillery:latest | gzip > artillery/image.tar.gz

echo "Deploying workload..." | chalk blue
cd infrastructure/workload
terraform init
terraform apply -auto-approve | tee ../../artillery/workload-deploy.log

echo "Destroying workload instance..." | chalk blue
terraform destroy -auto-approve -target aws_instance.workload

echo "Done" | chalk blue bold
