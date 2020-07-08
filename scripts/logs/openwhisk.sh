#!/bin/bash

set -euo pipefail

echo "Getting OpenWhisk logs" | chalk magenta
wsk activation list -f | grep -v 'activations' | jq -sr '.[].logs[]' > $logdir/openwhisk.log
