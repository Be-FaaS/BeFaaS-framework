#!/bin/bash

set -euo pipefail

# Note: curl sometimes times out while fetching the logs, this is **not** an issue with this code but rather with openFaaS.
# The same thing happens when using the official cli for log fetching

for fname in $(jq -r '.program.functions | with_entries(select(.value.provider == "openfaas" )) | keys[]' $1); do
    curl --max-time 5 http://admin:$OPENFAAS_TOKEN@`echo $OPENFAAS_GATEWAY | sed 's_http://__'`/system/logs?name=$fname |
        jq -R 'fromjson? | .text' -r | sed 's/.*stdout: //' | tr -d '\n' | sed 's/FAASTERMETRICS/\nFAASTERMETRICS/g' >>  $logdir/openfaas.log || true
done
