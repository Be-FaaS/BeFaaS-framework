#!/bin/bash

set -euo pipefail

echo "Download Google Cloud logs (very slow)" | chalk magenta

gcloud logging read --project $GOOGLE_PROJECT 'resource.type="cloud_function" AND textPayload:'$BEFAAS_DEPLOYMENT_ID --format json > $logdir/google.log