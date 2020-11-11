#!/bin/bash

set -euo pipefail

if [ ! -z ${BASH_SOURCE} ]; then
  DOCKER_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
  DOCKER_DIR=$(dirname "$(readlink -f "$0")")
fi

# -t names the container
docker build -t befaas/framework $DOCKER_DIR
