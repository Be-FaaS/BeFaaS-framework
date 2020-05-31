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

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

cd infrastructure/experiment
export project_name=$(terraform output -json | jq -r '.project_name.value')
cd -

export logdir=logs/$1/$(date +%Y-%m-%d_%H-%M-%S)
mkdir -p $logdir

for provider in $(jq -r '[.program.functions[].provider] | unique | .[]' experiments/${1}/experiment.json); do
    ${SCRIPT_DIR}/logs/${provider}.sh
done
