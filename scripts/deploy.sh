#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <experiment name>"
    echo "Choose one of:"
    echo "> $(ls experiments/ | tr '\n' ' ')"
    exit 1
fi

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo "Invalid experiment name"
    exit 1
fi

echo "Running deploy for $1"

cd infrastructure
terraform apply -var "experiment=${1}"
