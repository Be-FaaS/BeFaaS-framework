#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

cd infrastructure
project_name=$(terraform output -json | jq -r '.project_name.value')
cd -

logdir=logs/$1/$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p $logdir

echo "Getting AWS logs" | chalk magenta
for lg in $(aws logs describe-log-groups --log-group-name-prefix /aws/lambda/${project_name} | jq -r '.logGroups[].logGroupName'); do
  echo "Getting logs for $lg" | chalk magenta
  for ls in $(aws logs describe-log-streams --log-group-name $lg | jq -r '.logStreams[].logStreamName'); do
      echo "|--> $ls" | chalk magenta
        aws logs get-log-events --log-group-name $lg --log-stream-name $ls | jq -c '.events[]' >> $logdir/aws.log
  done
done

echo "Getting Google Cloud logs" | chalk magenta
gcloud logging read 'resource.type="cloud_function"' --format json | jq -c '.[]' > $logdir/google.log

echo "Getting Azure logs" | chalk magenta
az webapp log download --resource-group $project_name --name $project_name --log-file $logdir/azure.zip

echo "Extracting Azure logs" | chalk magenta
unzip $logdir/azure.zip -d $logdir/azure
cat $logdir/azure/LogFiles/Application/Functions/Host/*.log > $logdir/azure.log
rm -rf $logdir/azure.zip $logdir/azure
