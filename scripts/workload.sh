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

if [[ -z "${2:-}" ]]; then
	exp_json="experiment.json"
else
	exp_json="$2"
fi

exp_json="${exp_dir}/${exp_json}"

workload_config_name=$(jq -r '.services.workload.config' "$exp_json")
if [ "$workload_config_name" == "null" ]; then
    echo -e "Workload config not defined (services.workload.config)\n" | chalk red
    exit 1
fi

workload_config="${exp_dir}/${workload_config_name}"
echo "Found workload config: $workload_config" | chalk blue

cd infrastructure/experiment/
deployment_id=$(terraform output -json | jq -r '.deployment_id.value')
cd -

echo "Found deployment id: $deployment_id" | chalk blue

echo "Getting endpoints..." | chalk blue
states=""
for provider in $(jq -r '[.program.functions[].provider] | unique | .[]' $exp_json); do
  cd infrastructure/${provider}/endpoint
  states="${states}$(terraform output --json)"
  cd -
done

endpoints=$(echo $states | jq -sc 'add | with_entries(select(.key | endswith("ENDPOINT"))) | map_values(.value)')

echo "Matching endpoints..." | chalk blue
var_json="{}"
for fname in $(jq -r '.program.functions | keys[]' "$exp_json"); do
  provider=$(jq -r --arg f $fname '.program.functions[$f].provider' "$exp_json")
  f_ep=$(echo $endpoints | jq -r --arg p $provider 'with_entries(select(.key | ascii_downcase | startswith($p))) | to_entries[0].value')/$fname
  echo "Matched $fname endpoint: $f_ep" | chalk blue
  var_json=`echo $var_json | jq ". + {$fname: [\"$f_ep\"]}"`
done

echo "Matching publisher endpoints..." | chalk blue
for service in $(jq -r '.services | keys[]' "$exp_json"); do
  echo $service
  if [[ $service == publisher* ]]; then
    echo "Going to match $service endpoint" | chalk cyan
	if [[ $service == *Aws ]]; then
	  provider="aws"
	  s_ep=$(echo $endpoints | jq -r --arg p $provider 'with_entries(select(.key | ascii_downcase | startswith($p))) | to_entries[0].value')/publisher
	  echo "Matched $service endpoint: $s_ep" | chalk blue
      var_json=`echo $var_json | jq ". + {$service: [\"$s_ep\"]}"`
	fi
	if [[ $service == *Google ]]; then
	  provider="google"
	  s_ep=$(echo $endpoints | jq -r --arg p $provider 'with_entries(select(.key | ascii_downcase | startswith($p))) | to_entries[0].value')/publisher
	  echo "Matched $service endpoint: $s_ep" | chalk blue
      var_json=`echo $var_json | jq ". + {$service: [\"$s_ep\"]}"`
	fi
	if [[ $service == *Tinyfaas ]]; then
	  provider="tinyfaas"
	  s_ep=$(echo $endpoints | jq -r --arg p $provider 'with_entries(select(.key | ascii_downcase | startswith($p))) | to_entries[0].value')/publisher
	  echo "Matched $service endpoint: $s_ep" | chalk blue
      var_json=`echo $var_json | jq ". + {$service: [\"$s_ep\"]}"`
	fi
	if [[ $service == *Azure ]]; then
	  provider="azure"
	  s_ep=$(echo $endpoints | jq -r --arg p $provider 'with_entries(select(.key | ascii_downcase | startswith($p))) | to_entries[0].value')/publisher
	  echo "Matched $service endpoint: $s_ep" | chalk blue
      var_json=`echo $var_json | jq ". + {$service: [\"$s_ep\"]}"`
	fi
  fi
done


echo "Writing config..." | chalk blue
echo -n $var_json > artillery/variables.json
cp $workload_config artillery/workload.yml

echo "Compiling logger.js" | chalk blue
npx ncc build artillery/logger.js -o artillery/build

echo "Creating docker image..." | chalk blue
docker build -t befaas/artillery artillery/

echo "Cleaning up build files" | chalk blue
rm -rf artillery/build

echo "Exporting docker image..." | chalk blue
docker save befaas/artillery:latest | gzip > artillery/image.tar.gz

echo "Deploying workload..." | chalk blue
cd infrastructure/services/workload
terraform init
terraform apply -auto-approve | tee ../../../artillery/workload-deploy.log

echo "Destroying workload instance..." | chalk blue
terraform destroy -auto-approve

echo "Done" | chalk blue bold
