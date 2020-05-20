#!/bin/bash

set -euo pipefail

cd infrastructure
project_name=$(terraform output -json | jq -r '.project_name.value')
cd -

logdir=logs/$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p $logdir

echo "Getting AWS logs" | chalk magenta
for lg in $(saw groups | grep /aws/lambda/${project_name}-); do
  echo "Getting logs for $lg" | chalk magenta
  saw get $lg --start -100h --rawString >> $logdir/aws.log
done

echo "Getting Google Cloud logs" | chalk magenta
gcloud logging read 'resource.type="cloud_function"' --format json > $logdir/google.log

echo "Getting Azure logs" | chalk magenta
az webapp log download --resource-group $project_name --name $project_name --log-file $logdir/azure.zip
