#!/bin/bash

set -euo pipefail

echo "Download Google Cloud logs, part 1/2 (very slow)" | chalk magenta

gcloud logging read --project $GOOGLE_PROJECT 'resource.type="cloud_function" AND textPayload:'$BEFAAS_DEPLOYMENT_ID --format json > $logdir/googleraw.json

echo "Getting Google Cloud logs, part 2 (faster)" | chalk magenta

cat $logdir/googleraw.json | jq -c -s -R '.[]' > $logdir/google.log