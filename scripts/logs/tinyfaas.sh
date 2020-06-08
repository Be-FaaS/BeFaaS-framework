#!/bin/bash

set -euo pipefail
curl http://$TINYFAAS_ADDRESS:8080/logs > $logdir/tinyfaas.log