#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

# Check for regiosn
[ -z "${AWS_REGION:-}" ] && {
    echo -e "Environment variable AWS_REGION should be set\n" | chalk red
    exit 1
}

[ -z "${GOOGLE_REGION:-}" ] && {
    echo -e "Environment variable GOOGLE_REGION should be set\n" | chalk red
    exit 1
}

# Check for credentials
[ -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" ] && {
    echo -e "Environment variable GOOGLE_APPLICATION_CREDENTIALS should be set\n" | chalk red
    exit 1
}

[ -z "${GOOGLE_PROJECT:-}" ] && {
    echo -e "Environment variable GOOGLE_PROJECT should be set\n" | chalk red
    exit 1
}


exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

chalk -t "{cyan Running deploy for} {cyan.bold $1}"

cd infrastructure
terraform apply -var "experiment=${1}"
