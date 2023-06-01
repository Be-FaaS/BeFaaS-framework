#!/bin/bash

set -euo pipefail

echo "Getting tinyFaaS logs" | chalk magenta
curl http://$TINYFAAS_ADDRESS/logs > $logdir/tinyfaas.log
