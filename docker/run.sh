#!/bin/bash

set -euo pipefail

if [ ! -z ${BASH_SOURCE} ]; then
  DOCKER_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
  DOCKER_DIR=$(dirname "$(readlink -f "$0")")
fi


dOpts=""
[ ! -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" ] && {
  resolvedGAC=$(realpath $GOOGLE_APPLICATION_CREDENTIALS)
  dOpts="-e CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE=$resolvedGAC -e GOOGLE_APPLICATION_CREDENTIALS=$resolvedGAC -v $resolvedGAC:$resolvedGAC:ro"
}

expDir=$(realpath $DOCKER_DIR/../)

docker run -it --rm --net host --env-file $DOCKER_DIR/env.list $dOpts -e HOST_EXPERIMENT_DIR=$expDir -v $expDir:/experiments -v /var/run/docker.sock:/var/run/docker.sock faastermetrics/experiments
