#!/bin/bash

set -euo pipefail

echo "Getting Azure logs" | chalk magenta
az webapp log download --resource-group $project_name --name $project_name --log-file $logdir/azure.zip

echo "Extracting Azure logs" | chalk magenta
unzip $logdir/azure.zip -d $logdir/azure
if [[ -d $logdir/azure/LogFiles/Application/Functions/Host ]]; then
  cat $logdir/azure/LogFiles/Application/Functions/Host/*.log > $logdir/azure.log
else
  echo "No azure logs found in archive." | chalk red
fi
rm -rf $logdir/azure.zip $logdir/azure
