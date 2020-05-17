#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <experiment name>"
    echo "Choose one of:"
    echo "> $(ls experiments/ | tr '\n' ' ')"
    exit 1
fi

# Check for propper project name
[ -s "${TF_VAR_project_name:-}" ] || {
    echo "Environment variable TF_VAR_project_name should be set"
    exit 1
}

# Check for regiosn
[ -s "${AWS_REGION:-}" ] || {
    echo "Environment variable AWS_REGION should be set"
    exit 1
}

[ -s "${GOOGLE_REGION:-}" ] || {
    echo "Environment variable GOOGLE_REGION should be set"
    exit 1
}

# Check for credentials
[ -s "${GOOGLE_APPLICATION_CREDENTIALS:-}" ] || {
    echo "Environment variable GOOGLE_APPLICATION_CREDENTIALS should be set"
    exit 1
}

[ -s "${GOOGLE_PROJECT:-}" ] || {
    echo "Environment variable GOOGLE_PROJECT should be set"
    exit 1
}


exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo "Invalid experiment name"
    exit 1
fi

echo "Running deploy for $1"

cd infrastructure
terraform apply -var "experiment=${1}"
