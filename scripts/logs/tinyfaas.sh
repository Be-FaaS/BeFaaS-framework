#!/bin/bash

set -euo pipefail

echo "Getting tinyFaaS logs" | chalk magenta
curl http://$TINYFAAS_ADDRESS:8080/logs > $logdir/tinyfaas.log
