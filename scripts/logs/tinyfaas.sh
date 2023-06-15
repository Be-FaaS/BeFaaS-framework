#!/bin/bash

set -euo pipefail

echo "Getting tinyFaaS logs" | chalk magenta
curl http://$TINYFAAS_ADDRESS:$TINYFAAS_MPORT/logs > $logdir/tinyfaas.log
