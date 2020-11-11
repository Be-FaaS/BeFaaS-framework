#!/bin/bash

set -euo pipefail

if [ ! -z ${BASH_SOURCE} ]; then
  SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
  SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
fi

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

if [[ ! -f "experiments/$1/experiment.json" ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

if [[ -z "${2:-}" ]]; then
	logTimestamp=$(ls logs/$1/ | sort -r | head -n 1)
else
  logTimestamp="$2"
fi

logDir="/experiments/logs/$1/$logTimestamp"
echo "Using log directory: $logDir" | chalk blue

expDir=${HOST_EXPERIMENT_DIR:-$(realpath $SCRIPT_DIR/../)}

echo "Running analysis..." | chalk blue
docker run -it --rm -v $expDir:/experiments befaas/analysis $logDir /experiments/analysis
echo "done." | chalk blue
