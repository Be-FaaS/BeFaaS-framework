#!/bin/bash

set -euo pipefail

echo "Getting Google Cloud logs" | chalk magenta
gcloud logging read 'resource.type="cloud_function"' --format json | jq -c '.[]' > $logdir/google.log
