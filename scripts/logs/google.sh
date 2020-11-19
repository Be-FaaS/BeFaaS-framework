#!/bin/bash

set -euo pipefail

echo "Getting Google Cloud logs" | chalk magenta
gcloud logging read --project $GOOGLE_PROJECT 'resource.type="cloud_function" AND textPayload:'$BEFAAS_DEPLOYMENT_ID --format json | jq -c '.[]' > $logdir/google.log
