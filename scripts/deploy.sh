#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "usage: $0 <experiment name>"
    exit 1
fi

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo "invalid experiment name"
    exit 1
fi

echo "running deploy for $1..."

cd infrastructure
terraform apply -var "experiment=${1}"
